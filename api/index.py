from http.server import BaseHTTPRequestHandler
import json
import os
import time
from datetime import datetime, timedelta
import requests  # Import requests for RPC calls

# Configuration
PROJECT_ID = 'gen-lang-client-0438257778'
LOCATION = 'us-central1'
# World Chain RPC - Public Mainnet Endpoint
WORLD_CHAIN_RPC = "https://worldchain-mainnet.g.alchemy.com/public"
# Wallet Address that receives payments (from index.html)
WALLET_ADDRESS = "0xa3cdea9fe705bc16dcd9e9170e217b0f1ba5aaf6"

# Global cache for responses (survives across requests in warm containers)
# Format: {cache_key: (response_text, timestamp)}
response_cache = {}
CACHE_TTL_SECONDS = 3600  # 1 hour

# Global Vertex AI client (reuse across requests to avoid cold starts)
_vertex_initialized = False
_generative_model = None

def get_cache_key(card_name, language, definitions):
    """Generate a unique cache key for this request"""
    # Create a deterministic key from the request parameters
    arquetipo = definitions.get('arquetipo', '')[:50]  # Limit for key size
    sombra = definitions.get('sombra', '')[:50]
    misticismo = definitions.get('misticismo', '')[:50]
    
    return f"{card_name}|{language}|{arquetipo}|{sombra}|{misticismo}"

def get_cached_response(cache_key):
    """Get cached response if still valid"""
    if cache_key in response_cache:
        cached_text, cached_time = response_cache[cache_key]
        age_seconds = (datetime.now() - cached_time).total_seconds()
        
        if age_seconds < CACHE_TTL_SECONDS:
            print(f"✅ Cache hit! Age: {age_seconds:.1f}s")
            return cached_text
        else:
            # Expired, remove from cache
            del response_cache[cache_key]
            print(f"🗑️  Cache expired ({age_seconds:.1f}s old)")
    
    return None

def set_cached_response(cache_key, response_text):
    """Store response in cache"""
    response_cache[cache_key] = (response_text, datetime.now())
    print(f"💾 Cached response (total cached: {len(response_cache)})")

def verify_transaction(tx_hash, expected_recipient):
    """
    Verify a World Chain transaction on the blockchain.
    Returns (is_valid, error_message)
    """
    # SKIP verification for Simulation IDs (dev mode)
    if tx_hash.startswith("sim_"):
        print(f"🧪 Simulation ID detected: {tx_hash}. Allowing access.")
        return True, None

    if not tx_hash or len(tx_hash) < 60: # Simple format check
        return False, "Invalid transaction format"

    try:
        print(f"🔍 Verifying transaction {tx_hash} on World Chain...")
        
        payload = {
            "jsonrpc": "2.0",
            "method": "eth_getTransactionReceipt",
            "params": [tx_hash],
            "id": 1
        }
        
        response = requests.post(WORLD_CHAIN_RPC, json=payload, timeout=5)
        data = response.json()
        
        if "result" not in data or data["result"] is None:
            print("❌ Transaction not found on chain")
            return False, "Transaction not found"
            
        receipt = data["result"]
        
        # 1. Check status (0x1 = success)
        if receipt["status"] != "0x1":
            print(f"❌ Transaction failed on chain (status {receipt['status']})")
            return False, "Transaction failed"
            
        # 2. Check recipient (logs or to address)
        # Note: If it's a token transfer (ERC20), 'to' is the contract, logs contain the transfer.
        # Ideally we parse logs, but for native/direct formatting we check 'to'.
        # For robustness in MVP we verify the transaction exists and succeeded. 
        # Advanced: Decode log for specific amount and recipient.
        
        print("✅ Transaction verified on chain!")
        return True, None
        
    except Exception as e:
        print(f"⚠️ RPC Verification error: {e}")
        # Fail open or closed? For high security fail closed.
        return False, f"Verification error: {str(e)}"

def initialize_vertex_ai():
    """Initialize Vertex AI once and reuse the client"""
    global _vertex_initialized, _generative_model
    
    if _vertex_initialized:
        return _generative_model
    
    try:
        import vertexai
        from vertexai.generative_models import GenerativeModel
        
        # Check for service account file or environment credentials
        if os.path.exists('service_account.json'):
            os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'service_account.json'
        
        vertexai.init(project=PROJECT_ID, location=LOCATION)
        _generative_model = GenerativeModel("gemini-2.0-flash-exp")
        _vertex_initialized = True
        
        print("✅ Vertex AI initialized")
        return _generative_model
    
    except Exception as e:
        print(f"❌ Vertex AI initialization failed: {e}")
        raise

def validate_request(data):
    """Validate incoming request data"""
    errors = []
    
    if not data.get('cardName'):
        errors.append('cardName is required')
    
    if not data.get('language'):
        errors.append('language is required')
    
    if not data.get('definitions'):
        errors.append('definitions object is required')
    else:
        definitions = data.get('definitions', {})
        if not definitions.get('arquetipo'):
            errors.append('definitions.arquetipo is required')
        if not definitions.get('sombra'):
            errors.append('definitions.sombra is required')
        if not definitions.get('misticismo'):
            errors.append('definitions.misticismo is required')
    
    return errors

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()
    
    def _set_cors_headers(self):
        """Set CORS headers for cross-origin requests"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
    
    def do_POST(self):
        request_start = time.time()
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            # Parse JSON
            data = json.loads(post_data)
            
            # --- SECURITY CHECK ---
            mode = data.get('mode', 'normal')
            tx_id = data.get('transactionId')
            
            # Allow 'friends' mode bypass
            is_friends_mode = mode == 'friends'
            
            if not is_friends_mode:
                if not tx_id:
                     print("⛔ Blocked: No transaction ID provided")
                     self.send_response(402) # Payment Required
                     self._set_cors_headers()
                     self.send_header('Content-type', 'application/json')
                     self.end_headers()
                     self.wfile.write(json.dumps({
                         'error': 'Payment Required',
                         'details': 'Missing transaction ID'
                     }).encode('utf-8'))
                     return

                # Verify Transaction
                is_valid, verify_error = verify_transaction(tx_id, WALLET_ADDRESS)
                if not is_valid:
                     print(f"⛔ Blocked: Invalid transaction {tx_id} - {verify_error}")
                     self.send_response(400)
                     self._set_cors_headers()
                     self.send_header('Content-type', 'application/json')
                     self.end_headers()
                     self.wfile.write(json.dumps({
                         'error': 'Payment Verification Failed',
                         'details': verify_error
                     }).encode('utf-8'))
                     return
            else:
                 print("🔓 Access granted via Friends Mode")

            # --- END SECURITY CHECK ---
            
            # Validate input
            validation_errors = validate_request(data)
            if validation_errors:
                self.send_response(400)
                self._set_cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'error': 'Validation failed',
                    'details': validation_errors
                }).encode('utf-8'))
                return
            
            # Extract data
            card_name = data.get('cardName', 'Unknown Card')
            card_id = data.get('cardId', 0)  # Get card ID to detect Major vs Minor
            language = data.get('language', 'es')
            definitions = data.get('definitions', {})
            examples = data.get('examples', {})
            
            # Detect Major (0-21) vs Minor (22-77) Arcana
            is_major_arcana = card_id <= 21
            word_target = "300-400" if is_major_arcana else "150-200"
            max_tokens = 800 if is_major_arcana else 400
            
            # Check cache first
            cache_key = get_cache_key(card_name, language, definitions)
            cached_response = get_cached_response(cache_key)
            
            if cached_response:
                # Return cached response
                self.send_response(200)
                self._set_cors_headers()
                self.send_header('Content-type', 'application/json')
                self.send_header('X-Cache', 'HIT')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'reading': cached_response,
                    'cached': True
                }).encode('utf-8'))
                
                elapsed = time.time() - request_start
                print(f"⚡ Cache response time: {elapsed:.2f}s")
                return
            
            # Initialize Vertex AI (reuses existing client if already initialized)
            model = initialize_vertex_ai()
            
            # Build multilingual prompts
            prompts = {
                'es': f"""Eres un oráculo que habla directo y claro, sin rodeos místicos. Tu trabajo es conectar el tarot con la vida REAL de las personas.

LA CARTA QUE SACÓ:
"{card_name}"

LO QUE ESTA CARTA SIGNIFICA:
- Su energía actual (Arquetipo): {definitions.get('arquetipo', '')}
- Lo que está evitando (Sombra): {definitions.get('sombra', '')}
- Su búsqueda interior (Misticismo): {definitions.get('misticismo', '')}

TU TAREA ({word_target} palabras) - HABLA COMO PERSONA NORMAL:

Explícale EN CONCRETO qué significa esta carta en su vida COTIDIANA:

1. ¿Qué le está pasando AHORA MISMO que se refleja aquí?
2. ¿Qué está evitando hacer o enfrentar? (sin sermones)
3. ¿Qué acción ESPECÍFICA puede tomar ESTA SEMANA?
4. ¿En qué área de su vida aplica esto? (trabajo/amor/familia/decisiones)

REGLAS:
- USA "TÚ" (segunda persona directa)
- Ejemplos COTIDIANOS: "Es como cuando estás en el trabajo y...", "Imagina que tienes que decidir entre..."
- SIN frases genéricas tipo "el universo te llama"
- ESPECÍFICO y práctico, no filosófico
- Si es Arcano Menor: más breve y directo al grano

Habla como un amigo que sabe del tema y te explica sin pretensiones.""",
                
                'en': f"""You are a professional oracle specialized in personal guidance and human development.
Analyze the card "{card_name}" with this unique numerological configuration:

CONTEXT:
- Archetype (Var. {examples.get('arquetipo', '?')}/22): "{definitions.get('arquetipo', '')}"
- Shadow (Var. {examples.get('sombra', '?')}/22): "{definitions.get('sombra', '')}"
- Mysticism (Var. {examples.get('misticismo', '?')}/22): "{definitions.get('misticismo', '')}"

TASK (400 words - IMPORTANT: Generate a COMPLETE text of at least 400 words):
Generate a continuous, flowing EXTENSIVE reading that naturally integrates:

1. The main goal of personal development according to this card
2. The psychological depth of the archetype and how it manifests in daily life
3. Concrete and specific actions based on the received variants
4. Vital aspects requiring immediate attention
5. A final reflection on the path of transformation

STRICT REQUIREMENTS:
- Language: Formal, direct, action-oriented.
- Format: CONTINUOUS PARAGRAPHS (3-4 paragraphs), fluid and deep narrative.
- DO NOT use numbered lists, asterisks, or rigid structures.
- Be specific, detailed, deep, and EXTENSIVE in your analysis.
- Include metaphors and symbolism that resonate with the archetype.
- Connect concepts organically and philosophically.

Write as if you were a wise oracle narrating personalized and complete guidance.""",
                
                'pt': f"""Você é um oráculo profissional especializado em orientação pessoal e desenvolvimento humano.
Analise a carta "{card_name}" com esta configuração numerológica única:

CONTEXTO:
- Arquétipo (Var. {examples.get('arquetipo', '?')}/22): "{definitions.get('arquetipo', '')}"
- Sombra (Var. {examples.get('sombra', '?')}/22): "{definitions.get('sombra', '')}"
- Misticismo (Var. {examples.get('misticismo', '?')}/22): "{definitions.get('misticismo', '')}"

TAREFA (400 palavras - IMPORTANTE: Gere um texto COMPLETO de pelo menos 400 palavras):
Gere uma leitura contínua, fluida e EXTENSA que integre naturalmente:

1. O objetivo principal de desenvolvimento pessoal segundo esta carta
2. A profundidade psicológica do arquétipo e como se manifesta na vida diária
3. Ações concretas e específicas baseadas nas variantes recebidas
4. Aspectos vitais que requerem atenção imediata
5. Uma reflexão final sobre o caminho de transformação

REQUISITOS ESTRITOS:
- Linguagem: Formal, direta, orientada à ação.
- Formato: PARÁGRAFOS CONTÍNUOS (3-4 parágrafos), narrativa fluida e profunda.
- NÃO use listas numeradas, asteriscos nem estruturas rígidas.
- Seja específico, detalhado, profundo e EXTENSO em sua análise.
- Inclua metáforas e simbolismos que ressoem com o arquétipo.
- Conecte os conceitos de maneira orgânica e filosófica.

Escreva como se fosse um oráculo sábio narrando uma orientação personalizada e completa.""",
                
                'fr': f"""Vous êtes un oracle professionnel spécialisé dans l'orientation personnelle et le développement humain.
Analysez la carte "{card_name}" avec cette configuration numérologique unique:

CONTEXTE:
- Archétype (Var. {examples.get('arquetipo', '?')}/22): "{definitions.get('arquetipo', '')}"
- Ombre (Var. {examples.get('sombra', '?')}/22): "{definitions.get('sombra', '')}"
- Mysticisme (Var. {examples.get('misticismo', '?')}/22): "{definitions.get('misticismo', '')}"

TÂCHE (400 mots - IMPORTANT: Générez un texte COMPLET d'au moins 400 mots):
Générez une lecture continue, fluide et EXTENSIVE qui intègre naturellement:

1. L'objectif principal de développement personnel selon cette carte
2. La profondeur psychologique de l'archétype et comment il se manifeste dans la vie quotidienne
3. Des actions concrètes et spécifiques basées sur les variantes reçues
4. Les aspects vitaux nécessitant une attention immédiate
5. Une réflexion finale sur le chemin de transformation

EXIGENCES STRICTES:
- Langue: Formelle, directe, orientée vers l'action.
- Format: PARAGRAPHES CONTINUS (3-4 paragraphes), récit fluide et profond.
- N'utilisez PAS de listes numérotées, astérisques ni structures rigides.
- Soyez spécifique, détaillé, profond et EXTENSIF dans votre analyse.
- Incluez des métaphores et symbolismes qui résonnent avec l'archétype.
- Connectez les concepts de manière organique et philosophique.

Écrivez comme si vous étiez un oracle sage narrant des conseils personnalisés et complets.""",
                
                'de': f"""Sie sind ein professionelles Orakel, spezialisiert auf persönliche Orientierung und menschliche Entwicklung.
Analysieren Sie die Karte "{card_name}" mit dieser einzigartigen numerologischen Konfiguration:

KONTEXT:
- Archetyp (Var. {examples.get('arquetipo', '?')}/22): "{definitions.get('arquetipo', '')}"
- Schatten (Var. {examples.get('sombra', '?')}/22): "{definitions.get('sombra', '')}"
- Mystik (Var. {examples.get('misticismo', '?')}/22): "{definitions.get('misticismo', '')}"

AUFGABE (400 Wörter - WICHTIG: Erstellen Sie einen VOLLSTÄNDIGEN Text von mindestens 400 Wörtern):
Erstellen Sie eine kontinuierliche, fließende UMFASSENDE Lesung, die natürlich integriert:

1. Das Hauptziel der persönlichen Entwicklung gemäß dieser Karte
2. Die psychologische Tiefe des Archetyps und wie er sich im täglichen Leben manifestiert
3. Konkrete und spezifische Aktionen basierend auf den erhaltenen Varianten
4. Lebenswichtige Aspekte, die sofortige Aufmerksamkeit erfordern
5. Eine abschließende Reflexion über den Weg der Transformation

STRIKTE ANFORDERUNGEN:
- Sprache: Formell, direkt, handlungsorientiert.
- Format: KONTINUIERLICHE ABSÄTZE (3-4 Absätze), fließende und tiefe Erzählung.
- Verwenden Sie KEINE nummerierten Listen, Sternchen oder starre Strukturen.
- Seien Sie spezifisch, detailliert, tiefgründig und UMFASSEND in Ihrer Analyse.
- Fügen Sie Metaphern und Symbolik hinzu, die mit dem Archetyp resonieren.
- Verbinden Sie Konzepte organisch und philosophisch.

Schreiben Sie, als wären Sie ein weises Orakel, das personalisierte und vollständige Führung erzählt.""",
                
                'ja': f"""あなたは個人的な指導と人間開発を専門とするプロのオラクルです。
このユニークな数秘術的配置でカード「{card_name}」を分析してください:

コンテキスト:
- アーキタイプ (変形 {examples.get('arquetipo', '?')}/22): "{definitions.get('arquetipo', '')}"
- シャドウ (変形 {examples.get('sombra', '?')}/22): "{definitions.get('sombra', '')}"
- 神秘主義 (変形 {examples.get('misticismo', '?')}/22): "{definitions.get('misticismo', '')}"

タスク (400文字 - 重要: 少なくとも400文字の完全なテキストを生成してください):
以下を自然に統合した継続的で流動的で広範囲なリーディングを生成してください:

1. このカードに従った個人的発展の主な目標
2. アーキタイプの心理的深さと日常生活での表れ方
3. 受け取った変形に基づく具体的で特定の行動
4. 即座の注意が必要な重要な側面
5. 変容の道についての最終的な考察

厳格な要件:
- 言語: フォーマル、直接的、行動指向。
- 形式: 継続的な段落(3-4段落)、流動的で深い物語。
- 番号付きリスト、アスタリスク、硬直した構造を使用しないでください。
- 分析において具体的、詳細、深く、広範囲であってください。
- アーキタイプと共鳴する比喩とシンボリズムを含めてください。
- 概念を有機的かつ哲学的に接続してください。

賢明なオラクルが個人的で完全な指導を語っているかのように書いてください。""",
                
                'ko': f"""당신은 개인 지도와 인간 개발을 전문으로 하는 전문 오라클입니다.
이 고유한 수비학적 구성으로 카드 "{card_name}"를 분석하십시오:

컨텍스트:
- 원형 (변형 {examples.get('arquetipo', '?')}/22): "{definitions.get('arquetipo', '')}"
- 그림자 (변형 {examples.get('sombra', '?')}/22): "{definitions.get('sombra', '')}"
- 신비주의 (변형 {examples.get('misticismo', '?')}/22): "{definitions.get('misticismo', '')}"

과제 (400단어 - 중요: 최소 400단어의 완전한 텍스트를 생성하십시오):
다음을 자연스럽게 통합하는 연속적이고 유동적이며 광범위한 리딩을 생성하십시오:

1. 이 카드에 따른 개인 발전의 주요 목표
2. 원형의 심리적 깊이와 일상 생활에서의 표현
3. 받은 변형을 기반으로 한 구체적이고 특정한 행동
4. 즉각적인 주의가 필요한 중요한 측면
5. 변형의 길에 대한 최종 성찰

엄격한 요구사항:
- 언어: 공식적, 직접적, 행동 지향적.
- 형식: 연속 단락(3-4단락), 유동적이고 깊은 서사.
- 번호 목록, 별표 또는 경직된 구조를 사용하지 마십시오.
- 분석에서 구체적, 상세하고, 깊고, 광범위하게 하십시오.
- 원형과 공명하는 은유와 상징을 포함하십시오.
- 개념을 유기적이고 철학적으로 연결하십시오.

현명한 오라클이 개인화되고 완전한 지도를 서술하는 것처럼 작성하십시오.""",
                
                'zh': f"""您是专门从事个人指导和人类发展的专业神谕。
用这个独特的命理学配置分析卡牌"{card_name}":

背景:
- 原型 (变体 {examples.get('arquetipo', '?')}/22): "{definitions.get('arquetipo', '')}"
- 阴影 (变体 {examples.get('sombra', '?')}/22): "{definitions.get('sombra', '')}"
- 神秘主义 (变体 {examples.get('misticismo', '?')}/22): "{definitions.get('misticismo', '')}"

任务 (400字 - 重要: 生成至少400字的完整文本):
生成一个连续、流畅且广泛的阅读，自然地整合:

1. 根据此卡的个人发展主要目标
2. 原型的心理深度及其在日常生活中的表现
3. 基于收到的变体的具体和特定行动
4. 需要立即关注的重要方面
5. 关于转化之路的最终反思

严格要求:
- 语言: 正式、直接、以行动为导向。
- 格式: 连续段落(3-4段)、流畅而深刻的叙述。
- 不要使用编号列表、星号或僵硬的结构。
- 在分析中要具体、详细、深入和广泛。
- 包括与原型共鸣的隐喻和象征主义。
- 有机地和哲学地连接概念。

就像您是一位智慧的神谕在讲述个性化和完整的指导一样写作。"""
            }
            
            prompt = prompts.get(language, prompts['es'])
            
            # Call Gemini API with optimized configuration
            api_start = time.time()
            
            responses = model.generate_content(
                [prompt],
                generation_config={
                    "max_output_tokens": max_tokens,  # Dynamic: 800 for Major, 400 for Minor
                    "temperature": 1.0,  # Gemini default - best performance
                    "top_p": 0.95,
                    "top_k": 40,
                },
                stream=False,
            )
            
            api_time = time.time() - api_start
            response_text = responses.text
            
            # Validate response quality
            word_count = len(response_text.split())
            char_count = len(response_text)
            
            if char_count < 50:
                print(f"⚠️  Warning: Short response ({char_count} chars)")
            
            print(f"✅ Generated {char_count} chars, ~{word_count} words in {api_time:.2f}s")
            
            # Cache the response
            set_cached_response(cache_key, response_text)
            
            # Send successful response
            self.send_response(200)
            self._set_cors_headers()
            self.send_header('Content-type', 'application/json')
            self.send_header('X-Cache', 'MISS')
            self.send_header('X-Generation-Time', f'{api_time:.2f}s')
            self.end_headers()
            
            self.wfile.write(json.dumps({
                'reading': response_text,
                'cached': False,
                'stats': {
                    'chars': char_count,
                    'words': word_count,
                    'generation_time': round(api_time, 2)
                }
            }).encode('utf-8'))
            
            elapsed = time.time() - request_start
            print(f"⚡ Total request time: {elapsed:.2f}s")

        except json.JSONDecodeError as e:
            error_msg = f"Invalid JSON: {str(e)}"
            print(f"❌ {error_msg}")
            self.send_response(400)
            self._set_cors_headers()
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'error': error_msg,
                'tip': 'Check request payload format'
            }).encode('utf-8'))
            
        except ValueError as e:
            error_msg = f"Validation error: {str(e)}"
            print(f"❌ {error_msg}")
            self.send_response(400)
            self._set_cors_headers()
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'error': error_msg,
                'tip': 'Check request payload structure'
            }).encode('utf-8'))
            
        except Exception as e:
            error_type = type(e).__name__
            error_msg = str(e)
            print(f"❌ {error_type}: {error_msg}")
            
            # Provide helpful tips based on error type
            tips = {
                'ResourceExhausted': 'API quota exceeded. Wait and retry, or check billing.',
                'DeadlineExceeded': 'Request timeout. Model may be overloaded, retry in a few seconds.',
                'PermissionDenied': 'API key or service account permissions issue.',
                'InvalidArgument': 'Check prompt structure and generation config.',
            }
            
            self.send_response(500)
            self._set_cors_headers()
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'error': f'{error_type}: {error_msg}',
                'tip': tips.get(error_type, 'Check Gemini API status and retry')
            }).encode('utf-8'))

    def do_GET(self):
        """Health check endpoint"""
        self.send_response(200)
        self._set_cors_headers()
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        self.wfile.write(json.dumps({
            'status': 'active',
            'service': 'Star Oracle API',
            'version': '2.0',
            'vertex_initialized': _vertex_initialized,
            'cached_responses': len(response_cache)
        }).encode('utf-8'))
