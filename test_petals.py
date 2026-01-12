from petals import AutoDistributedModelForCausalLM
from transformers import AutoTokenizer

# Elegimos un modelo que suele estar activo en la red (Stable Beluga 2 es popular y potente)
MODEL_NAME = "petals-team/StableBeluga2"

print(f"🌸 Conectando a la colmena Petals ({MODEL_NAME})...")

try:
    # 1. Cargamos el tokenizador (el traductor de texto a números)
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

    # 2. Conectamos con el modelo distribuido
    model = AutoDistributedModelForCausalLM.from_pretrained(MODEL_NAME)
    
    print("✅ ¡Conectado a la colmena!")
    print("🧠 Generando pensamiento de prueba...")

    # 3. Prueba simple
    inputs = tokenizer("El Tarot es una herramienta para", return_tensors="pt")["input_ids"]
    outputs = model.generate(inputs, max_new_tokens=20)
    
    print("\n🔮 Respuesta de la Colmena:")
    print(tokenizer.decode(outputs[0]))

except Exception as e:
    print(f"\n❌ Error conectando a Petals: {e}")
