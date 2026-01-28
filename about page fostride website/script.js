document.addEventListener('DOMContentLoaded', () => {
    // Hero image slide-up animation on scroll
    const heroImageContainer = document.querySelector('.hero-image-container');

    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-up');
                imageObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (heroImageContainer) {
        imageObserver.observe(heroImageContainer);
    }

    // Accordion Functionality
    const accordions = document.querySelectorAll('.accordion-header');

    accordions.forEach(acc => {
        acc.addEventListener('click', () => {
            const item = acc.parentElement;
            const content = item.querySelector('.accordion-content');

            // Clear any inline styles that might interfere
            content.style.maxHeight = null;

            // Toggle current
            item.classList.toggle('active');

            // Close others
            accordions.forEach(otherAcc => {
                if (otherAcc !== acc) {
                    const otherItem = otherAcc.parentElement;
                    const otherContent = otherItem.querySelector('.accordion-content');

                    if (otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        // Clear inline styles
                        otherContent.style.maxHeight = null;
                        // Don't need to reset icon text since we use CSS rotation on '+'
                    }
                }
            });
        });
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Simple fade-in animation on scroll
    const cards = document.querySelectorAll('.card, .bento-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Process Step Slide-Up Animation
    const processSteps = document.querySelectorAll('.process-step');

    if (processSteps.length > 0) {
        const stepObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, {
            threshold: 0, // Trigger as soon as it enters the narrow center band
            rootMargin: "-45% 0px -45% 0px" // Only detect matching in the middle 10% of screen
        });

        processSteps.forEach(step => {
            stepObserver.observe(step);
        });
    }
    // Team Card Interactions
    const teamCards = document.querySelectorAll('.team-card');

    if (teamCards.length > 0) {
        // SVG Icons
        const icons = {
            close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
            linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`,
            email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`
        };

        const socialLinksData = {
            "Piyush Tanwar": {
                linkedin: "https://www.linkedin.com/",
                email: "mailto:fostride@gmail.com"
            },
            "Aryan Nair": {
                linkedin: "https://www.linkedin.com/in/aryan-nair-b70248317/",
                email: "mailto:fostride@gmail.com"
            },
            "Gobind Singh": {
                linkedin: "https://www.linkedin.com/in/gobind-singh-75301a278/",
                email: "mailto:fostride@gmail.com"
            },
            "Aryan Jain": {
                linkedin: "https://www.linkedin.com/in/aryan-jain-4357241b9/",
                email: "mailto:fostride@gmail.com"
            },
            "Mayank Verma": {
                linkedin: "https://www.linkedin.com/in/mayank-verma-3a459b306/",
                email: "mailto:tech@fostride.com"
            }
        };

        teamCards.forEach(card => {
            const cardUpper = card.querySelector('.card-upper');
            const name = card.querySelector('.card-lower h3').textContent.trim();
            const links = socialLinksData[name] || { linkedin: "#", email: "#" };

            // Inject Active Shape behind image (prepend)
            const activeShape = document.createElement('div');
            activeShape.className = 'active-shape';
            cardUpper.prepend(activeShape);

            // Inject Social Buttons (append)
            const socialRow = document.createElement('div');
            socialRow.className = 'social-row';
            socialRow.innerHTML = `
                <button class="social-btn close-action-btn" aria-label="Close">${icons.close}</button>
                <a href="${links.linkedin}" target="_blank" class="social-btn" aria-label="LinkedIn">${icons.linkedin}</a>
                <a href="${links.email}" class="social-btn" aria-label="Email">${icons.email}</a>
            `;
            cardUpper.appendChild(socialRow);

            // Event Listeners
            const plusBtn = card.querySelector('.plus-btn');
            const closeBtn = socialRow.querySelector('.close-action-btn');

            plusBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close others
                teamCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });

            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                card.classList.remove('active');
            });
        });

        // Close when clicking outside? Optional but nice.
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.team-card')) {
                teamCards.forEach(c => c.classList.remove('active'));
            }
        });
    }
});
