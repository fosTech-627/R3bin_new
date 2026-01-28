"use client"

import React, { useEffect, useRef } from 'react'
import { Navbar } from "@/components/landing/navbar"
import './team.css'
import Image from 'next/image'

export default function TeamPage() {
    const heroImageRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Hero image slide-up animation on scroll
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

        if (heroImageRef.current) {
            imageObserver.observe(heroImageRef.current);
        }

        // Accordion Functionality
        const accordions = document.querySelectorAll('.accordion-header');

        accordions.forEach(acc => {
            // Remove existing listeners to avoid duplicates if re-running
            const newAcc = acc.cloneNode(true) as HTMLElement;
            if (acc.parentNode) {
                acc.parentNode.replaceChild(newAcc, acc);
            }

            // Re-select and add listener
            newAcc.addEventListener('click', () => {
                const item = newAcc.parentElement as HTMLElement;
                const content = item.querySelector('.accordion-content') as HTMLElement;

                // Clear any inline styles that might interfere
                content.style.maxHeight = '';

                // Toggle current
                item.classList.toggle('active');

                // Close others
                document.querySelectorAll('.accordion-header').forEach((otherAcc) => {
                    if (otherAcc !== newAcc) {
                        const otherItem = otherAcc.parentElement as HTMLElement;
                        const otherContent = otherItem.querySelector('.accordion-content') as HTMLElement;

                        if (otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                            // Clear inline styles
                            otherContent.style.maxHeight = '';
                        }
                    }
                });
            });
        });

        // Simple fade-in animation on scroll
        const cards = document.querySelectorAll('.card, .bento-item');
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    (entry.target as HTMLElement).style.opacity = '1';
                    (entry.target as HTMLElement).style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => {
            (card as HTMLElement).style.opacity = '0';
            (card as HTMLElement).style.transform = 'translateY(20px)';
            (card as HTMLElement).style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            fadeObserver.observe(card);
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
                threshold: 0,
                rootMargin: "-45% 0px -45% 0px"
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

            const socialLinksData: any = {
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

            teamCards.forEach((card) => {
                const cardUpper = card.querySelector('.card-upper') as HTMLElement;
                const nameEl = card.querySelector('.card-lower h3') as HTMLElement;
                const name = nameEl ? nameEl.textContent?.trim() : "";
                const links = socialLinksData[name || ""] || { linkedin: "#", email: "#" };

                // Check if already injected
                if (cardUpper.querySelector('.active-shape')) return;

                // Inject Active Shape
                const activeShape = document.createElement('div');
                activeShape.className = 'active-shape';
                cardUpper.prepend(activeShape);

                // Inject Social Buttons
                const socialRow = document.createElement('div');
                socialRow.className = 'social-row';
                socialRow.innerHTML = `
                <button class="social-btn close-action-btn" aria-label="Close">${icons.close}</button>
                <a href="${links.linkedin}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="LinkedIn">${icons.linkedin}</a>
                <a href="${links.email}" class="social-btn" aria-label="Email">${icons.email}</a>
            `;
                cardUpper.appendChild(socialRow);

                // Event Listeners
                const plusBtn = card.querySelector('.plus-btn') as HTMLElement;
                const closeBtn = socialRow.querySelector('.close-action-btn') as HTMLElement;

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

            // Close when clicking outside
            const outsideClickListener = (e: MouseEvent) => {
                // @ts-ignore
                if (!e.target.closest('.team-card')) {
                    teamCards.forEach(c => c.classList.remove('active'));
                }
            }
            document.addEventListener('click', outsideClickListener);

            return () => {
                document.removeEventListener('click', outsideClickListener)
            }
        }
    }, [])

    return (
        <div className="about-page-wrapper">
            <Navbar />

            <main className="min-h-screen bg-[#050505]">
                <header className="about-hero">
                    <div className="about-hero-inner">
                        <h1>Hey There! Welcome to <br /> <span className="highlight-text">Fostride!</span></h1>
                    </div>
                </header>

                <section className="about-content">
                    <div className="about-grid">
                        <div className="about-left">
                            <h2>About our Company</h2>
                            <p>Let's get acquainted! At Fostride, we're passionate about sustainability and innovation. Our mission
                                is to redefine waste, transforming it into opportunities for a greener tomorrow. From AI-powered
                                solutions to grassroots initiatives, we're creating a cleaner planet—because sustainability isn't
                                just a goal, it's an exciting journey. Join us as we revolutionize waste management and build a
                                better future, one solution at a time.</p>
                        </div>
                        <div className="about-right">
                            <div className="accordion-item">
                                <button className="accordion-header">
                                    <span className="header-text">01. Our History</span>
                                    <div className="icon-box">
                                        <span className="icon">+</span>
                                    </div>
                                </button>
                                <div className="accordion-content">
                                    <p>Fostride began in 2022 as a simple yet ambitious idea for a school competition, driven by the
                                        vision of tackling one of the world's most pressing problems—waste management. What started
                                        as a small concept has now evolved into a determined effort to develop groundbreaking
                                        technology that focuses on waste sorting and conversion for a sustainable future.</p>
                                    <br />
                                    <p>Over the years, our journey has been marked by several achievements, including winning
                                        competitions and organizing impactful small-scale waste management drives. These milestones
                                        fueled our passion and commitment, prompting us to dedicate ourselves to extensive research
                                        and development.</p>
                                    <br />
                                    <p>In 2024, we made significant strides, directing our focus entirely on expanding our R&D
                                        capabilities to create more effective and eco-friendly solutions. Today, Fostride stands at
                                        the prototyping stage, working tirelessly to bring our vision to life and to deliver
                                        innovative technology that not only addresses waste but also protects and preserves our
                                        environment for generations to come.</p>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <button className="accordion-header">
                                    <span className="header-text">02. Our Mission</span>
                                    <div className="icon-box">
                                        <span className="icon">+</span>
                                    </div>
                                </button>
                                <div className="accordion-content">
                                    <p>To revolutionize waste management through innovative technology, fostering a circular economy
                                        that minimizes environmental impact and creates sustainable value. By connecting waste
                                        generators, recyclers, and upcyclers, we aim to empower communities, reduce pollution, and
                                        promote a cleaner, greener future for generations to come.</p>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <button className="accordion-header">
                                    <span className="header-text">03. Our Vision</span>
                                    <div className="icon-box">
                                        <span className="icon">+</span>
                                    </div>
                                </button>
                                <div className="accordion-content">
                                    <p>To lead the global transition toward a zero-waste future by transforming waste into
                                        opportunities, fostering sustainable practices, and creating a world where every resource is
                                        valued, reused, and repurposed for the benefit of people and the planet.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="founder-section">
                    <div className="founder-container">
                        <h2>Meet The Founder</h2>

                        <p className="founder-intro">
                            Gavi Kothari, the <span className="highlight">founder of Fostride</span>, is passionate about <span
                                className="highlight">leveraging technology</span> for <span
                                    className="highlight">sustainability</span>.
                            His <span className="highlight">innovative vision</span> and <span className="highlight">dedication</span>
                            drive
                            Fostride's mission to <span className="highlight">revolutionize waste management</span> and <span
                                className="highlight">create a greener future</span>.
                        </p>

                        <div className="founder-content-grid">
                            <div className="founder-image-wrapper">
                                <div className="founder-bg-circle"></div>
                                <img src="/images/team/founder.png" alt="Gavi Kothari" className="founder-img" />
                                <div className="founder-name-overlay">
                                    <span className="name-green">Gavi</span>
                                    <span className="name-white">KOTHARI</span>
                                </div>
                            </div>

                            <div className="founder-details">
                                <p className="founder-bio">
                                    Gavi Kothari is an accomplished professional who brings passion, innovation, and leadership
                                    to
                                    his endeavors. With a strong presence in the industry, Gavi has been instrumental in driving
                                    impactful initiatives. His expertise spans across various fields, combining technological
                                    innovation with sustainable practices to create value. Known for his strategic vision and
                                    dedication to excellence, Gavi has significantly influenced the trajectory of his projects,
                                    positioning himself as a respected figure and a mentor. His commitment to empowering teams
                                    and
                                    delivering exceptional results makes him a driving force in his domain.
                                </p>

                                <div className="founder-skills">
                                    <span className="skill-tag"><span className="icon">⌘</span> Visionary Thinker</span>
                                    <span className="skill-tag"><span className="icon">⌘</span> Empathetic Leader</span>
                                    <span className="skill-tag"><span className="icon">⌘</span> Creative Problem-Solver</span>
                                    <span className="skill-tag"><span className="icon">⌘</span> Passionate Mentor</span>
                                </div>

                                <div className="founder-socials-group">
                                    <p className="label">Socials:</p>
                                    <div className="buttons-row">
                                        <a href="https://in.linkedin.com/in/gavikothari" target="_blank" rel="noopener noreferrer"
                                            className="btn-pill green">LINKEDIN <span className="arrow">↗</span></a>
                                        <a href="https://www.instagram.com/gavi.kothari/" target="_blank" rel="noopener noreferrer"
                                            className="btn-pill green">INSTAGRAM <span className="arrow">↗</span></a>
                                        <a href="mailto:gavi@fostride.com" className="btn-pill green">MAIL <span
                                            className="arrow">↗</span></a>
                                    </div>
                                </div>

                                <div className="founder-featured-group">
                                    <p className="label">Featured In:</p>
                                    <div className="buttons-row">
                                        <a href="https://drive.google.com/file/d/1QTAlZHICLFw7WFB1zexor9qMtQkkkqPl/view?usp=sharing"
                                            target="_blank" rel="noopener noreferrer" className="btn-pill outline">THE HINDU IN SCHOOL</a>
                                        <a href="https://drive.google.com/file/d/1uQ9PFhs4yBvDeIlnDfK0SiUdbHSuVyU9/view?usp=sharing"
                                            target="_blank" rel="noopener noreferrer" className="btn-pill outline">GUIDING YOUNG MINDS</a>
                                        <a href="https://www.somaiya.edu/en/view-announcement/1018/" target="_blank" rel="noopener noreferrer"
                                            className="btn-pill outline">SOMAIYA UNIVERSITY</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="values-section">
                    <div className="values-layout">
                        <span className="values-huge">VA</span>
                        <div className="values-lens-container">
                            <div className="v-pill p1">⌘ Sustainability</div>
                            <div className="v-pill p2">⌘ Impact</div>
                            <div className="v-pill p3 dark">⌘ Positive Experience</div>
                            <div className="v-pill p4 dark">⌘ Trustworthiness</div>
                            <div className="v-pill p5 dark">⌘ Circularity</div>
                            <div className="v-pill p6">⌘ Innovation</div>
                            <div className="v-pill p7 dark">⌘ Collaboration</div>
                            <div className="v-pill p8 dark">⌘ Innovation</div>
                            <div className="v-pill p9">⌘ Integrity</div>
                            <div className="v-pill p10 dark">⌘ Reliability</div>
                            <div className="v-pill p11">⌘ Quality</div>
                        </div>
                        <span className="values-huge">UES</span>
                    </div>
                </section>

                <section className="process-section">
                    <div className="process-header">
                        <span className="process-tag">HOW WE WORK</span>
                        <h2 className="process-title">Our 4 Stage Process</h2>
                    </div>
                    <div className="process-timeline">
                        <div className="process-step">
                            <div className="step-left">
                                <div className="step-number">01</div>
                                <div className="step-line"></div>
                            </div>
                            <div className="step-card">
                                <span className="step-pill">STEP 01</span>
                                <h3>Data Collection & Analysis</h3>
                                <p>Our journey begins with understanding the waste problem at its roots. Using advanced
                                    data-gathering tools, we track waste generation patterns, identify key sources, and analyze
                                    its composition. This helps us create targeted and effective solutions for different types
                                    of waste streams.</p>
                            </div>
                        </div>
                        <div className="process-step">
                            <div className="step-left">
                                <div className="step-number">02</div>
                                <div className="step-line"></div>
                            </div>
                            <div className="step-card">
                                <span className="step-pill">STEP 02</span>
                                <h3>Smart Waste Sorting</h3>
                                <p>At the heart of our process lies AI-driven technology. We utilize intelligent algorithms and
                                    cutting-edge machines to sort waste into recyclable, reusable, and non-recyclable
                                    categories. This precision reduces contamination and ensures that each material is utilized
                                    to its fullest potential.</p>
                            </div>
                        </div>
                        <div className="process-step">
                            <div className="step-left">
                                <div className="step-number">03</div>
                                <div className="step-line"></div>
                            </div>
                            <div className="step-card">
                                <span className="step-pill">STEP 03</span>
                                <h3>Conversion & Recycling</h3>
                                <p>Once sorted, we focus on transforming waste into valuable resources. Through innovative
                                    recycling and upcycling methods, we convert discarded materials into eco-friendly products
                                    or energy sources. This ensures minimal waste goes to landfills, contributing to a circular
                                    economy.</p>
                            </div>
                        </div>
                        <div className="process-step">
                            <div className="step-left">
                                <div className="step-number">04</div>
                                <div className="step-line"></div>
                            </div>
                            <div className="step-card">
                                <span className="step-pill">STEP 04</span>
                                <h3>Impact Assessment & Expansion</h3>
                                <p>We believe in measurable change. After every project, we assess the environmental and
                                    economic impact of our efforts—tracking metrics like waste diverted from landfills and
                                    carbon footprint reduction. With this data, we refine our processes and scale our solutions
                                    to benefit more communities and industries globally.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="team-section">
                    <div className="team-header">
                        <span className="team-tag">TEAM MEMBERS</span>
                        <h2 className="team-title">Say Hello to Our<br />Squad</h2>
                        <p className="team-subtitle">Get ready to meet the faces behind the magic, the dreamers, the doers, and the
                            unstoppable force driving our success.</p>
                    </div>

                    <div className="team-grid">
                        <div className="team-card">
                            <div className="card-upper">
                                <div className="watermark-text">Strategic</div>
                                <div className="overlay-text">MARKETING GENIUS</div>
                                <div className="image-area">
                                    <img src="/images/team/piyush.png" alt="Piyush Tanwar" className="team-placeholder" />
                                </div>
                                <button className="plus-btn">+</button>
                            </div>
                            <div className="card-lower">
                                <h3>Piyush Tanwar</h3>
                                <span>Chief Marketing Officer</span>
                            </div>
                        </div>

                        <div className="team-card">
                            <div className="card-upper">
                                <div className="watermark-text">Practical</div>
                                <div className="overlay-text">INGENIUS STRATEGY</div>
                                <div className="image-area">
                                    <img src="/images/team/aryan.png" alt="Aryan Nair" className="team-placeholder" />
                                </div>
                                <button className="plus-btn">+</button>
                            </div>
                            <div className="card-lower">
                                <h3>Aryan Nair</h3>
                                <span>Chief Strategy Officer</span>
                            </div>
                        </div>

                        <div className="team-card">
                            <div className="card-upper">
                                <div className="watermark-text">Visionary</div>
                                <div className="overlay-text">DESIGN & DEVELOPER</div>
                                <div className="image-area">
                                    <img src="/images/team/gobind.png" alt="Gobind Singh" className="team-placeholder" />
                                </div>
                                <button className="plus-btn">+</button>
                            </div>
                            <div className="card-lower">
                                <h3>Gobind Singh</h3>
                                <span>R&D Head</span>
                            </div>
                        </div>

                        <div className="team-card">
                            <div className="card-upper">
                                <div className="watermark-text">Finance</div>
                                <div className="overlay-text">FINANCIAL FORECASTING</div>
                                <div className="image-area">
                                    <img src="/images/team/aryan_jain.png" alt="Aryan Jain" className="team-placeholder" />
                                </div>
                                <button className="plus-btn">+</button>
                            </div>
                            <div className="card-lower">
                                <h3>Aryan Jain</h3>
                                <span>Chief Financial Officer</span>
                            </div>
                        </div>

                        <div className="team-card">
                            <div className="card-upper">
                                <div className="watermark-text">Tech</div>
                                <div className="overlay-text">SPECIALIZED COMPUTING</div>
                                <div className="image-area">
                                    <img src="/images/team/mayank_verma.png" alt="Mayank Verma" className="team-placeholder" />
                                </div>
                                <button className="plus-btn">+</button>
                            </div>
                            <div className="card-lower">
                                <h3>Mayank Verma</h3>
                                <span>Chief Technology Officer</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="faq-section">
                    <div className="faq-header">
                        <span className="faq-tag">FREQUENTLY ASKED QUESTIONS</span>
                        <h2 className="faq-title">Got Questions?<br />We've Got Answers!</h2>
                    </div>

                    <div className="faq-container">
                        <div className="faq-item">
                            <div className="accordion-header">
                                <span>What is Fostride?</span>
                                <div className="icon-box"> <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                </svg></div>
                            </div>
                            <div className="accordion-content">
                                <p>Fostride is a sustainability-focused startup that leverages technology to revolutionize waste
                                    management. Our mission is to create a cleaner future by promoting recycling, upcycling, and
                                    waste-to-value initiatives.
                                </p>
                            </div>
                        </div>

                        <div className="faq-item">
                            <div className="accordion-header">
                                <span>How does Fostride work?</span>
                                <div className="icon-box"> <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                </svg></div>
                            </div>
                            <div className="accordion-content">
                                <p>Fostride connects individuals and businesses that generate waste with those who can recycle,
                                    repurpose, or upcycle it. Using AI-powered solutions, we track, analyze, and optimize waste
                                    management processes to ensure sustainability.
                                </p>
                            </div>
                        </div>

                        <div className="faq-item">
                            <div className="accordion-header">
                                <span>What phase is Fostride currently in?</span>
                                <div className="icon-box"> <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                </svg></div>
                            </div>
                            <div className="accordion-content">
                                <p>We are currently in the development and growth phase, focusing on refining our platform,
                                    onboarding partners, and expanding our reach in waste management ecosystems.
                                </p>
                            </div>
                        </div>
                        <div className="faq-item">
                            <div className="accordion-header">
                                <span>Who can join Fostride?</span>
                                <div className="icon-box"> <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                </svg></div>
                            </div>
                            <div className="accordion-content">
                                <p>Anyone can join Fostride! Whether you're a waste generator, recycler, environmental
                                    enthusiast, or an organization looking to manage waste sustainably, we have a role for you.
                                </p>
                            </div>
                        </div>
                        <div className="faq-item">
                            <div className="accordion-header">
                                <span>How can I get involved with Fostride?</span>
                                <div className="icon-box"> <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                </svg></div>
                            </div>
                            <div className="accordion-content">
                                <p>You can contribute by:
                                    - Registering as a waste generator or recycler on our platform.
                                    - Partnering with us for sustainable waste management initiatives.
                                    - Joining our team as a collaborator or volunteer.
                                </p>
                            </div>
                        </div>
                        <div className="faq-item">
                            <div className="accordion-header">
                                <span>What kind of waste does Fostride manage?</span>
                                <div className="icon-box"> <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                </svg></div>
                            </div>
                            <div className="accordion-content">
                                <p>Fostride manages a wide range of waste, including plastic, metal, organic waste, and e-waste.
                                    We focus on ensuring that every type of waste is handled responsibly and sustainably.
                                </p>
                            </div>
                        </div>
                        <div className="faq-item">
                            <div className="accordion-header">
                                <span>How does Fostride help the environment?</span>
                                <div className="icon-box"> <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                </svg></div>
                            </div>
                            <div className="accordion-content">
                                <p>By promoting recycling, upcycling, and reducing landfill usage, Fostride helps cut down
                                    pollution, conserve resources, and reduce the overall carbon footprint of waste management
                                    processes.
                                </p>
                            </div>
                        </div>
                        <div className="faq-item">
                            <div className="accordion-header">
                                <span>Is Fostride only for businesses, or can individuals join too?</span>
                                <div className="icon-box"> <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                </svg></div>
                            </div>
                            <div className="accordion-content">
                                <p>Fostride is open to both individuals and businesses. Whether you're an individual looking to
                                    responsibly dispose of waste or a business aiming to implement sustainable practices, we’ve
                                    got you covered.
                                </p>
                            </div>
                        </div>
                        <div className="faq-item">
                            <div className="accordion-header">
                                <span>How do I track the waste I contribute or recycle through Fostride?</span>
                                <div className="icon-box"> <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                </svg></div>
                            </div>
                            <div className="accordion-content">
                                <p>Our platform provides real-time analytics and dashboards to help you track the waste you
                                    generate, recycle, or repurpose. You'll see how your efforts are making a tangible impact on
                                    the environment.
                                </p>
                            </div>
                        </div>
                        <div className="faq-item">
                            <div className="accordion-header">
                                <span>Does Fostride offer partnerships or collaborations?</span>
                                <div className="icon-box"> <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                </svg></div>
                            </div>
                            <div className="accordion-content">
                                <p>Yes, we actively seek partnerships with businesses, NGOs, government organizations, and
                                    individuals to expand our waste management efforts and create innovative solutions.
                                </p>
                            </div>
                        </div>
                        <div className="faq-item">
                            <div className="accordion-header">
                                <span>Can I invest in Fostride?</span>
                                <div className="icon-box"> <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                </svg></div>
                            </div>
                            <div className="accordion-content">
                                <p>We welcome investors who believe in our vision of sustainable waste management. For more
                                    details, feel free to contact us through our website.
                                </p>
                            </div>
                        </div>
                        <div className="faq-item">
                            <div className="accordion-header">
                                <span>How can I contact the Fostride team?</span>
                                <div className="icon-box"> <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                </svg></div>
                            </div>
                            <div className="accordion-content">
                                <p>You can reach out to us via email at fostride@gmail.com. We would be happy to answer your
                                    questions.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="about-footer">
                    <div className="footer-top-container">
                        <div className="footer-contact-column">
                            <div className="footer-contact-card">
                                <div className="footer-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                        strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z">
                                        </path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                </div>
                                <span>fostride@gmail.com</span>
                            </div>

                            <div className="footer-contact-card">
                                <div className="footer-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                        strokeLinecap="round" strokeLinejoin="round">
                                        <path
                                            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z">
                                        </path>
                                    </svg>
                                </div>
                                <span>+91 9818801050</span>
                            </div>

                            <div className="footer-contact-card">
                                <div className="footer-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                        strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                </div>
                                <span>Mumbai</span>
                            </div>
                        </div>

                        <div className="footer-links-column">
                            <div className="footer-link-group">
                                <h4>Menu</h4>
                                <a>Home</a>
                                <a>About</a>
                                <a>Services</a>
                                <a>Projects</a>
                                <a>Blog</a>
                                <a>Contact</a>
                            </div>

                            <div className="footer-link-group">
                                <h4>Services</h4>
                                <a>AI-Powered Waste Sorting</a>
                                <a>Sustainable Waste Conversion</a>
                                <a>Sustainability Workshops</a>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom-container">
                        <div className="footer-socials">
                            <span className="follow-text">Follow us:</span>
                            <div className="social-icons-footer">
                                <a href="https://www.linkedin.com/company/fostride" target="_blank" rel="noopener noreferrer" className="social-btn-footer"
                                    aria-label="LinkedIn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path
                                            d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z">
                                        </path>
                                        <rect x="2" y="9" width="4" height="12"></rect>
                                        <circle cx="4" cy="4" r="2"></circle>
                                    </svg>
                                </a>
                                <a href="https://www.instagram.com/fostride/" target="_blank" rel="noopener noreferrer" className="social-btn-footer"
                                    aria-label="Instagram">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div className="footer-copyright">
                            &copy; Copyright 2026 <span className="green-text">Fostride</span>. All rights reserved.
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    )
}
