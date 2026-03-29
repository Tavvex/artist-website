// Основной JavaScript файл

document.addEventListener('DOMContentLoaded', function() {
    // Устанавливаем текущий год в футере
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    // Инициализация меню для мобильных устройств
    initMobileMenu();
    
    // Инициализация слайдера на главной странице
    if (document.querySelector('.hero-slider')) {
        initHeroSlider();
    }
    
    // Инициализация фильтров портфолио
    if (document.querySelector('.portfolio-filters')) {
        initPortfolioFilters();
    }
    
    // Инициализация форм (подписка)
    initForms();
    
    // Инициализация модальных окон
    initModals();
    
    // Закрытие flash-сообщений
    initFlashMessages();
});

// Мобильное меню
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMain = document.querySelector('.nav-main');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactBtn = document.querySelector('.contact-btn');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });
        
        if (contactBtn) {
            contactBtn.addEventListener('click', function() {
                closeMobileMenu();
            });
        }
        
        document.addEventListener('click', function(e) {
            if (navMain && navMain.classList.contains('active') && 
                !navMain.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMain && navMain.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
    
    function toggleMobileMenu() {
        menuToggle.classList.toggle('active');
        navMain.classList.toggle('active');
        
        if (navMain.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    function closeMobileMenu() {
        menuToggle.classList.remove('active');
        navMain.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Слайдер на главной странице
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    let currentSlide = 0;
    let slideInterval;
    
    function showSlide(index) {
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }
    
    function nextSlide() {
        let nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }
    
    function prevSlide() {
        let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }
    
    function startSlideShow() {
        if (slides.length > 1) {
            slideInterval = setInterval(nextSlide, 5000);
        }
    }
    
    function stopSlideShow() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            stopSlideShow();
            nextSlide();
            startSlideShow();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            stopSlideShow();
            prevSlide();
            startSlideShow();
        });
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            stopSlideShow();
            showSlide(index);
            startSlideShow();
        });
    });
    
    const slider = document.querySelector('.hero-slider');
    if (slider) {
        slider.addEventListener('mouseenter', stopSlideShow);
        slider.addEventListener('mouseleave', startSlideShow);
        slider.addEventListener('touchstart', stopSlideShow);
        slider.addEventListener('touchend', function() {
            setTimeout(startSlideShow, 3000);
        });
    }
    
    startSlideShow();
}



// Инициализация форм
function initForms() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                showNotification('Спасибо за подписку!');
                emailInput.value = '';
            } else {
                showNotification('Пожалуйста, введите корректный email адрес.', 'error');
                emailInput.focus();
            }
        });
    });
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

// Уведомления
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#8a9b8c' : '#e6c9c9'};
        color: ${type === 'success' ? '#ffffff' : '#333333'};
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        transform: translateX(150%);
        transition: transform 0.3s ease;
        font-size: 0.9rem;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Модальные окна
function initModals() {
    const viewButtons = document.querySelectorAll('.view-details');
    const workModal = document.getElementById('work-modal');
    
    if (viewButtons.length > 0 && workModal) {
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const workId = this.getAttribute('data-work');
                const workData = getWorkData(workId);
                
                if (workData) {
                    document.getElementById('modal-work-title').textContent = workData.title;
                    document.getElementById('modal-work-details').textContent = workData.details;
                    document.getElementById('modal-work-description').textContent = workData.description;
                    document.getElementById('modal-work-image').src = workData.image;
                    document.getElementById('modal-work-image').alt = workData.title;
                    
                    workModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        const closeButtons = workModal.querySelectorAll('.modal-close, .modal-close-btn');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                workModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        workModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && workModal.classList.contains('active')) {
                workModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    function getWorkData(workId) {
        const worksData = {
            1: {
                title: '"Алан"',
                details: 'Масло, холст • 60×80 см • 2024',
                description: '---',
                image: 'images/portfolio/alan_60-80.jpg'
            },
            2: {
                title: '"Глоток свежести"',
                details: 'Масло, холст • 45x60 см • 2026',
                description: '---',
                image: 'images/portfolio/freshness_45-60.jpg'
            },
            3: {
                title: '"Портрет"',
                details: 'Масло, холст • 35x40 см • 2026',
                description: '---',
                image: 'images/portfolio/portret_1_35-40.jpg'
            },
            4: {
                title: '"Портрет"',
                details: 'Масло, холст • 50x60 см • 2026',
                description: '---',
                image: 'images/portfolio/portret_2_35-40.jpg'
            },
            5: {
                title: '"Сам себе кукловод"',
                details: 'Масло, холст • 60×80 см • 2024',
                description: '---',
                image: 'images/portfolio/puppeter_60-80.jpg'
            },
            6: {
                title: '"Перерождение"',
                details: 'Масло, холст • 70x90 см • 2024',
                description: '---',
                image: 'images/portfolio/reborn_70-90.jpg'
            },
            7: {
                title: '"Тишина"',
                details: 'Масло, холст • 50x70 см • 2025',
                description: '---',
                image: 'images/portfolio/silence_50-70.jpg'
            },
            8: {
                title: '"Летний денёк"',
                details: 'Масло, холст • 50x70 см • 2024',
                description: '---',
                image: 'images/portfolio/summer_day_50-70.jpg'
            },
            9: {
                title: '"Райский уголок"',
                details: 'Масло, холст • 20x35 см • 2025',
                description: '---',
                image: 'images/portfolio/heavens_corner_20-35.jpg'
            }
        };
        
        return worksData[workId];
    }
}

// Flash сообщения
function initFlashMessages() {
    const closeButtons = document.querySelectorAll('.alert .btn-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const alert = this.closest('.alert');
            if (alert) {
                alert.style.opacity = '0';
                setTimeout(() => {
                    alert.remove();
                }, 300);
            }
        });
    });
    
    setTimeout(() => {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            setTimeout(() => {
                alert.style.opacity = '0';
                setTimeout(() => {
                    if (alert.parentNode) alert.remove();
                }, 300);
            }, 5000);
        });
    }, 1000);
}

let lastScrollTop = 0;
const header = document.querySelector('.header');
const scrollThreshold = 100; // Через сколько пикселей срабатывает

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (window.innerWidth <= 768) { // Только для мобильных
        if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
            // Скролл вниз - скрываем шапку
            header.style.transform = 'translateY(-100%)';
            header.style.transition = 'transform 0.3s ease';
        } else if (scrollTop < lastScrollTop) {
            // Скролл вверх - показываем шапку
            header.style.transform = 'translateY(0)';
        }
    }
    
    lastScrollTop = scrollTop;
});

// Фильтры и сортировка портфолио
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortButtons = document.querySelectorAll('.sort-btn');
    const portfolioGrid = document.getElementById('portfolio-grid');
    
    if (!portfolioGrid) return;
    
    let currentFilter = 'all';
    let currentSort = 'newest'; // newest или oldest
    
    // Функция сортировки элементов
    function sortItems() {
        const items = Array.from(portfolioGrid.querySelectorAll('.portfolio-item'));
        
        // Сначала фильтруем видимые элементы
        const visibleItems = items.filter(item => item.style.display !== 'none');
        const hiddenItems = items.filter(item => item.style.display === 'none');
        
        // Сортируем только видимые
        visibleItems.sort((a, b) => {
            const yearA = parseInt(a.getAttribute('data-year'));
            const yearB = parseInt(b.getAttribute('data-year'));
            
            if (currentSort === 'newest') {
                return yearB - yearA;
            } else {
                return yearA - yearB;
            }
        });
        
        // Переставляем элементы в DOM (сначала отсортированные видимые, потом скрытые)
        visibleItems.forEach(item => {
            portfolioGrid.appendChild(item);
        });
        hiddenItems.forEach(item => {
            portfolioGrid.appendChild(item);
        });
    }
    
    // Функция фильтрации
    function filterItems() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        portfolioItems.forEach(item => {
            const categories = item.getAttribute('data-category');
            
            if (currentFilter === 'all' || categories.includes(currentFilter)) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                }, 10);
            } else {
                item.style.opacity = '0';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        // После фильтрации применяем сортировку
        sortItems();
    }
    
    // Обработчики кнопок фильтров
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.getAttribute('data-filter');
            filterItems();
        });
    });
    
    // Обработчики кнопок сортировки
    sortButtons.forEach(button => {
        button.addEventListener('click', function() {
            sortButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            currentSort = this.getAttribute('data-sort');
            sortItems();
        });
    });
    
    // Начальная сортировка
    sortItems();
}