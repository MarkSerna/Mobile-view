const vscode = require('vscode');

function activate(context) {
  const disposable = vscode.commands.registerCommand('mobileView.open', () => {
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

  context.subscriptions.push(disposable);
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
        <select id="device-select"></select>
      </section>

      <section class="segmented" aria-label="Platform">
        <button id="platform-ios" type="button" class="active" data-platform="ios">iPhone</button>
        <button id="platform-android" type="button" data-platform="android">Android</button>
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
