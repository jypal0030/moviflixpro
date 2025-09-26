// MoviFlixPro - Custom JavaScript

$(document).ready(function() {
    // Sample data - in real implementation, this would come from an API
    const sampleData = {
        movies: [
            {
                id: 1,
                title: "The Dark Knight",
                description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
                posterUrl: "https://picsum.photos/seed/darkknight/195/256.jpg",
                year: 2008,
                duration: "2h 32m",
                rating: 9.0,
                quality: "HD",
                telegramUrl: "https://t.me/example/darkknight",
                category: "Action"
            },
            {
                id: 2,
                title: "Inception",
                description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
                posterUrl: "https://picsum.photos/seed/inception/195/256.jpg",
                year: 2010,
                duration: "2h 28m",
                rating: 8.8,
                quality: "4K",
                telegramUrl: "https://t.me/example/inception",
                category: "Sci-Fi"
            },
            {
                id: 3,
                title: "Interstellar",
                description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
                posterUrl: "https://picsum.photos/seed/interstellar/195/256.jpg",
                year: 2014,
                duration: "2h 49m",
                rating: 8.6,
                quality: "4K",
                telegramUrl: "https://t.me/example/interstellar",
                category: "Sci-Fi"
            },
            {
                id: 4,
                title: "The Matrix",
                description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
                posterUrl: "https://picsum.photos/seed/matrix/195/256.jpg",
                year: 1999,
                duration: "2h 16m",
                rating: 8.7,
                quality: "HD",
                telegramUrl: "https://t.me/example/matrix",
                category: "Action"
            },
            {
                id: 5,
                title: "Pulp Fiction",
                description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
                posterUrl: "https://picsum.photos/seed/pulpfiction/195/256.jpg",
                year: 1994,
                duration: "2h 34m",
                rating: 8.9,
                quality: "HD",
                telegramUrl: "https://t.me/example/pulpfiction",
                category: "Drama"
            },
            {
                id: 6,
                title: "Forrest Gump",
                description: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
                posterUrl: "https://picsum.photos/seed/forrestgump/195/256.jpg",
                year: 1994,
                duration: "2h 22m",
                rating: 8.8,
                quality: "HD",
                telegramUrl: "https://t.me/example/forrestgump",
                category: "Drama"
            }
        ],
        webSeries: [
            {
                id: 7,
                title: "Breaking Bad",
                description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
                posterUrl: "https://picsum.photos/seed/breakingbad/195/256.jpg",
                year: 2008,
                duration: "5 Seasons",
                rating: 9.5,
                quality: "4K",
                telegramUrl: "https://t.me/example/breakingbad",
                category: "Crime"
            },
            {
                id: 8,
                title: "Stranger Things",
                description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
                posterUrl: "https://picsum.photos/seed/strangerthings/195/256.jpg",
                year: 2016,
                duration: "4 Seasons",
                rating: 8.7,
                quality: "4K",
                telegramUrl: "https://t.me/example/strangerthings",
                category: "Mystery"
            },
            {
                id: 9,
                title: "The Crown",
                description: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
                posterUrl: "https://picsum.photos/seed/thecrown/195/256.jpg",
                year: 2016,
                duration: "6 Seasons",
                rating: 8.6,
                quality: "4K",
                telegramUrl: "https://t.me/example/thecrown",
                category: "Drama"
            },
            {
                id: 10,
                title: "Money Heist",
                description: "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.",
                posterUrl: "https://picsum.photos/seed/moneyheist/195/256.jpg",
                year: 2017,
                duration: "5 Seasons",
                rating: 8.2,
                quality: "HD",
                telegramUrl: "https://t.me/example/moneyheist",
                category: "Crime"
            },
            {
                id: 11,
                title: "The Witcher",
                description: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
                posterUrl: "https://picsum.photos/seed/witcher/195/256.jpg",
                year: 2019,
                duration: "3 Seasons",
                rating: 8.0,
                quality: "4K",
                telegramUrl: "https://t.me/example/witcher",
                category: "Fantasy"
            },
            {
                id: 12,
                title: "Narcos",
                description: "A chronicled look at the criminal exploits of Colombian drug lord Pablo Escobar, as well as the many other drug kingpins who plagued the country through the years.",
                posterUrl: "https://picsum.photos/seed/narcos/195/256.jpg",
                year: 2015,
                duration: "3 Seasons",
                rating: 8.8,
                quality: "HD",
                telegramUrl: "https://t.me/example/narcos",
                category: "Crime"
            }
        ]
    };

    // Group content by category
    function groupByCategory(items) {
        return items.reduce((groups, item) => {
            const category = item.category;
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(item);
            return groups;
        }, {});
    }

    // Create content card HTML
    function createContentCard(item) {
        return `
            <div class="content-card" data-id="${item.id}">
                <div class="position-relative">
                    <img src="${item.posterUrl}" alt="${item.title}" class="poster">
                    <span class="quality-badge">${item.quality}</span>
                </div>
                <div class="content-info">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="title">${item.title}</h6>
                        <span class="year">${item.year}</span>
                    </div>
                    <div class="meta">
                        <span class="duration">
                            <i class="fas fa-clock me-1"></i>
                            ${item.duration}
                        </span>
                        <span class="rating">
                            <i class="fas fa-star me-1"></i>
                            ${item.rating}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }

    // Create content section HTML
    function createContentSection(category, items) {
        return `
            <div class="content-section">
                <h3>${category}</h3>
                <div class="content-row">
                    ${items.map(item => createContentCard(item)).join('')}
                </div>
            </div>
        `;
    }

    // Load content into containers
    function loadContent() {
        const moviesByCategory = groupByCategory(sampleData.movies);
        const webSeriesByCategory = groupByCategory(sampleData.webSeries);

        const moviesContainer = $('#moviesContainer');
        const webSeriesContainer = $('#webseriesContainer');

        // Load movies
        moviesContainer.empty();
        Object.keys(moviesByCategory).forEach(category => {
            moviesContainer.append(createContentSection(category, moviesByCategory[category]));
        });

        // Load web series
        webSeriesContainer.empty();
        Object.keys(webSeriesByCategory).forEach(category => {
            webSeriesContainer.append(createContentSection(category, webSeriesByCategory[category]));
        });

        // Add click handlers to content cards
        $('.content-card').click(function() {
            const itemId = $(this).data('id');
            const item = [...sampleData.movies, ...sampleData.webSeries].find(i => i.id === itemId);
            if (item) {
                showContentModal(item);
            }
        });
    }

    // Show content modal
    function showContentModal(item) {
        $('#modalTitle').text(item.title);
        $('#modalPoster').attr('src', item.posterUrl).attr('alt', item.title);
        $('#modalDescription').text(item.description);
        $('#modalYear').text(`Year: ${item.year}`);
        $('#modalDuration').text(`Duration: ${item.duration}`);
        $('#modalRating').text(`Rating: ${item.rating}/10`);
        $('#modalQuality').text(item.quality);
        
        $('#watchButton').off('click').on('click', function() {
            window.open(item.telegramUrl || 'https://t.me/yourchannel', '_blank');
        });

        const modal = new bootstrap.Modal(document.getElementById('contentModal'));
        modal.show();
    }

    // Search functionality
    function performSearch(query) {
        const allContent = [...sampleData.movies, ...sampleData.webSeries];
        const results = allContent.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );

        const searchResults = $('#searchResults');
        searchResults.empty();

        if (results.length === 0) {
            searchResults.html('<p class="text-white text-center">No results found</p>');
            return;
        }

        results.forEach(item => {
            const resultItem = $(`
                <div class="search-result-item" data-id="${item.id}">
                    <div class="d-flex align-items-center">
                        <img src="${item.posterUrl}" alt="${item.title}" 
                             style="width: 60px; height: 80px; object-fit: cover; border-radius: 4px; margin-right: 1rem;">
                        <div class="flex-grow-1">
                            <h6 class="text-white mb-1">${item.title}</h6>
                            <p class="text-white-50 mb-1 small">${item.description.substring(0, 100)}...</p>
                            <div class="d-flex gap-2">
                                <span class="badge bg-secondary">${item.year}</span>
                                <span class="badge bg-purple">${item.quality}</span>
                                <span class="badge bg-warning text-dark">${item.rating}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `);

            resultItem.click(function() {
                $('#searchOverlay').fadeOut();
                $('#searchInput').val('');
                showContentModal(item);
            });

            searchResults.append(resultItem);
        });
    }

    // Search overlay toggle
    $('#searchToggle').click(function(e) {
        e.preventDefault();
        $('#searchOverlay').fadeIn();
        $('#searchInput').focus();
    });

    $('#closeSearch').click(function() {
        $('#searchOverlay').fadeOut();
        $('#searchInput').val('');
        $('#searchResults').empty();
    });

    // Search input handler
    let searchTimeout;
    $('#searchInput').on('input', function() {
        clearTimeout(searchTimeout);
        const query = $(this).val();
        
        searchTimeout = setTimeout(function() {
            if (query.trim()) {
                performSearch(query);
            } else {
                $('#searchResults').empty();
            }
        }, 300);
    });

    // Close search overlay on escape key
    $(document).keydown(function(e) {
        if (e.key === 'Escape') {
            $('#searchOverlay').fadeOut();
            $('#searchInput').val('');
            $('#searchResults').empty();
        }
    });

    // Tab change handler
    $('#contentTabs button').on('shown.bs.tab', function(e) {
        const target = $(e.target).attr('data-bs-target');
        // Add smooth transition effect
        $(target).hide().fadeIn(500);
    });

    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 100
            }, 800);
        }
    });

    // Initialize content when page loads
    loadContent();

    // Add hover effects to content cards
    $(document).on('mouseenter', '.content-card', function() {
        $(this).css('transform', 'scale(1.05)');
    }).on('mouseleave', '.content-card', function() {
        $(this).css('transform', 'scale(1)');
    });

    // Add loading animation
    function showLoading(container) {
        container.html('<div class="loading"></div>');
    }

    // Hide loading animation
    function hideLoading(container) {
        container.find('.loading').remove();
    }

    // Responsive navigation handling
    $('.navbar-nav .nav-link').on('click', function() {
        if ($('.navbar-collapse').hasClass('show')) {
            $('.navbar-collapse').collapse('hide');
        }
    });

    // Add smooth fade-in animation for content sections
    function animateContentSections() {
        $('.content-section').each(function(index) {
            const section = $(this);
            setTimeout(function() {
                section.css('opacity', '0').animate({opacity: 1}, 600);
            }, index * 200);
        });
    }

    // Initialize animations
    setTimeout(animateContentSections, 500);

    // Handle window resize for responsive design
    let resizeTimeout;
    $(window).on('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Adjust content card sizes based on screen width
            const screenWidth = $(window).width();
            if (screenWidth < 576) {
                $('.content-card').css('flex', '0 0 120px');
            } else if (screenWidth < 768) {
                $('.content-card').css('flex', '0 0 140px');
            } else {
                $('.content-card').css('flex', '0 0 195px');
            }
        }, 250);
    });

    // Console welcome message
    console.log('%c🎬 MoviFlixPro', 'color: #8b5cf6; font-size: 16px; font-weight: bold;');
    console.log('%cBuilt with HTML, CSS, Bootstrap, and jQuery', 'color: #ec4899; font-size: 12px;');
});