// MoviFlixPro Admin Panel JavaScript

$(document).ready(function() {
    // Sample data - in real implementation, this would come from an API
    const adminData = {
        movies: [
            {
                id: 1,
                title: "The Dark Knight",
                year: 2008,
                duration: "2h 32m",
                rating: 9.0,
                quality: "HD",
                category: "Action"
            },
            {
                id: 2,
                title: "Inception",
                year: 2010,
                duration: "2h 28m",
                rating: 8.8,
                quality: "4K",
                category: "Sci-Fi"
            },
            {
                id: 3,
                title: "Interstellar",
                year: 2014,
                duration: "2h 49m",
                rating: 8.6,
                quality: "4K",
                category: "Sci-Fi"
            },
            {
                id: 4,
                title: "The Matrix",
                year: 1999,
                duration: "2h 16m",
                rating: 8.7,
                quality: "HD",
                category: "Action"
            },
            {
                id: 5,
                title: "Pulp Fiction",
                year: 1994,
                duration: "2h 34m",
                rating: 8.9,
                quality: "HD",
                category: "Drama"
            },
            {
                id: 6,
                title: "Forrest Gump",
                year: 1994,
                duration: "2h 22m",
                rating: 8.8,
                quality: "HD",
                category: "Drama"
            }
        ],
        webSeries: [
            {
                id: 7,
                title: "Breaking Bad",
                year: 2008,
                duration: "5 Seasons",
                rating: 9.5,
                quality: "4K",
                category: "Crime"
            },
            {
                id: 8,
                title: "Stranger Things",
                year: 2016,
                duration: "4 Seasons",
                rating: 8.7,
                quality: "4K",
                category: "Mystery"
            },
            {
                id: 9,
                title: "The Crown",
                year: 2016,
                duration: "6 Seasons",
                rating: 8.6,
                quality: "4K",
                category: "Drama"
            },
            {
                id: 10,
                title: "Money Heist",
                year: 2017,
                duration: "5 Seasons",
                rating: 8.2,
                quality: "HD",
                category: "Crime"
            },
            {
                id: 11,
                title: "The Witcher",
                year: 2019,
                duration: "3 Seasons",
                rating: 8.0,
                quality: "4K",
                category: "Fantasy"
            },
            {
                id: 12,
                title: "Narcos",
                year: 2015,
                duration: "3 Seasons",
                rating: 8.8,
                quality: "HD",
                category: "Crime"
            }
        ],
        categories: [
            { id: 1, name: "Action", count: 2, type: "movie" },
            { id: 2, name: "Sci-Fi", count: 2, type: "movie" },
            { id: 3, name: "Drama", count: 2, type: "movie" },
            { id: 4, name: "Crime", count: 3, type: "webseries" },
            { id: 5, name: "Mystery", count: 1, type: "webseries" },
            { id: 6, name: "Fantasy", count: 1, type: "webseries" }
        ]
    };

    // Load movies table
    function loadMoviesTable() {
        const tbody = $('#moviesTableBody');
        tbody.empty();
        
        adminData.movies.forEach(movie => {
            const row = `
                <tr>
                    <td>${movie.id}</td>
                    <td>${movie.title}</td>
                    <td>${movie.year}</td>
                    <td>${movie.duration}</td>
                    <td>${movie.rating}</td>
                    <td><span class="badge bg-purple">${movie.quality}</span></td>
                    <td>${movie.category}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="editMovie(${movie.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteMovie(${movie.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
    }

    // Load web series table
    function loadWebSeriesTable() {
        const tbody = $('#webSeriesTableBody');
        tbody.empty();
        
        adminData.webSeries.forEach(series => {
            const row = `
                <tr>
                    <td>${series.id}</td>
                    <td>${series.title}</td>
                    <td>${series.year}</td>
                    <td>${series.duration}</td>
                    <td>${series.rating}</td>
                    <td><span class="badge bg-purple">${series.quality}</span></td>
                    <td>${series.category}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="editWebSeries(${series.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteWebSeries(${series.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
    }

    // Load categories
    function loadCategories() {
        const container = $('#categoriesContainer');
        container.empty();
        
        adminData.categories.forEach(category => {
            const card = `
                <div class="col-md-4 mb-3">
                    <div class="card bg-dark text-white">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h5 class="card-title">${category.name}</h5>
                                    <p class="card-text">
                                        <small class="text-muted">${category.count} items</small><br>
                                        <small class="text-muted">${category.type}</small>
                                    </p>
                                </div>
                                <div>
                                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editCategory(${category.id})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" onclick="deleteCategory(${category.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.append(card);
        });
    }

    // Initialize admin panel
    function initAdmin() {
        loadMoviesTable();
        loadWebSeriesTable();
        loadCategories();
        
        // Update stats
        $('.stat-number').eq(0).text(adminData.movies.length);
        $('.stat-number').eq(1).text(adminData.webSeries.length);
        $('.stat-number').eq(2).text(adminData.categories.length);
    }

    // Tab change handler
    $('#adminTabs button').on('shown.bs.tab', function(e) {
        const target = $(e.target).attr('data-bs-target');
        // Add smooth transition effect
        $(target).hide().fadeIn(500);
    });

    // Show notification
    function showNotification(message, type = 'info') {
        const notification = $(`
            <div class="notification notification-${type} position-fixed top-0 end-0 m-3" style="z-index: 9999;">
                <div class="d-flex align-items-center">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
                    <span>${message}</span>
                    <button type="button" class="btn-close btn-close-white ms-3" onclick="$(this).closest('.notification').remove()"></button>
                </div>
            </div>
        `);
        
        $('body').append(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(function() {
            notification.fadeOut(function() {
                $(this).remove();
            });
        }, 5000);
    }

    // Global functions for buttons
    window.showAddMovieModal = function() {
        showNotification('Add Movie modal would open here', 'info');
    };

    window.showAddWebSeriesModal = function() {
        showNotification('Add Web Series modal would open here', 'info');
    };

    window.showAddCategoryModal = function() {
        showNotification('Add Category modal would open here', 'info');
    };

    window.editMovie = function(id) {
        const movie = adminData.movies.find(m => m.id === id);
        showNotification(`Edit Movie: ${movie.title}`, 'info');
    };

    window.editWebSeries = function(id) {
        const series = adminData.webSeries.find(s => s.id === id);
        showNotification(`Edit Web Series: ${series.title}`, 'info');
    };

    window.editCategory = function(id) {
        const category = adminData.categories.find(c => c.id === id);
        showNotification(`Edit Category: ${category.name}`, 'info');
    };

    window.deleteMovie = function(id) {
        const movie = adminData.movies.find(m => m.id === id);
        if (confirm(`Are you sure you want to delete "${movie.title}"?`)) {
            const index = adminData.movies.findIndex(m => m.id === id);
            adminData.movies.splice(index, 1);
            loadMoviesTable();
            showNotification('Movie deleted successfully', 'success');
            
            // Update stats
            $('.stat-number').eq(0).text(adminData.movies.length);
        }
    };

    window.deleteWebSeries = function(id) {
        const series = adminData.webSeries.find(s => s.id === id);
        if (confirm(`Are you sure you want to delete "${series.title}"?`)) {
            const index = adminData.webSeries.findIndex(s => s.id === id);
            adminData.webSeries.splice(index, 1);
            loadWebSeriesTable();
            showNotification('Web Series deleted successfully', 'success');
            
            // Update stats
            $('.stat-number').eq(1).text(adminData.webSeries.length);
        }
    };

    window.deleteCategory = function(id) {
        const category = adminData.categories.find(c => c.id === id);
        if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
            const index = adminData.categories.findIndex(c => c.id === id);
            adminData.categories.splice(index, 1);
            loadCategories();
            showNotification('Category deleted successfully', 'success');
            
            // Update stats
            $('.stat-number').eq(2).text(adminData.categories.length);
        }
    };

    window.saveSettings = function() {
        showNotification('Settings saved successfully', 'success');
    };

    // Add CSS for admin panel
    const adminStyles = `
        <style>
            .admin-header {
                background: linear-gradient(135deg, #1f2937, #374151);
                border-radius: 15px;
                padding: 2rem;
                margin-bottom: 2rem;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .admin-title {
                color: #ffffff;
                font-weight: 700;
                font-size: 2.5rem;
                margin-bottom: 0.5rem;
            }
            
            .admin-subtitle {
                color: rgba(255, 255, 255, 0.7);
                font-size: 1.1rem;
                margin-bottom: 0;
            }
            
            .admin-stats {
                display: flex;
                gap: 2rem;
                justify-content: flex-end;
            }
            
            .stat-item {
                text-align: center;
            }
            
            .stat-number {
                font-size: 2rem;
                font-weight: 700;
                color: #8b5cf6;
            }
            
            .stat-label {
                color: rgba(255, 255, 255, 0.7);
                font-size: 0.9rem;
            }
            
            .admin-tabs {
                background: rgba(255, 255, 255, 0.1);
                padding: 1rem;
                border-radius: 15px;
                margin-bottom: 2rem;
            }
            
            .admin-tabs .nav-link {
                color: rgba(255, 255, 255, 0.7) !important;
                border: none;
                padding: 0.75rem 1.5rem;
                margin: 0 0.5rem;
                border-radius: 10px;
                transition: all 0.3s ease;
            }
            
            .admin-tabs .nav-link.active {
                background: linear-gradient(135deg, #8b5cf6, #ec4899);
                color: #ffffff !important;
            }
            
            .admin-section {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 15px;
                padding: 2rem;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
            }
            
            .section-header h3 {
                color: #ffffff;
                font-weight: 600;
                margin-bottom: 0;
            }
            
            .settings-form {
                background: rgba(255, 255, 255, 0.05);
                padding: 2rem;
                border-radius: 15px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .form-group {
                margin-bottom: 1.5rem;
            }
            
            .form-label {
                color: #ffffff;
                font-weight: 500;
                margin-bottom: 0.5rem;
            }
            
            .form-control, .form-select {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #ffffff;
            }
            
            .form-control:focus, .form-select:focus {
                background: rgba(255, 255, 255, 0.15);
                border-color: #8b5cf6;
                color: #ffffff;
                box-shadow: 0 0 0 0.2rem rgba(139, 92, 246, 0.25);
            }
            
            .form-control::placeholder {
                color: rgba(255, 255, 255, 0.5);
            }
            
            .form-check-input:checked {
                background-color: #8b5cf6;
                border-color: #8b5cf6;
            }
            
            .form-check-label {
                color: rgba(255, 255, 255, 0.8);
            }
            
            .table-dark {
                background: rgba(255, 255, 255, 0.05);
            }
            
            .table-dark th {
                border-color: rgba(255, 255, 255, 0.1);
                color: #ffffff;
            }
            
            .table-dark td {
                border-color: rgba(255, 255, 255, 0.1);
                color: rgba(255, 255, 255, 0.8);
            }
            
            .table-dark tbody tr:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            
            @media (max-width: 768px) {
                .admin-stats {
                    gap: 1rem;
                }
                
                .stat-number {
                    font-size: 1.5rem;
                }
                
                .section-header {
                    flex-direction: column;
                    gap: 1rem;
                    align-items: flex-start;
                }
                
                .admin-tabs .nav-link {
                    padding: 0.5rem 1rem;
                    margin: 0.25rem;
                    font-size: 0.9rem;
                }
            }
        </style>
    `;
    
    $('head').append(adminStyles);

    // Initialize admin panel
    initAdmin();

    // Console welcome message
    console.log('%c🛡️ MoviFlixPro Admin Panel', 'color: #8b5cf6; font-size: 16px; font-weight: bold;');
    console.log('%cBuilt with HTML, CSS, Bootstrap, and jQuery', 'color: #ec4899; font-size: 12px;');
});