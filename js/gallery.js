// JavaScript для галереи портфолио

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация лайтбокса для галереи
    initLightbox();
    
    // Инициализация кнопки "Загрузить еще"
    initLoadMore();
});

// Лайтбокс для просмотра изображений в галерее
function initLightbox() {
    const galleryImages = document.querySelectorAll('.portfolio-image img');
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="" alt="" class="lightbox-img">
            <div class="lightbox-caption"></div>
            <button class="lightbox-prev">&larr;</button>
            <button class="lightbox-next">&rarr;</button>
        </div>
    `;
    document.body.appendChild(lightbox);
    
    let currentIndex = 0;
    const images = Array.from(galleryImages);
    
    // Открытие лайтбокса
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', function() {
            currentIndex = index;
            updateLightbox();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Обновление содержимого лайтбокса
    function updateLightbox() {
        const lightboxImg = lightbox.querySelector('.lightbox-img');
        const caption = lightbox.querySelector('.lightbox-caption');
        const currentImg = images[currentIndex];
        
        lightboxImg.src = currentImg.src;
        lightboxImg.alt = currentImg.alt;
        
        // Получаем заголовок из родительского элемента
        const workInfo = currentImg.closest('.portfolio-card').querySelector('.portfolio-info h3');
        const workDetails = currentImg.closest('.portfolio-card').querySelector('.portfolio-info p');
        
        if (workInfo && workDetails) {
            caption.innerHTML = `<h3>${workInfo.textContent}</h3><p>${workDetails.textContent}</p>`;
        }
    }
    
    // Закрытие лайтбокса
    lightbox.querySelector('.lightbox-close').addEventListener('click', function() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Закрытие при клике вне изображения
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Навигация
    lightbox.querySelector('.lightbox-prev').addEventListener('click', function(e) {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightbox();
    });
    
    lightbox.querySelector('.lightbox-next').addEventListener('click', function(e) {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % images.length;
        updateLightbox();
    });
    
    // Навигация с помощью клавиатуры
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        } else if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateLightbox();
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % images.length;
            updateLightbox();
        }
    });
    
    // Добавляем стили для лайтбокса
    const lightboxStyles = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        .lightbox.active {
            opacity: 1;
            visibility: visible;
        }
        
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            width: auto;
            height: auto;
        }
        
        .lightbox-img {
            max-width: 100%;
            max-height: 70vh;
            display: block;
            border-radius: 8px;
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
        }
        
        .lightbox-caption {
            position: absolute;
            bottom: -60px;
            left: 0;
            width: 100%;
            color: white;
            text-align: center;
            padding: 10px;
        }
        
        .lightbox-caption h3 {
            color: white;
            margin-bottom: 5px;
            font-size: 1.5rem;
        }
        
        .lightbox-caption p {
            color: #ccc;
            margin: 0;
            font-size: 0.9rem;
        }
        
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .lightbox-close:hover {
            color: #8a9b8c;
        }
        
        .lightbox-prev,
        .lightbox-next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background-color: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            font-size: 1.5rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            transition: background-color 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .lightbox-prev:hover,
        .lightbox-next:hover {
            background-color: rgba(138, 155, 140, 0.7);
        }
        
        .lightbox-prev {
            left: -70px;
        }
        
        .lightbox-next {
            right: -70px;
        }
        
        @media (max-width: 767px) {
            .lightbox-prev,
            .lightbox-next {
                width: 40px;
                height: 40px;
                font-size: 1.2rem;
            }
            
            .lightbox-prev {
                left: 10px;
            }
            
            .lightbox-next {
                right: 10px;
            }
            
            .lightbox-caption {
                bottom: -80px;
            }
            
            .lightbox-caption h3 {
                font-size: 1.2rem;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = lightboxStyles;
    document.head.appendChild(styleSheet);
}

// Кнопка "Загрузить еще" для портфолио
function initLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Симуляция загрузки дополнительных работ
            this.textContent = 'Загрузка...';
            this.disabled = true;
            
            setTimeout(() => {
                // В реальном проекте здесь будет загрузка данных с сервера
                // и добавление новых элементов в сетку
                
                // Пример добавления новых работ
                const portfolioGrid = document.querySelector('.portfolio-grid');
                if (portfolioGrid) {
                    // Создаем дополнительные элементы портфолио
                    // В реальном проекте это будут данные с сервера
                    for (let i = 9; i <= 12; i++) {
                        const newItem = document.createElement('div');
                        newItem.className = 'portfolio-item';
                        newItem.setAttribute('data-category', 'painting');
                        newItem.innerHTML = `
                            <div class="portfolio-card">
                                <div class="portfolio-image">
                                    <img src="images/portfolio/work${i}.jpg" alt="Дополнительная работа ${i}">
                                    <div class="portfolio-overlay">
                                        <button class="view-details" data-work="${i}">Подробнее</button>
                                    </div>
                                </div>
                                <div class="portfolio-info">
                                    <h3>"Дополнительная работа ${i}"</h3>
                                    <p>Масло, холст • ${60+i*5}×${40+i*5} см • 2024</p>
                                </div>
                            </div>
                        `;
                        portfolioGrid.appendChild(newItem);
                    }
                    
                    // Инициализируем кнопки просмотра для новых элементов
                    const newViewButtons = document.querySelectorAll('.portfolio-item:nth-last-child(-n+4) .view-details');
                    initNewViewButtons(newViewButtons);
                }
                
                this.style.display = 'none';
            }, 1500);
        });
    }
    
    // Инициализация кнопок просмотра для новых элементов
    function initNewViewButtons(buttons) {
        // В реальном проекте здесь будет привязка обработчиков событий
        // для новых кнопок просмотра деталей работы
    }
}