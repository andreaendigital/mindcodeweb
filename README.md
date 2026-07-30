# Mind & Code — Landing Page

Landing page de alta conversión para **Mind & Code**, firma especializada en Headhunting IT, Selección de Personal y Generación de Reportes de Capital Humano para empresas.

## Stack Tecnológico

- HTML5 semántico
- Tailwind CSS vía CDN
- JavaScript vanilla
- Google Fonts (Inter + Plus Jakarta Sans)

## Despliegue en GitHub Pages

### 1. Crear el repositorio en GitHub

1. Inicia sesión en [GitHub](https://github.com).
2. Haz clic en el botón **"New"** (o ve a https://github.com/new).
3. Asigna un nombre al repositorio (por ejemplo, `mindandcodeweb`).
4. Selecciona **Public** para que GitHub Pages funcione en cuentas gratuitas.
5. Haz clic en **"Create repository"**.

### 2. Subir los archivos al repositorio

```bash
git init
git add .
git commit -m "Initial commit - Mind & Code landing page"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/mindandcodeweb.git
git push -u origin main
```

> Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub y `mindandcodeweb` con el nombre de tu repositorio.

### 3. Activar GitHub Pages

1. Ve a tu repositorio en GitHub.
2. Haz clic en **Settings** (Configuración).
3. En el menú lateral, selecciona **Pages**.
4. En la sección **Source**, selecciona **Deploy from a branch**.
5. Elige la rama **main** y la carpeta **/ (root)**.
6. Haz clic en **Save**.

### 4. Verificar que el sitio está publicado

Espera unos minutos y visita:

```
https://TU_USUARIO.github.io/mindandcodeweb/
```

> Reemplaza `TU_USUARIO` y `mindandcodeweb` con tus datos. Si el sitio no carga inmediatamente, espera 2-3 minutos y recarga la página.

## Estructura del Proyecto

```
├── index.html    # Página principal
├── styles.css    # Estilos personalizados
├── script.js     # Interactividad (navegación, animaciones, formulario)
└── README.md     # Este archivo
```

## Licencia

© 2025 Mind & Code. Todos los derechos reservados.
