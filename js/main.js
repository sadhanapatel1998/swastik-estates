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

        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
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

    // 5. WhatsApp Integration with Strong Validation for CONTACT US Form (Target: 919999226744)
    const contactForm = document.getElementById('contactForm');
    const formSuccessAlert = document.getElementById('formSuccessAlert');
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    const messageInput = document.getElementById('messageInput');
    const nameGroup = document.getElementById('nameGroup');
    const emailGroup = document.getElementById('emailGroup');
    const nameFeedback = document.getElementById('nameFeedback');
    const emailFeedback = document.getElementById('emailFeedback');
    const messageFeedback = document.getElementById('messageFeedback');
    const submitBtn = document.getElementById('submitBtn');

    // Target WhatsApp Number specified
    const WHATSAPP_PHONE = '919999226744';

    function setFieldError(inputEl, containerEl, feedbackEl, message) {
        if (containerEl) {
            containerEl.classList.remove('is-valid');
            containerEl.classList.add('is-invalid');
        } else if (inputEl) {
            inputEl.classList.remove('is-valid');
            inputEl.classList.add('is-invalid');
        }
        if (feedbackEl) {
            feedbackEl.textContent = message;
            feedbackEl.classList.add('d-block');
        }
    }

    function setFieldSuccess(inputEl, containerEl, feedbackEl) {
        if (containerEl) {
            containerEl.classList.remove('is-invalid');
            containerEl.classList.add('is-valid');
        } else if (inputEl) {
            inputEl.classList.remove('is-invalid');
            inputEl.classList.add('is-valid');
        }
        if (feedbackEl) {
            feedbackEl.textContent = '';
            feedbackEl.classList.remove('d-block');
        }
    }

    function validateName() {
        if (!nameInput) return false;
        const val = nameInput.value.trim();
        // 2 to 60 characters, only letters, spaces, hyphens, dots
        const nameRegex = /^[a-zA-Z\u00C0-\u017F\s.'-]{2,60}$/;
        
        if (val === '') {
            setFieldError(nameInput, nameGroup, nameFeedback, 'Please enter your name.');
            return false;
        } else if (val.length < 2) {
            setFieldError(nameInput, nameGroup, nameFeedback, 'Name must be at least 2 characters long.');
            return false;
        } else if (!nameRegex.test(val)) {
            setFieldError(nameInput, nameGroup, nameFeedback, 'Please enter a valid name (letters & spaces only).');
            return false;
        }
        setFieldSuccess(nameInput, nameGroup, nameFeedback);
        return true;
    }

    function validateEmail() {
        if (!emailInput) return false;
        const val = emailInput.value.trim();
        // RFC compatible email pattern
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
        
        if (val === '') {
            setFieldError(emailInput, emailGroup, emailFeedback, 'Please enter your email address.');
            return false;
        } else if (!emailRegex.test(val) || val.indexOf('..') !== -1) {
            setFieldError(emailInput, emailGroup, emailFeedback, 'Please enter a valid email address (e.g. name@example.com).');
            return false;
        }
        setFieldSuccess(emailInput, emailGroup, emailFeedback);
        return true;
    }

    function validateMessage() {
        if (!messageInput) return false;
        const val = messageInput.value.trim();
        
        if (val === '') {
            setFieldError(messageInput, null, messageFeedback, 'Please enter your message or enquiry.');
            return false;
        } else if (val.length < 10) {
            setFieldError(messageInput, null, messageFeedback, 'Message must be at least 10 characters long.');
            return false;
        } else if (val.length > 1000) {
            setFieldError(messageInput, null, messageFeedback, 'Message must not exceed 1000 characters.');
            return false;
        }
        setFieldSuccess(messageInput, null, messageFeedback);
        return true;
    }

    // Attach real-time validation listeners
    if (nameInput) {
        nameInput.addEventListener('input', () => { if (nameGroup && nameGroup.classList.contains('is-invalid')) validateName(); });
        nameInput.addEventListener('blur', validateName);
    }
    if (emailInput) {
        emailInput.addEventListener('input', () => { if (emailGroup && emailGroup.classList.contains('is-invalid')) validateEmail(); });
        emailInput.addEventListener('blur', validateEmail);
    }
    if (messageInput) {
        messageInput.addEventListener('input', () => { if (messageInput.classList.contains('is-invalid')) validateMessage(); });
        messageInput.addEventListener('blur', validateMessage);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Run strong validations
            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isMessageValid = validateMessage();

            if (!isNameValid || !isEmailValid || !isMessageValid) {
                // Auto-focus the first invalid field
                if (!isNameValid && nameInput) nameInput.focus();
                else if (!isEmailValid && emailInput) emailInput.focus();
                else if (!isMessageValid && messageInput) messageInput.focus();
                return;
            }

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();

            // Build formatted WhatsApp message
            const waMessage = 
`*New Property Enquiry - Swastik Estates*

*Name:* ${name}
*Email:* ${email}
*Message / Query:*
${message}

---
_Sent via Swastik Estates Website_`;

            const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(waMessage)}`;

            // Visual feedback on submit button
            const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '<i class="fab fa-whatsapp me-2"></i> Submit';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Opening WhatsApp...';
            }

            if (formSuccessAlert) {
                formSuccessAlert.classList.remove('d-none');
            }

            // Open WhatsApp in new tab
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHtml;
                }

                // Reset form fields and validation styles
                contactForm.reset();
                if (nameGroup) nameGroup.classList.remove('is-valid', 'is-invalid');
                if (emailGroup) emailGroup.classList.remove('is-valid', 'is-invalid');
                if (messageInput) messageInput.classList.remove('is-valid', 'is-invalid');

                // Auto-hide success message after 7 seconds
                setTimeout(() => {
                    if (formSuccessAlert) formSuccessAlert.classList.add('d-none');
                }, 7000);
            }, 600);
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

