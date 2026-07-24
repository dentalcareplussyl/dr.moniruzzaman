/**
 * Dr. Moniruzzaman Website Design System (about.js)
 * Page-specific interactions for about.html
 */

document.addEventListener('DOMContentLoaded', () => {

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

            // Generate structural IDs for accessibility parameters
            const panelId = `accordion-panel-${Math.random().toString(36).substr(2, 9)}`;
            content.id = panelId;
            header.setAttribute('aria-controls', panelId);

            const togglePanel = (isActive) => {
                if (isActive) {
                    item.classList.remove('active');
                    header.setAttribute('aria-expanded', 'false');
                    content.style.maxHeight = '0';
                } else {
                    // Close other active panels
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
                    e.stopPropagation(); // Avoid double execution from header click propagation
                    const isActive = item.classList.contains('active');
                    togglePanel(isActive);
                });
            }
        });
    };

    // Initialize components
    initServicesAccordion();
});