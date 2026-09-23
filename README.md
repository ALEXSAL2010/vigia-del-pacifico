# Vigía del Pacífico · Curso básico en línea

Curso de autoaprendizaje para estudiantes y profesionales de salud: **de El Niño y el índice ONI al calor, el dengue y la alerta temprana en salud pública**.

- Un estudiante, un rol genérico: *vigía de salud pública* de Puerto Brisa (ciudad ficticia del Caribe colombiano).
- 5 niveles que siguen el diagrama El Niño → ONI → Temperaturas → Dengue → Alerta temprana.
- Cada nivel: **concepto** (10 XP) → **evaluación** (40 XP) → **reto** (50 XP). Con 70 XP se sube de nivel.
- 500 XP en total; certificado imprimible al terminar e insignia «Centinela de oro» con 450 XP o más.
- Sin servidor ni base de datos: el progreso se guarda en el navegador del estudiante.

## Estructura

```
index.html         página única
css/styles.css     estilos (modo claro y oscuro, adaptado a celular)
js/contenido.js    TODO el contenido del curso: textos, preguntas, retos y datos
js/app.js          la plataforma: niveles, XP, progreso y certificado
.nojekyll          evita que GitHub Pages procese los archivos
```

Para cambiar textos o preguntas, edita solo `js/contenido.js`. Para crear otro curso con la misma plataforma, copia la carpeta y reemplaza ese archivo manteniendo las mismas claves.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub (por ejemplo `vigia-del-pacifico`) y sube estos archivos a la rama `main`, en la raíz.
2. En el repositorio: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, rama `main`, carpeta `/ (root)`. Guarda.
3. En uno o dos minutos el curso queda en `https://<tu-usuario>.github.io/vigia-del-pacifico/`.

Desde la terminal, con Git instalado:

```bash
cd curso-web-vigia-del-pacifico
git init -b main
git add .
git commit -m "Curso básico Vigía del Pacífico"
git remote add origin https://github.com/<tu-usuario>/vigia-del-pacifico.git
git push -u origin main
```

## Probar en tu computador

Abre `index.html` con doble clic, o sirve la carpeta con `python3 -m http.server` y entra a `http://localhost:8000`.

## Fuentes

- Salazar-Ceballos A, Álvarez-Miño L. Incidencia de dengue y su relación con el índice oceánico de El Niño, como variable sensible para anticipar brotes en la región Caribe colombiana. *Biomédica*. 2025;45(Supl.2):56-67. https://doi.org/10.7705/biomedica.7933
- Climate Prediction Center, NOAA. Oceanic Niño Index (ONI).

## Pendiente de validar

- Fuente citable para el efecto casi inmediato de El Niño sobre la temperatura en el Caribe colombiano (Nivel 3).
