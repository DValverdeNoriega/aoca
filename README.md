<!--
  Este README es un ANDAMIO. Complétenlo ustedes (las alumnas).
  Las secciones marcadas con «✍️ ...» son para que las llenen.
-->

# AOCA

**Un tutor con IA que guía, no resuelve.**

AOCA no da la respuesta final. Hace preguntas, da una pista a la vez, corrige
señalando el paso exacto que falló y verifica que de verdad entendiste. La
respuesta la construyes tú.

Proyecto de cuatro alumnas de 8.º grado — Innova Schools, Sede Surco Ambrosio.

> ✍️ **Nuestros nombres:** _______, _______, _______, _______

---

## Qué hace

- **Modo Demo** — 8 conversaciones pregrabadas (Matemáticas e Historia del Perú).
  Funciona **sin internet**: es la red de seguridad para el día de la exposición.
- **IA en vivo** — cada mensaje va a Claude a través de una función serverless.
- **Accesibilidad** — responder hablando, lectura en voz alta (con las matemáticas
  leídas en palabras), modo lectura fácil, reducir movimiento, y todo navegable
  con teclado.

> ✍️ **Nuestra tesis, en nuestras palabras:** ______________________________

---

## Cómo está hecho

HTML + CSS + JavaScript puro. **Sin frameworks y sin paso de compilación.** Se sube
a GitHub y Vercel lo publica tal cual.

```
index.html        página pública (landing)
login.html        ingreso simulado (solo el nombre, en sessionStorage)
app.html          la plataforma (chat, una sola página, dos estados)
css/aoca.css       colores, tipografía y componentes
js/app.js          la interfaz, el chat, el interruptor de modo, la accesibilidad
js/guiones.js      las 8 conversaciones del Modo Demo
api/chat.js        función serverless: habla con Claude (la API key vive aquí)
assets/            el logo y la marca (no se toca)
references/        maquetas de consulta (no se publican)
```

---

## Probarlo en tu compu

Para ver el **Modo Demo** (no necesita internet ni clave), basta con abrir
`index.html` en el navegador.

Para probar también **IA en vivo**, necesitas correr la función serverless:

```bash
npm install -g vercel     # una sola vez
vercel dev                # levanta el proyecto en http://localhost:3000
```

Antes de eso, pon tu clave de Anthropic en `.env.local` (ese archivo NO se sube):

```
ANTHROPIC_API_KEY=tu-clave-real
```

> ⚠️ **Nunca** pongas la clave como variable de entorno del sistema en Windows, ni
> la escribas dentro de ningún archivo del frontend. Solo en `.env.local` y en el
> panel de Vercel.

---

## Publicarlo (Vercel)

1. Sube el proyecto a GitHub (sin `.env.local` — ya está ignorado).
2. En Vercel: **New Project** → importa el repositorio.
3. En **Settings → Environment Variables** agrega `ANTHROPIC_API_KEY` con tu clave.
4. Deploy. Listo.

> ✍️ **Enlace de nuestra plataforma publicada:** ______________________________

---

## Reglas que respetamos (por qué es así)

- La barra de progreso **solo** avanza cuando el alumno llega **solo** a la respuesta
  correcta. No avanza por preguntar ni por pedir pistas.
- Las pistas se **acaban**: 3 por conversación. No puedes pedir ayuda antes de
  intentar.
- **Sin cronómetros, sin rachas, sin sonidos de premio.** Su ausencia es a propósito:
  la presión no ayuda a pensar.

> ✍️ **Lo que aprendimos haciendo este proyecto:** ______________________________

---

## Créditos

- Marca del colegio: Innova Schools – Sede Surco Ambrosio.
- Hecho con [Claude](https://claude.com) para las conversaciones en vivo.
