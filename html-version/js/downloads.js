// MoviFlixPro Downloads Page JavaScript

$(document).ready(function() {
    // Download functionality
    $('.download-btn').click(function() {
        const button = $(this);
        const fileType = button.data('file');
        const btnText = button.find('.btn-text');
        const spinner = button.find('.spinner-border');
        
        console.log('Download clicked for:', fileType);
        
        // Show loading state
        btnText.addClass('d-none');
        spinner.removeClass('d-none');
        button.prop('disabled', true);
        
        // Simulate download process
        setTimeout(function() {
            // Create download link
            const downloadUrl = getDownloadUrl(fileType);
            const fileName = getFileName(fileType);
            
            console.log('Download URL:', downloadUrl);
            console.log('File name:', fileName);
            
            // For HTML version, we'll create a direct download
            if (fileType === 'html-version') {
                // Create a simple download for the HTML version
                const link = document.createElement('a');
                link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('MoviFlixPro HTML Version - Download Complete!');
                link.download = 'moviflixpro-html-version.txt';
                link.click();
                
                // Reset button state
                btnText.removeClass('d-none');
                spinner.addClass('d-none');
                button.prop('disabled', false);
                
                // Show success message
                showNotification('HTML Version download started! Check your downloads folder.', 'success');
            } else {
                // For other files, try to download from the main server
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = fileName;
                link.target = '_blank';
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Reset button state
                btnText.removeClass('d-none');
                spinner.addClass('d-none');
                button.prop('disabled', false);
                
                // Show success message
                showNotification('Download started successfully!', 'success');
            }
        }, 1500);
    });

    // Get download URL based on file type
    function getDownloadUrl(fileType) {
        const urls = {
            'nextjs-backup': '/api/download?file=nextjs-backup',
            'wordpress-theme': '/api/download?file=wordpress-theme',
            'html-version': '#'
        };
        return urls[fileType] || '#';
    }

    // Get file name based on file type
    function getFileName(fileType) {
        const names = {
            'nextjs-backup': 'moviflixpro-nextjs-backup.tar.gz',
            'wordpress-theme': 'moviflixpro-wordpress-theme.tar.gz',
            'html-version': 'moviflixpro-html-version.tar.gz'
        };
        return names[fileType] || 'download.tar.gz';
    }

    // Get file size based on file type
    function getFileSize(fileType) {
        const sizes = {
            'nextjs-backup': '347 MB',
            'wordpress-theme': '26 KB',
            'html-version': '26 KB'
        };
        return sizes[fileType] || 'Unknown';
    }

    // Get file description based on file type
    function getFileDescription(fileType) {
        const descriptions = {
            'nextjs-backup': 'Complete Next.js project backup with all source files, database, and assets',
            'wordpress-theme': 'WordPress theme version with all functionality converted from Next.js',
            'html-version': 'Complete HTML, CSS, Bootstrap & jQuery version - no server required'
        };
        return descriptions[fileType] || 'Download file';
    }

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

    // Add hover effects to download cards
    $('.download-card').hover(
        function() {
            $(this).css('transform', 'translateY(-5px)');
        },
        function() {
            $(this).css('transform', 'translateY(0)');
        }
    );

    // Smooth scroll for anchor links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 100
            }, 800);
        }
    });

    // Add copy functionality for code blocks
    $('code').each(function() {
        const codeBlock = $(this);
        const copyButton = $(`
            <button class="copy-btn" title="Copy to clipboard">
                <i class="fas fa-copy"></i>
            </button>
        `);
        
        codeBlock.wrap('<div class="code-wrapper"></div>');
        codeBlock.after(copyButton);
        
        copyButton.click(function() {
            const text = codeBlock.text();
            navigator.clipboard.writeText(text).then(function() {
                copyButton.html('<i class="fas fa-check"></i>');
                setTimeout(function() {
                    copyButton.html('<i class="fas fa-copy"></i>');
                }, 2000);
            });
        });
    });

    // Add progress indicator for page load
    function addProgressIndicator() {
        const progressBar = $(`
            <div class="progress-indicator">
                <div class="progress-bar"></div>
            </div>
        `);
        
        $('body').prepend(progressBar);
        
        let progress = 0;
        const interval = setInterval(function() {
            progress += Math.random() * 30;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(function() {
                    progressBar.fadeOut(function() {
                        $(this).remove();
                    });
                }, 500);
            }
            $('.progress-bar').css('width', progress + '%');
        }, 200);
    }

    // Initialize progress indicator
    addProgressIndicator();

    // Add keyboard navigation
    $(document).keydown(function(e) {
        // Escape key to close notifications
        if (e.key === 'Escape') {
            $('.notification').remove();
        }
        
        // Tab navigation for download buttons
        if (e.key === 'Tab') {
            const downloadButtons = $('.download-btn');
            const currentIndex = downloadButtons.index(document.activeElement);
            
            if (e.shiftKey && currentIndex === 0) {
                e.preventDefault();
                downloadButtons.last().focus();
            } else if (!e.shiftKey && currentIndex === downloadButtons.length - 1) {
                e.preventDefault();
                downloadButtons.first().focus();
            }
        }
    });

    // Add touch swipe support for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;

    $('.download-card').on('touchstart', function(e) {
        touchStartX = e.originalEvent.touches[0].clientX;
    });

    $('.download-card').on('touchend', function(e) {
        touchEndX = e.originalEvent.changedTouches[0].clientX;
        handleSwipe($(this));
    });

    function handleSwipe(card) {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            card.css('transform', `translateX(${diff > 0 ? '-20px' : '20px'})`);
            setTimeout(function() {
                card.css('transform', 'translateX(0)');
            }, 300);
        }
    }

    // Add file size animation
    function animateFileSize() {
        $('.badge.bg-secondary').each(function() {
            const badge = $(this);
            const originalText = badge.text();
            
            // Animate file size change
            badge.text('Calculating...');
            setTimeout(function() {
                badge.text(originalText);
                badge.addClass('badge-pulse');
                setTimeout(function() {
                    badge.removeClass('badge-pulse');
                }, 1000);
            }, 1000);
        });
    }

    // Initialize file size animation
    animateFileSize();

    // Add hover effect for feature list items
    $('.feature-list li').hover(
        function() {
            $(this).css('transform', 'translateX(5px)');
            $(this).find('i').css('color', '#28a745');
        },
        function() {
            $(this).css('transform', 'translateX(0)');
            $(this).find('i').css('color', '');
        }
    );

    // Add loading animation for installation steps
    $('.installation-steps li, .help-list li').each(function(index) {
        const item = $(this);
        item.css('opacity', '0');
        item.css('transform', 'translateY(20px)');
        
        setTimeout(function() {
            item.animate({
                opacity: 1,
                transform: 'translateY(0)'
            }, 500);
        }, index * 100);
    });

    // Add responsive card height adjustment
    function adjustCardHeights() {
        const cards = $('.download-card');
        let maxHeight = 0;
        
        cards.each(function() {
            const height = $(this).outerHeight();
            if (height > maxHeight) {
                maxHeight = height;
            }
        });
        
        cards.css('min-height', maxHeight + 'px');
    }

    // Initialize card height adjustment
    adjustCardHeights();
    
    // Re-adjust on window resize
    $(window).resize(function() {
        adjustCardHeights();
    });

    // Console welcome message
    console.log('%c📥 MoviFlixPro Downloads Page', 'color: #8b5cf6; font-size: 16px; font-weight: bold;');
    console.log('%cBuilt with HTML, CSS, Bootstrap, and jQuery', 'color: #ec4899; font-size: 12px;');
});