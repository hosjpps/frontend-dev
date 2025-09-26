// Modal logic
const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
let lastActive = null;

openBtn.addEventListener('click', () => {
  lastActive = document.activeElement;
  dlg.showModal();
  dlg.querySelector('input, select, textarea, button')?.focus();
});

closeBtn.addEventListener('click', () => dlg.close('cancel'));

dlg.addEventListener('close', () => {
  lastActive?.focus();
});

// Phone mask
const phone = document.getElementById('phone');
phone?.addEventListener('input', () => {
  const digits = phone.value.replace(/\D/g, '').slice(0, 11);
  const d = digits.replace(/^8/, '7');
  const parts = [];
  if (d.length > 0) parts.push('+7');
  if (d.length > 1) parts.push(' (' + d.slice(1, 4));
  if (d.length >= 4) parts[parts.length - 1] += ')';
  if (d.length >= 5) parts.push(' ' + d.slice(4, 7));
  if (d.length >= 8) parts.push('-' + d.slice(7, 9));
  if (d.length >= 10) parts.push('-' + d.slice(9, 11));
  phone.value = parts.join('');
  phone?.setAttribute('pattern', '^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$');
});

// Form validation
form?.addEventListener('submit', (e) => {
  console.log('Form submit event triggered'); // Отладка
  
  // 1) Сброс кастомных сообщений
  [...form.elements].forEach(el => el.setCustomValidity?.(''));

  // 2) Проверка встроенных ограничений
  if (!form.checkValidity()) {
    console.log('Form validation failed'); // Отладка
    e.preventDefault();
    // Пример: таргетированное сообщение
    const email = form.elements.email;
    if (email?.validity.typeMismatch) {
      email.setCustomValidity('Введите корректный e-mail, например name@example.com');
    }
    form.reportValidity();
    // A11y: подсветка проблемных полей
    [...form.elements].forEach(el => {
      if (el.willValidate) el.toggleAttribute('aria-invalid', !el.checkValidity());
    });
    return;
  }

  // 3) Успешная «отправка» (без сервера)
  console.log('Form validation passed, showing notification'); // Отладка
  e.preventDefault();
  
  // Показываем уведомление об успешной отправке
  showSuccessNotification();
  
  // Если форма внутри <dialog>, закрываем окно:
  document.getElementById('contactDialog')?.close('success');
  form.reset();
});

// Функция для показа уведомления об успешной отправке
function showSuccessNotification() {
  console.log('showSuccessNotification called'); // Отладка
  
  // Создаем элемент уведомления
  const notification = document.createElement('div');
  notification.className = 'success-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">✓</span>
      <span class="notification-text">Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;
  
  console.log('Notification element created:', notification); // Отладка
  
  // Добавляем уведомление в body
  document.body.appendChild(notification);
  console.log('Notification added to body'); // Отладка
  
  // Показываем уведомление с анимацией
  setTimeout(() => {
    notification.classList.add('show');
    console.log('Show class added'); // Отладка
  }, 100);
  
  // Автоматически скрываем через 5 секунд
  setTimeout(() => {
    notification.classList.add('hide');
    setTimeout(() => {
      notification.remove();
      console.log('Notification removed'); // Отладка
    }, 300);
  }, 5000);
}