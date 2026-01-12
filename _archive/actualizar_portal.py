
html_path = '/home/star/star/BAJAR_CODIGO.html'

html_template = """
<!DOCTYPE html>
<html>
<head>
    <title>Descargar Oráculo de Star</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
            color: white;
            margin: 0;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(25px);
            padding: 50px;
            border-radius: 30px;
            text-align: center;
            box-shadow: 0 15px 50px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.15);
            max-width: 500px;
        }
        h1 { margin-bottom: 10px; font-weight: 300; letter-spacing: 1px; }
        h2 { margin-bottom: 30px; font-weight: 200; font-size: 16px; color: #a2a2ff; }
        
        .btn {
            display: inline-block;
            text-decoration: none;
            color: white;
            border: none;
            padding: 18px 40px;
            font-size: 16px;
            font-weight: bold;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 10px;
            width: 80%;
        }
        
        .btn-zip {
            background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
            box-shadow: 0 4px 15px rgba(37, 117, 252, 0.4);
        }
        
        .btn-zip:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(37, 117, 252, 0.6);
        }

        .btn-md {
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.3);
        }
        
        .btn-md:hover {
            background: rgba(255,255,255,0.2);
        }

        .info { color: rgba(255,255,255,0.5); margin-top: 30px; font-size: 13px; line-height: 1.5; }
        .status { color: #00ff88; font-weight: bold; margin-top: 10px; display: block; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Oráculo Extraído</h1>
        <h2>Estado: ESTABLE Y LISTO</h2>
        
        <a href="oraculo_star.zip" download class="btn btn-zip">
            DESCARGAR APP COMPLETA (.ZIP)
        </a>
        
        <a href="oraculo_codificado.md" download class="btn btn-md">
            Descargar Código Solo (.MD)
        </a>

        <div class="info">
            La versión ZIP (366MB) incluye todas las imágenes y la estructura lista para funcionar en tu ordenador.<br>
            <span class="status">● Servidor Antigravity listo</span>
        </div>
    </div>
</body>
</html>
"""

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html_template)

print("✅ Descargador actualizado con link al ZIP.")
