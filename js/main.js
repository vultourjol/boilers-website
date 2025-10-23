// Navigation script
document.addEventListener('DOMContentLoaded', function() {
    // Handle all anchor links (#)
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Skip modal windows
            if (targetId === '#' || targetId.includes('Modal')) {
                return;
            }
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Slow down scrolling with CSS
                document.documentElement.style.scrollBehavior = 'smooth';
            }
        });
    });
});

// Filters script
document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const radios = document.querySelectorAll('input[type="radio"]');
    
    checkboxes.forEach(checkbox => {
        // Find parent label
        const label = checkbox.closest('label');
        if (!label) return;
        
        const customCheckbox = label.querySelector('.checkbox-custom');
        const checkmark = label.querySelector('.checkmark');
        
        if (!customCheckbox || !checkmark) return;
        
        // Handle checkbox click
        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {
                checkmark.style.opacity = '1';
                customCheckbox.style.borderColor = '#8FA67E';
                customCheckbox.style.backgroundColor = '#f5f9f3';
            } else {
                checkmark.style.opacity = '0';
                customCheckbox.style.borderColor = '#d1d5db';
                customCheckbox.style.backgroundColor = 'white';
            }
        });
        
        // Handle custom checkbox click
        customCheckbox.addEventListener('click', function(e) {
            e.preventDefault();
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        });
    });
    
    radios.forEach(radio => {
        // Find parent label
        const label = radio.closest('label');
        if (!label) return;
        
        const customRadio = label.querySelector('.radio-custom');
        const radioDot = label.querySelector('.radio-dot');
        
        if (!customRadio || !radioDot) return;
        
        // Handle radio click
        radio.addEventListener('change', function() {
            const name = radio.getAttribute('name');
            const allRadios = document.querySelectorAll(`input[name="${name}"]`);
            
            allRadios.forEach(r => {
                const l = r.closest('label');
                if (!l) return;
                const customR = l.querySelector('.radio-custom');
                const dotR = l.querySelector('.radio-dot');
                
                if (customR && dotR) {
                    dotR.style.opacity = '0';
                    customR.style.borderColor = '#d1d5db';
                    customR.style.backgroundColor = 'white';
                }
            });
            
            radioDot.style.opacity = '1';
            customRadio.style.borderColor = '#8FA67E';
            customRadio.style.backgroundColor = '#f5f9f3';
        });
        
        // Handle custom radio click
        customRadio.addEventListener('click', function(e) {
            e.preventDefault();
            radio.checked = true;
            radio.dispatchEvent(new Event('change', { bubbles: true }));
        });
    });
    
    // Reset filters button
    const resetButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Сброс фильтров')
    );
    
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            // Reset all checkboxes
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            });
            
            // Reset all radios
            radios.forEach(radio => {
                radio.checked = false;
                radio.dispatchEvent(new Event('change', { bubbles: true }));
            });
            
            // Reset price slider to middle value
            const slider = document.querySelector('.slider');
            if (slider) {
                slider.value = (parseInt(slider.min) + parseInt(slider.max)) / 2;
                slider.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    }
});

// ============ MODAL WINDOW FOR PRODUCTS ============
// Product data
const productData = {
    'Zetka KL47': {
        image: 'src/boilers/1.webp',
        price: '₽200,199',
        rating: '4.6',
        description: 'Компактный газовый котел с интеллектуальным термостатом - идеальное решение для небольших загородных домов. Оснащен системой автоматического отключения и цифровым управлением температурой.',
        type: 'Газовый котел',
        power: '22 kW',
        efficiency: '92%',
        warranty: '5 лет',
        availability: 'В наличии',
        specs: {
            'Вид котла': 'Газовый',
            'Отапливаемая площадь, м²': '450',
            'Установка': 'Настенная',
            'Макс. температура теплоносителя, C': '85±5',
            'Диаметр дымохода, мм': '180',
            'Камера сгорания': 'Открытая',
            'КПД, %': '92',
            'Макс. давление отопления, бар': '5',
            'Производитель': 'Кентау',
            'Подключения холодной воды, дюйм': '1/2"',
            'Класс электробезопасности': '1',
            'Мощность, кВт': '22',
            'Вид топлива': 'Газ/Сж.газ',
            'Кол-во контуров': 'Одноконтурный',
            'Гарантия': '5 лет',
            'Датчик уличной температуры': 'Опция',
            'Комнатный термостат': 'Опция',
            'Потребляемая мощность, Вт': '12',
            'Высота, мм': '1100',
            'Ширина, мм': '600',
            'Вес, кг': '28'
        }
    },
    'Metalhui BX92': {
        image: 'src/boilers/2.webp',
        price: '₽300,299',
        rating: '4.8',
        description: 'Высокоэффективный масляный котел для сельской местности. Прочная конструкция из нержавеющей стали обеспечивает долговечность и надежность в любых условиях.',
        type: 'Масляный котел',
        power: '30 kW',
        efficiency: '95%',
        warranty: '7 лет',
        availability: 'В наличии',
        specs: {
            'Вид котла': 'Масляный',
            'Отапливаемая площадь, м²': '800',
            'Установка': 'Напольная',
            'Макс. температура теплоносителя, C': '90±5',
            'Диаметр дымохода, мм': '200',
            'Камера сгорания': 'Закрытая',
            'КПД, %': '95',
            'Макс. давление отопления, бар': '6',
            'Производитель': 'Финляндия',
            'Подключения холодной воды, дюйм': '3/4"',
            'Класс электробезопасности': '1',
            'Мощность, кВт': '30',
            'Вид топлива': 'Дизель',
            'Кол-во контуров': 'Одноконтурный',
            'Гарантия': '7 лет',
            'Датчик уличной температуры': 'Есть',
            'Комнатный термостат': 'Опция',
            'Потребляемая мощность, Вт': '18',
            'Высота, мм': '1200',
            'Ширина, мм': '800',
            'Вес, кг': '85'
        }
    },
    'Optimus VD23': {
        image: 'src/boilers/3.webp',
        price: '₽100,899',
        rating: '4.5',
        description: 'Бесшумный электрический котел с зональным управлением температурой. Экологичное и безопасное решение для домов без газовой сети.',
        type: 'Электрический котел',
        power: '18 kW',
        efficiency: '100%',
        warranty: '3 года',
        availability: 'В наличии',
        specs: {
            'Вид котла': 'Электрический',
            'Отапливаемая площадь, м²': '350',
            'Установка': 'Настенная',
            'Макс. температура теплоносителя, C': '80±3',
            'Диаметр дымохода, мм': '0',
            'Камера сгорания': 'Отсутствует',
            'КПД, %': '100',
            'Макс. давление отопления, бар': '5',
            'Производитель': 'Германия',
            'Подключения холодной воды, дюйм': '1/2"',
            'Класс электробезопасности': '2',
            'Мощность, кВт': '18',
            'Вид топлива': 'Электричество',
            'Кол-во контуров': 'Одноконтурный',
            'Гарантия': '3 года',
            'Датчик уличной температуры': 'Опция',
            'Комнатный термостат': 'Есть',
            'Потребляемая мощность, Вт': '18000',
            'Высота, мм': '450',
            'Ширина, мм': '400',
            'Вес, кг': '12'
        }
    },
    'Zetka MN81': {
        image: 'src/boilers/4.webp',
        price: '₽4,199',
        rating: '4.9',
        description: 'Мощный системный котел для больших домов. Обладает встроенным расширительным сосудом и компенсационным клапаном для оптимальной производительности.',
        type: 'Системный котел',
        power: '40 kW',
        efficiency: '94%',
        warranty: '10 лет',
        availability: 'В наличии',
        specs: {
            'Вид котла': 'Газовый комбинированный',
            'Отапливаемая площадь, м²': '1200',
            'Установка': 'Напольная',
            'Макс. температура теплоносителя, C': '92±5',
            'Диаметр дымохода, мм': '250',
            'Камера сгорания': 'Закрытая с вентилятором',
            'КПД, %': '94',
            'Макс. давление отопления, бар': '8',
            'Производитель': 'Швеция',
            'Подключения холодной воды, дюйм': '1"',
            'Класс электробезопасности': '1',
            'Мощность, кВт': '40',
            'Вид топлива': 'Газ',
            'Кол-во контуров': 'Двухконтурный',
            'Гарантия': '10 лет',
            'Датчик уличной температуры': 'Есть',
            'Комнатный термостат': 'Есть',
            'Потребляемая мощность, Вт': '25',
            'Высота, мм': '1350',
            'Ширина, мм': '900',
            'Вес, кг': '120'
        }
    },
    'Metalhui TR56': {
        image: 'src/boilers/5.webp',
        price: '₽2,799',
        rating: '4.7',
        description: 'Конденсационный газовый котел с КПД 95% - экономит топливо за счет использования скрытой теплоты конденсации водяного пара.',
        type: 'Конденсационный котел',
        power: '26 kW',
        efficiency: '95%',
        warranty: '6 лет',
        availability: 'В наличии',
        specs: {
            'Вид котла': 'Газовый конденсационный',
            'Отапливаемая площадь, м²': '600',
            'Установка': 'Настенная',
            'Макс. температура теплоносителя, C': '88±5',
            'Диаметр дымохода, мм': '150',
            'Камера сгорания': 'Закрытая',
            'КПД, %': '95',
            'Макс. давление отопления, бар': '7',
            'Производитель': 'Италия',
            'Подключения холодной воды, дюйм': '3/4"',
            'Класс электребезопасности': '1',
            'Мощность, кВт': '26',
            'Вид топлива': 'Газ/Сж.газ',
            'Кол-во контуров': 'Двухконтурный',
            'Гарантия': '6 лет',
            'Датчик уличной температуры': 'Опция',
            'Комнатный термостат': 'Опция',
            'Потребляемая мощность, Вт': '16',
            'Высота, мм': '950',
            'Ширина, мм': '650',
            'Вес, кг': '35'
        }
    },
    'Optimus FG34': {
        image: 'src/boilers/6.webp',
        price: '₽4,899',
        rating: '4.4',
        description: 'Котел на биомассе с автоматической подачей топлива - экологичное решение на основе возобновляемых источников энергии.',
        type: 'Котел на биомассе',
        power: '32 kW',
        efficiency: '90%',
        warranty: '8 лет',
        availability: 'В наличии',
        specs: {
            'Вид котла': 'Биомасса с автоподачей',
            'Отапливаемая площадь, м²': '900',
            'Установка': 'Напольная',
            'Макс. температура теплоносителя, C': '90±5',
            'Диаметр дымохода, мм': '220',
            'Камера сгорания': 'Открытая',
            'КПД, %': '90',
            'Макс. давление отопления, бар': '6',
            'Производитель': 'Австрия',
            'Подключения холодной воды, дюйм': '3/4"',
            'Класс электробезопасности': '1',
            'Мощность, кВт': '32',
            'Вид топлива': 'Древесные пеллеты',
            'Кол-во контуров': 'Одноконтурный',
            'Гарантия': '8 лет',
            'Датчик уличной температуры': 'Есть',
            'Комнатный термостат': 'Опция',
            'Потребляемая мощность, Вт': '20',
            'Высота, мм': '1400',
            'Ширина, мм': '950',
            'Вес, кг': '150'
        }
    }
};

// Calculate scrollbar width
function getScrollbarWidth() {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);
    const inner = document.createElement('div');
    outer.appendChild(inner);
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    return scrollbarWidth;
}

// Modal functions - declare in global scope
window.openModal = function(productName) {
    const modal = document.getElementById('productModal');
    const product = productData[productName];
    
    if (product) {
        // Fill modal with product data
        document.getElementById('modalProductImage').src = product.image;
        document.getElementById('modalProductName').textContent = productName;
        document.getElementById('modalProductPrice').textContent = product.price;
        document.getElementById('modalProductRating').textContent = product.rating;
        document.getElementById('modalProductDescription').textContent = product.description;
        document.getElementById('specType').textContent = product.type;
        document.getElementById('specPower').textContent = product.power;
        document.getElementById('specEfficiency').textContent = product.efficiency;
        document.getElementById('specWarranty').textContent = product.warranty;
        document.getElementById('specAvailability').textContent = product.availability;
        
        // Fill full specifications table
        const specsTable = document.getElementById('fullSpecsTable');
        if (specsTable && product.specs) {
            specsTable.innerHTML = '';
            const specsArray = Object.entries(product.specs);
            
            // Определяем количество колонок в зависимости от размера экрана
            const getColumns = () => {
                if (window.innerWidth < 640) return 1; // mobile
                if (window.innerWidth < 1024) return 2; // tablet
                return 4; // desktop
            };
            
            const columns = getColumns();
            
            // Create grid container
            const gridContainer = document.createElement('div');
            gridContainer.className = 'grid gap-2 sm:gap-3';
            gridContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
            
            specsArray.forEach(([key, value]) => {
                const specDiv = document.createElement('div');
                specDiv.innerHTML = `
                    <div class="pb-1.5 border-b border-gray-100">
                        <span class="text-gray-600 font-light text-xs block mb-0.5">${key}</span>
                        <span class="font-semibold text-xs">${value}</span>
                    </div>
                `;
                gridContainer.appendChild(specDiv);
            });
            
            specsTable.appendChild(gridContainer);
        }
        
        // Show modal and prevent body scroll
        modal.classList.remove('hidden');
        const scrollbarWidth = getScrollbarWidth();
        document.documentElement.style.setProperty('--scrollbar-width', scrollbarWidth + 'px');
        document.body.classList.add('modal-open');
    }
}

window.closeModal = function() {
    const modal = document.getElementById('productModal');
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
    document.documentElement.style.setProperty('--scrollbar-width', '0px');
}

// Close modal on X button click
document.addEventListener('DOMContentLoaded', function() {
    const closeButton = document.getElementById('closeModal');
    if (closeButton) {
        closeButton.addEventListener('click', window.closeModal);
    }
    
    // Close modal on overlay click
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                window.closeModal();
            }
        });
    }
});

// Attach click handlers to product cards and "Подробнее" buttons
document.addEventListener('DOMContentLoaded', function() {
    // Handle click on entire product card
    const productCards = document.querySelectorAll('.premium-card');
    productCards.forEach(card => {
        card.style.cursor = 'pointer'; // Add pointer cursor to show it's clickable
        
        card.addEventListener('click', function(e) {
            // Get the product name from the card
            const productName = card.querySelector('h3').textContent.trim();
            window.openModal(productName);
        });
    });
    
    // Also handle "Подробнее" buttons (for backward compatibility)
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (button.textContent.trim() === 'Подробнее') {
            button.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent double trigger from card click
                e.preventDefault();
                // Find the product card and get the product name
                const card = button.closest('.premium-card');
                if (card) {
                    const productName = card.querySelector('h3').textContent.trim();
                    window.openModal(productName);
                }
            });
        }
    });
});

// ============ COPY PHONE NUMBER ============
document.addEventListener('DOMContentLoaded', function() {
    const copyPhoneButton = document.getElementById('copyPhoneButton');
    const phoneButtonText = document.getElementById('phoneButtonText');
    const copyTooltip = document.getElementById('copyTooltip');
    
    if (copyPhoneButton) {
        copyPhoneButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Phone number to copy
            const phoneNumber = '+7 (495) 123-4567';
            
            // Use Clipboard API
            navigator.clipboard.writeText(phoneNumber).then(function() {
                // Copy successful
                const originalText = phoneButtonText.textContent;
                
                // Change button text
                phoneButtonText.textContent = '✓ Номер скопирован!';
                copyPhoneButton.classList.add('bg-gold', 'text-white');
                
                // Show tooltip
                if (copyTooltip) {
                    copyTooltip.classList.remove('opacity-0');
                    copyTooltip.textContent = 'Скопировано в буфер обмена!';
                }
                
                // Restore original text after 2 seconds
                setTimeout(function() {
                    phoneButtonText.textContent = originalText;
                    copyPhoneButton.classList.remove('bg-gold', 'text-white');
                    if (copyTooltip) {
                        copyTooltip.classList.add('opacity-0');
                        copyTooltip.textContent = 'Click to copy';
                    }
                }, 2000);
            }).catch(function(err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = phoneNumber;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                document.body.appendChild(textArea);
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    
                    // Copy successful
                    const originalText = phoneButtonText.textContent;
                    phoneButtonText.textContent = '✓ Номер скопирован!';
                    copyPhoneButton.classList.add('bg-gold', 'text-white');
                    
                    setTimeout(function() {
                        phoneButtonText.textContent = originalText;
                        copyPhoneButton.classList.remove('bg-gold', 'text-white');
                    }, 2000);
                } catch (err) {
                    console.error('Copy error:', err);
                    alert('Error copying number. Please copy manually: ' + phoneNumber);
                }
                
                document.body.removeChild(textArea);
            });
        });
    }
});

// ============ DOUBLE RANGE SLIDERS ============
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize price range slider
    const priceSliderMin = document.getElementById('priceSliderMin');
    const priceSliderMax = document.getElementById('priceSliderMax');
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const priceTrack = document.getElementById('priceTrack');
    
    if (priceSliderMin && priceSliderMax) {
        function updatePriceTrack() {
            const minVal = parseInt(priceSliderMin.value);
            const maxVal = parseInt(priceSliderMax.value);
            const minPercent = ((minVal - priceSliderMin.min) / (priceSliderMin.max - priceSliderMin.min)) * 100;
            const maxPercent = ((maxVal - priceSliderMax.min) / (priceSliderMax.max - priceSliderMax.min)) * 100;
            
            if (priceTrack) {
                priceTrack.style.left = minPercent + '%';
                priceTrack.style.right = (100 - maxPercent) + '%';
                priceTrack.style.transition = 'none';
            }
            
            priceMin.value = minVal;
            priceMax.value = maxVal;
        }
        
        priceSliderMin.addEventListener('input', function() {
            if (parseInt(priceSliderMin.value) > parseInt(priceSliderMax.value)) {
                priceSliderMin.value = priceSliderMax.value;
            }
            updatePriceTrack();
        });
        
        priceSliderMin.addEventListener('pointerdown', function() {
            if (priceTrack) priceTrack.style.transition = 'none';
        });
        
        priceSliderMax.addEventListener('input', function() {
            if (parseInt(priceSliderMax.value) < parseInt(priceSliderMin.value)) {
                priceSliderMax.value = priceSliderMin.value;
            }
            updatePriceTrack();
        });
        
        priceSliderMax.addEventListener('pointerdown', function() {
            if (priceTrack) priceTrack.style.transition = 'none';
        });
        
        priceMin.addEventListener('input', function() {
            const value = this.value === '' ? 0 : parseInt(this.value);
            const val = Math.max(0, value);
            if (val > parseInt(priceMax.value)) {
                this.value = priceMax.value;
            } else {
                this.value = val;
            }
            priceSliderMin.value = this.value;
            updatePriceTrack();
        });
        
        priceMax.addEventListener('input', function() {
            const value = this.value === '' ? 600000 : parseInt(this.value);
            const val = Math.min(600000, value);
            if (val < parseInt(priceMin.value)) {
                this.value = priceMin.value;
            } else {
                this.value = val;
            }
            priceSliderMax.value = this.value;
            updatePriceTrack();
        });
        
        updatePriceTrack();
    }
    
    // Initialize power range slider
    const powerSliderMin = document.getElementById('powerSliderMin');
    const powerSliderMax = document.getElementById('powerSliderMax');
    const powerMin = document.getElementById('powerMin');
    const powerMax = document.getElementById('powerMax');
    const powerTrack = document.getElementById('powerTrack');
    
    if (powerSliderMin && powerSliderMax) {
        function updatePowerTrack() {
            const minVal = parseInt(powerSliderMin.value);
            const maxVal = parseInt(powerSliderMax.value);
            const minPercent = ((minVal - powerSliderMin.min) / (powerSliderMin.max - powerSliderMin.min)) * 100;
            const maxPercent = ((maxVal - powerSliderMax.min) / (powerSliderMax.max - powerSliderMax.min)) * 100;
            
            if (powerTrack) {
                powerTrack.style.left = minPercent + '%';
                powerTrack.style.right = (100 - maxPercent) + '%';
                powerTrack.style.transition = 'none';
            }
            
            powerMin.value = minVal;
            powerMax.value = maxVal;
        }
        
        powerSliderMin.addEventListener('input', function() {
            if (parseInt(powerSliderMin.value) > parseInt(powerSliderMax.value)) {
                powerSliderMin.value = powerSliderMax.value;
            }
            updatePowerTrack();
        });
        
        powerSliderMin.addEventListener('pointerdown', function() {
            if (powerTrack) powerTrack.style.transition = 'none';
        });
        
        powerSliderMax.addEventListener('input', function() {
            if (parseInt(powerSliderMax.value) < parseInt(powerSliderMin.value)) {
                powerSliderMax.value = powerSliderMin.value;
            }
            updatePowerTrack();
        });
        
        powerSliderMax.addEventListener('pointerdown', function() {
            if (powerTrack) powerTrack.style.transition = 'none';
        });
        
        powerMin.addEventListener('input', function() {
            const value = this.value === '' ? 0 : parseInt(this.value);
            const val = Math.max(0, value);
            if (val > parseInt(powerMax.value)) {
                this.value = powerMax.value;
            } else {
                this.value = val;
            }
            powerSliderMin.value = this.value;
            updatePowerTrack();
        });
        
        powerMax.addEventListener('input', function() {
            const value = this.value === '' ? 100 : parseInt(this.value);
            const val = Math.min(100, value);
            if (val < parseInt(powerMin.value)) {
                this.value = powerMin.value;
            } else {
                this.value = val;
            }
            powerSliderMax.value = this.value;
            updatePowerTrack();
        });
        
        updatePowerTrack();
    }
    
    // Initialize area range slider
    const areaSliderMin = document.getElementById('areaSliderMin');
    const areaSliderMax = document.getElementById('areaSliderMax');
    const areaMin = document.getElementById('areaMin');
    const areaMax = document.getElementById('areaMax');
    const areaTrack = document.getElementById('areaTrack');
    
    if (areaSliderMin && areaSliderMax) {
        function updateAreaTrack() {
            const minVal = parseInt(areaSliderMin.value);
            const maxVal = parseInt(areaSliderMax.value);
            const minPercent = ((minVal - areaSliderMin.min) / (areaSliderMin.max - areaSliderMin.min)) * 100;
            const maxPercent = ((maxVal - areaSliderMax.min) / (areaSliderMax.max - areaSliderMax.min)) * 100;
            
            if (areaTrack) {
                areaTrack.style.left = minPercent + '%';
                areaTrack.style.right = (100 - maxPercent) + '%';
                areaTrack.style.transition = 'none';
            }
            
            areaMin.value = minVal;
            areaMax.value = maxVal;
        }
        
        areaSliderMin.addEventListener('input', function() {
            if (parseInt(areaSliderMin.value) > parseInt(areaSliderMax.value)) {
                areaSliderMin.value = areaSliderMax.value;
            }
            updateAreaTrack();
        });
        
        areaSliderMin.addEventListener('pointerdown', function() {
            if (areaTrack) areaTrack.style.transition = 'none';
        });
        
        areaSliderMax.addEventListener('input', function() {
            if (parseInt(areaSliderMax.value) < parseInt(areaSliderMin.value)) {
                areaSliderMax.value = areaSliderMin.value;
            }
            updateAreaTrack();
        });
        
        areaSliderMax.addEventListener('pointerdown', function() {
            if (areaTrack) areaTrack.style.transition = 'none';
        });
        
        areaMin.addEventListener('input', function() {
            const value = this.value === '' ? 0 : parseInt(this.value);
            const val = Math.max(0, value);
            if (val > parseInt(areaMax.value)) {
                this.value = areaMax.value;
            } else {
                this.value = val;
            }
            areaSliderMin.value = this.value;
            updateAreaTrack();
        });
        
        areaMax.addEventListener('input', function() {
            const value = this.value === '' ? 10000 : parseInt(this.value);
            const val = Math.min(10000, value);
            if (val < parseInt(areaMin.value)) {
                this.value = areaMin.value;
            } else {
                this.value = val;
            }
            areaSliderMax.value = this.value;
            updateAreaTrack();
        });
        
        updateAreaTrack();
    }
});

// ============ CONSULTATION MODAL ============
// Declare functions in global scope to make them accessible to inline onclick handlers
window.openConsultationModal = function() {
    const modal = document.getElementById('consultationModal');
    if (modal) {
        modal.classList.remove('hidden');
        const scrollbarWidth = getScrollbarWidth();
        document.documentElement.style.setProperty('--scrollbar-width', scrollbarWidth + 'px');
        document.body.classList.add('modal-open');
    }
}

window.closeConsultationModal = function() {
    const modal = document.getElementById('consultationModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('modal-open');
        document.documentElement.style.setProperty('--scrollbar-width', '0px');
    }
}

// Attach event listeners to consultation modal buttons
document.addEventListener('DOMContentLoaded', function() {
    // Open button - both inline onclick and by ID
    const openButton = document.getElementById('openConsultationModal');
    if (openButton) {
        openButton.addEventListener('click', window.openConsultationModal);
    }
    
    // Close button
    const closeButton = document.getElementById('closeConsultationModal');
    if (closeButton) {
        closeButton.addEventListener('click', window.closeConsultationModal);
    }
    
    // Close on overlay click
    const modal = document.getElementById('consultationModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                window.closeConsultationModal();
            }
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const consultationModal = document.getElementById('consultationModal');
            const productModal = document.getElementById('productModal');
            
            if (consultationModal && !consultationModal.classList.contains('hidden')) {
                window.closeConsultationModal();
            }
            if (productModal && !productModal.classList.contains('hidden')) {
                window.closeModal();
            }
        }
    });
    
    // Form submission
    const form = document.getElementById('consultationForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                source: 'Main page - consultation form'
            };
            
            // Log data
            console.log('Consultation form submitted:', data);
            
            // Send to Telegram bot webhook
            try {
                // IMPORTANT: Replace URL with your server address with running bot
                const WEBHOOK_URL = 'http://localhost:5001/webhook/consultation';
                
                const response = await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    // Show success message
                    alert('✅ Thank you! Your request has been sent. We will contact you soon.');
                    
                    // Reset form and close modal
                    form.reset();
                    window.closeConsultationModal();
                } else {
                    throw new Error('Send error');
                }
            } catch (error) {
                console.error('Error sending request:', error);
                alert('⚠️ An error occurred while sending the request. Please try again later or contact us by phone.');
            }
        });
    }
});

// ============ ORDER FORM SUBMISSION ============
document.addEventListener('DOMContentLoaded', function() {
    // Handle order form on order.html page
    const orderForm = document.querySelector('.bg-white.rounded-xl.shadow-sm.border.border-gray-200 form, form#orderForm');
    const submitOrderButton = document.querySelector('button:contains("Submit order")');
    
    // Find "Submit order" button more reliably
    const buttons = document.querySelectorAll('button');
    let orderButton = null;
    buttons.forEach(btn => {
        if (btn.textContent.includes('Отправить заказ')) {
            orderButton = btn;
        }
    });
    
    if (orderButton) {
        orderButton.addEventListener('click', async function(e) {
            e.preventDefault();
            
            // Collect data from all order form fields
            const firstNameInput = document.querySelector('input[type="text"]');
            const lastNameInputs = document.querySelectorAll('input[type="text"]');
            const emailInput = document.querySelector('input[type="email"]');
            const phoneInput = document.querySelector('input[type="tel"]');
            const streetInput = lastNameInputs[2]; // third text input
            const cityInput = lastNameInputs[3];
            const zipInput = lastNameInputs[4];
            
            // Get product info from localStorage or URL params
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('productId') || 'Not specified';
            const productName = urlParams.get('productName') || 'Not specified';
            const productPrice = urlParams.get('productPrice') || 'Not specified';
            
            const orderData = {
                firstName: firstNameInput?.value || '',
                lastName: lastNameInputs[1]?.value || '',
                email: emailInput?.value || '',
                phone: phoneInput?.value || '',
                street: streetInput?.value || '',
                city: cityInput?.value || '',
                zipCode: zipInput?.value || '',
                productId: productId,
                productName: productName,
                productPrice: productPrice,
                totalAmount: productPrice
            };
            
            // Validate required fields
            if (!orderData.firstName || !orderData.lastName || !orderData.email || !orderData.phone) {
                alert('⚠️ Please fill in all required fields!');
                return;
            }
            
            console.log('Order form submitted:', orderData);
            
            // Send to Telegram bot webhook
            try {
                // IMPORTANT: Replace URL with your server address with running bot
                const WEBHOOK_URL = 'http://localhost:5001/webhook/order';
                
                const response = await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData)
                });
                
                if (response.ok) {
                    alert('✅ Thank you for your order! We will contact you soon for confirmation.');
                    
                    // Redirect to main page after 2 seconds
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                } else {
                    throw new Error('Order send error');
                }
            } catch (error) {
                console.error('Error sending order:', error);
                alert('⚠️ An error occurred while placing the order. Please try again later or contact us by phone: +7 (495) 123-4567');
            }
        });
    }
});

// ============ SHOPPING CART SYSTEM ============
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartUI();
    }

    loadCart() {
        const savedCart = localStorage.getItem('shoppingCart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.items));
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartUI();
        this.showNotification(product.name);
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
            this.updateCartUI();
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => {
            const price = parseFloat(item.price.replace(/[^\d]/g, ''));
            return total + (price * item.quantity);
        }, 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    updateCartUI() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const count = this.getItemCount();
        
        cartCountElements.forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    showNotification(productName) {
        // Remove existing notification if any
        const existing = document.querySelector('.cart-notification');
        if (existing) existing.remove();

        // Create notification
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="ri-checkbox-circle-fill text-green-500 text-2xl"></i>
                <div>
                    <p class="font-semibold">Товар добавлен в корзину</p>
                    <p class="text-sm text-gray-600">${productName}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Hide and remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartUI();
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Handle "Add to Cart" buttons in modal
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('productModal');
    
    if (modal) {
        // Find all "Add to Cart" buttons in modal
        const addToCartButtons = modal.querySelectorAll('button');
        
        addToCartButtons.forEach(button => {
            if (button.textContent.trim().includes('В корзину')) {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Get current product data from modal
                    const productName = document.getElementById('modalProductName').textContent;
                    const productPrice = document.getElementById('modalProductPrice').textContent;
                    const productImage = document.getElementById('modalProductImage').src;
                    
                    // Product name is the key in productData
                    if (productData[productName]) {
                        cart.addItem({
                            id: productName,
                            name: productName,
                            price: productPrice,
                            image: productImage
                        });
                        
                        // Close modal after adding to cart using the global function
                        if (typeof window.closeModal === 'function') {
                            window.closeModal();
                        }
                    }
                });
            }
        });
    }
});

// Handle cart button click
document.addEventListener('DOMContentLoaded', function() {
    const cartButton = document.getElementById('cartButton');
    
    if (cartButton) {
        cartButton.addEventListener('click', function(e) {
            e.preventDefault();
            // For now, redirect to order page or show cart modal
            // You can implement a cart modal later
            window.location.href = 'order.html';
        });
    }
});
