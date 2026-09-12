/**
 * KOSPY.SITE — Main Interactive Script
 * Provides live search, tag filtering, dynamic counters, and UI enhancements.
 */

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements Selection
    const searchInput = document.getElementById('gameSearchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const gameCards = document.querySelectorAll('.game-card');
    const gamesCount = document.getElementById('gamesCount');
    const noResultsBox = document.getElementById('noResults');
    const resetSearchBtn = document.getElementById('resetSearchBtn');
    const tagButtons = document.querySelectorAll('.tag-btn');
    const currentYearEl = document.getElementById('currentYear');

    // Update Footer Copyright Year Dynamically
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    /**
     * Helper: Normalize Arabic text for accurate matching
     * Converts variations of Alif, Ta Marbuta, Ha, etc.
     */
    function normalizeArabicText(text) {
        if (!text) return '';
        return text
            .toLowerCase()
            .replace(/[أإآ]/g, 'ا')
            .replace(/ة/g, 'ه')
            .replace(/ى/g, 'ي')
            .replace(/[\u064B-\u0652]/g, '') // Remove Arabic Tashkeel
            .trim();
    }

    /**
     * Filter Game Cards based on Search Term
     */
    function filterGames(query = '') {
        const normalizedQuery = normalizeArabicText(query);
        let visibleCount = 0;

        gameCards.forEach(card => {
            const rawTitle = card.getAttribute('data-title') || '';
            const cardText = card.textContent || '';
            const normalizedCardContent = normalizeArabicText(rawTitle + ' ' + cardText);

            if (normalizedQuery === '' || normalizedCardContent.includes(normalizedQuery)) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Update Counter Display
        if (gamesCount) {
            gamesCount.textContent = visibleCount;
        }

        // Toggle No Results Box
        if (noResultsBox) {
            if (visibleCount === 0) {
                noResultsBox.hidden = false;
            } else {
                noResultsBox.hidden = true;
            }
        }

        // Toggle Clear Button Visibility
        if (clearSearchBtn) {
            clearSearchBtn.hidden = (query.trim() === '');
        }
    }

    // Input Event Listener for Live Search
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterGames(e.target.value);
        });
    }

    // Clear Search Input Handler
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
            }
            filterGames('');
        });
    }

    // Reset Search Handler from No Results Box
    if (resetSearchBtn) {
        resetSearchBtn.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
            }
            filterGames('');
        });
    }

    // Quick Filter Tags Click Handler
    tagButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tagSearch = button.getAttribute('data-search') || '';
            if (searchInput) {
                searchInput.value = tagSearch;
                searchInput.focus();
            }
            filterGames(tagSearch);
        });
    });

    // Smooth Scrolling for Internal Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
