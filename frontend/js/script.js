const API_URL = "http://127.0.0.1:8000";


// ==========================================
// OBTENER PRODUCTOS DESDE EL BACK-END
// ==========================================

async function obtenerProductos() {

    try {

        const respuesta = await fetch(`${API_URL}/productos/`);

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los productos.");
        }

        const productos = await respuesta.json();

        mostrarProductos(productos);

    } catch (error) {

        console.error("Error al obtener productos:", error);

        const listaProductos =
            document.getElementById("lista-productos");

        if (listaProductos) {

            listaProductos.innerHTML = `
                <tr>
                    <td colspan="3">
                        No se pudieron cargar los productos.
                    </td>
                </tr>
            `;
        }
    }
}


// ==========================================
// MOSTRAR PRODUCTOS EN LA TABLA
// ==========================================

function mostrarProductos(productos) {

    const listaProductos =
        document.getElementById("lista-productos");

    if (!listaProductos) {
        return;
    }

    listaProductos.innerHTML = "";

    productos.forEach(function(producto) {

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.stock}</td>
            <td>${producto.categoria}</td>
        `;

        listaProductos.appendChild(fila);

    });
}


// ==========================================
// OBTENER CATEGORÍAS DESDE EL BACK-END
// ==========================================

async function obtenerCategorias() {

    try {

        const respuesta =
            await fetch(`${API_URL}/categorias/`);

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener las categorías.");
        }

        const categorias =
            await respuesta.json();

        mostrarCategorias(categorias);
        cargarCategoriasFormulario(categorias);

    } catch (error) {

        console.error("Error al obtener categorías:", error);

        const listaCategorias =
            document.getElementById("lista-categorias");

        if (listaCategorias) {

            listaCategorias.innerHTML =
                "<p>No se pudieron cargar las categorías.</p>";

        }

        const selectorCategoria =
            document.getElementById("categoria");

        if (selectorCategoria) {

            selectorCategoria.innerHTML =
                "<option value=''>No se pudieron cargar las categorías</option>";

        }
    }
}


// ==========================================
// MOSTRAR CATEGORÍAS
// ==========================================

function mostrarCategorias(categorias) {

    const listaCategorias =
        document.getElementById("lista-categorias");

    if (!listaCategorias) {
        return;
    }

    listaCategorias.innerHTML = "";

    categorias.forEach(function(categoria) {

        const tarjeta =
            document.createElement("article");

        tarjeta.className = "tarjeta";

        tarjeta.innerHTML = `
            <h3>${categoria.nombre}</h3>

            <p>
                Categoría registrada en el sistema
                de inventario.
            </p>

            <a href="productos.html" class="boton">
                Ver productos
            </a>
        `;

        listaCategorias.appendChild(tarjeta);

    });
}



// ==========================================
// CARGAR CATEGORÍAS EN EL FORMULARIO
// ==========================================

function cargarCategoriasFormulario(categorias) {

    const selectorCategoria =
        document.getElementById("categoria");

    if (!selectorCategoria) {
        return;
    }

    selectorCategoria.innerHTML = `
        <option value="">
            Selecciona una categoría
        </option>
    `;

    categorias.forEach(function(categoria) {

        const opcion =
            document.createElement("option");

        opcion.value = categoria.id;
        opcion.textContent = categoria.nombre;

        selectorCategoria.appendChild(opcion);

    });
}


// ==========================================
// AGREGAR PRODUCTO AL BACK-END
// ==========================================

const formulario =
    document.getElementById("formulario-producto");

if (formulario) {

    formulario.addEventListener("submit", async function(evento) {

        evento.preventDefault();

        const nombre =
            document.getElementById("nombre").value;

        const stock =
            document.getElementById("stock").value;

        const categoria =
            document.getElementById("categoria").value;

        const mensaje =
            document.getElementById("mensaje");

        if (!nombre || !stock || !categoria) {

            mensaje.textContent =
                "Por favor, completa todos los campos.";

            return;
        }

        try {

            const respuesta = await fetch(
                `${API_URL}/productos/`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        nombre: nombre,
                        stock: Number(stock),
                        categoria: Number(categoria)
                    })
                }
            );

            if (!respuesta.ok) {

                const error =
                    await respuesta.json();

                console.error("Error del servidor:", error);

                throw new Error(
                    "No se pudo agregar el producto."
                );
            }

            const productoCreado =
                await respuesta.json();

            console.log(
                "Producto creado:",
                productoCreado
            );

            mensaje.textContent =
                "Producto agregado correctamente al inventario.";

            formulario.reset();

        } catch (error) {

            console.error(
                "Error al agregar producto:",
                error
            );

            mensaje.textContent =
                "No se pudo agregar el producto.";
        }

    });

}


// ==========================================
// INICIALIZAR FUNCIONES SEGÚN LA PÁGINA
// ==========================================

if (document.getElementById("lista-productos")) {

    obtenerProductos();

}

if (document.getElementById("lista-categorias") ||
    document.getElementById("categoria")) {

    obtenerCategorias();

}