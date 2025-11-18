let productos = [];
let carrito = [];

// ---- Selectores ----
const contenedor = document.getElementById("contenedor-productos");
const contenedorCarrito = document.getElementById("carrito");
const totalDiv = document.getElementById("total");
const finalizarBtn = document.getElementById("finalizar");

// ---- Cargar productos desde JSON ----
async function cargarProductos() {
    try {
        const res = await fetch("./productos.json");
        productos = await res.json();
        renderProductos();
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

// ---- Render productos ----
function renderProductos() {
    contenedor.innerHTML = "";

    productos.forEach(prod => {
        const item = document.createElement("div");
        item.className = "card";
        item.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}">
            <h3>${prod.nombre}</h3>
            <p>Precio: $${prod.precio}</p>
            <button onclick="agregarAlCarrito(${prod.id})">Agregar</button>
        `;
        contenedor.appendChild(item);
    });
}

// ---- Agregar al carrito ----
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    carrito.push(producto);

    Swal.fire({
        icon: "success",
        title: "Producto agregado",
        text: `${producto.nombre} fue agregado al carrito`,
        timer: 1200,
        showConfirmButton: false
    });

    renderCarrito();
}

// ---- Render carrito ----
function renderCarrito() {
    contenedorCarrito.innerHTML = "";

    carrito.forEach((prod, index) => {
        const item = document.createElement("div");
        item.className = "carrito-item";
        item.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}">
            <p>${prod.nombre} - $${prod.precio}</p>
            <button onclick="eliminarProducto(${index})">❌</button>
        `;
        contenedorCarrito.appendChild(item);
    });

    actualizarTotal();
}

// ---- Eliminar un producto ----
function eliminarProducto(index) {
    carrito.splice(index, 1);
    renderCarrito();
}

// ---- Total ----
function actualizarTotal() {
    const total = carrito.reduce((acc, prod) => acc + prod.precio, 0);
    totalDiv.textContent = total;
}

// ---- Finalizar compra (mejorado) ----
finalizarBtn.addEventListener("click", () => {
  if (!carrito || carrito.length === 0) {
    return Swal.fire({
      icon: "warning",
      title: "Carrito vacío",
      text: "Agrega productos antes de finalizar."
    });
  }

  // Construimos el resumen HTML que mostrará SweetAlert
  const total = carrito.reduce((acc, p) => acc + p.precio * (p.cantidad || 1), 0);
  let listaHTML = '<ul style="text-align:left;padding-left:18px">';
  carrito.forEach(p => {
    const qty = p.cantidad || 1;
    listaHTML += `<li style="margin-bottom:6px">${p.nombre} x${qty} — $${p.precio * qty}</li>`;
  });
  listaHTML += `</ul><p style="text-align:right;font-weight:700;margin-top:8px">Total: $${total}</p>`;

  // Confirmación final con SweetAlert (resumen + botones)
  Swal.fire({
    title: 'Confirmar compra',
    html: `<h3>Resumen de compra</h3>${listaHTML}`,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Confirmar y pagar',
    cancelButtonText: 'Cancelar',
    width: '600px',
    focusConfirm: false
  }).then((result) => {
    if (result.isConfirmed) {
      // Simulamos el pago y mostramos éxito
      Swal.fire({
        title: '¡Compra realizada!',
        html: `<p>Gracias por tu compra. Se procesó un pago de <strong>$${total}</strong>.</p>`,
        icon: 'success'
      });

      // Vaciar carrito, limpiar storage y actualizar UI
      carrito = [];
      try { localStorage.removeItem('carrito'); } catch(e) {}
      renderCarrito();
    } else {
      // Si cancela, mostramos mensaje informativo (opcional)
      Swal.fire({
        title: 'Compra cancelada',
        icon: 'info',
        timer: 1400,
        showConfirmButton: false
      });
    }
  });
});

// ---- INICIAR ----
cargarProductos();
