// ---- Datos base ----
const productos = [
  { id: 1, nombre: "Cigarrillos", precio: 2500 },
  { id: 2, nombre: "Bebida", precio: 4800 },
  { id: 3, nombre: "Galletitas", precio: 3100 },
  { id: 4, nombre: "Caramelos", precio: 1500 }
];

let carrito = [];

// ---- Selectores ----
const contenedor = document.getElementById("contenedor-productos");
const contenedorCarrito = document.getElementById("carrito");
const totalDiv = document.getElementById("total");
const finalizarBtn = document.getElementById("finalizar");

// ---- Render productos ----
function renderProductos() {
  contenedor.innerHTML = ""; // limpiar
  productos.forEach(p => {
    const card = document.createElement("div");
    card.className = "producto";
    card.innerHTML = `
      <h3>${p.nombre}</h3>
      <p>Precio: $${p.precio}</p>
      <button>Agregar al carrito</button>
    `;
    const btn = card.querySelector("button");
    btn.addEventListener("click", () => agregarAlCarrito(p.id));
    contenedor.appendChild(card);
  });
}

// ---- Agregar al carrito ----
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  const itemExistente = carrito.find(p => p.id === id);

  if (itemExistente) {
    itemExistente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  actualizarCarrito();
  animacionCarrito();
}

// ---- Eliminar del carrito ----
function eliminarDelCarrito(id) {
  carrito = carrito.filter(p => p.id !== id);
  actualizarCarrito();
}

// ---- Actualizar cantidad ----
function actualizarCantidad(id, cantidad) {
  const producto = carrito.find(p => p.id === id);
  if (producto) {
    producto.cantidad = parseInt(cantidad) || 1; // evita NaN
    actualizarCarrito();
  }
}

// ---- Actualizar carrito ----
function actualizarCarrito() {
  contenedorCarrito.innerHTML = "";
  let total = 0;

  carrito.forEach(p => {
    const item = document.createElement("div");
    item.className = "carrito-item";

    const spanNombre = document.createElement("span");
    spanNombre.innerHTML = `${p.nombre} x `;
    
    const input = document.createElement("input");
    input.type = "number";
    input.value = p.cantidad;
    input.min = 1;
    input.addEventListener("change", () => actualizarCantidad(p.id, input.value));

    spanNombre.appendChild(input);

    const spanSubtotal = document.createElement("span");
    spanSubtotal.textContent = `Subtotal: $${p.precio * p.cantidad}`;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "❌";
    btnEliminar.addEventListener("click", () => eliminarDelCarrito(p.id));

    item.appendChild(spanNombre);
    item.appendChild(spanSubtotal);
    item.appendChild(btnEliminar);

    contenedorCarrito.appendChild(item);

    total += p.precio * p.cantidad;
  });

  totalDiv.textContent = carrito.length > 0 ? `Total: $${total}` : "Carrito vacío";

  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// ---- Animación visual ----
function animacionCarrito() {
  contenedorCarrito.classList.add("agregado");
  setTimeout(() => contenedorCarrito.classList.remove("agregado"), 300);
}

// ---- Recuperar carrito ----
window.addEventListener("DOMContentLoaded", () => {
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
  }

  renderProductos();
  actualizarCarrito();

  // Finalizar compra
  if (finalizarBtn) {
    finalizarBtn.addEventListener("click", finalizarCompra);
  }
});

// ---- Finalizar compra ----
function finalizarCompra() {
  if (carrito.length === 0) {
    mostrarModal("Tu carrito está vacío.");
    return;
  }

  let mensaje = "<h3>Resumen de tu compra:</h3><ul>";
  carrito.forEach(p => {
    mensaje += `<li>${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}</li>`;
  });
  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  mensaje += `</ul><p><strong>Total a pagar: $${total}</strong></p>`;

  mostrarModal(mensaje);

  carrito = [];
  localStorage.removeItem("carrito");
  actualizarCarrito();
}

// ---- Modal simple ----
function mostrarModal(contenido) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-contenido">
      ${contenido}
      <button id="cerrarModal">Cerrar</button>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector("#cerrarModal").addEventListener("click", () => {
    modal.remove();
  });
}
