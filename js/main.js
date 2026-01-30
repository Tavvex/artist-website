// Основной JavaScript файл для сайта художника

document.addEventListener('DOMContentLoaded', function() {
    // Устанавливаем текущий год в футере
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
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
    
    // Инициализация табов в магазине
    if (document.querySelector('.shop-tabs')) {
        initShopTabs();
    }
    
    // Инициализация фильтров в магазине
    if (document.querySelector('.shop-filters')) {
        initShopFilters();
    }
    
    // Инициализация форм
    initForms();
    
    // Инициализация анимаций при скролле
    initScrollAnimations();
    
    // Инициализация модальных окон
    initModals();
});

// Мобильное меню
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Закрытие меню при клике на ссылку
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', function(event) {
        if (menuToggle && navMenu && 
            !menuToggle.contains(event.target) && 
            !navMenu.contains(event.target) && 
            navMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Слайдер на главной странице
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    let currentSlide = 0;
    let slideInterval;
    
    // Функция показа слайда
    function showSlide(index) {
        // Скрываем все слайды
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Убираем активный класс со всех точек
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Показываем текущий слайд
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }
    
    // Следующий слайд
    function nextSlide() {
        let nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }
    
    // Предыдущий слайд
    function prevSlide() {
        let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }
    
    // Автопрокрутка слайдов
    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopSlideShow() {
        clearInterval(slideInterval);
    }
    
    // Обработчики событий
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
    
    // Обработчики для точек
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            stopSlideShow();
            showSlide(index);
            startSlideShow();
        });
    });
    
    // Пауза при наведении на слайдер
    const slider = document.querySelector('.hero-slider');
    if (slider) {
        slider.addEventListener('mouseenter', stopSlideShow);
        slider.addEventListener('mouseleave', startSlideShow);
    }
    
    // Запуск слайдшоу
    startSlideShow();
}

// Фильтры портфолио
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс со всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Получаем категорию для фильтрации
            const filterValue = this.getAttribute('data-filter');
            
            // Фильтрация элементов
            portfolioItems.forEach(item => {
                const categories = item.getAttribute('data-category');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Кнопка "Показать еще"
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // В реальном проекте здесь будет загрузка дополнительных работ с сервера
            alert('В реальном проекте здесь будет загрузка дополнительных работ с сервера');
            this.style.display = 'none';
        });
    }
}

// Табы в магазине
function initShopTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс со всех кнопок
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Скрываем все вкладки
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Показываем выбранную вкладку
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Обновление счетчика в табе корзины
    function updateCartTabCount() {
        const cartTabCount = document.querySelector('.cart-tab-count');
        const cartCount = document.querySelector('.cart-count');
        
        if (cartTabCount && cartCount) {
            cartTabCount.textContent = cartCount.textContent;
        }
    }
    
    // Инициализация счетчика
    updateCartTabCount();
    
    // Слушаем изменения в корзине
    document.addEventListener('cartUpdated', updateCartTabCount);
}

// Фильтры в магазине
function initShopFilters() {
    const priceFilter = document.getElementById('price-filter');
    const sizeFilter = document.getElementById('size-filter');
    const techniqueFilter = document.getElementById('technique-filter');
    const shopItems = document.querySelectorAll('.shop-item');
    
    function filterItems() {
        const priceValue = priceFilter.value;
        const sizeValue = sizeFilter.value;
        const techniqueValue = techniqueFilter.value;
        
        shopItems.forEach(item => {
            const price = item.getAttribute('data-price');
            const size = item.getAttribute('data-size');
            const technique = item.getAttribute('data-technique');
            
            let priceMatch = true;
            let sizeMatch = true;
            let techniqueMatch = true;
            
            // Фильтрация по цене
            if (priceValue !== 'all') {
                const priceNum = parseInt(price);
                
                switch (priceValue) {
                    case 'low':
                        priceMatch = priceNum <= 20000;
                        break;
                    case 'medium':
                        priceMatch = priceNum > 20000 && priceNum <= 50000;
                        break;
                    case 'high':
                        priceMatch = priceNum > 50000;
                        break;
                }
            }
            
            // Фильтрация по размеру
            if (sizeValue !== 'all') {
                sizeMatch = size === sizeValue;
            }
            
            // Фильтрация по технике
            if (techniqueValue !== 'all') {
                techniqueMatch = technique === techniqueValue;
            }
            
            // Показываем/скрываем элемент
            if (priceMatch && sizeMatch && techniqueMatch) {
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
    }
    
    if (priceFilter) priceFilter.addEventListener('change', filterItems);
    if (sizeFilter) sizeFilter.addEventListener('change', filterItems);
    if (techniqueFilter) techniqueFilter.addEventListener('change', filterItems);
}

// Инициализация форм
function initForms() {
    // Форма подписки на новости
    const newsletterForms = document.querySelectorAll('.newsletter-form, .sidebar-newsletter');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                // В реальном проекте здесь будет отправка на сервер
                alert('Спасибо за подписку! Вы будете получать уведомления о новых работах и выставках.');
                emailInput.value = '';
            } else {
                alert('Пожалуйста, введите корректный email адрес.');
                emailInput.focus();
            }
        });
    });
    
    // Форма заказа картины
    const orderForm = document.getElementById('custom-order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Простая валидация
            let isValid = true;
            const requiredFields = this.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = 'red';
                    
                    field.addEventListener('input', function() {
                        this.style.borderColor = '';
                    }, { once: true });
                }
            });
            
            if (isValid) {
                // В реальном проекте здесь будет отправка формы на сервер
                alert('Спасибо за вашу заявку! Я свяжусь с вами в течение 24 часов для обсуждения деталей вашей картины.');
                this.reset();
            } else {
                alert('Пожалуйста, заполните все обязательные поля (отмечены *).');
            }
        });
    }
    
    // Валидация email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

// Анимации при скролле
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .timeline-item, .step');
    
    // Функция проверки видимости элемента
    function checkVisibility() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            // Если элемент виден в области просмотра
            if (elementTop < windowHeight * 0.9 && elementBottom > 0) {
                element.classList.add('visible');
            }
        });
    }
    
    // Проверяем при загрузке и при скролле
    checkVisibility();
    window.addEventListener('scroll', checkVisibility);
}

// Модальные окна
function initModals() {
    // Модальное окно для деталей работы в портфолио
    const viewButtons = document.querySelectorAll('.view-details');
    const workModal = document.getElementById('work-modal');
    
    // Данные для работ (в реальном проекте будут загружаться с сервера)
    const worksData = {
        1: {
            title: '"Рассвет над полем"',
            details: 'Масло, холст • 80×60 см • 2024',
            description: 'Эта работа была создана ранним утром в подмосковном поле. Я стремилась передать не только визуальную красоту рассвета, но и то чувство умиротворения и обновления, которое приходит с первыми лучами солнца. Текстура масла позволяет создать эффект легкой дымки, окутывающей поле.',
            image: 'images/portfolio/work1.jpg',
            price: '45 000 ₽'
        },
        2: {
            title: '"Городские тени"',
            details: 'Акрил, смешанная техника • 100×70 см • 2023',
            description: 'Городской пейзаж, исследующий игру света и тени в архитектурном пространстве. Смешанная техника с использованием акрила и текстурных паст создает эффект рельефа, подчеркивая грубую фактуру городских стен и плавность теней.',
            image: 'images/portfolio/work2.jpg',
            price: '38 000 ₽'
        },
        3: {
            title: '"Тишина моря"',
            details: 'Масло, холст • 90×60 см • 2024',
            description: 'Абстрактная интерпретация морского пейзажа, где цвет и текстура передают не столько визуальный образ, сколько эмоциональное состояние спокойствия и безмятежности, которое дарит море.',
            image: 'images/portfolio/work3.jpg',
            price: '52 000 ₽'
        },
        4: {
            title: '"Линии города"',
            details: 'Уголь, бумага • 50×70 см • 2023',
            description: 'Графическая работа, исследующая геометрию и ритм городской архитектуры. Уголь позволяет создавать глубокие, насыщенные тени и четкие линии, подчеркивающие строгость и лаконичность городских форм.',
            image: 'images/portfolio/work4.jpg',
            price: '18 000 ₽'
        },
        5: {
            title: '"Вечерние огни"',
            details: 'Акрил, холст • 70×90 см • 2022',
            description: 'Картина из серии городских пейзажей, передающая магию вечернего города, когда зажигаются огни и город преображается. Теплые и холодные оттенки создают контраст между искусственным освещением и естественной темнотой ночи.',
            image: 'images/portfolio/work5.jpg',
            price: '42 000 ₽'
        },
        6: {
            title: '"Портрет"',
            details: 'Карандаш, бумага • 40×50 см • 2021',
            description: 'Карандашный портрет, выполненный с натуры. Работа сосредоточена на передаче не только внешнего сходства, но и внутреннего состояния модели, ее характера и эмоций через тонкую работу со светотенью.',
            image: 'images/portfolio/work6.jpg',
            price: '15 000 ₽'
        },
        7: {
            title: '"Осенний лес"',
            details: 'Масло, холст • 80×100 см • 2023',
            description: 'Осенний пейзаж, передающий богатство и многообразие осенних красок. Работа выполнена в технике импасто, что создает эффект объемности и позволяет зрителю буквально почувствовать фактуру листвы и коры деревьев.',
            image: 'images/portfolio/work7.jpg',
            price: '48 000 ₽'
        },
        8: {
            title: '"Метро"',
            details: 'Акрил, смешанная техника • 90×120 см • 2024',
            description: 'Крупноформатная работа из городской серии, посвященная пространству метро. Смешанная техника с использованием акрила, песка и металлической пудры создает эффект движения, шума и энергии подземного города.',
            image: 'images/portfolio/work8.jpg',
            price: '68 000 ₽'
        }
    };
    
    if (viewButtons.length > 0 && workModal) {
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const workId = this.getAttribute('data-work');
                const workData = worksData[workId];
                
                if (workData) {
                    document.getElementById('modal-work-title').textContent = workData.title;
                    document.getElementById('modal-work-details').textContent = workData.details;
                    document.getElementById('modal-work-description').textContent = workData.description;
                    document.getElementById('modal-work-image').src = workData.image;
                    document.getElementById('modal-work-image').alt = workData.title;
                    
                    // Кнопка покупки
                    const buyBtn = document.getElementById('modal-buy-btn');
                    buyBtn.href = `shop.html#ready-works`;
                    
                    // Открываем модальное окно
                    workModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        // Закрытие модального окна
        const closeButtons = workModal.querySelectorAll('.modal-close, .modal-close-btn');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                workModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
        
        // Закрытие при клике вне окна
        workModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Закрытие при нажатии Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && workModal.classList.contains('active')) {
                workModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
}