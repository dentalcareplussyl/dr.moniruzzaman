document.documentElement.classList.add('js-enabled');

// Instantly reset odometer numbers to 0 on load to prevent visual flashing before animation starts
document.querySelectorAll('.odometer').forEach(odometer => {
    odometer.textContent = "0";
});

document.addEventListener('DOMContentLoaded', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ==========================================================================
    // 0. Smooth Scroll Engine (Lenis) Integration
    // ==========================================================================
    let lenis;
    const isDesktop = window.innerWidth >= 1025;

    if (!reducedMotion && isDesktop) {
        const LenisClass = window.Lenis || window.lenis;
        if (typeof LenisClass !== "undefined") {
            lenis = new LenisClass({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                direction: 'vertical',
                gestureDirection: 'vertical',
                smoothMultiplier: 1.0,
                smoothTouch: false,
                infinite: false,
            });

            if (typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined") {
                lenis.on('scroll', window.ScrollTrigger.update);
                window.gsap.ticker.add((time) => {
                    lenis.raf(time * 1000);
                });
                window.gsap.ticker.lagSmoothing(0);
            } else {
                const raf = (time) => {
                    lenis.raf(time);
                    requestAnimationFrame(raf);
                };
                requestAnimationFrame(raf);
            }
        }
    }

    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        if (reducedMotion) {
            heroVideo.pause();
        } else {
            const heroVideoObserver = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    heroVideo.play().catch(() => { });
                } else {
                    heroVideo.pause();
                }
            }, { threshold: 0.1 });
            heroVideoObserver.observe(heroVideo);
        }
    }

    // ==========================================================================
    // 1. Dynamic Header Navigation scrolling transitions
    // ==========================================================================
    const header = document.querySelector('.site-header');
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeaderClasses = () => {
        const currentScrollY = window.scrollY;
        const isMenuOpen = header ? header.classList.contains('nav-open') : false;

        if (header) {
            if (currentScrollY > 50 || isMenuOpen) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            if (window.innerWidth > 1024 && currentScrollY > lastScrollY && currentScrollY > 150 && !isMenuOpen) {
                header.style.transform = 'translateY(-110%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
        lastScrollY = Math.max(0, currentScrollY);
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeaderClasses);
            ticking = true;
        }
    }, { passive: true });

    // ==========================================================================
    // 2. Mobile Nav Toggle Handling
    // ==========================================================================
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const siteHeader = document.querySelector('.site-header');
    const mainNav = document.getElementById('mainNav');
    const menuLinks = document.querySelectorAll('.nav-link, .phone-btn');

    if (menuToggle && siteHeader) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            siteHeader.classList.toggle('nav-open');
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
            updateHeaderClasses();
        });
    }

    document.addEventListener('keydown', (event) => {
        if (!siteHeader) return;
        const isMenuOpen = siteHeader.classList.contains('nav-open');

        if (event.key === 'Escape' && isMenuOpen) {
            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.focus();
            }
            siteHeader.classList.remove('nav-open');
            document.body.style.overflow = '';
            updateHeaderClasses();
        }
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (siteHeader && siteHeader.classList.contains('nav-open')) {
                if (menuToggle) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
                siteHeader.classList.remove('nav-open');
                document.body.style.overflow = '';
                updateHeaderClasses();
            }
        });
    });

// ==========================================================================
    // 3. Cinematic Frame Parallax Engine (Polished for Precision Alignment)
    // ==========================================================================
    const parallaxTargets = document.querySelectorAll(".parallax-target");
    let parallaxFrameId = null;

    // Helper function to safely calculate absolute offset relative to the document
    const getDocumentOffsetTop = (element) => {
        let offsetTop = 0;
        let el = element;
        while (el) {
            offsetTop += el.offsetTop;
            el = el.offsetParent;
        }
        return offsetTop;
    };

    const handleParallax = () => {
        if (reducedMotion || window.innerWidth < 1025) return;
        const scrollPos = window.scrollY;
        const viewportHeight = window.innerHeight;

        parallaxTargets.forEach(target => {
            const rect = target.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < viewportHeight) {
                const speed = parseFloat(target.getAttribute('data-speed')) || 0.05;
                // Use absolute document-relative Y offset instead of local offsetTop
                const absoluteTop = getDocumentOffsetTop(target);
                const offset = (scrollPos - (absoluteTop - viewportHeight)) * speed;
                target.style.transform = `translate3d(0, ${offset}px, 0)`;
            }
        });
        parallaxFrameId = null;
    };

    window.addEventListener("scroll", () => {
        if (!parallaxFrameId) {
            parallaxFrameId = requestAnimationFrame(handleParallax);
        }
    }, { passive: true });

    // Forces recalculation once all page assets (images, layouts) are fully loaded
    window.addEventListener("load", () => {
        handleParallax();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth < 1025) {
            parallaxTargets.forEach(target => {
                target.style.transform = '';
            });
        } else {
            handleParallax();
        }
    }, { passive: true });

    // ==========================================================================
    // 4. Dynamic Counter (Odometer effect with clean memory reset loops)
    // ==========================================================================
    const runOdometerAnimation = (element) => {
        const target = parseFloat(element.getAttribute('data-target'));
        if (isNaN(target)) return;
        const decimals = parseInt(element.getAttribute('data-decimal')) || 0;
        const duration = 1500;
        const startTime = performance.now();

        const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            const currentVal = easeProgress * target;

            element.textContent = currentVal.toFixed(decimals);

            if (progress < 1) {
                element.dataset.rafId = requestAnimationFrame(updateCount);
            } else {
                element.textContent = target.toFixed(decimals);
            }
        };
        element.dataset.rafId = requestAnimationFrame(updateCount);
    };

    // ==========================================================================
    // 5. Bidirectional Scroll Reveal Observer
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal');

    const initializeRevealObserver = () => {
        if (typeof IntersectionObserver === "undefined") {
            // Legacy fallbacks
            revealElements.forEach(element => {
                element.classList.add('active');
                const odometers = element.querySelectorAll('.odometer');
                odometers.forEach(odometer => {
                    const target = odometer.getAttribute('data-target');
                    const decimals = parseInt(odometer.getAttribute('data-decimal')) || 0;
                    if (target) odometer.textContent = parseFloat(target).toFixed(decimals);
                });
            });
            return;
        }

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                if (entry.isIntersecting) {
                    element.classList.add('active');

                    const odometers = element.querySelectorAll('.odometer');
                    odometers.forEach(odometer => {
                        if (!odometer.classList.contains('counted')) {
                            odometer.classList.add('counted');
                            runOdometerAnimation(odometer);
                        }
                    });
                } else {
                    element.classList.remove('active');
                    const odometers = element.querySelectorAll('.odometer');
                    odometers.forEach(odometer => {
                        odometer.classList.remove('counted');
                        if (odometer.dataset.rafId) {
                            cancelAnimationFrame(parseInt(odometer.dataset.rafId, 10));
                        }
                        odometer.textContent = "0"; // Force recount when scrolled back into viewport
                    });
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px -20px 0px'
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

        // Expose globally to handle dynamic content loads
        window.revealObserver = revealObserver;
    };

    initializeRevealObserver();

    // ==========================================================================
    // 6. Modern GSAP Pin Scroll & Dynamic Mobile Drag Before/After Comparison
    // ==========================================================================
    const initBeforeAfterComparison = () => {
        const section = document.getElementById('smile-transformation');
        const comparisonSlider = document.getElementById('comparisonSlider');
        const afterImgWrapper = document.getElementById('afterImgWrapper');
        const sliderHandle = document.getElementById('sliderHandle');
        const comparisonRange = document.getElementById('comparisonRange');

        if (!section || !comparisonSlider || !afterImgWrapper || !sliderHandle) return;

        const updatePosition = (percentage) => {
            const clipPercentage = 100 - percentage;
            afterImgWrapper.style.clipPath = `inset(0 ${clipPercentage}% 0 0)`;
            sliderHandle.style.left = `${percentage}%`;
            if (comparisonRange && Number(comparisonRange.value) !== percentage) {
                comparisonRange.value = percentage;
            }
        };

        if (comparisonRange) {
            comparisonRange.addEventListener('input', (e) => {
                if (window.innerWidth < 992) {
                    updatePosition(Number(e.target.value));
                }
            });
        }

        // Standard GSAP pin scroll active on larger layout displays
        if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
            gsap.registerPlugin(ScrollTrigger);
            let mm = gsap.matchMedia();

            mm.add("(min-width: 992px)", () => {
                updatePosition(0);
                comparisonSlider.style.cursor = 'default';

                ScrollTrigger.create({
                    trigger: "#smile-transformation",
                    start: "top top",
                    end: "+=150%",
                    pin: true,
                    scrub: 0.5,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        const progressPercent = self.progress * 100;
                        updatePosition(progressPercent);

                        if (self.progress > 0.02 && self.progress < 0.98) {
                            section.classList.add('active-scroll');
                        } else {
                            section.classList.remove('active-scroll');
                        }
                    }
                });

                return () => {
                    section.classList.remove('active-scroll');
                    updatePosition(50);
                };
            });

            mm.add("(max-width: 991px)", () => {
                comparisonSlider.style.cursor = 'ew-resize';
                updatePosition(50);
                section.classList.remove('active-scroll');
            });
        }
    };

    initBeforeAfterComparison();

    // ==========================================================================
    // 7. Reusable Accordion Interface (FAQ)
    // ==========================================================================
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach((trigger, index) => {
        const content = trigger.nextElementSibling;
        if (content) {
            const contentId = `faq-answer-${index + 1}`;
            content.id = contentId;
            trigger.setAttribute('aria-controls', contentId);
            content.setAttribute('aria-hidden', 'true');
        }
        trigger.addEventListener('click', () => {
            const currentItem = trigger.closest('.faq-item');
            if (!currentItem) return;
            const isActive = currentItem.classList.contains('active');

            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                const itemTrigger = item.querySelector('.faq-trigger');
                const itemContent = item.querySelector('.faq-content');
                if (itemTrigger) itemTrigger.setAttribute('aria-expanded', 'false');
                if (itemContent) itemContent.setAttribute('aria-hidden', 'true');
            });

            if (!isActive) {
                currentItem.classList.add('active');
                trigger.setAttribute('aria-expanded', 'true');
                const currentContent = currentItem.querySelector('.faq-content');
                if (currentContent) currentContent.setAttribute('aria-hidden', 'false');
            }
        });
    });

    // ==========================================================================
    // 8. Active Navigation Underline Scroll Mapping
    // ==========================================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const activeNavigationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                if (!id) return;

                navLinks.forEach(link => {
                    const dataSection = link.getAttribute('data-section');
                    if (dataSection) {
                        const normalizedSection = dataSection.toLowerCase();
                        const normalizedId = id.toLowerCase();

                        if (normalizedSection === normalizedId || (normalizedSection === 'find-us' && normalizedId === 'location')) {
                            link.classList.add('active-link');
                        } else {
                            link.classList.remove('active-link');
                        }
                    }
                });
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '-20% 0px -40% 0px'
    });

    sections.forEach(section => {
        activeNavigationObserver.observe(section);
    });

    // ==========================================================================
    // 9. Back To Top Dynamics & Smooth Anchor Clicks
    // ==========================================================================
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (lenis) {
                lenis.scrollTo(0, { duration: 1.0 });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                if (lenis) {
                    lenis.scrollTo(targetElement, { duration: 1.0, offset: -70 });
                } else {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // ==========================================================================
    // 10. Form submission listener bypasses safely on replaced CTA layouts
    // ==========================================================================
    const appointmentForm = document.getElementById('appointmentForm');
    const appointmentStatus = document.getElementById('appointmentStatus');
    if (appointmentForm && appointmentStatus) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }
});
