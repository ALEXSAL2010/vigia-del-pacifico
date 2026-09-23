/*
 * CONTENIDO DEL CURSO — "Vigía del Pacífico"
 * ------------------------------------------------------------
 * Este es el único archivo que hay que editar para cambiar textos,
 * preguntas o retos. La estructura de cada nivel es siempre:
 *   concepto (lección) → evaluación (quiz) → reto
 * «nodo» puede ser un texto o una lista de líneas (para títulos largos en el mapa).
 * Para crear otro curso con la misma plataforma, copia este archivo
 * y reemplaza su contenido manteniendo las mismas claves.
 */

const CURSO = {
  titulo: "Vigía del Pacífico",
  subtitulo: "De El Niño a la alerta temprana en salud",
  rol: "Vigía de salud pública de Puerto Brisa",
  descripcion:
    "Eres el nuevo vigía de salud pública de Puerto Brisa, una ciudad ficticia del Caribe colombiano. Tu trabajo es leer las señales del clima y avisar a tiempo. Los datos, umbrales y hallazgos que usarás son reales.",
  meta:
    "Al terminar podrás explicar cómo una señal del océano Pacífico (el ONI) se relaciona con el calor y el dengue en el Caribe colombiano, y por qué sirve para una alerta temprana.",
  reglas: {
    xpLeccion: 10,
    xpPregunta: 10,
    xpPreguntaSegundoIntento: 5,
    xpItemReto: 10,
    xpParaSubir: 70,
    xpInsigniaOro: 450,
  },
  personaje: "Dra. Rivas, jefa de salud pública de Puerto Brisa",

  // Datos reales 2023, región Caribe colombiana.
  // Fuente: Salazar-Ceballos y Álvarez-Miño, Biomédica 2025, Cuadro 1.
  datos2023: {
    meses: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    oni: [-0.7, -0.4, -0.1, 0.2, 0.5, 0.8, 1.1, 1.3, 1.6, 1.8, 1.9, 2.0],
    dengue: [20.8, 19.1, 15.4, 12.3, 15.4, 19.0, 22.5, 23.0, 22.1, 22.7, 25.2, 29.5],
    fuente: "Salazar-Ceballos A, Álvarez-Miño L. Biomédica. 2025;45(Supl.2):56-67. Cuadro 1.",
  },

  fuentes: [
    {
      texto:
        "Salazar-Ceballos A, Álvarez-Miño L. Incidencia de dengue y su relación con el índice oceánico de El Niño, como variable sensible para anticipar brotes en la región Caribe colombiana. Biomédica. 2025;45(Supl.2):56-67.",
      url: "https://doi.org/10.7705/biomedica.7933",
    },
    {
      texto: "Climate Prediction Center, NOAA. Oceanic Niño Index (ONI): serie histórica y definición.",
      url: "https://origin.cpc.ncep.noaa.gov/products/analysis_monitoring/ensostuff/ONI_v5.php",
    },
  ],

  niveles: [
    // ---------------------------------------------------------------- 1
    {
      id: 1,
      nodo: "El Niño / ENSO",
      nodoDetalle: ["fase cálida del ciclo", "océano–atmósfera"],
      titulo: "El Niño / ENSO",
      rango: "Observador del Pacífico",
      pregunta: "¿Qué es El Niño y qué fases tiene?",
      mensaje:
        "Bienvenido al equipo. Antes de mirar datos, necesito que entiendas de qué hablan todos cuando dicen «viene El Niño».",
      concepto: {
        intro: "Lo que vas a entender: qué es el ciclo ENSO, sus tres fases y cada cuánto se repite.",
        claves: [
          { t: "Un ciclo natural", d: "ENSO (El Niño–Oscilación del Sur) es un ciclo natural que acopla el océano y la atmósfera en el Pacífico tropical." },
          { t: "Tres fases", d: "El Niño (fase cálida), La Niña (fase fría) y neutral." },
          { t: "Irregular", d: "El ciclo se repite cada 2 a 7 años, sin un calendario fijo." },
          { t: "Efecto en Colombia", d: "El Niño calienta el Pacífico y eso se traduce en un aumento general de la temperatura en el país." },
        ],
      },
      quiz: [
        { q: "¿Qué es ENSO?", op: ["Una enfermedad transmitida por mosquitos", "Un ciclo natural de interacción océano–atmósfera en el Pacífico tropical", "Un tipo de huracán del Caribe", "Una medición de lluvias en Colombia"], ok: 1, exp: "ENSO es un ciclo natural del sistema océano–atmósfera en el Pacífico tropical." },
        { q: "¿Cuáles son las fases de ENSO?", op: ["Verano, invierno y transición", "Solo cálida y fría", "El Niño, La Niña y neutral", "Seca, húmeda y neutral"], ok: 2, exp: "Las tres fases son El Niño, La Niña y neutral." },
        { q: "El Niño es la fase…", op: ["cálida", "fría", "neutral"], ok: 0, exp: "El Niño es la fase cálida; La Niña es la fría." },
        { q: "¿Cada cuánto se repite el ciclo?", op: ["Cada año", "Cada 2 a 7 años", "Cada 20 años", "Cada mes"], ok: 1, exp: "Se repite de forma irregular, cada 2 a 7 años." },
      ],
      reto: {
        enunciado:
          "Un vecino te pregunta: «¿Qué es eso de El Niño que sale en las noticias?». Escribe una respuesta de 3 a 5 frases, sin tecnicismos. Luego revisa tu texto con la lista y marca lo que cumpliste.",
        texto: true,
        items: [
          { tipo: "auto-eval", t: "Dice que ocurre en el océano Pacífico." },
          { tipo: "auto-eval", t: "Dice que es un fenómeno natural que se repite (un ciclo)." },
          { tipo: "auto-eval", t: "Menciona que tiene fases (cálida y fría)." },
          { tipo: "auto-eval", t: "Explica que puede subir la temperatura en Colombia." },
          { tipo: "auto-eval", t: "Se entiende sin conocimientos técnicos." },
        ],
      },
    },

    // ---------------------------------------------------------------- 2
    {
      id: 2,
      nodo: "ONI",
      nodoDetalle: ["región Niño 3.4", "umbral ≥ +0,5 °C", "5 trimestres seguidos"],
      titulo: "El índice ONI",
      rango: "Lector del ONI",
      pregunta: "¿Cómo se mide El Niño y cuándo se declara?",
      mensaje:
        "Ya sabes qué es El Niño. Ahora necesito que sepas leer el número con el que se declara oficialmente.",
      concepto: {
        intro: "Lo que vas a entender: qué mide el ONI, dónde, y qué umbral y duración definen una fase.",
        claves: [
          { t: "Qué mide", d: "El ONI (índice oceánico de El Niño) mide cuánto se aparta la temperatura del mar de lo normal en la región Niño 3.4 del Pacífico. Es un promedio móvil de 3 meses." },
          { t: "Umbrales", d: "ONI ≥ +0,5 °C: condiciones de El Niño. ONI ≤ −0,5 °C: La Niña. Entre ambos valores: neutral." },
          { t: "Persistencia", d: "Para declarar un episodio, el valor debe sostenerse al menos 5 trimestres seguidos. Un solo mes cálido no basta." },
          { t: "Quién lo publica", d: "El Climate Prediction Center de la NOAA; en Colombia lo comunica el IDEAM." },
        ],
      },
      quiz: [
        { q: "¿Qué mide el ONI?", op: ["La lluvia acumulada en Colombia", "La anomalía de temperatura del mar en la región Niño 3.4", "La temperatura del aire en Santa Marta", "El nivel del mar Caribe"], ok: 1, exp: "Mide cuánto se aparta la temperatura del mar de lo normal en la región Niño 3.4." },
        { q: "¿Qué valor del ONI indica condiciones de El Niño?", op: ["≥ +0,5 °C", "≥ +2,0 °C", "≤ −0,5 °C", "Exactamente 0 °C"], ok: 0, exp: "+0,5 °C o más indica condiciones de El Niño." },
        { q: "El ONI marca +0,6 °C un solo mes. ¿Ya es un episodio de El Niño?", op: ["Sí, porque supera +0,5 °C", "No, el valor debe sostenerse al menos 5 trimestres seguidos", "Sí, si además hace calor en la ciudad"], ok: 1, exp: "Hace falta persistencia: al menos 5 trimestres seguidos." },
        { q: "Un ONI de −0,8 °C indica…", op: ["El Niño", "La Niña", "Fase neutral"], ok: 1, exp: "−0,5 °C o menos corresponde a La Niña." },
      ],
      reto: {
        enunciado:
          "Estos son los valores reales del ONI durante 2023, los mismos que se usaron en el estudio sobre dengue en el Caribe colombiano. Observa la línea y responde.",
        grafico: "oni",
        texto: false,
        items: [
          { tipo: "auto", t: "(a) ¿Qué fase había en enero de 2023?", op: ["El Niño", "La Niña", "Neutral"], ok: 1, exp: "En enero el ONI era −0,7 °C: La Niña." },
          { tipo: "auto", t: "(b) ¿En qué mes el ONI llega a +0,5 °C?", op: ["Abril", "Mayo", "Junio"], ok: 1, exp: "Mayo: +0,5 °C." },
          { tipo: "auto", t: "(c) ¿Desde qué mes se cumplen 5 valores seguidos en +0,5 °C o más?", op: ["Mayo", "Julio", "Septiembre", "Diciembre"], ok: 2, exp: "Mayo, junio, julio, agosto y septiembre: 5 valores seguidos." },
          { tipo: "auto-eval", t: "Puedo explicar por qué no se podía declarar El Niño en mayo." },
          { tipo: "auto-eval", t: "Identifico la tendencia del año: el ONI sube hasta +2,0 °C en diciembre." },
        ],
      },
    },

    // ---------------------------------------------------------------- 3
    {
      id: 3,
      nodo: "Temperaturas ↑",
      nodoDetalle: ["olas de calor", "efecto casi inmediato"],
      titulo: "Temperaturas y calor",
      rango: "Vigía del calor",
      pregunta: "¿Qué le hace El Niño a la temperatura y a quién afecta?",
      mensaje:
        "El ONI está subiendo. La primera pregunta que me hará el alcalde es si va a hacer más calor y a quién le debe preocupar.",
      concepto: {
        intro: "Lo que vas a entender: por qué El Niño se asocia con más calor, que ese efecto es rápido y quiénes son más vulnerables.",
        claves: [
          { t: "Efecto rápido", d: "Durante El Niño aumenta la temperatura en el territorio colombiano. El efecto es casi simultáneo: aparece en el mismo periodo, no meses después." },
          { t: "No actúa solo", d: "Otros patrones del clima, como los de los océanos Índico y Atlántico, pueden reforzar o suavizar el calor." },
          { t: "Quiénes sufren más", d: "El calor extremo afecta más a lactantes y a personas mayores. El Lancet Countdown 2023 para Latinoamérica reportó que entre 2013 y 2022 estos grupos estuvieron expuestos a muchos más días de ola de calor que en periodos anteriores." },
        ],
      },
      quiz: [
        { q: "¿El efecto de El Niño sobre la temperatura es…?", op: ["casi inmediato", "de un año después", "inexistente"], ok: 0, exp: "Es casi concurrente: aparece en el mismo periodo." },
        { q: "¿El Niño es el único factor que define una ola de calor?", op: ["Sí", "No, otros patrones climáticos también influyen"], ok: 1, exp: "Otros patrones del clima pueden reforzar o suavizar el calor." },
        { q: "¿Qué grupos son especialmente vulnerables al calor?", op: ["Adultos jóvenes y deportistas", "Lactantes y personas mayores de 65 años", "Adolescentes"], ok: 1, exp: "Lactantes y personas mayores regulan peor su temperatura." },
        { q: "Si el ONI sube en junio, ¿cuándo esperas más calor?", op: ["Junio–julio", "Diciembre", "El año siguiente"], ok: 0, exp: "En el mismo periodo, porque el efecto es casi inmediato." },
      ],
      reto: {
        enunciado:
          "Ordena estos tres eventos en una línea de tiempo: «aumento de casos de dengue», «el ONI supera +0,5 °C» y «días más calurosos en la ciudad». Luego escribe 2 frases sobre por qué los primeros en llegar a urgencias podrían ser niños pequeños y adultos mayores.",
        texto: true,
        items: [
          { tipo: "auto", t: "¿Qué ocurre primero?", op: ["Aumento de casos de dengue", "El ONI supera +0,5 °C", "Días más calurosos"], ok: 1, exp: "Primero se observa la señal: el ONI supera +0,5 °C." },
          { tipo: "auto", t: "¿Qué ocurre en segundo lugar?", op: ["Aumento de casos de dengue", "El ONI supera +0,5 °C", "Días más calurosos"], ok: 2, exp: "El calor llega casi al mismo tiempo que la señal." },
          { tipo: "auto", t: "¿Qué ocurre al final?", op: ["Aumento de casos de dengue", "El ONI supera +0,5 °C", "Días más calurosos"], ok: 0, exp: "El dengue sube meses después." },
          { tipo: "auto-eval", t: "Nombré a lactantes y adultos mayores como grupos vulnerables." },
          { tipo: "auto-eval", t: "Expliqué que su cuerpo regula peor la temperatura." },
        ],
      },
    },

    // ---------------------------------------------------------------- 4
    {
      id: 4,
      nodo: "Dengue ↑",
      nodoDetalle: ["vía Aedes aegypti", "desfase: 2–4 m El Niño", "5–6 m La Niña"],
      titulo: "Dengue y desfase",
      rango: "Rastreador del dengue",
      pregunta: "¿Por qué el dengue sube meses después?",
      mensaje:
        "El calor ya llegó. Ahora me preocupa lo que no se ve todavía: el dengue. Necesito saber cuándo esperarlo.",
      concepto: {
        intro: "Lo que vas a entender: por qué el clima favorece el dengue, qué es el desfase temporal y qué puede (y no puede) afirmar una correlación.",
        claves: [
          { t: "El vector", d: "El dengue lo transmite el mosquito Aedes aegypti. Con más temperatura, el virus se replica más rápido dentro del mosquito y la picadura es más frecuente." },
          { t: "El desfase", d: "En el Caribe colombiano, el aumento de dengue llegó 2 a 4 meses después de valores positivos del ONI (El Niño) y 5 a 6 meses después de valores negativos (La Niña)." },
          { t: "La evidencia de 2023", d: "En 2023, año de El Niño, la relación ONI–dengue fue positiva en Bolívar, Cesar, Córdoba y Magdalena. En Magdalena fue muy fuerte (ρ = 0,874)." },
          { t: "No todos igual", d: "En La Guajira y Sucre la correlación fue negativa. Las condiciones locales (agua, vivienda, saneamiento, servicios de salud) también cuentan." },
          { t: "Asociación no es causa", d: "Una correlación muestra que dos cosas se mueven juntas, no que una cause la otra. El ONI es una señal de riesgo, no la explicación completa." },
        ],
      },
      quiz: [
        { q: "¿Qué mosquito transmite el dengue?", op: ["Anopheles", "Aedes aegypti", "Culex"], ok: 1, exp: "El vector principal es Aedes aegypti." },
        { q: "Durante El Niño, ¿cuántos meses después suele subir el dengue en el Caribe colombiano?", op: ["De inmediato", "Entre 2 y 4 meses", "Entre 5 y 6 meses", "Un año después"], ok: 1, exp: "Con El Niño el desfase fue de 2 a 4 meses." },
        { q: "¿Y durante La Niña?", op: ["Entre 2 y 4 meses", "Entre 5 y 6 meses", "De inmediato"], ok: 1, exp: "Con La Niña el efecto fue más tardío: 5 a 6 meses." },
        { q: "En Magdalena, ρ = 0,874 en 2023. ¿Qué significa?", op: ["Que El Niño causó los casos de dengue", "Una asociación positiva fuerte, no una relación de causa", "Que no hay relación"], ok: 1, exp: "La correlación indica asociación, no causalidad." },
      ],
      reto: {
        enunciado:
          "Ahora mira el ONI y la tasa de dengue de 2023 juntos. Responde y luego escribe en 2 o 3 frases por qué La Guajira y Sucre no siguieron el patrón regional.",
        grafico: "ambos",
        texto: true,
        items: [
          { tipo: "auto", t: "(a) Si el ONI llegó a +0,5 °C en mayo, ¿qué meses deberías vigilar con más atención el dengue?", op: ["Mayo y junio", "Julio a septiembre", "Noviembre a enero"], ok: 1, exp: "Con un desfase de 2 a 4 meses: julio a septiembre." },
          { tipo: "auto", t: "(b) ¿Qué pasó con la tasa de dengue en el segundo semestre?", op: ["Bajó", "Se mantuvo igual", "Subió"], ok: 2, exp: "Subió: de 19,0 en junio a 29,5 en diciembre por 100 000 habitantes." },
          { tipo: "auto-eval", t: "En mi texto menciono factores locales o determinantes sociales, no solo el clima." },
          { tipo: "auto-eval", t: "Uso la palabra «asociación» o «relación», no «causa»." },
          { tipo: "auto-eval", t: "Distingo el desfase de El Niño (2–4 meses) del de La Niña (5–6 meses)." },
        ],
      },
    },

    // ---------------------------------------------------------------- 5
    {
      id: 5,
      nodo: ["Alerta", "temprana"],
      nodoDetalle: ["PDSP · Eje 5"],
      titulo: "Alerta temprana",
      rango: "Centinela de alerta temprana",
      pregunta: "¿Cómo convierto la señal en una acción anticipada?",
      mensaje:
        "Ya entiendes la señal y sus dos efectos. Ahora quiero que me propongas qué hacer y cuándo, antes de que se llenen los hospitales.",
      concepto: {
        intro: "Lo que vas a entender: qué es un sistema de alerta temprana y por qué el ONI da tiempo para actuar.",
        claves: [
          { t: "Tres pasos", d: "Un sistema de alerta temprana conecta una señal (el ONI), un umbral que dispara la alerta y una acción anticipada." },
          { t: "La ventaja es el tiempo", d: "El ONI permite prepararse para el calor casi de inmediato y para el dengue con meses de anticipación." },
          { t: "Mandato nacional", d: "El Plan Decenal de Salud Pública 2022–2031 (eje 5: cambio climático, emergencias, desastres y pandemias) espera que en 2031 los departamentos y distritos tengan sistemas de alerta temprana para riesgos en salud por clima." },
          { t: "Señal + vigilancia", d: "La señal climática se confirma con la vigilancia de casos (SIVIGILA). Una no reemplaza a la otra." },
        ],
      },
      quiz: [
        { q: "¿Cuáles son los tres pasos de un sistema de alerta temprana?", op: ["Caso, diagnóstico y tratamiento", "Señal, umbral y acción anticipada", "Reporte, sanción y cierre"], ok: 1, exp: "Señal → umbral → acción anticipada." },
        { q: "¿Qué ventaja da el ONI frente a esperar los casos?", op: ["Elimina el dengue", "Tiempo para prepararse", "Reemplaza la vigilancia epidemiológica"], ok: 1, exp: "Da tiempo: meses en el caso del dengue." },
        { q: "¿Dónde aparece la meta de tener sistemas de alerta temprana al 2031?", op: ["En el Plan Decenal de Salud Pública 2022–2031, eje 5", "No aparece en ningún plan nacional", "Solo en los planes de tránsito municipales"], ok: 0, exp: "Eje 5: cambio climático, emergencias, desastres y pandemias." },
        { q: "¿Con qué fuente de datos de salud se confirma la alerta?", op: ["Redes sociales", "Vigilancia de casos (SIVIGILA)", "Pronóstico del tiempo"], ok: 1, exp: "La señal climática se confirma con SIVIGILA." },
      ],
      reto: {
        enunciado:
          "Reto final. Estamos a finales de junio. El boletín muestra el ONI en +0,2 °C (abril), +0,5 °C (mayo) y +0,8 °C (junio). Escribe una ficha de alerta para la Dra. Rivas con cinco partes: (1) en qué fase estamos y qué tan seguros estamos; (2) qué hacer ya frente al calor; (3) qué preparar para el dengue y para qué meses; (4) a quién priorizar; (5) qué dato de vigilancia confirmará que la alerta era correcta.",
        texto: true,
        items: [
          { tipo: "auto-eval", t: "Digo que El Niño está en desarrollo pero aún no confirmado (falta persistencia)." },
          { tipo: "auto-eval", t: "Propongo acciones inmediatas frente al calor (hidratación, avisos, atención a grupos vulnerables)." },
          { tipo: "auto-eval", t: "Ubico la preparación para el dengue entre agosto y octubre." },
          { tipo: "auto-eval", t: "Priorizo a niños pequeños, adultos mayores y barrios con menos acceso a servicios." },
          { tipo: "auto-eval", t: "Nombro un indicador de SIVIGILA para confirmar (por ejemplo, casos semanales de dengue)." },
        ],
      },
    },
  ],
};
