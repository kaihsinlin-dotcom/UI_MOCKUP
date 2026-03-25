// main.js — add interactivity here

document.addEventListener('DOMContentLoaded', () => {
  // Highlight the active nav link based on the current page
  const navLinks = document.querySelectorAll('.nav__links a');
  navLinks.forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('nav__link--active');
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
