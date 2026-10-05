const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');

const applyTheme = (theme) => {
  root.setAttribute('data-theme', theme);
};

const savedTheme = localStorage.getItem('manlisa-theme');
if (savedTheme) {
  applyTheme(savedTheme);
} else {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('manlisa-theme', nextTheme);
    applyTheme(nextTheme);
  });
}

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealItems.forEach((item) => observer.observe(item));

const contactForm = document.querySelector('.contact-form');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const key = contactForm.dataset.web3formsKey;
    const formData = new FormData(contactForm);

    if (!key || key === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      toastMessage.textContent = 'Email setup is not finished yet.';
      toast.hidden = false;
      setTimeout(() => toast.hidden = true, 3000);
      return;
    }

    const payload = Object.fromEntries(formData.entries());
    payload.access_key = key;
    payload.subject = `Portfolio message: ${payload.subject}`;

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || 'Could not send message.');
      }

      contactForm.reset();
      toastMessage.textContent = 'Your message was sent successfully.';
      toast.hidden = false;
      setTimeout(() => toast.hidden = true, 4000);
    } catch (error) {
      toastMessage.textContent = 'Message failed. Please use email directly.';
      toast.hidden = false;
      setTimeout(() => toast.hidden = true, 4000);
    }
  });
}
