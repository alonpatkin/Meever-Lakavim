document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Navigation ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('#nav-list a');

    function toggleMenu() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        mainNav.classList.toggle('nav-open');
    }

    menuToggle.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('nav-open')) {
                toggleMenu();
            }
        });
    });

    // --- Footer Year ---
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // --- Hero Slider ---
    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length > 0) {
        let currentHeroIndex = 0;
        setInterval(() => {
            heroSlides[currentHeroIndex].classList.remove('active');
            currentHeroIndex = (currentHeroIndex + 1) % heroSlides.length;
            heroSlides[currentHeroIndex].classList.add('active');
        }, 6000);
    }

    // --- Image Gallery Carousel (Infinite Loop) ---
    const track = document.getElementById('gallery-track');
    const nextButton = document.querySelector('.carousel-btn.next');
    const prevButton = document.querySelector('.carousel-btn.prev');
    let isTransitioning = false;
    let autoplayInterval;

    function slideNext() {
        if (isTransitioning) return;
        isTransitioning = true;
        const slideWidth = track.firstElementChild.offsetWidth;
        const dir = document.documentElement.dir === 'rtl' ? 1 : -1;
        
        track.style.transition = 'transform 0.6s ease-in-out';
        track.style.transform = `translateX(${slideWidth * dir}px)`;

        track.addEventListener('transitionend', function handler() {
            track.removeEventListener('transitionend', handler);
            track.appendChild(track.firstElementChild);
            track.style.transition = 'none';
            track.style.transform = 'translateX(0)';
            isTransitioning = false;
        });
    }

    function slidePrev() {
        if (isTransitioning) return;
        isTransitioning = true;
        const slideWidth = track.firstElementChild.offsetWidth;
        const dir = document.documentElement.dir === 'rtl' ? 1 : -1;
        
        track.insertBefore(track.lastElementChild, track.firstElementChild);
        track.style.transition = 'none';
        track.style.transform = `translateX(${slideWidth * dir}px)`;
        
        track.offsetHeight; // Force reflow
        
        track.style.transition = 'transform 0.6s ease-in-out';
        track.style.transform = 'translateX(0)';

        track.addEventListener('transitionend', function handler() {
            track.removeEventListener('transitionend', handler);
            isTransitioning = false;
        });
    }

    if (nextButton && prevButton && track) {
        nextButton.addEventListener('click', () => {
            slideNext();
            resetAutoplay();
        });
        prevButton.addEventListener('click', () => {
            slidePrev();
            resetAutoplay();
        });
    }

    // Keyboard navigation for carousel
    track.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            slidePrev();
            resetAutoplay();
        } else if (e.key === 'ArrowLeft') {
            slideNext();
            resetAutoplay();
        }
    });

    function startAutoplay() {
        autoplayInterval = setInterval(slidePrev, 4000);
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    startAutoplay();
    // Pause carousel on hover or focus
    track.parentElement.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    track.parentElement.addEventListener('mouseleave', startAutoplay);
    track.parentElement.addEventListener('focusin', () => clearInterval(autoplayInterval));
    track.parentElement.addEventListener('focusout', startAutoplay);


    // --- Contact Form Validation ---
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');

        // Reset errors
        document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
        formFeedback.textContent = '';
        formFeedback.style.color = '';

        if (!nameInput.value.trim()) {
            isValid = false;
            nameInput.setAttribute('aria-invalid', 'true');
            nameInput.nextElementSibling.style.display = 'block';
        } else {
            nameInput.removeAttribute('aria-invalid');
        }

        const phonePattern = /^[0-9\-\+\s]{8,15}$/;
        if (!phonePattern.test(phoneInput.value.trim())) {
            isValid = false;
            phoneInput.setAttribute('aria-invalid', 'true');
            phoneInput.nextElementSibling.style.display = 'block';
        } else {
            phoneInput.removeAttribute('aria-invalid');
        }

        if (isValid) {
            const name = nameInput.value.trim();
            const phone = phoneInput.value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            const btnSubmit = contactForm.querySelector('.btn-submit');
            const originalText = btnSubmit.textContent;
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'שולח...';

            fetch('https://formsubmit.co/ajax/diegal05@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    phone: phone,
                    email: email,
                    message: message || 'ללא הודעה',
                    _subject: "✨ פנייה חדשה מאתר מעבר לקווים!"
                })
            })
            .then(response => response.json())
            .then(data => {
                btnSubmit.textContent = 'נשלח בהצלחה!';
                btnSubmit.style.backgroundColor = 'var(--clr-primary-green)';
                contactForm.reset();
                setTimeout(() => {
                    btnSubmit.textContent = originalText;
                    btnSubmit.disabled = false;
                    btnSubmit.style.backgroundColor = '';
                }, 4000);
            })
            .catch(error => {
                console.error('Error:', error);
                btnSubmit.textContent = 'שגיאה בשליחה. נסו שוב.';
                setTimeout(() => {
                    btnSubmit.textContent = originalText;
                    btnSubmit.disabled = false;
                }, 4000);
            });
        } else {
            formFeedback.textContent = 'אנא תקן את השגיאות בטופס.';
            formFeedback.style.color = '#d32f2f';
        }
    });

    // --- Accessibility Widget ---
    const accessBtn = document.getElementById('accessibility-btn');
    const accessMenu = document.getElementById('accessibility-menu');
    const closeAccessBtn = document.getElementById('close-access-btn');
    const body = document.body;

    function toggleAccessMenu() {
        const isHidden = accessMenu.hasAttribute('hidden');
        if (isHidden) {
            accessMenu.removeAttribute('hidden');
            accessBtn.setAttribute('aria-expanded', 'true');
            document.getElementById('btn-increase-text').focus();
        } else {
            accessMenu.setAttribute('hidden', '');
            accessBtn.setAttribute('aria-expanded', 'false');
            accessBtn.focus();
        }
    }

    accessBtn.addEventListener('click', toggleAccessMenu);
    closeAccessBtn.addEventListener('click', toggleAccessMenu);

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !accessMenu.hasAttribute('hidden')) {
            toggleAccessMenu();
        }
    });

    // Actions
    let currentFontSize = 16;
    
    document.getElementById('btn-increase-text').addEventListener('click', () => {
        if (currentFontSize < 24) {
            currentFontSize += 2;
            document.documentElement.style.fontSize = `${currentFontSize}px`;
        }
    });

    document.getElementById('btn-decrease-text').addEventListener('click', () => {
        if (currentFontSize > 12) {
            currentFontSize -= 2;
            document.documentElement.style.fontSize = `${currentFontSize}px`;
        }
    });

    document.getElementById('btn-high-contrast').addEventListener('click', () => {
        body.classList.toggle('high-contrast');
    });

    document.getElementById('btn-highlight-links').addEventListener('click', () => {
        body.classList.toggle('highlight-links');
    });

    document.getElementById('btn-reset-access').addEventListener('click', () => {
        currentFontSize = 16;
        document.documentElement.style.fontSize = '16px';
        body.classList.remove('high-contrast', 'highlight-links');
    });
});
