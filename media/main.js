(function () {
  const vscode = acquireVsCodeApi();

  const devices = [
    { name: 'iPhone SE', platform: 'ios', width: 375, height: 667 },
    { name: 'iPhone 15', platform: 'ios', width: 393, height: 852 },
    { name: 'iPhone 15 Pro Max', platform: 'ios', width: 430, height: 932 },
    { name: 'Pixel 7', platform: 'android', width: 412, height: 915 },
    { name: 'Pixel Fold', platform: 'android', width: 673, height: 841 },
    { name: 'Galaxy S23', platform: 'android', width: 360, height: 780 },
    { name: 'Galaxy A54', platform: 'android', width: 412, height: 915 }
  ];

  const state = {
    platform: 'ios',
    url: document.getElementById('url-input').value,
    width: 393,
    height: 852,
    zoom: 80
  };

  const elements = {
    device: document.getElementById('device'),
    deviceWrap: document.getElementById('device-wrap'),
    deviceSelect: document.getElementById('device-select'),
    frame: document.getElementById('preview-frame'),
    heightInput: document.getElementById('height-input'),
    platformButtons: document.querySelectorAll('[data-platform]'),
    controlsToggle: document.getElementById('controls-toggle'),
    previewUrlForm: document.getElementById('preview-url-form'),
    previewUrlInput: document.getElementById('preview-url-input'),
    reloadButton: document.getElementById('reload-button'),
    rotateButton: document.getElementById('rotate-button'),
    toolbar: document.getElementById('toolbar'),
    urlForm: document.getElementById('url-form'),
    urlInput: document.getElementById('url-input'),
    widthInput: document.getElementById('width-input'),
    zoomInput: document.getElementById('zoom-input'),
    zoomValue: document.getElementById('zoom-value')
  };

  function initialize() {
    renderDeviceOptions();

    const savedState = vscode.getState();
    if (savedState) {
      state.platform = savedState.platform || 'ios';
      state.url = savedState.url || document.getElementById('url-input').value;
      state.width = savedState.width || 393;
      state.height = savedState.height || 852;
      state.zoom = savedState.zoom || 80;

      elements.urlInput.value = state.url;
      elements.previewUrlInput.value = state.url;
      elements.frame.src = state.url;

      renderDeviceOptions(state.platform);

      const matchedDevice = devices.find((item) => item.name === savedState.deviceName);
      if (matchedDevice && matchedDevice.platform === state.platform) {
        selectDevice(matchedDevice);
      } else {
        setPlatform(state.platform);
        applyDeviceSize();
      }
    } else {
      renderDeviceOptions(state.platform);
      selectDevice(devices.find(d => d.platform === state.platform));
      loadUrl(state.url);
    }

    bindEvents();
  }

  function renderDeviceOptions(platform = state.platform) {
    elements.deviceSelect.innerHTML = '';
    
    const filtered = devices.filter((device) => device.platform === platform);
    for (const device of filtered) {
      const option = document.createElement('option');
      option.value = device.name;
      option.textContent = `${device.name} (${device.width} x ${device.height})`;
      elements.deviceSelect.appendChild(option);
    }
  }

  function bindEvents() {
    elements.urlForm.addEventListener('submit', (event) => {
      event.preventDefault();
      loadUrl(elements.urlInput.value);
    });

    elements.previewUrlForm.addEventListener('submit', (event) => {
      event.preventDefault();
      loadUrl(elements.previewUrlInput.value);
      elements.previewUrlInput.blur();
    });

    elements.deviceSelect.addEventListener('change', () => {
      const device = devices.find((item) => item.name === elements.deviceSelect.value);
      selectDevice(device);
    });

    elements.platformButtons.forEach((button) => {
      button.addEventListener('click', () => {
        setPlatform(button.dataset.platform);
        applyDeviceSize();
      });
    });

    elements.widthInput.addEventListener('input', () => {
      state.width = clamp(Number(elements.widthInput.value), 240, 1200);
      applyDeviceSize();
    });

    elements.heightInput.addEventListener('input', () => {
      state.height = clamp(Number(elements.heightInput.value), 320, 1600);
      applyDeviceSize();
    });

    elements.zoomInput.addEventListener('input', () => {
      state.zoom = Number(elements.zoomInput.value);
      applyDeviceSize();
    });

    elements.rotateButton.addEventListener('click', () => {
      const nextWidth = state.height;
      state.height = state.width;
      state.width = nextWidth;
      applyDeviceSize();
    });

    elements.reloadButton.addEventListener('click', () => {
      elements.frame.src = elements.frame.src;
    });

    elements.controlsToggle.addEventListener('click', () => {
      const isCollapsed = elements.toolbar.classList.toggle('collapsed');
      elements.controlsToggle.textContent = isCollapsed ? 'Show' : 'Hide';
      elements.controlsToggle.title = isCollapsed ? 'Show controls' : 'Hide controls';
    });
  }

  function selectDevice(device) {
    if (!device) {
      return;
    }

    state.width = device.width;
    state.height = device.height;
    setPlatform(device.platform);
    elements.deviceSelect.value = device.name;
    applyDeviceSize();
  }

  function setPlatform(platform) {
    if (state.platform !== platform) {
      state.platform = platform;
      renderDeviceOptions(platform);
      
      const newDevice = devices.find((d) => d.platform === platform);
      if (newDevice) {
        state.width = newDevice.width;
        state.height = newDevice.height;
        elements.deviceSelect.value = newDevice.name;
      }
    }

    elements.device.classList.toggle('device-ios', platform === 'ios');
    elements.device.classList.toggle('device-android', platform === 'android');

    elements.platformButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.platform === platform);
    });
  }

  function applyDeviceSize() {
    elements.widthInput.value = state.width;
    elements.heightInput.value = state.height;
    elements.zoomInput.value = state.zoom;
    elements.zoomValue.textContent = `${state.zoom}%`;

    const chromeHeight = state.platform === 'ios' ? 96 : 86;
    const scale = state.zoom / 100;
    const outerWidth = state.width + 28;
    const outerHeight = state.height + chromeHeight + 34;

    elements.device.style.setProperty('--device-width', `${state.width}px`);
    elements.device.style.setProperty('--device-height', `${state.height + chromeHeight}px`);
    elements.device.style.setProperty('--screen-width', `${state.width}px`);
    elements.device.style.setProperty('--screen-height', `${state.height}px`);
    elements.device.style.setProperty('--device-scale', scale);
    elements.deviceWrap.style.setProperty('--device-layout-width', `${outerWidth * scale}px`);
    elements.deviceWrap.style.setProperty('--device-layout-height', `${outerHeight * scale}px`);

    saveState();
  }

  function saveState() {
    vscode.setState({
      platform: state.platform,
      url: state.url,
      width: state.width,
      height: state.height,
      zoom: state.zoom,
      deviceName: elements.deviceSelect.value
    });
  }

  function loadUrl(value) {
    const url = normalizeUrl(value);
    const welcomeUrl = document.querySelector('.app-shell').dataset.welcomeUrl;
    
    state.url = url === welcomeUrl ? '' : url;
    
    if (url !== welcomeUrl) {
      elements.urlInput.value = url;
      elements.previewUrlInput.value = url;
    } else {
      elements.urlInput.value = '';
      elements.previewUrlInput.value = '';
    }
    
    elements.frame.src = url;
    saveState();
  }

  function normalizeUrl(value) {
    const trimmed = String(value || '').trim();

    if (!trimmed) {
      return document.querySelector('.app-shell').dataset.welcomeUrl;
    }

    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }

    return `http://${trimmed}`;
  }

  function clamp(value, min, max) {
    if (Number.isNaN(value)) {
      return min;
    }

    return Math.min(Math.max(value, min), max);
  }

  initialize();
}());
