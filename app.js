const form = document.querySelector("form");
const labels = document.querySelectorAll("label");
const inputs = document.querySelectorAll("input");
// console.log(form, labels, inputs);

inputs.forEach(input => {
  input.addEventListener('input', (event) => {
    const p = document.querySelector(`.${input.name}`);
    console.log(p);    
   p.textContent = event.target.value.toUpperCase();
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

/** 
 * Чтобы было проще следить за числовыми форматами, можно использовать с функ
цией parseInt() второй аргумент: основание системы счисления (иначе говоря, 
количество цифр в ней). 
Чаще всего вы будете передавать в функцию parseInt() десятич
ные числа, указывая 10 в качестве второго аргумента.
*/

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
  // Получаем последние 2 цифры текущего года
  // 2026 % 100 - 26 100*2=200 2026-200 - (вычитаем в столбик) 2026 - под ним 200 осататок остается - 26
  
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

// const checkValidation = (input) => {
//   if (input.name === "cardMonth" || input.name === "cardYear") {
//     const month = document.querySelector(`input[name="cardMonth"]`).value;
//     const year = document.querySelector(`input[name="cardYear"]`).value;
//     const errorExp = document.querySelector(".error.exp");

//     if (!month || !year) {
//       errorExp.textContent = "Can't be blank";
//       errorExp.classList.add("invalid");
//       input.classList.add("input__error");
//       return;
//     }
//     errorExp.classList.remove("invalid");
//     input.classList.remove("input__error");
//     return;
//   }

//   const errorMsg = document.querySelector(`.error.${input.name}`);
//   if (input.name === "cardMonth" || input.name === "cardYear") {
//     errorSelector = ".error.exp";
//   }

//   errorMsg.classList.add("invalid");
//   input.classList.add("input__error");
//   if (!input.value) {
//     errorMsg.textContent = "Can't be blank";
//   } else if (
//     input.name === "cardNumber" &&
//     !/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(input.value)
//   ) {
//     errorMsg.textContent = `Wrong format, number only`;
//   } else if (
//     (input.name === "cardMonth" && !/^[0-9]{2}$/.test(input.value)) ||
//     parseInt(input.value, 10) < 1 ||
//     parseInt(input.value, 10) > 12
//   ) {
//     errorMsg.textContent = "Invalid month";
//   } else if (
//     (input.name === "cardYear" && !/^[0-9]{2}$/.test(input.value)) ||
//     parseInt(input.value, 20) >= 26 ||
//     parseInt(input.value, 30) <= 30
//   ) {
//     errorMsg.textContent = "Wrong Year";
//   } else if (input.name === "cardCvc" && !/^[0-9]{3}$/.test(input.value)) {
//     errorMsg.textContent = `Wrong format, 3 digits only`;
//   } else {
//     errorMsg.classList.remove("invalid");
//     input.classList.remove("input__error");
//     return;
//   }

//   console.log(input.name);
// };

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



// 32:33

/**
 * const form = document.querySelector("form");
const labels = document.querySelectorAll("label");
const inputs = document.querySelectorAll("input");

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
  const currentYear = new Date().getFullYear() % 100; // Получаем последние 2 цифры текущего года
  
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
      <p class="completed__text">We've added your card details</p>
      <button class="card__btn confirm__btn">Continue</button>
    </div>
  `;
  form.insertAdjacentHTML("afterbegin", completed);
  const continueBtn = document.querySelector(".confirm__btn");
  continueBtn.addEventListener("click", () => location.reload());
};
 */