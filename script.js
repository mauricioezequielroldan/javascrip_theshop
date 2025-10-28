// ---- Datos base ----
const productos = [
  { id: 1, nombre: "Cigarrillos", precio: 2500 },
  { id: 2, nombre: "Bebida", precio: 4800 },
  { id: 3, nombre: "Galletitas", precio: 3100 },
  { id: 4, nombre: "Caramelos", precio: 1500 }
];

let carrito = [];

// ---- 
const contenedor = document.getElementById("contenedor-productos");
const contenedorCarrito = document.getElementById("carrito");
const totalDiv = document.getElementById("total");
const finalizarBtn = document.getElementById("finalizar");

// ---- 
productos.forEach(p => {
  const card = document.createElement("div");
  card.className = "producto";
  card.innerHTML = `
    <h3>${p.nombre}</h3>
    <p>Precio: $${p.precio}</p>
    <button onclick="agregarAlCarrito(${p.id})">Agregar al carrito</button>
  `;
  contenedor.appendChild(card);
});

// ----carrito ----
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  const itemExistente = carrito.find(p => p.id === id);

  if (itemExistente) {
    itemExistente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  actualizarCarrito();
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter(p => p.id !== id);
  actualizarCarrito();
}

function actualizarCarrito() {
  contenedorCarrito.innerHTML = "";
  let total = 0;

  carrito.forEach(p => {
    const item = document.createElement("div");
    item.innerHTML = `
      <span>${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}</span>
      <button onclick="eliminarDelCarrito(${p.id})">❌</button>
    `;
    contenedorCarrito.appendChild(item);
    total += p.precio * p.cantidad;
  });

  totalDiv.textContent = carrito.length > 0 ? `Total: $${total}` : "Carrito vacío";

  // Guardamos el carrito en localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// ---- Recuperar carrito al cargar la página - lo hice con gpt
window.addEventListener("load", () => {
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    actualizarCarrito();
  }
});

// ---- Finalizar compra ----
finalizarBtn.addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  let mensaje = "Resumen de tu compra:\n";
  carrito.forEach(p => {
    mensaje += `${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}\n`;
  });
  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  mensaje += `\nTotal a pagar: $${total}`;

  alert(mensaje);

  //Limpiar carrito
  carrito = [];
  localStorage.removeItem("carrito");
  actualizarCarrito();
  console.log("Compra finalizada correctamente.");
});
