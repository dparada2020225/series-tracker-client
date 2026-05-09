# Series Tracker — Frontend

Cliente web para Series Tracker. Construido con HTML, CSS y JavaScript vanilla. Consume la API REST del backend con fetch().

## Stack
- HTML5
- CSS3
- JavaScript vanilla (sin frameworks, sin librerías)

## Correr en local

1. Clona el repositorio
2. Asegúrate de que el backend esté corriendo en http://localhost:3000
3. Abre index.html directo en el navegador

No requiere servidor ni instalación.

## Estructura

frontend/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── api.js     # Capa de comunicación con la API
    ├── ui.js      # Funciones de renderizado del DOM
    └── app.js     # Lógica principal y eventos

## CORS

CORS es una política de seguridad del navegador que bloquea peticiones entre orígenes distintos. El backend tiene configurado el header Access-Control-Allow-Origin: * para permitir las peticiones desde el cliente.

## Repositorio Backend

https://github.com/dparada2020225/series-tracker-api

## App publicada

https://dparada2020225.github.io/series-tracker-client/

## Challenges implementados

- Diseño visual profesional estilo Netflix
- Códigos HTTP correctos (201, 204, 404, 400)
- Validación server-side con respuestas JSON descriptivas
- Búsqueda por nombre con ?q=
- Ordenamiento con ?sort= y ?order=
- Paginación con ?page= y ?limit=
- Exportar lista de series a CSV generado manualmente desde JavaScript
- Swagger UI corriendo desde el backend
- Sistema de rating con tabla propia, endpoints REST y visible en el cliente

## Reflexión

Trabajar con JavaScript vanilla obliga a entender cómo funciona el DOM y fetch() sin abstracciones. Al principio se extraña un framework, pero el resultado es código más liviano y sin dependencias. La separación entre cliente y servidor hace el código más mantenible y reutilizable. Lo volvería a usar para proyectos pequeños donde no se justifica la complejidad de React.