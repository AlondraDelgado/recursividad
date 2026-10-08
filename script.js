"use strict";

// ==================================================
// FUNCIONES PARA CREAR LOS ELEMENTOS VISUALES
// ==================================================

function crearElemento(tipo, texto, contenedor) {
    const elemento = document.createElement(tipo);

    if (texto !== undefined) {
        elemento.textContent = texto;
    }

    if (contenedor) {
        contenedor.appendChild(elemento);
    }

    return elemento;
}

function prepararResultado(id) {
    const contenedor = document.getElementById(id);

    contenedor.replaceChildren();
    contenedor.style.display = "block";
    contenedor.style.textAlign = "left";

    return contenedor;
}

// Comprueba que el usuario ingrese un entero válido.
function leerEntero(id, minimo, maximo) {
    const campo = document.getElementById(id);
    const texto = campo.value.trim();
    const numero = Number(texto);

    if (
        texto === "" ||
        !Number.isInteger(numero) ||
        numero < minimo ||
        numero > maximo
    ) {
        campo.focus();

        throw new Error(
            `Ingresa un número entero entre ${minimo} y ${maximo}.`
        );
    }

    return numero;
}

// Crea una figura SVG que se adapta al panel.
function crearSVG(contenedor, ancho, alto, descripcion) {
    const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );

    svg.setAttribute("viewBox", `0 0 ${ancho} ${alto}`);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", descripcion);

    svg.style.width = "100%";
    svg.style.height = "auto";
    svg.style.display = "block";

    contenedor.appendChild(svg);

    return svg;
}

function figuraSVG(svg, tipo, atributos, texto) {
    const elemento = document.createElementNS(
        "http://www.w3.org/2000/svg",
        tipo
    );

    for (const [nombre, valor] of Object.entries(atributos)) {
        elemento.setAttribute(nombre, valor);
    }

    if (texto !== undefined) {
        elemento.textContent = texto;
    }

    svg.appendChild(elemento);

    return elemento;
}

function tarjetaVisual(contenedor, texto, nivel = 0) {
    const tarjeta = crearElemento("div", texto, contenedor);

    tarjeta.style.padding = "10px";
    tarjeta.style.margin = "6px 0";
    tarjeta.style.marginLeft = `${Math.min(nivel, 6) * 8}px`;
    tarjeta.style.borderLeft = "4px solid var(--principal, #9b3569)";
    tarjeta.style.background = "var(--suave, #f9e5ef)";
    tarjeta.style.borderRadius = "8px";

    return tarjeta;
}

// ==================================================
// 1. FACTORIAL RECURSIVO
// ==================================================

// BigInt permite mostrar exactamente factoriales grandes.
function factorial(n, pasos) {
    pasos.push({
        texto: `Llamada: factorial(${n})`,
        nivel: pasos.filter(p => p.tipo === "llamada").length,
        tipo: "llamada"
    });

    if (n === 0) {
        pasos.push({
            texto: "Caso base: factorial(0) = 1",
            nivel: n,
            tipo: "resultado"
        });

        return 1n;
    }

    const anterior = factorial(n - 1, pasos);
    const resultado = BigInt(n) * anterior;

    pasos.push({
        texto: `${n} × ${anterior} = ${resultado}`,
        nivel: 0,
        tipo: "resultado"
    });

    return resultado;
}

function mostrarFactorial() {
    const contenedor = prepararResultado("resultado-factorial");

    try {
        const n = leerEntero("numero-factorial", 0, 20);
        const pasos = [];
        const resultado = factorial(n, pasos);

        crearElemento("h3", `${n}! = ${resultado}`, contenedor);

        crearElemento(
            "p",
            "Primero se realizan las llamadas; después se resuelven las multiplicaciones pendientes.",
            contenedor
        );

        const detalle = crearElemento("details", undefined, contenedor);
        detalle.open = true;

        crearElemento(
            "summary",
            `Ver recorrido: ${n + 1} llamadas`,
            detalle
        );

        pasos.forEach(function (paso) {
            tarjetaVisual(detalle, paso.texto, paso.nivel);
        });
    } catch (error) {
        crearElemento("p", error.message, contenedor);
    }
}

// ==================================================
// 2. FIBONACCI RECURSIVO
// ==================================================

function fibonacci(n) {
    if (n <= 1) {
        return n;
    }

    return fibonacci(n - 1) + fibonacci(n - 2);
}

function mostrarFibonacci() {
    const contenedor = prepararResultado("resultado-fibonacci");

    try {
        const cantidad = leerEntero("cantidad-fibonacci", 1, 15);

        crearElemento(
            "h3",
            `Primeros ${cantidad} términos`,
            contenedor
        );

        const tarjetas = crearElemento("div", undefined, contenedor);

        tarjetas.style.display = "flex";
        tarjetas.style.flexWrap = "wrap";
        tarjetas.style.gap = "8px";

        for (let i = 0; i < cantidad; i++) {
            const valor = fibonacci(i);
            const tarjeta = crearElemento("div", undefined, tarjetas);

            tarjeta.style.padding = "10px";
            tarjeta.style.minWidth = "65px";
            tarjeta.style.textAlign = "center";
            tarjeta.style.borderRadius = "10px";
            tarjeta.style.background = "var(--suave, #f9e5ef)";

            crearElemento("small", `F(${i})`, tarjeta);
            crearElemento("strong", String(valor), tarjeta)
                .style.display = "block";
        }

        crearElemento(
            "p",
            "Cada término, después de 0 y 1, se obtiene sumando los dos anteriores.",
            contenedor
        );

        // Se limita el árbol para que sea fácil de leer.
        const ejemplo = Math.min(cantidad - 1, 5);

        const detalle = crearElemento("details", undefined, contenedor);

        crearElemento(
            "summary",
            `Ver llamadas recursivas de F(${ejemplo})`,
            detalle
        );

        dibujarArbolFibonacci(ejemplo, detalle, 0);

        crearElemento(
            "p",
            "Los valores que aparecen varias veces muestran los cálculos repetidos de esta versión.",
            detalle
        );
    } catch (error) {
        crearElemento("p", error.message, contenedor);
    }
}

function dibujarArbolFibonacci(n, contenedor, nivel) {
    const texto = n <= 1
        ? `F(${n}) = ${n} · caso base`
        : `F(${n}) = F(${n - 1}) + F(${n - 2}) = ${fibonacci(n)}`;

    tarjetaVisual(contenedor, texto, nivel);

    if (n <= 1) {
        return;
    }

    dibujarArbolFibonacci(n - 1, contenedor, nivel + 1);
    dibujarArbolFibonacci(n - 2, contenedor, nivel + 1);
}

// ==================================================
// 3. TORRES DE HANÓI
// ==================================================

let temporizadorHanoi = null;

// Genera los movimientos usando recursividad.
function hanoi(n, origen, auxiliar, destino, movimientos) {
    if (n === 1) {
        movimientos.push([origen, destino]);
        return;
    }

    hanoi(n - 1, origen, destino, auxiliar, movimientos);

    movimientos.push([origen, destino]);

    hanoi(n - 1, auxiliar, origen, destino, movimientos);
}

function detenerHanoi() {
    if (temporizadorHanoi !== null) {
        clearInterval(temporizadorHanoi);
        temporizadorHanoi = null;
    }
}

function mostrarHanoi() {
    detenerHanoi();

    const contenedor = prepararResultado("resultado-hanoi");

    try {
        const cantidad = leerEntero("discos", 3, 5);
        const movimientos = [];

        hanoi(cantidad, 0, 1, 2, movimientos);

        const torres = [[], [], []];

        // El disco mayor está al inicio del arreglo.
        for (let disco = cantidad; disco >= 1; disco--) {
            torres[0].push(disco);
        }

        const estado = crearElemento("p", undefined, contenedor);

        const svg = crearSVG(
            contenedor,
            480,
            250,
            "Tres torres con discos que se trasladan de A a C"
        );

        const controles = crearElemento("div", undefined, contenedor);

        controles.style.display = "flex";
        controles.style.flexWrap = "wrap";
        controles.style.gap = "8px";
        controles.style.marginTop = "15px";

        const pausa = crearElemento("button", "Pausar", controles);
        const siguiente = crearElemento("button", "Siguiente paso", controles);
        const reiniciar = crearElemento("button", "Reiniciar", controles);

        pausa.type = "button";
        siguiente.type = "button";
        reiniciar.type = "button";

        let paso = 0;
        let reproduciendo = false;

        function actualizar(mensaje) {
            dibujarTorres(svg, torres);

            estado.textContent =
                `Movimiento ${paso} de ${movimientos.length}. ${mensaje}`;
        }

        function avanzar() {
            if (paso >= movimientos.length) {
                finalizar();
                return;
            }

            const [origen, destino] = movimientos[paso];
            const disco = torres[origen].pop();

            torres[destino].push(disco);
            paso++;

            const nombres = ["A", "B", "C"];

            actualizar(
                `Disco ${disco}: ${nombres[origen]} → ${nombres[destino]}.`
            );

            if (paso === movimientos.length) {
                finalizar();
            }
        }

        function finalizar() {
            detenerHanoi();
            reproduciendo = false;
            pausa.textContent = "Completado";
            pausa.disabled = true;
            siguiente.disabled = true;

            estado.textContent =
                `¡Completado! ${movimientos.length} movimientos. Todos los discos están en C.`;
        }

        function reproducir() {
            detenerHanoi();
            reproduciendo = true;
            pausa.textContent = "Pausar";

            temporizadorHanoi = setInterval(avanzar, 800);
        }

        pausa.addEventListener("click", function () {
            if (reproduciendo) {
                detenerHanoi();
                reproduciendo = false;
                pausa.textContent = "Continuar";
            } else {
                reproducir();
            }
        });

        siguiente.addEventListener("click", function () {
            detenerHanoi();
            reproduciendo = false;
            pausa.textContent = "Continuar";
            avanzar();
        });

        reiniciar.addEventListener("click", mostrarHanoi);

        actualizar("Inicio: los discos están en A.");
        reproducir();
    } catch (error) {
        crearElemento("p", error.message, contenedor);
    }
}

function dibujarTorres(svg, torres) {
    svg.replaceChildren();

    const posiciones = [80, 240, 400];
    const nombres = ["A", "B", "C"];

    const colores = [
        "#f3a8c8",
        "#d6b2ef",
        "#9ec9e8",
        "#a8d5ba",
        "#efcb88"
    ];

    posiciones.forEach(function (x, indice) {
        // Poste.
        figuraSVG(svg, "rect", {
            x: x - 4,
            y: 45,
            width: 8,
            height: 160,
            rx: 4,
            fill: "#786377"
        });

        // Base.
        figuraSVG(svg, "rect", {
            x: x - 68,
            y: 205,
            width: 136,
            height: 8,
            rx: 4,
            fill: "#786377"
        });

        figuraSVG(svg, "text", {
            x: x,
            y: 238,
            "text-anchor": "middle",
            fill: "#342c35",
            "font-size": 18
        }, nombres[indice]);

        torres[indice].forEach(function (disco, nivel) {
            const ancho = 28 + disco * 19;
            const y = 181 - nivel * 25;

            figuraSVG(svg, "rect", {
                x: x - ancho / 2,
                y: y,
                width: ancho,
                height: 22,
                rx: 7,
                fill: colores[disco - 1],
                stroke: "#71576b"
            });

            figuraSVG(svg, "text", {
                x: x,
                y: y + 16,
                "text-anchor": "middle",
                fill: "#342c35",
                "font-size": 14
            }, String(disco));
        });
    });
}

// ==================================================
// 4. FRACTAL: TRIÁNGULO DE SIERPINSKI
// ==================================================

function puntoMedio(a, b) {
    return [
        (a[0] + b[0]) / 2,
        (a[1] + b[1]) / 2
    ];
}

function dibujarTriangulo(svg, a, b, c) {
    figuraSVG(svg, "polygon", {
        points:
            `${a[0]},${a[1]} ${b[0]},${b[1]} ${c[0]},${c[1]}`,
        fill: "var(--principal, #9b3569)"
    });
}

function sierpinski(svg, a, b, c, profundidad) {
    if (profundidad === 0) {
        dibujarTriangulo(svg, a, b, c);
        return;
    }

    const ab = puntoMedio(a, b);
    const ac = puntoMedio(a, c);
    const bc = puntoMedio(b, c);

    sierpinski(svg, a, ab, ac, profundidad - 1);
    sierpinski(svg, ab, b, bc, profundidad - 1);
    sierpinski(svg, ac, bc, c, profundidad - 1);
}

function mostrarFractal() {
    const contenedor = prepararResultado("resultado-fractal");

    try {
        const profundidad = leerEntero("profundidad", 0, 6);

        document.getElementById("valor-profundidad").value =
            profundidad;

        crearElemento(
            "h3",
            `Profundidad ${profundidad}`,
            contenedor
        );

        const svg = crearSVG(
            contenedor,
            500,
            440,
            `Triángulo de Sierpinski de profundidad ${profundidad}`
        );

        const a = [250, 15];
        const b = [15, 422];
        const c = [485, 422];

        sierpinski(svg, a, b, c, profundidad);

        crearElemento(
            "p",
            `Triángulos finales: ${3 ** profundidad}.`,
            contenedor
        );

        crearElemento(
            "p",
            profundidad === 0
                ? "Caso base: se dibuja un solo triángulo."
                : "Cada llamada genera tres triángulos menores y reduce la profundidad en uno.",
            contenedor
        );
    } catch (error) {
        crearElemento("p", error.message, contenedor);
    }
}

// ==================================================
// CONECTAR LOS BOTONES DEL HTML
// ==================================================

const acciones = {
    "resultado-factorial": mostrarFactorial,
    "resultado-fibonacci": mostrarFibonacci,
    "resultado-hanoi": mostrarHanoi,
    "resultado-fractal": mostrarFractal
};

document.querySelectorAll("[data-demo]").forEach(function (boton) {
    const accion = acciones[boton.dataset.demo];

    if (accion) {
        boton.addEventListener("click", accion);
    }
});

// Al cambiar el deslizador, el fractal se actualiza.
document.getElementById("profundidad").addEventListener(
    "input",
    mostrarFractal
);

// Al cambiar los discos, se cancela la animación anterior.
document.getElementById("discos").addEventListener(
    "change",
    function () {
        detenerHanoi();

        const contenedor = prepararResultado("resultado-hanoi");

        crearElemento(
            "p",
            "Pulsa Iniciar demostración para usar la nueva cantidad de discos.",
            contenedor
        );
    }
);

// Detiene el temporizador al salir de la página.
window.addEventListener("pagehide", detenerHanoi);

// Muestra el fractal al abrir la página.
mostrarFractal();