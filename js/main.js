/**
 * Swastik Estates - Main JavaScript
 * Handles AOS animations, Navbar scroll behavior, Back-to-Top, and Form Interactivity
 */

document.addEventListener('DOMContentLoaded', function () {
    // 1. Initialize AOS (Animate on Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }

    // 2. Dynamic Year Update
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // 3. Back to Top Button and Header Scroll Shadow
    const backToTopBtn = document.getElementById('backToTop');
    const header = document.getElementById('topHeader');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }

        if (window.scrollY > 50) {
            header.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.45)';
        } else {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.25)';
        }
    });

    // 4. Smooth Anchor Scrolling for Navbar Links
    const navLinks = document.querySelectorAll('.navbar-nav a[href^="#"], .hero-content a[href^="#"], .back-to-top');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    
                    // Close mobile navbar collapse if open
                    const navToggler = document.querySelector('.navbar-toggler');
                    const navCollapse = document.querySelector('.navbar-collapse');
                    if (navCollapse && navCollapse.classList.contains('show')) {
                        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                        if (bsCollapse) {
                            bsCollapse.hide();
                        }
                    }

                    const headerOffset = 70;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 5. Contact Form Submission Feedback
    const contactForm = document.getElementById('contactForm');
    const formSuccessAlert = document.getElementById('formSuccessAlert');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            // Check form validity
            if (!contactForm.checkValidity()) {
                e.stopPropagation();
                contactForm.classList.add('was-validated');
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn.innerHTML;

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
                formSuccessAlert.classList.remove('d-none');
                contactForm.reset();
                contactForm.classList.remove('was-validated');

                // Auto hide message after 6 seconds
                setTimeout(() => {
                    formSuccessAlert.classList.add('d-none');
                }, 6000);
            }, 1200);
        });
    }

    // 6. Testimonial Carousel Auto-cycle
    const carouselEl = document.querySelector('#testimonialCarousel');
    if (carouselEl && typeof bootstrap !== 'undefined') {
        new bootstrap.Carousel(carouselEl, {
            interval: 5000,
            wrap: true,
            touch: true
        });
    }
});

