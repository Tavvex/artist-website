// JavaScript для функционала магазина

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация корзины
    initCart();
    
    // Инициализация быстрого просмотра товаров
    initQuickView();
    
    // Инициализация кнопок добавления в корзину
    initAddToCartButtons();
    
    // Инициализация кнопок избранного
    initWishlistButtons();
    
    // Инициализация формы заказа
    initOrderForm();
});

// Корзина
function initCart() {
    let cart = JSON.parse(localStorage.getItem('artist_cart')) || [];
    
    // Функция обновления отображения корзины
    function updateCartDisplay() {
        const cartCount = document.querySelector('.cart-count');
        const cartTabCount = document.querySelector('.cart-tab-count');
        const cartItemsContainer = document.getElementById('cart-items');
        const cartSummary = document.getElementById('cart-summary');
        const cartTotal = document.getElementById('cart-total');
        const cartGrandTotal = document.getElementById('cart-grand-total');
        const checkoutBtn = document.getElementById('checkout-btn');
        
        // Обновляем счетчики
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (cartCount) cartCount.textContent = totalItems;
        if (cartTabCount) cartTabCount.textContent = totalItems;
        
        if (cartSummary) {
            cartSummary.textContent = `В корзине ${totalItems} ${getNoun(totalItems, 'товар', 'товара', 'товаров')}`;
        }
        
        // Обновляем список товаров в корзине
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-bag"></i>
                        <p>Ваша корзина пуста</p>
                        <a href="shop.html" class="btn btn-primary">Перейти к покупкам</a>
                    </div>
                `;
            } else {
                cart.forEach((item, index) => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.title}">
                        </div>
                        <div class="cart-item-details">
                            <h3 class="cart-item-title">${item.title}</h3>
                            <p class="cart-item-details-text">${item.details}</p>
                            <p class="cart-item-price">${formatPrice(item.price)}</p>
                        </div>
                        <div class="cart-item-actions">
                            <div class="quantity-control">
                                <button class="quantity-btn minus" data-index="${index}">-</button>
                                <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                                <button class="quantity-btn plus" data-index="${index}">+</button>
                            </div>
                            <button class="remove-item" data-index="${index}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                    cartItemsContainer.appendChild(cartItem);
                });
                
                // Добавляем обработчики для кнопок управления количеством
                document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const index = parseInt(this.getAttribute('data-index'));
                        updateQuantity(index, -1);
                    });
                });
                
                document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const index = parseInt(this.getAttribute('data-index'));
                        updateQuantity(index, 1);
                    });
                });
                
                // Добавляем обработчики для кнопок удаления
                document.querySelectorAll('.remove-item').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const index = parseInt(this.getAttribute('data-index'));
                        removeFromCart(index);
                    });
                });
            }
        }
        
        // Обновляем итоговую сумму
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        if (cartTotal) cartTotal.textContent = formatPrice(total);
        if (cartGrandTotal) cartGrandTotal.textContent = formatPrice(total);
        
        // Активируем или деактивируем кнопку оформления заказа
        if (checkoutBtn) {
            if (cart.length === 0) {
                checkoutBtn.disabled = true;
                checkoutBtn.textContent = 'Корзина пуста';
            } else {
                checkoutBtn.disabled = false;
                checkoutBtn.textContent = 'Оформить заказ';
                
                // Обработчик для кнопки оформления заказа
                checkoutBtn.addEventListener('click', function() {
                    // В реальном проекте здесь будет переход к оформлению заказа
                    alert('В реальном проекте здесь будет переход к оформлению заказа. Сумма к оплате: ' + formatPrice(total));
                    
                    // Очистка корзины после оформления
                    cart = [];
                    localStorage.setItem('artist_cart', JSON.stringify(cart));
                    updateCartDisplay();
                    
                    // Событие обновления корзины
                    document.dispatchEvent(new Event('cartUpdated'));
                });
            }
        }
        
        // Сохраняем корзину в localStorage
        localStorage.setItem('artist_cart', JSON.stringify(cart));
        
        // Событие обновления корзины
        document.dispatchEvent(new Event('cartUpdated'));
    }
    
    // Функция добавления товара в корзину
    function addToCart(product) {
        // Проверяем, есть ли уже такой товар в корзине
        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            // Увеличиваем количество, если товар уже есть в корзине
            cart[existingItemIndex].quantity += 1;
        } else {
            // Добавляем новый товар в корзину
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCartDisplay();
        
        // Анимация добавления в корзину
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.classList.add('add-to-cart-animation');
            setTimeout(() => {
                cartIcon.classList.remove('add-to-cart-animation');
            }, 500);
        }
        
        // Уведомление
        showNotification(`"${product.title}" добавлен в корзину`);
    }
    
    // Функция обновления количества товара
    function updateQuantity(index, change) {
        if (cart[index]) {
            cart[index].quantity += change;
            
            // Если количество стало меньше 1, удаляем товар из корзины
            if (cart[index].quantity < 1) {
                cart.splice(index, 1);
                showNotification('Товар удален из корзины');
            }
            
            updateCartDisplay();
        }
    }
    
    // Функция удаления товара из корзины
    function removeFromCart(index) {
        if (cart[index]) {
            const productTitle = cart[index].title;
            cart.splice(index, 1);
            updateCartDisplay();
            showNotification(`"${productTitle}" удален из корзины`);
        }
    }
    
    // Данные о товарах (в реальном проекте будут загружаться с сервера)
    const productsData = {
        1: {
            id: 1,
            title: '"Рассвет над полем"',
            details: 'Масло, холст • 80×60 см • 2024',
            description: 'Эта работа была создана ранним утром в подмосковном поле. Я стремилась передать не только визуальную красоту рассвета, но и то чувство умиротворения и обновления, которое приходит с первыми лучами солнца.',
            image: 'images/shop/work1.jpg',
            price: 45000
        },
        2: {
            id: 2,
            title: '"Городские тени"',
            details: 'Акрил, смешанная техника • 100×70 см • 2023',
            description: 'Городской пейзаж, исследующий игру света и тени в архитектурном пространстве.',
            image: 'images/shop/work2.jpg',
            price: 38000
        },
        3: {
            id: 3,
            title: '"Тишина моря"',
            details: 'Масло, холст • 90×60 см • 2024',
            description: 'Абстрактная интерпретация морского пейзажа, где цвет и текстура передают эмоциональное состояние спокойствия и безмятежности.',
            image: 'images/shop/work3.jpg',
            price: 52000
        },
        4: {
            id: 4,
            title: '"Линии города"',
            details: 'Уголь, бумага • 50×70 см • 2023',
            description: 'Графическая работа, исследующая геометрию и ритм городской архитектуры.',
            image: 'images/shop/work4.jpg',
            price: 18000
        },
        5: {
            id: 5,
            title: '"Вечерние огни"',
            details: 'Акрил, холст • 70×90 см • 2022',
            description: 'Картина из серии городских пейзажей, передающая магию вечернего города.',
            image: 'images/shop/work5.jpg',
            price: 42000
        },
        6: {
            id: 6,
            title: '"Портрет"',
            details: 'Карандаш, бумага • 40×50 см • 2021',
            description: 'Карандашный портрет, выполненный с натуры.',
            image: 'images/shop/work6.jpg',
            price: 15000
        }
    };
    
    // Вспомогательные функции
    function formatPrice(price) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        }).format(price);
    }
    
    function getNoun(number, one, two, five) {
        let n = Math.abs(number);
        n %= 100;
        if (n >= 5 && n <= 20) {
            return five;
        }
        n %= 10;
        if (n === 1) {
            return one;
        }
        if (n >= 2 && n <= 4) {
            return two;
        }
        return five;
    }
    
    function showNotification(message) {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #8a9b8c;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 3000;
            transform: translateX(150%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Показываем уведомление
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Скрываем уведомление через 3 секунды
        setTimeout(() => {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Публичные методы
    window.cartFunctions = {
        addToCart: addToCart,
        updateCartDisplay: updateCartDisplay
    };
    
    // Инициализация отображения корзины
    updateCartDisplay();
}

// Быстрый просмотр товаров
function initQuickView() {
    const quickViewButtons = document.querySelectorAll('.quick-view');
    const productModal = document.getElementById('product-modal');
    
    // Данные о товарах (используем те же, что и для корзины)
    const productsData = window.cartFunctions ? null : {
        // Если cartFunctions не загружен, создаем локальную копию
        1: { id: 1, title: '"Рассвет над полем"', details: 'Масло, холст • 80×60 см • 2024', description: 'Эта работа была создана ранним утром в подмосковном поле.', image: 'images/shop/work1.jpg', price: 45000 },
        2: { id: 2, title: '"Городские тени"', details: 'Акрил, смешанная техника • 100×70 см • 2023', description: 'Городской пейзаж, исследующий игру света и тени.', image: 'images/shop/work2.jpg', price: 38000 },
        3: { id: 3, title: '"Тишина моря"', details: 'Масло, холст • 90×60 см • 2024', description: 'Абстрактная интерпретация морского пейзажа.', image: 'images/shop/work3.jpg', price: 52000 },
        4: { id: 4, title: '"Линии города"', details: 'Уголь, бумага • 50×70 см • 2023', description: 'Графическая работа, исследующая геометрию города.', image: 'images/shop/work4.jpg', price: 18000 },
        5: { id: 5, title: '"Вечерние огни"', details: 'Акрил, холст • 70×90 см • 2022', description: 'Картина из серии городских пейзажей.', image: 'images/shop/work5.jpg', price: 42000 },
        6: { id: 6, title: '"Портрет"', details: 'Карандаш, бумага • 40×50 см • 2021', description: 'Карандашный портрет, выполненный с натуры.', image: 'images/shop/work6.jpg', price: 15000 }
    };
    
    if (quickViewButtons.length > 0 && productModal) {
        quickViewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-product');
                let productData;
                
                // Получаем данные о товаре
                if (window.cartFunctions) {
                    // Пытаемся получить данные из корзины
                    const cart = JSON.parse(localStorage.getItem('artist_cart')) || [];
                    productData = cart.find(item => item.id == productId) || productsData[productId];
                } else {
                    productData = productsData[productId];
                }
                
                if (productData) {
                    document.getElementById('modal-product-title').textContent = productData.title;
                    document.getElementById('modal-product-details').textContent = productData.details;
                    document.getElementById('modal-product-description').textContent = productData.description;
                    document.getElementById('modal-product-image').src = productData.image;
                    document.getElementById('modal-product-image').alt = productData.title;
                    document.getElementById('modal-product-price').textContent = formatPrice(productData.price);
                    
                    // Кнопка добавления в корзину
                    const addToCartBtn = document.getElementById('modal-add-to-cart');
                    addToCartBtn.setAttribute('data-product', productId);
                    
                    // Открываем модальное окно
                    productModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        // Закрытие модального окна
        const closeButtons = productModal.querySelectorAll('.modal-close, .modal-close-btn');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                productModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
        
        // Закрытие при клике вне окна
        productModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Закрытие при нажатии Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && productModal.classList.contains('active')) {
                productModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Форматирование цены
    function formatPrice(price) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        }).format(price);
    }
}

// Кнопки добавления в корзину
function initAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    // Данные о товарах
    const productsData = {
        1: { id: 1, title: '"Рассвет над полем"', details: 'Масло, холст • 80×60 см • 2024', image: 'images/shop/work1.jpg', price: 45000 },
        2: { id: 2, title: '"Городские тени"', details: 'Акрил, смешанная техника • 100×70 см • 2023', image: 'images/shop/work2.jpg', price: 38000 },
        3: { id: 3, title: '"Тишина моря"', details: 'Масло, холст • 90×60 см • 2024', image: 'images/shop/work3.jpg', price: 52000 },
        4: { id: 4, title: '"Линии города"', details: 'Уголь, бумага • 50×70 см • 2023', image: 'images/shop/work4.jpg', price: 18000 },
        5: { id: 5, title: '"Вечерние огни"', details: 'Акрил, холст • 70×90 см • 2022', image: 'images/shop/work5.jpg', price: 42000 },
        6: { id: 6, title: '"Портрет"', details: 'Карандаш, бумага • 40×50 см • 2021', image: 'images/shop/work6.jpg', price: 15000 }
    };
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product');
            const productData = productsData[productId];
            
            if (productData && window.cartFunctions) {
                window.cartFunctions.addToCart(productData);
            }
        });
    });
    
    // Кнопка добавления в корзину в модальном окне
    const modalAddToCartBtn = document.getElementById('modal-add-to-cart');
    if (modalAddToCartBtn) {
        modalAddToCartBtn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product');
            const productsData = {
                1: { id: 1, title: '"Рассвет над полем"', details: 'Масло, холст • 80×60 см • 2024', image: 'images/shop/work1.jpg', price: 45000 },
                2: { id: 2, title: '"Городские тени"', details: 'Акрил, смешанная техника • 100×70 см • 2023', image: 'images/shop/work2.jpg', price: 38000 },
                3: { id: 3, title: '"Тишина моря"', details: 'Масло, холст • 90×60 см • 2024', image: 'images/shop/work3.jpg', price: 52000 },
                4: { id: 4, title: '"Линии города"', details: 'Уголь, бумага • 50×70 см • 2023', image: 'images/shop/work4.jpg', price: 18000 },
                5: { id: 5, title: '"Вечерние огни"', details: 'Акрил, холст • 70×90 см • 2022', image: 'images/shop/work5.jpg', price: 42000 },
                6: { id: 6, title: '"Портрет"', details: 'Карандаш, бумага • 40×50 см • 2021', image: 'images/shop/work6.jpg', price: 15000 }
            };
            
            const productData = productsData[productId];
            
            if (productData && window.cartFunctions) {
                window.cartFunctions.addToCart(productData);
                
                // Закрываем модальное окно
                const productModal = document.getElementById('product-modal');
                if (productModal) {
                    productModal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            }
        });
    }
}

// Кнопки избранного
function initWishlistButtons() {
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            this.querySelector('i').classList.toggle('far');
            this.querySelector('i').classList.toggle('fas');
            
            // Получаем информацию о товаре
            const productCard = this.closest('.shop-card');
            const productTitle = productCard.querySelector('h3').textContent;
            
            if (this.classList.contains('active')) {
                showNotification(`"${productTitle}" добавлен в избранное`);
            } else {
                showNotification(`"${productTitle}" удален из избранного`);
            }
        });
    });
    
    function showNotification(message) {
        // Используем ту же функцию, что и для корзины, или создаем новую
        console.log(message); // В реальном проекте здесь будет отображение уведомления
    }
}

// Форма заказа картины
function initOrderForm() {
    const orderForm = document.getElementById('custom-order-form');
    
    if (orderForm) {
        // Валидация формы
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Проверка обязательных полей
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = 'red';
                    
                    field.addEventListener('input', function() {
                        this.style.borderColor = '';
                    }, { once: true });
                }
            });
            
            // Проверка email
            const emailField = this.querySelector('input[type="email"]');
            if (emailField && emailField.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value.trim())) {
                    isValid = false;
                    emailField.style.borderColor = 'red';
                    alert('Пожалуйста, введите корректный email адрес.');
                    emailField.focus();
                }
            }
            
            if (isValid) {
                // В реальном проекте здесь будет отправка данных на сервер
                alert('Спасибо за вашу заявку! Я свяжусь с вами в течение 24 часов для обсуждения деталей вашей картины.');
                
                // Сброс формы
                this.reset();
                
                // Прокрутка к верху формы
                window.scrollTo({
                    top: document.querySelector('.order-form-container').offsetTop - 100,
                    behavior: 'smooth'
                });
            } else {
                alert('Пожалуйста, заполните все обязательные поля (отмечены *).');
            }
        });
        
        // Подсказки при фокусе
        const textarea = orderForm.querySelector('textarea');
        if (textarea) {
            const charCount = document.createElement('div');
            charCount.className = 'char-count';
            charCount.style.cssText = `
                font-size: 0.9rem;
                color: #777;
                text-align: right;
                margin-top: 5px;
            `;
            textarea.parentNode.appendChild(charCount);
            
            function updateCharCount() {
                const count = textarea.value.length;
                charCount.textContent = `${count} символов`;
                
                if (count < 50) {
                    charCount.style.color = '#e74c3c';
                } else if (count < 100) {
                    charCount.style.color = '#f39c12';
                } else {
                    charCount.style.color = '#777';
                }
            }
            
            textarea.addEventListener('input', updateCharCount);
            updateCharCount();
        }
    }
}