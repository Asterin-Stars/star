
import json

md_path = '/home/star/star/oraculo_codificado.md'
html_path = '/home/star/star/BAJAR_CODIGO.html'

with open(md_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Escapar el contenido para que sea seguro en un template literal de JS
safe_content = json.dumps(content)

html_template = f"""
<!DOCTYPE html>
<html>
<head>
    <title>Descargar Oráculo de Star</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: linear-gradient(135deg, #1e1e2f 0%, #0f0f1a 100%);
            color: white;
            margin: 0;
        }}
        .container {{
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            padding: 40px;
            border-radius: 24px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.1);
        }}
        h1 {{ margin-bottom: 30px; font-weight: 300; letter-spacing: 1px; }}
        button {{
            background: linear-gradient(90deg, #ff416c 0%, #ff4b2b 100%);
            color: white;
            border: none;
            padding: 15px 40px;
            font-size: 18px;
            font-weight: bold;
            border-radius: 50px;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 15px rgba(255, 65, 108, 0.4);
        }}
        button:hover {{
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 65, 108, 0.6);
        }}
        p {{ color: rgba(255,255,255,0.6); margin-top: 20px; font-size: 14px; }}
    </style>
</head>
<body>
    <div class="container">
        <h1>Tu Código está listo</h1>
        <button id="dlBtn">DESCARGAR ORÁCULO (.md)</button>
        <p>Haz clic para guardar el archivo en tu PC</p>
    </div>

    <script>
        document.getElementById('dlBtn').addEventListener('click', () => {{
            const content = {safe_content};
            const blob = new Blob([content], {{ type: 'text/markdown' }});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'oraculo_codificado_FINAL.md';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }});
    </script>
</body>
</html>
"""

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html_template)

print("✅ Archivo BAJAR_CODIGO.html creado con éxito.")
