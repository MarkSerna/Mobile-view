const vscode = require('vscode');

function activate(context) {
  const openPanelCommand = vscode.commands.registerCommand('mobileView.open', () => {
    const panel = vscode.window.createWebviewPanel(
      'mobileView.preview',
      'Mobile View',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
      }
    );

    const defaultUrl = vscode.workspace
      .getConfiguration('mobileView')
      .get('defaultUrl', 'http://localhost:3000');

    panel.webview.html = getWebviewHtml(panel.webview, context.extensionUri, defaultUrl);
  });

  const sidebarProvider = new MobileViewSidebarProvider(context.extensionUri);
  const sidebarView = vscode.window.registerWebviewViewProvider(
    'mobileView.sidebarView',
    sidebarProvider
  );

  context.subscriptions.push(openPanelCommand, sidebarView);
}

class MobileViewSidebarProvider {
  constructor(extensionUri) {
    this._extensionUri = extensionUri;
  }

  resolveWebviewView(webviewView, context, token) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this._extensionUri, 'media')]
    };

    const defaultUrl = vscode.workspace
      .getConfiguration('mobileView')
      .get('defaultUrl', 'http://localhost:3000');

    webviewView.webview.html = getWebviewHtml(webviewView.webview, this._extensionUri, defaultUrl);
  }
}

function deactivate() {}

function getWebviewHtml(webview, extensionUri, defaultUrl) {
  const stylesUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'styles.css'));
  const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'main.js'));
  const nonce = getNonce();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https: data:; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; frame-src http: https:;">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="${stylesUri}" rel="stylesheet">
  <title>Mobile View</title>
</head>
<body>
  <main class="app-shell">
    <aside id="toolbar" class="toolbar" aria-label="Mobile View controls">
      <div class="control-window-header">
        <div class="brand">
          <span class="brand-mark"></span>
          <div>
            <h1>Mobile View</h1>
            <p>Preview Chromium</p>
          </div>
        </div>
        <button id="controls-toggle" class="ghost-button" type="button" title="Hide controls">Hide</button>
      </div>

      <form id="url-form" class="url-form">
        <label for="url-input">URL</label>
        <div class="url-row">
          <input id="url-input" type="url" value="${escapeHtml(defaultUrl)}" placeholder="http://localhost:3000">
          <button type="submit" title="Load URL">Go</button>
        </div>
      </form>

      <section class="control-group">
        <label for="device-select">Device</label>
        <div class="device-row">
          <div class="segmented platform-icons" aria-label="Platform">
            <button id="platform-ios" type="button" class="active" data-platform="ios" title="iPhone">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>
            </button>
            <button id="platform-android" type="button" data-platform="android" title="Android">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 16V9h14v7c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2z"/><path d="M9 4v5"/><path d="M15 4v5"/><path d="M12 9v9"/></svg>
            </button>
          </div>
          <select id="device-select"></select>
        </div>
      </section>

      <section class="control-grid">
        <label>
          Width
          <input id="width-input" type="number" min="240" max="1200">
        </label>
        <label>
          Height
          <input id="height-input" type="number" min="320" max="1600">
        </label>
      </section>

      <section class="control-group">
        <label for="zoom-input">Zoom <span id="zoom-value">80%</span></label>
        <input id="zoom-input" type="range" min="35" max="125" value="80">
      </section>

      <div class="actions">
        <button id="rotate-button" type="button" title="Rotate device">Rotate</button>
        <button id="reload-button" type="button" title="Reload preview">Reload</button>
      </div>

      <p class="note">Note: Some sites block iframe embedding for security (CORS/CSP). Local servers work best.</p>
    </aside>

    <section class="stage" aria-label="Device preview">
      <div id="device-wrap" class="device-wrap">
        <div id="device" class="device device-ios">
          <div class="device-top">
            <span class="speaker"></span>
          </div>
          <div class="screen">
            <div class="status-bar">
              <span id="status-time">9:41</span>
              <span class="status-icons">LTE 100%</span>
            </div>
            <div class="browser-bar">
              <span class="lock">https://</span>
              <form id="preview-url-form" class="preview-url-form">
                <input id="preview-url-input" type="text" aria-label="Preview URL" autocomplete="off" spellcheck="false">
              </form>
            </div>
            <iframe id="preview-frame" title="Chromium mobile preview" sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts"></iframe>
          </div>
          <div class="home-indicator"></div>
        </div>
      </div>
    </section>
  </main>

  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 32; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

module.exports = {
  activate,
  deactivate
};
