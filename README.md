# Mobile View

[Available on Open VSX](https://open-vsx.org/extension/MarkSerna/mobile-view)

**Mobile View** is a Visual Studio Code extension that opens a Chromium-based mobile device simulator within a VS Code webview panel. It lets you preview and test responsive web applications on typical iPhone and Android screen resolutions, change devices, rotate orientation, adjust zoom, and manually input custom resolutions.

---

## Features

- **Sidebar Integration**: Access Mobile View directly from the VS Code Activity Bar (left panel) for seamless multitasking.
- **Floating Controls Panel**: An optimized, floating configuration panel that won't disrupt your preview layout when expanded or collapsed.
- **Smart Device Filtering**: Dedicated Apple and Android icons to instantly filter and select device presets in a compact row.
- **Device Presets**: Swap between multiple iPhone and Android presets (iPhone SE, iPhone 15, Pixel 7, Galaxy S23, etc.).
- **Orientation Rotation**: Quickly toggle portrait and landscape viewports.
- **Custom Viewport Sizes**: Manually adjust width and height bounds.
- **Adjustable Zoom**: Zoom the device frame from 35% to 125% to fit your workspace.
- **Dynamic Themes**: The interface automatically inherits your active VS Code theme (Light, Dark, and High Contrast).
- **Persistent State**: Remembers your active URL, zoom level, selected device, and viewport dimensions between panel re-opens.

---

## How to Run in Development

1. Open this project folder in VS Code.
2. Press `F5` to open the Extension Development Host window.
3. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and run: **`Mobile View: Open Preview`**.
4. Enter the URL of your local or remote server (e.g., `http://localhost:3000`).

---

## Commands

- `Mobile View: Open Preview`: Launches the mobile preview simulator.

## Configuration

- `mobileView.defaultUrl`: The default URL loaded upon launch (default is `http://localhost:3000`).

---

## Important Notice on IFrame Loading

VS Code webviews run on Electron's Chromium framework. To display target websites, Mobile View uses an `<iframe>` container.
- **Local Servers**: Local development servers (like Vite, React, Vue, Next.js, etc.) run smoothly without restrictions.
- **Security Headers**: Some external production websites block iframe embedding for safety using `X-Frame-Options: DENY` or `Content-Security-Policy: frame-ancestors ...` (e.g. Google, Facebook, GitHub). If a site fails to load, check the Developer Tools console (`Developer: Toggle Developer Tools`) for CSP violations.

---

## Publishing to Open VSX

To package and publish updates to the Open VSX registry, use the following commands:

```bash
# 1. Package the extension (generates a .vsix file)
npx @vscode/vsce package

# 2. Publish to Open VSX using your Personal Access Token (PAT)
npx ovsx publish --pat <YOUR_OPEN_VSX_PAT>
```

---

# Mobile View (Español)

**Mobile View** es una extensión para Visual Studio Code que abre un simulador de dispositivos móviles basado en Chromium dentro de un panel webview de VS Code. Permite probar y previsualizar aplicaciones web en tamaños de pantalla típicos de iPhone y Android, rotar la orientación, cambiar el zoom e ingresar resoluciones personalizadas.

## Características

- **Integración en Barra Lateral (Activity Bar)**: Accede a Mobile View directamente desde el panel izquierdo de VS Code para un flujo de trabajo ininterrumpido.
- **Panel de Controles Flotante**: Una interfaz de controles optimizada y flotante que no desplaza ni interrumpe la vista previa al mostrarse u ocultarse.
- **Filtrado Inteligente de Dispositivos**: Iconos dedicados de Apple y Android para filtrar y seleccionar instantáneamente los preajustes de dispositivos.
- **Preajustes de Dispositivos**: Cambia entre presets de iPhone y Android (iPhone SE, iPhone 15, Pixel 7, Galaxy S23, etc.).
- **Rotación de Orientación**: Rota el dispositivo entre vertical y horizontal con un clic.
- **Dimensiones Personalizadas**: Modifica manualmente el ancho y el alto.
- **Zoom Ajustable**: Cambia el zoom de la simulación del 35% al 125% para que encaje en tu editor.
- **Temas Dinámicos**: La barra de controles hereda los colores del tema activo de VS Code (Claro, Oscuro y Alto Contraste).
- **Persistencia de Estado**: Recuerda la última URL, nivel de zoom, dispositivo y dimensiones entre aperturas del panel.

## Comandos

- `Mobile View: Open Preview`: Abre la vista de simulación móvil.

## Configuración

- `mobileView.defaultUrl`: URL predeterminada que se carga al abrir el panel (por defecto es `http://localhost:3000`).

## Nota sobre Cargas en IFrame

- Las herramientas locales de desarrollo (`http://localhost:3000`, etc.) funcionan perfectamente.
- Algunos sitios externos bloquean iframes por políticas de seguridad (`X-Frame-Options` o `Content-Security-Policy`). Si un sitio externo no carga, es debido a estas restricciones de seguridad del servidor remoto.
