const form = document.querySelector("form");
const labels = document.querySelectorAll("label");
const inputs = document.querySelectorAll("input");
// console.log(form, labels, inputs);

inputs.forEach(input => {
  input.addEventListener('input', (event) => {
    const p = document.querySelector(`.${input.name}`);
    console.log(p);    
    
    if(input.name === 'cardNumber') {
      // Убираем все пробелы из введенного значения
      let value = event.target.value.replace(/\s/g, '');
      
      // Ограничиваем длину до 16 цифр
      if (value.length > 16) {
        value = value.slice(0, 16);
      }
      
      // Форматируем с пробелами каждые 4 цифры
      const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
      
      // Обновляем значение в input (чтобы пользователь видел пробелы)
      event.target.value = formatted;
      
      // Обновляем отображение на карте
      p.textContent = formatted || '0000 0000 0000 0000';
    } else {
      // Для остальных полей
      p.textContent = event.target.value.toUpperCase();
    }
  })
})


form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (form.checkValidity()) {
    showCompleted();
  } else {
    inputs.forEach((input) => checkValidation(input));
  }
});

const checkValidation = (input) => {
  // Сначала удаляем все ошибки для этого поля
  clearError(input);
  
  // Проверка на пустое поле
  if (!input.value.trim()) {
    showError(input, "Can't be blank");
    return;
  }

  // Валидация в зависимости от типа поля
  switch (input.name) {
    case "cardMonth":
      validateMonth(input);
      break;
    case "cardYear":
      validateYear(input);
      break;
    case "cardNumber":
      validateCardNumber(input);
      break;
    case "cardCvc":
      validateCvc(input);
      break;
  }
};

const validateMonth = (input) => {
  const month = parseInt(input.value, 10);
  if (!/^\d{2}$/.test(input.value)) {
    showError(input, "Invalid format (MM)");
  } else if (month < 1 || month > 12) {
    showError(input, "Invalid month (01-12)");
  }
};

const validateYear = (input) => {
  const year = parseInt(input.value, 10);
  const currentYear = new Date().getFullYear() % 100; 
  
  if (!/^\d{2}$/.test(input.value)) {
    showError(input, "Invalid format (YY)");
  } else if (year < currentYear || year > currentYear + 10) {
    showError(input, "Invalid year");
  }
};

const validateCardNumber = (input) => {
  // Убираем пробелы для проверки
  const cleanNumber = input.value.replace(/\s/g, '');
  if (!/^\d{16}$/.test(cleanNumber)) {
    showError(input, "Wrong format, 16 digits only");
  } else {
    // Форматируем номер карты с пробелами
    const formatted = cleanNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
    input.value = formatted;
  }
};

const validateCvc = (input) => {
  if (!/^\d{3}$/.test(input.value)) {
    showError(input, "Wrong format, 3 digits only");
  }
};

const showError = (input, message) => {
  // Для месяца и года используем общий контейнер ошибки
  if (input.name === "cardMonth" || input.name === "cardYear") {
    const errorExp = document.querySelector(".error.exp");
    errorExp.textContent = message;
    errorExp.classList.add("invalid");
    
    // Подсвечиваем оба поля
    document.querySelector('input[name="cardMonth"]').classList.add("input__error");
    document.querySelector('input[name="cardYear"]').classList.add("input__error");
    return;
  }
  
  // Для остальных полей
  const errorMsg = document.querySelector(`.error.${input.name}`);
  if (errorMsg) {
    errorMsg.textContent = message;
    errorMsg.classList.add("invalid");
  }
  input.classList.add("input__error");
};

const clearError = (input) => {
  // Для месяца и года очищаем общую ошибку
  if (input.name === "cardMonth" || input.name === "cardYear") {
    const errorExp = document.querySelector(".error.exp");
    if (errorExp) {
      errorExp.classList.remove("invalid");
      errorExp.textContent = "";
    }
    
    // Снимаем подсветку с обоих полей
    document.querySelector('input[name="cardMonth"]')?.classList.remove("input__error");
    document.querySelector('input[name="cardYear"]')?.classList.remove("input__error");
    return;
  }
  
  // Для остальных полей
  const errorMsg = document.querySelector(`.error.${input.name}`);
  if (errorMsg) {
    errorMsg.classList.remove("invalid");
    errorMsg.textContent = "";
  }
  input.classList.remove("input__error");
}; 

const showCompleted = () => {
  form.textContent = "";
  const completed = `
    <div class="completed">
      <img src="./images/icon-complete.svg" alt="icon complete">
      <h2 class="completed__header">Thank you!</h2>
      <p class="completed__text">We've added you cart details</p>
      <button class="card__btn confirm__btn">Continue</button>
    </div>
  `;
  form.insertAdjacentHTML("afterbegin", completed);
  const continueBtn = document.querySelector(".confirm__btn");
  continueBtn.addEventListener("click", () => location.reload());
};
