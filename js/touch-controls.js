// Touch Controls: D-Pad, Action Buttons, Look Box
const TouchControls = (() => {
  let isEnabled = false;
  const touches = {};

  function init() {
    if (isEnabled) return;
    isEnabled = true;

    // Create control overlay
    const overlay = createControlsOverlay();
    document.body.appendChild(overlay);

    // Setup touch event handlers
    setupTouchHandlers(overlay);

    console.log('Touch controls initialized');
  }

  function createControlsOverlay() {
    const div = document.createElement('div');
    div.id = 'touchControls';
    div.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 2;
      user-select: none;
      font-family: 'Alfa Slab One', Georgia, serif;
    `;

    // D-Pad (left side)
    const dpad = `
      <div style="position: absolute; left: 16px; bottom: calc(140px + env(safe-area-inset-bottom, 0px)); width: 110px; height: 110px; pointer-events: auto;">
        <button class="dpad-btn dpad-up" data-key="KeyW" style="position: absolute; left: 10px; top: 0; width: 50px; height: 40px; background: rgba(200, 26, 26, 0.7); border: 2px solid #f2c230; color: #f2c230; font-weight: bold; cursor: pointer; border-radius: 4px;">↑</button>
        <button class="dpad-btn dpad-left" data-key="KeyA" style="position: absolute; left: 0; top: 50px; width: 40px; height: 50px; background: rgba(200, 26, 26, 0.7); border: 2px solid #f2c230; color: #f2c230; font-weight: bold; cursor: pointer; border-radius: 4px;">←</button>
        <button class="dpad-btn dpad-down" data-key="KeyS" style="position: absolute; left: 10px; top: 60px; width: 50px; height: 40px; background: rgba(200, 26, 26, 0.7); border: 2px solid #f2c230; color: #f2c230; font-weight: bold; cursor: pointer; border-radius: 4px;">↓</button>
        <button class="dpad-btn dpad-right" data-key="KeyD" style="position: absolute; left: 60px; top: 50px; width: 40px; height: 50px; background: rgba(200, 26, 26, 0.7); border: 2px solid #f2c230; color: #f2c230; font-weight: bold; cursor: pointer; border-radius: 4px;">→</button>
      </div>
    `;

    // Action Buttons (right side)
    const actions = `
      <div style="position: absolute; right: 16px; bottom: calc(140px + env(safe-area-inset-bottom, 0px)); width: 200px; pointer-events: auto;">
        <button class="action-btn" data-key="KeyQ" style="position: absolute; right: 110px; bottom: 60px; width: 50px; height: 50px; background: rgba(200, 26, 26, 0.7); border: 2px solid #f2c230; color: #f2c230; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 20px;">Q</button>
        <button class="action-btn" data-key="Space" style="position: absolute; right: 50px; bottom: 60px; width: 50px; height: 50px; background: rgba(200, 26, 26, 0.7); border: 2px solid #f2c230; color: #f2c230; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 18px;">⚔</button>
        <button class="action-btn" data-key="ShiftLeft" style="position: absolute; right: 0; bottom: 60px; width: 50px; height: 50px; background: rgba(200, 26, 26, 0.7); border: 2px solid #f2c230; color: #f2c230; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 16px;">RUN</button>
        <button class="action-btn" data-key="KeyE" style="position: absolute; right: 110px; bottom: 0; width: 50px; height: 50px; background: rgba(200, 26, 26, 0.7); border: 2px solid #f2c230; color: #f2c230; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 20px;">E</button>
        <button class="action-btn" data-key="KeyV" style="position: absolute; right: 50px; bottom: 0; width: 50px; height: 50px; background: rgba(200, 26, 26, 0.7); border: 2px solid #f2c230; color: #f2c230; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 16px;">VENT</button>
        <button class="action-btn" data-key="KeyM" style="position: absolute; right: 0; bottom: 0; width: 50px; height: 50px; background: rgba(200, 26, 26, 0.7); border: 2px solid #f2c230; color: #f2c230; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 16px;">MAP</button>
      </div>
    `;

    // Map button (top-left)
    const mapBtn = `
      <button class="action-btn" data-key="KeyM" style="position: absolute; top: calc(16px + env(safe-area-inset-top, 0px)); left: 16px; width: 60px; height: 40px; background: rgba(200, 26, 26, 0.7); border: 2px solid #f2c230; color: #f2c230; font-weight: bold; cursor: pointer; border-radius: 4px; pointer-events: auto; z-index: 3;">M</button>
    `;

    // Look box (right side, for camera control)
    const lookBox = `
      <div style="position: absolute; right: calc(16px + env(safe-area-inset-right, 0px)); top: calc(16px + env(safe-area-inset-top, 0px)); width: 100px; height: 100px; background: rgba(50, 50, 50, 0.5); border: 2px solid #f2c230; pointer-events: auto; z-index: 3;" id="lookBox"></div>
    `;

    div.innerHTML = dpad + actions + mapBtn + lookBox;
    return div;
  }

  function setupTouchHandlers(overlay) {
    // D-Pad and action buttons
    overlay.querySelectorAll('.dpad-btn, .action-btn').forEach(btn => {
      const keyCode = btn.dataset.key;

      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        simulateKeyDown(keyCode);
        btn.style.background = 'rgba(200, 26, 26, 1)';
        btn.style.transform = 'scale(0.95)';
      });

      btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        simulateKeyUp(keyCode);
        btn.style.background = 'rgba(200, 26, 26, 0.7)';
        btn.style.transform = 'scale(1)';
      });

      // Mouse support for testing
      btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        simulateKeyDown(keyCode);
        btn.style.background = 'rgba(200, 26, 26, 1)';
        btn.style.transform = 'scale(0.95)';
      });

      btn.addEventListener('mouseup', (e) => {
        e.preventDefault();
        simulateKeyUp(keyCode);
        btn.style.background = 'rgba(200, 26, 26, 0.7)';
        btn.style.transform = 'scale(1)';
      });
    });

    // Look box for camera control
    const lookBox = document.getElementById('lookBox');
    if (lookBox) {
      let lastX = 0, lastY = 0;

      lookBox.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = lookBox.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        const dx = (x - lastX) * 0.003;
        const dy = (y - lastY) * 0.003;

        if (G && G.p) {
          G.p.yaw -= dx;
          G.p.pitch = Math.max(-1.2, Math.min(1.2, G.p.pitch - dy));
        }
        lastX = x;
        lastY = y;
      });

      lookBox.addEventListener('mousemove', (e) => {
        const rect = lookBox.getBoundingClientRect();
        if (e.buttons === 1) {
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const dx = (x - lastX) * 0.003;
          const dy = (y - lastY) * 0.003;

          if (G && G.p) {
            G.p.yaw -= dx;
            G.p.pitch = Math.max(-1.2, Math.min(1.2, G.p.pitch - dy));
          }
          lastX = x;
          lastY = y;
        }
      });
    }
  }

  function simulateKeyDown(keyCode) {
    const event = new KeyboardEvent('keydown', {
      code: keyCode,
      key: keyCodeToKey(keyCode),
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(event);
  }

  function simulateKeyUp(keyCode) {
    const event = new KeyboardEvent('keyup', {
      code: keyCode,
      key: keyCodeToKey(keyCode),
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(event);
  }

  function keyCodeToKey(code) {
    const map = {
      'KeyW': 'w', 'KeyA': 'a', 'KeyS': 's', 'KeyD': 'd',
      'KeyQ': 'q', 'KeyE': 'e', 'KeyV': 'v', 'KeyM': 'm',
      'Space': ' ', 'ShiftLeft': 'Shift'
    };
    return map[code] || code;
  }

  return { init };
})();

// Auto-init touch controls when game starts
if (typeof Game !== 'undefined') {
  const originalSetup = Game.setup;
  Game.setup = function() {
    originalSetup.call(this);
    TouchControls.init();
  };
}
