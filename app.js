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
    'Здравствуйте! Хочу подать заявку с сайта kon-web.ru.',
    '',
    `ФИО: ${data.get('full_name')}`,
    `Телефон или почта: ${data.get('contact')}`,
    `Тема обращения: ${data.get('topic')}`,
    `Комментарий: ${data.get('message')}`,
  ].join('\n');

  try {
    const telegramUrl = `https://t.me/ak_businesss?text=${encodeURIComponent(message)}`;
    status.textContent = 'Открываю чат в Telegram с готовой заявкой. Нажмите «Отправить» в Telegram.';
    window.location.assign(telegramUrl);
  } catch {
    status.textContent = 'Отправка отменена. Введённые данные никуда не переданы.';
  } finally {
    button.disabled = false;
    button.innerHTML = 'Подать заявку в Telegram <span aria-hidden="true">→</span>';
  }
});

const cursor = document.querySelector('.cursor-follower');
const finePointer = window.matchMedia('(pointer: fine)').matches;

if (cursor && finePointer) {
  let targetX = -100;
  let targetY = -100;
  let currentX = -100;
  let currentY = -100;

  window.addEventListener('pointermove', (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    cursor.classList.add('visible');
  }, { passive: true });

  document.addEventListener('pointerover', (event) => {
    cursor.style.setProperty('--cursor-scale', event.target.closest('a, button, input, select, textarea') ? '2.1' : '1');
  });

  const follow = () => {
    currentX += (targetX - currentX) * .18;
    currentY += (targetY - currentY) * .18;
    cursor.style.setProperty('--cursor-x', `${currentX}px`);
    cursor.style.setProperty('--cursor-y', `${currentY}px`);
    requestAnimationFrame(follow);
  };
  follow();
}

const heroArt = document.querySelector('.hero-art');
heroArt?.addEventListener('pointermove', (event) => {
  if (!finePointer) return;
  const rect = heroArt.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  heroArt.style.setProperty('--ry', `${(x - .5) * 8}deg`);
  heroArt.style.setProperty('--rx', `${(.5 - y) * 8}deg`);
  heroArt.style.setProperty('--spot-x', `${x * 100}%`);
  heroArt.style.setProperty('--spot-y', `${y * 100}%`);
});

heroArt?.addEventListener('pointerleave', () => {
  heroArt.style.setProperty('--ry', '0deg');
  heroArt.style.setProperty('--rx', '0deg');
  heroArt.style.setProperty('--spot-x', '50%');
  heroArt.style.setProperty('--spot-y', '50%');
});
