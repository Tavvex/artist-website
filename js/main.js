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

// Фильтры портфолио
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                const categories = item.getAttribute('data-category');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
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
        });
    });
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
                title: '"Рассвет над полем"',
                details: 'Масло, холст • 80×60 см • 2024',
                description: 'Эта работа была создана ранним утром в подмосковном поле. Я стремилась передать не только визуальную красоту рассвета, но и то чувство умиротворения и обновления, которое приходит с первыми лучами солнца.',
                image: 'images/portfolio/work1.jpg'
            },
            2: {
                title: '"Городские тени"',
                details: 'Акрил, смешанная техника • 100×70 см • 2023',
                description: 'Городской пейзаж, исследующий игру света и тени в архитектурном пространстве. Работа передает динамику мегаполиса и моменты тишины между шумом улиц.',
                image: 'images/portfolio/work2.jpg'
            },
            3: {
                title: '"Тишина моря"',
                details: 'Масло, холст • 90×60 см • 2024',
                description: 'Абстрактная интерпретация морского пейзажа, где цвет и текстура передают эмоциональное состояние спокойствия и безмятежности.',
                image: 'images/portfolio/work3.jpg'
            },
            4: {
                title: '"Линии города"',
                details: 'Уголь, бумага • 50×70 см • 2023',
                description: 'Графическая работа, исследующая геометрию и ритм городской архитектуры. Линии и штрихи создают ощущение движения и энергии.',
                image: 'images/portfolio/work4.jpg'
            },
            5: {
                title: '"Вечерние огни"',
                details: 'Акрил, холст • 70×90 см • 2022',
                description: 'Картина из серии городских пейзажей, передающая магию вечернего города, когда зажигаются огни и улицы наполняются особым светом.',
                image: 'images/portfolio/work5.jpg'
            },
            6: {
                title: '"Портрет"',
                details: 'Карандаш, бумага • 40×50 см • 2021',
                description: 'Карандашный портрет, выполненный с натуры. Работа передает характер и внутренний мир модели через тонкие градации света и тени.',
                image: 'images/portfolio/work6.jpg'
            },
            7: {
                title: '"Осенний лес"',
                details: 'Масло, холст • 80×100 см • 2023',
                description: 'Пейзаж, запечатлевший красоту осеннего леса. Яркие краски и мягкие переходы создают ощущение тепла и уюта.',
                image: 'images/portfolio/work7.jpg'
            },
            8: {
                title: '"Метро"',
                details: 'Акрил, смешанная техника • 90×120 см • 2024',
                description: 'Работа из серии городских зарисовок, исследующая ритм и движение в подземном пространстве метро.',
                image: 'images/portfolio/work8.jpg'
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