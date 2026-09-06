const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');

menuButton?.addEventListener('click', () => {
  const opened = navLinks.classList.toggle('open');
  document.body.classList.toggle('menu-open', opened);
  menuButton.setAttribute('aria-expanded', String(opened));
  menuButton.textContent = opened ? '✕' : '☰';
});

navLinks?.addEventListener('click', (event) => {
  if (!event.target.closest('a')) return;
  navLinks.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = '☰';
});

const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  status.textContent = '';

  if (!form.reportValidity()) return;
  const data = new FormData(form);
  if (data.get('website')) return;

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = 'Готовлю…';

  const message = [
    'Здравствуйте! Хочу обсудить проект.',
    `Имя: ${data.get('name')}`,
    `Контакт: ${data.get('contact')}`,
    `Тема: ${data.get('topic')}`,
    `Задача: ${data.get('message')}`,
  ].join('\n');

  try {
    if (navigator.share) {
      await navigator.share({ title: 'Заявка с сайта kon-web.ru', text: message });
      status.textContent = 'Меню отправки открыто. Выберите Telegram и подтвердите отправку.';
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(message);
      status.innerHTML = 'Текст скопирован. <a href="https://t.me/ak_businesss" target="_blank" rel="noopener">Откройте Telegram</a>, вставьте его и подтвердите отправку.';
    } else {
      status.innerHTML = 'Откройте <a href="https://t.me/ak_businesss" target="_blank" rel="noopener">Telegram</a> и отправьте сообщение вручную.';
    }
  } catch {
    status.textContent = 'Отправка отменена. Введённые данные никуда не переданы.';
  } finally {
    button.disabled = false;
    button.innerHTML = 'Подготовить сообщение <span aria-hidden="true">→</span>';
  }
});
