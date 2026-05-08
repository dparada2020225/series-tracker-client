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

## Funcionalidades

- Ver todas las series en formato de cards
- Filtrar por estado (Viendo, Completada, Pendiente)
- Stats en tiempo real (total, viendo, completadas, pendientes)
- Crear, editar y eliminar series
- Soporte para imagen de portada via URL

## CORS

CORS es una política de seguridad del navegador que bloquea peticiones entre orígenes distintos. El backend tiene configurado el header Access-Control-Allow-Origin: * para permitir las peticiones desde el cliente.

## Repositorio Backend

https://github.com/tu-usuario/series-tracker-backend

## App publicada

https://tu-usuario.github.io/series-tracker-frontend

## Challenges implementados

- Diseño visual profesional estilo Netflix
- Filtros por estado
- Stats en tiempo real

## Reflexión

Trabajar con JavaScript vanilla obliga a entender cómo funciona el DOM y fetch() sin abstracciones. Al principio se extraña un framework, pero el resultado es código más liviano y sin dependencias. Lo volvería a usar para proyectos pequeños donde no se justifica la complejidad de React.