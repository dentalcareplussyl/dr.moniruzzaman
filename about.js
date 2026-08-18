document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // EDITABLE TEAM DATA (DATABASE)
    // ==========================================================================
    const TEAM_DATABASE = [
        { 
            name: "Dr. Shahnewaz Alam Siam", 
            role: "Junior Consultant", 
            qualifications: "BDS (Northeast Medical College) | SMU", 
            imgClass: "emp-img-1" 
        },
        { 
            name: "Dr. Umana Dorin", 
            role: "Junior Consultant", 
            qualifications: "BDS (Central Dental College) | SUST", 
            imgClass: "emp-img-2" 
        },
        { 
            name: "Sumon Ahmed", 
            role: "Dental Assistant", 
            imgClass: "emp-img-3" 
        },
        { 
            name: "Ali Hussain", 
            role: "Dental Assistant", 
            imgClass: "emp-img-4" 
        },
        { 
            name: "MD. Shahed", 
            role: "Receptionist", 
            imgClass: "emp-img-5" 
        }
    ];

    // ==========================================================================
    // Render Team Roster Grid dynamically
    // ==========================================================================
    const renderTeam = () => {
        const teamGrid = document.getElementById('teamGrid');
        if (!teamGrid) return;

        TEAM_DATABASE.forEach(member => {
            const memberElement = document.createElement('div');
            const isDoctor = member.role.toLowerCase().includes("consultant");
            memberElement.className = `team-member ${isDoctor ? 'role-doctor' : 'role-staff'} reveal transition-up`;

            memberElement.innerHTML = `
                <div class="team-img-wrapper">
                    <div class="team-img ${member.imgClass}" role="img" aria-label="Portrait of ${member.name}"></div>
                </div>
                <h4 class="team-name">${member.name}</h4>
                <p class="team-details">${member.role}</p>
                ${member.qualifications ? `<p class="team-qualifications">${member.qualifications}</p>` : ''}
            `;

            teamGrid.appendChild(memberElement);
        });

        // Safe register observer to avoid race conditions with script.js initialization
        const registerReveals = () => {
            const observer = window.revealObserver;
            const newReveals = teamGrid.querySelectorAll('.reveal');

            if (observer) {
                newReveals.forEach(el => observer.observe(el));
            } else if ('IntersectionObserver' in window) {
                // Instantly spin up a local observer if global observer is missing/delayed
                const fallbackObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('active');
                            fallbackObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });
                newReveals.forEach(el => fallbackObserver.observe(el));
            } else {
                // Secondary check/fallback if older browser engine doesn't support observer
                newReveals.forEach(el => el.classList.add('active'));
            }
        };
        registerReveals();
    };

    renderTeam();

    // ==========================================================================
    // Specialized Services Accordion System
    // ==========================================================================
    const initServicesAccordion = () => {
        const accordionItems = document.querySelectorAll('.accordion-item');

        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');

            if (!header || !content) return;

            const panelId = `accordion-panel-${Math.random().toString(36).substring(2, 11)}`;
            content.id = panelId;
            header.setAttribute('aria-controls', panelId);

            const togglePanel = (isActive) => {
                if (isActive) {
                    item.classList.remove('active');
                    header.setAttribute('aria-expanded', 'false');
                    content.style.maxHeight = '0';
                } else {
                    // Close other active accordion panels
                    accordionItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                            const otherHeader = otherItem.querySelector('.accordion-header');
                            const otherContent = otherItem.querySelector('.accordion-content');
                            
                            if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
                            if (otherContent) otherContent.style.maxHeight = '0';
                        }
                    });

                    item.classList.add('active');
                    header.setAttribute('aria-expanded', 'true');
                    content.style.maxHeight = `${content.scrollHeight}px`;
                }
            };

            header.addEventListener('click', (e) => {
                e.preventDefault();
                const isActive = item.classList.contains('active');
                togglePanel(isActive);
            });
        });
    };

    initServicesAccordion();

    // Dynamic height recalculation system on viewport boundary changes
    let resizeTimeout;
    window.addEventListener('resize', () => {
        if (!resizeTimeout) {
            resizeTimeout = setTimeout(() => {
                resizeTimeout = null;
                requestAnimationFrame(() => {
                    const activeItem = document.querySelector('.accordion-item.active');
                    if (activeItem) {
                        const activeContent = activeItem.querySelector('.accordion-content');
                        if (activeContent) {
                            activeContent.style.maxHeight = `${activeContent.scrollHeight}px`;
                        }
                    }
                });
            }, 100);
        }
    });
});
