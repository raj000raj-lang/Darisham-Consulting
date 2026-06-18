// Darisham site — shared interactivity
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mobileNav.classList.remove('open'); });
    });
  }

  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { obs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // Contact form: AJAX submit to contact-mail.php
  var form = document.querySelector('#contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn    = document.getElementById('formSubmitBtn');
      var status = document.getElementById('formStatus');

      // Basic client-side validation
      var name    = form.querySelector('[name="name"]').value.trim();
      var email   = form.querySelector('[name="email"]').value.trim();
      var subject = form.querySelector('[name="subject"]').value.trim();
      if (!name || !email || !subject) {
        status.style.display = 'block';
        status.style.background = '#fff3cd';
        status.style.color = '#856404';
        status.textContent = 'Please fill in Name, Email and Subject.';
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Sending…';
      status.style.display = 'none';

      var data = new FormData(form);

      fetch('contact-mail.php', {
        method: 'POST',
        body: data
      })
      .then(function(res) { return res.json(); })
      .then(function(json) {
        status.style.display = 'block';
        if (json.success) {
          status.style.background = 'rgba(43,212,189,0.15)';
          status.style.color = '#0d9488';
          status.textContent = json.message;
          form.reset();
        } else {
          status.style.background = '#fde8e8';
          status.style.color = '#c53030';
          status.textContent = json.message;
        }
        btn.disabled = false;
        btn.textContent = 'Send Message';
      })
      .catch(function() {
        status.style.display = 'block';
        status.style.background = '#fde8e8';
        status.style.color = '#c53030';
        status.textContent = 'Something went wrong. Please email us at support@darisham.in';
        btn.disabled = false;
        btn.textContent = 'Send Message';
      });
    });
  }
});
