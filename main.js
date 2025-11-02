const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector('i');

menuBtn.addEventListener("click", (e) => {
    navLinks.classList.toggle("open");

    const isOpen = navLinks.classList.contains("open");
    menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

const scrollRevealOption = {
    distance: "50px",
    origin: "bottom",
    duration: 1000,
};

ScrollReveal().reveal(".header__image img", {
    ...scrollRevealOption,
    origin: "right",
});
ScrollReveal().reveal(".header__content h2", {
    ...scrollRevealOption,
    delay: 250,
});
ScrollReveal().reveal(".header__content h1", {
    ...scrollRevealOption,
    delay: 500,
});
ScrollReveal().reveal(".header__content .section__description", {
    ...scrollRevealOption,
    delay: 1000,
});
ScrollReveal().reveal(".header__form form", {
    ...scrollRevealOption,
    delay: 1500,
});
ScrollReveal().reveal(".about__card", {
    ...scrollRevealOption,
    interval: 500,
});

const tabs = document.querySelector(".deals__tabs")

tabs.addEventListener("click", (e) => {
    const tabContents = document.querySelectorAll(".deals__container .tab__content");
    Array.from(tabs.children).forEach(item => {
        if(item.dataset.id === e.target.dataset.id) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
    tabContents.forEach(item => {
        if(item.id === e.target.dataset.id) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    })
});

const swiper = new Swiper(".swiper", {
  slidesPerView: 3,
  spaceBetween: 20,
  loop: true,
});

const backdrop = document.getElementById('modal-backdrop');
function openModal(el) {
  el.classList.remove('hidden');
  backdrop.classList.add('show');
  backdrop.classList.remove('hidden');
}
function closeModals() {
  document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
  backdrop.classList.remove('show');
  backdrop.classList.add('hidden');
}
backdrop.addEventListener('click', closeModals);
document.addEventListener('click', (e) => {
  if (e.target.matches('[data-close-modal]')) closeModals();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModals();
});

const registerModal = document.getElementById('register-modal');
const registerForm = document.getElementById('register-form');

document.querySelectorAll('.nav__links li:last-child a, .nav__btns .btn')
  .forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(registerModal);
  }));

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  alert('Account created');
  closeModals();
  
  const btn = document.querySelector('.nav__btns .btn');
  if (btn) btn.textContent = 'Account';
});


const checkoutModal = document.getElementById('checkout-modal');
const coCar   = document.getElementById('co-car');
const coRate  = document.getElementById('co-rate');   
const coRate2 = document.getElementById('co-rate2');  
const coPickup = document.getElementById('co-pickup');
const coReturn = document.getElementById('co-return');
const coDaysEl = document.getElementById('co-days');
const coTotalEl = document.getElementById('co-total');
const checkoutForm = document.getElementById('checkout-form');

document.querySelectorAll('.deals__card .deals__card__footer a')
  .forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault();
    const card = e.currentTarget.closest('.deals__card');
    const carName = card.querySelector('h4')?.textContent?.trim() || 'Selected car';
    const rateText = card.querySelector('.deals__card__footer h3')?.textContent || '$0';
    const rateNum = Number((rateText.match(/(\d+(\.\d+)?)/) || [0, 0])[1]);

    coCar.value  = carName;
    coRate.value = `$${rateNum}`;
    coRate2.textContent = `$${rateNum}`;
    coPickup.value = '';
    coReturn.value = '';
    coDaysEl.textContent = '1';
    coTotalEl.textContent = `$${rateNum}`;

    
    checkoutForm.dataset.rate = String(rateNum);

    openModal(checkoutModal);
  }));

function calcDaysAndTotal() {
  const rate = Number(checkoutForm.dataset.rate || 0);
  const t1 = new Date(coPickup.value);
  const t2 = new Date(coReturn.value);
  if (isNaN(t1) || isNaN(t2) || t2 <= t1) {
    coDaysEl.textContent = '1';
    coTotalEl.textContent = `$${rate}`;
    return;
  }
  const ms = t2 - t1;
  const days = Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  coDaysEl.textContent = String(days);
  coTotalEl.textContent = `$${(days * rate).toFixed(2)}`;
}
['change','input'].forEach(evt => {
  coPickup.addEventListener(evt, calcDaysAndTotal);
  coReturn.addEventListener(evt, calcDaysAndTotal);
});


function validCardNumber(s) {
  const digits = (s || '').replace(/\D/g, '');
  if (digits.length < 12 || digits.length > 19) return false;
  
  let sum = 0, dbl = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (dbl) { d *= 2; if (d > 9) d -= 9; }
    sum += d; dbl = !dbl;
  }
  return sum % 10 === 0;
}

checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const loc = document.getElementById('co-location').value;
  if (!loc) { alert('Select a pick-up location'); return; }
  if (!coPickup.value || !coReturn.value) {
    alert('Select pick-up and return date/time');
    return;
  }

  alert('Payment successful. Booking confirmed.');
  closeModals();
});

