document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // EDITABLE TEAM DATA (DATABASE)
    // Edit employee names, roles/details, and CSS image classes here.
    // ==========================================================================
    const TEAM_DATABASE = [
        { name: "Dr. Shahnewaz Alam Siam", details: "Junior Consultant", qualifications: "BDS (Northeast Medical College) | SMU", imgClass: "emp-img-1" },
        { name: "Dr. Umana Dorin", details: "Junior Consultant", qualifications: "BDS (Central Dental College) | SUST", imgClass: "emp-img-2" },
        
        { name: "Sumon Ahmed", details: "Dental Assistant", imgClass: "emp-img-3" },
        { name: "Ali Hussain", details: "Dental Assistant", imgClass: "emp-img-4" },
        { name: "MD. Shahed", details: "Receptionist", imgClass: "emp-img-5" }
    ];

    // ==========================================================================
    // Render Team Roster Grid dynamically
    // ==========================================================================
    const renderTeam = () => {
        const teamGrid = document.getElementById('teamGrid');
        if (!teamGrid) return;

        TEAM_DATABASE.forEach(member => {
            const memberElement = document.createElement('div');
            memberElement.className = 'team-member reveal transition-up';

            memberElement.innerHTML = `
                <div class="team-img-wrapper">
                    <div class="team-img ${member.imgClass}" role="img" aria-label="Portrait of ${member.name}"></div>
                </div>
                <h4 class="team-name">${member.name}</h4>
                <p class="team-details">${member.details}</p>
            `;

            teamGrid.appendChild(memberElement);
        });

        // Register new elements with the scroll reveal observer across script lifecycles safely
        const registerReveals = () => {
            const observer = window.revealObserver;
            if (observer) {
                const newReveals = teamGrid.querySelectorAll('.reveal');
                newReveals.forEach(el => observer.observe(el));
            } else {
                // Secondary check in case script.js initialization delays
                setTimeout(registerReveals, 100);
            }
        };
        registerReveals();
    };

    renderTeam();

    // ==========================================================================
    // 1. Specialized Services Accordion System
    // ==========================================================================
    const initServicesAccordion = () => {
        const accordionItems = document.querySelectorAll('.accordion-item');

        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const toggle = item.querySelector('.accordion-toggle');
            const content = item.querySelector('.accordion-content');

            if (!header || !content) return;

            const panelId = `accordion-panel-${Math.random().toString(36).substr(2, 9)}`;
            content.id = panelId;
            header.setAttribute('aria-controls', panelId);

            const togglePanel = (isActive) => {
                if (isActive) {
                    item.classList.remove('active');
                    header.setAttribute('aria-expanded', 'false');
                    content.style.maxHeight = '0';
                } else {
                    accordionItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                            otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
                            otherItem.querySelector('.accordion-content').style.maxHeight = '0';
                        }
                    });

                    item.classList.add('active');
                    header.setAttribute('aria-expanded', 'true');
                    content.style.maxHeight = `${content.scrollHeight}px`;
                }
            };

            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                togglePanel(isActive);
            });

            if (toggle) {
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isActive = item.classList.contains('active');
                    togglePanel(isActive);
                });
            }
        });
    };

    initServicesAccordion();

    // Throttled recalculation system on viewport boundary changes
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
