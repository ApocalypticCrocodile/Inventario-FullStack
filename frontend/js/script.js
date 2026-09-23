const API_URL = "http://127.0.0.1:8000";


// ==========================================
// OBTENER PRODUCTOS DESDE EL BACK-END
// ==========================================

async function obtenerProductos() {

    const listaProductos =
        document.getElementById("lista-productos");

    // ESTADO DE CARGA
    if (listaProductos) {

        listaProductos.innerHTML = `
            <tr>
                <td colspan="4">
                    Cargando productos...
                </td>
            </tr>
        `;

    }

    try {

        const respuesta =
            await fetch(`${API_URL}/productos/`);

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los productos.");
        }

        const productos =
            await respuesta.json();

        mostrarProductos(productos);

    } catch (error) {

        console.error("Error al obtener productos:", error);

        if (listaProductos) {

            listaProductos.innerHTML = `
                <tr>
                    <td colspan="4">
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

        const fila =
            document.createElement("tr");

        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.stock}</td>
            <td>${producto.categoria}</td>
            <td>
                <a href="agregar_producto.html?id=${producto.id}" class="boton">
                    Editar
                </a>
            </td>
        `;

        listaProductos.appendChild(fila);

    });
}


// ==========================================
// OBTENER CATEGORÍAS DESDE EL BACK-END
// ==========================================

async function obtenerCategorias() {

    const listaCategorias =
        document.getElementById("lista-categorias");

    const selectorCategoria =
        document.getElementById("categoria");


    // ESTADO DE CARGA

    if (listaCategorias) {

        listaCategorias.innerHTML =
            "<p>Cargando categorías...</p>";

    }

    if (selectorCategoria) {

        selectorCategoria.innerHTML =
            "<option value=''>Cargando categorías...</option>";

    }


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

        return categorias;

    } catch (error) {

        console.error("Error al obtener categorías:", error);

        if (listaCategorias) {

            listaCategorias.innerHTML =
                "<p>No se pudieron cargar las categorías.</p>";

        }

        if (selectorCategoria) {

            selectorCategoria.innerHTML =
                "<option value=''>No se pudieron cargar las categorías</option>";

        }

        return null;
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
// AGREGAR / EDITAR PRODUCTO EN EL BACK-END
// ==========================================

const formulario =
    document.getElementById("formulario-producto");

if (formulario) {

    const parametros =
        new URLSearchParams(window.location.search);

    const productoId =
        parametros.get("id");

    const tituloFormulario =
        document.getElementById("titulo-formulario");

    const descripcionFormulario =
        document.getElementById("descripcion-formulario");

    const botonFormulario =
        document.getElementById("boton-formulario");


    // ==========================================
    // CARGAR PRODUCTO PARA EDITAR
    // ==========================================

    async function cargarProductoParaEditar() {

        if (!productoId) {
            return;
        }

        try {

            const respuesta =
                await fetch(`${API_URL}/productos/${productoId}/`);

            if (!respuesta.ok) {
                throw new Error(
                    "No se pudo obtener el producto."
                );
            }

            const producto =
                await respuesta.json();

            document.getElementById("nombre").value =
                producto.nombre;

            document.getElementById("stock").value =
                producto.stock;

            document.getElementById("categoria").value =
                producto.categoria;

            if (tituloFormulario) {
                tituloFormulario.textContent =
                    "Editar producto";
            }

            if (descripcionFormulario) {
                descripcionFormulario.textContent =
                    "Modifica la información del producto seleccionado.";
            }

            if (botonFormulario) {
                botonFormulario.textContent =
                    "Guardar cambios";
            }

        } catch (error) {

            console.error(
                "Error al cargar producto:",
                error
            );

            const mensaje =
                document.getElementById("mensaje");

            if (mensaje) {
                mensaje.textContent =
                    "No se pudo cargar el producto.";
            }
        }
    }


    // ==========================================
    // GUARDAR PRODUCTO
    // ==========================================

    formulario.addEventListener(
        "submit",
        async function(evento) {

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


            // EVITAR DOBLE ENVÍO

            botonFormulario.disabled = true;
            botonFormulario.textContent = "Guardando...";


            try {

                let respuesta;


                // ==========================================
                // EDITAR PRODUCTO → PUT
                // ==========================================

                if (productoId) {

                    respuesta = await fetch(
                        `${API_URL}/productos/${productoId}/`,
                        {
                            method: "PUT",

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

                }


                // ==========================================
                // AGREGAR PRODUCTO → POST
                // ==========================================

                else {

                    respuesta = await fetch(
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

                }


                if (!respuesta.ok) {

                    const error =
                        await respuesta.json();

                    console.error(
                        "Error del servidor:",
                        error
                    );

                    throw new Error(
                        "No se pudo guardar el producto."
                    );
                }


                const productoGuardado =
                    await respuesta.json();

                console.log(
                    "Producto guardado:",
                    productoGuardado
                );


                // ==========================================
                // MENSAJE SEGÚN LA OPERACIÓN
                // ==========================================

                if (productoId) {

                    mensaje.textContent =
                        "Producto actualizado correctamente.";

                    setTimeout(function() {

                        window.location.href =
                            "productos.html";

                    }, 1000);

                }

                else {

                    mensaje.textContent =
                        "Producto agregado correctamente al inventario.";

                    formulario.reset();

                    // RESTAURAR BOTÓN DESPUÉS DEL POST
                    botonFormulario.disabled = false;
                    botonFormulario.textContent = "Guardar producto";

                }


            } catch (error) {

                console.error(
                    "Error al guardar producto:",
                    error
                );

                mensaje.textContent =
                    "No se pudo guardar el producto.";

                // PERMITIR REINTENTAR SI OCURRE UN ERROR
                botonFormulario.disabled = false;

                if (productoId) {
                    botonFormulario.textContent =
                        "Guardar cambios";
                }
                else {
                    botonFormulario.textContent =
                        "Guardar producto";
                }

            }

        }
    );


    // ==========================================
    // INICIALIZAR FORMULARIO
    // ==========================================

obtenerCategorias().then(function() {

    if (productoId) {

        cargarProductoParaEditar();

    }

});

}


// ==========================================
// INICIALIZAR FUNCIONES SEGÚN LA PÁGINA
// ==========================================

if (document.getElementById("lista-productos")) {

    obtenerProductos();

}

if (document.getElementById("lista-categorias")) {

    obtenerCategorias();

}

