/* === EL CEREBRO (Lógica) === */

console.log("⚡ Star Genesis: Sistema Iniciado");

// 1. Seleccionar elementos del HTML (Traerlos a la mesa)
const botonRevelar = document.getElementById("btn-revelar");
const mesaTarot = document.getElementById("mesa-tarot");

// 2. Definir qué pasa cuando interactuamos
botonRevelar.addEventListener("click", () => {
  console.log("🔮 Ritual iniciado...");

  // Un simple cambio para probar que funciona
  mesaTarot.innerHTML = "<p>✨ ¡El destino se está tejiendo! ✨</p>";
});
