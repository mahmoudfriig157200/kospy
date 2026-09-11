
        (function() {
            // ===== بيانات الألعاب =====
            const games = [
                { id:1, title: "لغز الأرقام", category: "ألغاز", description: "تحدى عقلك وحل الألغاز.", image: "https://picsum.photos/seed/gameA/400/225", link: "game1.html" },
                { id:2, title: "سباق الفورمولا", category: "سباقات", description: "سباقات سريعة ومثيرة.", image: "https://picsum.photos/seed/gameB/400/225", link: "game2.html" },
                { id:3, title: "مغامرات الزومبي", category: "مغامرات", description: "نجو من الزومبي في عالم مفتوح.", image: "https://picsum.photos/seed/gameC/400/225", link: "game3.html" },
                { id:4, title: "كرة السلة 3D", category: "رياضة", description: "سجل الأهداف في مباريات حماسية.", image: "https://picsum.photos/seed/gameD/400/225", link: "game4.html" },
                { id:5, title: "تحدي الذاكرة", category: "ألغاز", description: "اختبر ذاكرتك مع البطاقات.", image: "https://picsum.photos/seed/gameE/400/225", link: "game5.html" },
                { id:6, title: "سباق الدراجات", category: "سباقات", description: "تسابق في شوارع المدينة.", image: "https://picsum.photos/seed/gameF/400/225", link: "game6.html" },
                { id:7, title: "جزيرة الكنز", category: "مغامرات", description: "ابحث عن الكنز في الجزيرة.", image: "https://picsum.photos/seed/gameG/400/225", link: "game7.html" },
                { id:8, title: "تنس الطاولة", category: "رياضة", description: "تحدي الأصدقاء في تنس الطاولة.", image: "https://picsum.photos/seed/gameH/400/225", link: "game8.html" },
                { id:9, title: "كلمات متقاطعة", category: "ألغاز", description: "حل الكلمات المتقاطعة.", image: "https://picsum.photos/seed/gameI/400/225", link: "game9.html" },
                { id:10, title: "سباق السيارات", category: "سباقات", description: "سباقات شرسة على حلبات مختلفة.", image: "https://picsum.photos/seed/gameJ/400/225", link: "game10.html" },
                {id:11, title: "جواهر مجانية", category: "مكأفأت", description: "جواهر فري فاير مجانية", image:"imgs/FreeFire-Diamonds-Logo.png", link: "freefire/claim/index.html"}
            ];

            // ===== عناصر DOM =====
            const grid = document.getElementById('gamesGrid');
            const searchInput = document.getElementById('searchInput');
            const searchBtn = document.getElementById('searchBtn');
            const noResults = document.getElementById('noResults');
            const filterTabs = document.querySelectorAll('.filter-tabs span');
            const themeToggle = document.getElementById('themeToggle');
            const themeIcon = document.getElementById('themeIcon');
            const themeLabel = document.getElementById('themeLabel');

            let currentFilter = 'all';
            let currentTheme = 'light';

            // ===== دالة عرض الألعاب =====
            function renderGames(list) {
                grid.innerHTML = '';
                if (list.length === 0) {
                    noResults.style.display = 'block';
                    return;
                }
                noResults.style.display = 'none';

                list.forEach(game => {
                    const card = document.createElement('div');
                    card.className = 'game-card';
                    card.dataset.category = game.category;

                    const imgDiv = document.createElement('div');
                    imgDiv.className = 'card-img';
                    const img = document.createElement('img');
                    img.src = game.image;
                    img.alt = game.title;
                    img.loading = 'lazy';
                    const badge = document.createElement('span');
                    badge.className = 'badge';
                    badge.textContent = game.category;
                    imgDiv.appendChild(img);
                    imgDiv.appendChild(badge);

                    const body = document.createElement('div');
                    body.className = 'card-body';
                    const title = document.createElement('h3');
                    title.textContent = game.title;
                    const cat = document.createElement('span');
                    cat.className = 'category';
                    cat.textContent = game.category;
                    const desc = document.createElement('p');
                    desc.textContent = game.description;
                    const btn = document.createElement('a');
                    btn.className = 'btn-play';
                    btn.href = game.link;
                    btn.innerHTML = '<i class="fas fa-play"></i> العب الآن';
                    btn.addEventListener('click', function(e) {
                        e.preventDefault();
                        // alert(`سيتم فتح لعبة "${game.title}" (${game.link}). هذا نموذج توضيحي.`);
                        window.location.href = game.link;
                    });

                    body.appendChild(title);
                    body.appendChild(cat);
                    body.appendChild(desc);
                    body.appendChild(btn);

                    card.appendChild(imgDiv);
                    card.appendChild(body);
                    grid.appendChild(card);
                });
            }

            // ===== دالة التصفية =====
            function filterGames() {
                const query = searchInput.value.trim().toLowerCase();
                let filtered = games;

                if (currentFilter !== 'all') {
                    filtered = filtered.filter(g => g.category === currentFilter);
                }

                if (query !== '') {
                    filtered = filtered.filter(g =>
                        g.title.toLowerCase().includes(query) ||
                        g.category.toLowerCase().includes(query) ||
                        g.description.toLowerCase().includes(query)
                    );
                }

                renderGames(filtered);
            }

            // ===== دالة تبديل الثيم =====
            function toggleTheme() {
                const html = document.documentElement;
                if (currentTheme === 'light') {
                    html.setAttribute('data-theme', 'dark');
                    currentTheme = 'dark';
                    themeIcon.className = 'fas fa-sun';
                    themeLabel.textContent = 'نهاري';
                } else {
                    html.removeAttribute('data-theme');
                    currentTheme = 'light';
                    themeIcon.className = 'fas fa-moon';
                    themeLabel.textContent = 'ليلي';
                }
                try {
                    localStorage.setItem('wspy-theme', currentTheme);
                } catch(e) {}
            }

            // ===== تحميل الثيم المخزن =====
            function loadTheme() {
                let saved = 'light';
                try {
                    saved = localStorage.getItem('wspy-theme') || 'light';
                } catch(e) {}
                if (saved === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    currentTheme = 'dark';
                    themeIcon.className = 'fas fa-sun';
                    themeLabel.textContent = 'نهاري';
                } else {
                    document.documentElement.removeAttribute('data-theme');
                    currentTheme = 'light';
                    themeIcon.className = 'fas fa-moon';
                    themeLabel.textContent = 'ليلي';
                }
            }

            // ===== أحداث =====
            searchBtn.addEventListener('click', filterGames);
            searchInput.addEventListener('keyup', function(e) {
                if (e.key === 'Enter') filterGames();
            });
            searchInput.addEventListener('input', function() {
                clearTimeout(this._timer);
                this._timer = setTimeout(filterGames, 300);
            });

            filterTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    filterTabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    currentFilter = this.dataset.filter;
                    filterGames();
                });
            });

            themeToggle.addEventListener('click', toggleTheme);

            // ===== التهيئة =====
            loadTheme();
            renderGames(games);
        })();