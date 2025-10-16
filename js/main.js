// Navigation script
document.addEventListener('DOMContentLoaded', function() {
    // Обработка всех ссылок со якорями (#)
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Пропускаем обработку модальных окон
            if (targetId === '#' || targetId.includes('Modal')) {
                return;
            }
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Замедляем прокрутку с помощью CSS
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
    'SmartHeat Compact 22kW': {
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
    'OilMax Efficiency 30kW': {
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
    'EcoElectric Pro 18kW': {
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
    'MaxPower System 40kW': {
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
    'CondenseMax 26kW': {
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
    'BioPower Wood 32kW': {
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

// Modal functions
function openModal(productName) {
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
            const columns = 4;
            
            // Create grid container
            const gridContainer = document.createElement('div');
            gridContainer.className = 'grid gap-6';
            gridContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
            
            specsArray.forEach(([key, value]) => {
                const specDiv = document.createElement('div');
                specDiv.innerHTML = `
                    <div class="pb-2 border-b border-gray-100">
                        <span class="text-gray-600 font-light text-xs block mb-1">${key}</span>
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

function closeModal() {
    const modal = document.getElementById('productModal');
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
    document.documentElement.style.setProperty('--scrollbar-width', '0px');
}

// Close modal on X button click
document.addEventListener('DOMContentLoaded', function() {
    const closeButton = document.getElementById('closeModal');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    
    // Close modal on overlay click
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Attach click handlers to "Подробнее" buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (button.textContent.trim() === 'Подробнее') {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                // Find the product card and get the product name
                const card = button.closest('.premium-card');
                if (card) {
                    const productName = card.querySelector('h3').textContent.trim();
                    openModal(productName);
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
            
            // Номер телефона для копирования
            const phoneNumber = '+7 (495) 123-4567';
            
            // Используем Clipboard API
            navigator.clipboard.writeText(phoneNumber).then(function() {
                // Успешное копирование
                const originalText = phoneButtonText.textContent;
                
                // Меняем текст кнопки
                phoneButtonText.textContent = '✓ Номер скопирован!';
                copyPhoneButton.classList.add('bg-gold', 'text-white');
                
                // Показываем tooltip
                if (copyTooltip) {
                    copyTooltip.classList.remove('opacity-0');
                    copyTooltip.textContent = 'Скопировано в буфер обмена!';
                }
                
                // Через 2 секунды возвращаем исходный текст
                setTimeout(function() {
                    phoneButtonText.textContent = originalText;
                    copyPhoneButton.classList.remove('bg-gold', 'text-white');
                    if (copyTooltip) {
                        copyTooltip.classList.add('opacity-0');
                        copyTooltip.textContent = 'Нажмите для копирования';
                    }
                }, 2000);
            }).catch(function(err) {
                // Fallback для старых браузеров
                const textArea = document.createElement('textarea');
                textArea.value = phoneNumber;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                document.body.appendChild(textArea);
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    
                    // Успешное копирование
                    const originalText = phoneButtonText.textContent;
                    phoneButtonText.textContent = '✓ Номер скопирован!';
                    copyPhoneButton.classList.add('bg-gold', 'text-white');
                    
                    setTimeout(function() {
                        phoneButtonText.textContent = originalText;
                        copyPhoneButton.classList.remove('bg-gold', 'text-white');
                    }, 2000);
                } catch (err) {
                    console.error('Ошибка копирования:', err);
                    alert('Ошибка копирования номера. Пожалуйста, скопируйте вручную: ' + phoneNumber);
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



// ============ PAGINATION LOGIC ============
let currentPage = 1;
const totalPages = 4;

function updatePagination() {
    // Find all buttons in the pagination container
    const paginationContainer = document.querySelector('.flex.items-center.space-x-3');
    if (!paginationContainer) return;
    
    const allButtons = paginationContainer.querySelectorAll('button');
    let prevBtn, nextBtn;
    const pageButtons = [];
    
    // Classify buttons
    allButtons.forEach(btn => {
        const text = btn.textContent.trim();
        if (btn.querySelector('.ri-arrow-left-s-line')) {
            prevBtn = btn;
        } else if (btn.querySelector('.ri-arrow-right-s-line')) {
            nextBtn = btn;
        } else if (text.match(/^[1-4]$/)) {
            pageButtons.push({ btn, pageNum: parseInt(text) });
        }
    });
    
    // Disable/enable prev button
    if (prevBtn) {
        if (currentPage === 1) {
            prevBtn.disabled = true;
        } else {
            prevBtn.disabled = false;
        }
    }
    
    // Disable/enable next button
    if (nextBtn) {
        if (currentPage === totalPages) {
            nextBtn.disabled = true;
        } else {
            nextBtn.disabled = false;
        }
    }
    
    // Update page number buttons
    pageButtons.forEach(({ btn, pageNum }) => {
        if (currentPage === pageNum) {
            btn.classList.add('bg-primary', 'text-white');
            btn.classList.remove('hover:border-gold', 'hover:text-gold');
        } else {
            btn.classList.remove('bg-primary', 'text-white');
            btn.classList.add('hover:border-gold', 'hover:text-gold');
        }
    });
}

function goToPage(pageNum) {
    if (pageNum >= 1 && pageNum <= totalPages) {
        currentPage = pageNum;
        updatePagination();
        rearrangeCards(pageNum);
        updateModelCount(pageNum);
        // Scroll to top of products
        const productsSection = document.querySelector('.grid.grid-cols-1');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

function updateModelCount(pageNum) {
    const modelCountElement = document.getElementById('modelCount');
    if (!modelCountElement) return;
    
    let count;
    switch(pageNum) {
        case 1:
            count = 12;
            break;
        case 2:
            count = 24;
            break;
        case 3:
            count = 36;
            break;
        case 4:
            count = 48;
            break;
        default:
            count = 12;
    }
    
    modelCountElement.innerHTML = `<span class="font-semibold text-primary">${count}</span> из 48 моделей`;
}

function rearrangeCards(pageNum) {
    const container = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.xl\\:grid-cols-3');
    if (!container) return;
    
    const cards = Array.from(container.querySelectorAll('.premium-card.luxury-border'));
    if (cards.length === 0) return;
    
    let order;
    
    // Define different orders for each page
    switch(pageNum) {
        case 1:
            // Original order: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
            order = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            break;
        case 2:
            // Reverse order
            order = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
            break;
        case 3:
            // Rotate by 6
            order = [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5];
            break;
        case 4:
            // Random shuffle (but deterministic based on page number)
            order = [2, 5, 8, 11, 1, 4, 7, 10, 0, 3, 6, 9];
            break;
        default:
            return;
    }
    
    // Reorder the cards
    order.forEach((originalIndex, newIndex) => {
        if (originalIndex < cards.length) {
            const card = cards[originalIndex];
            container.appendChild(card);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize pagination
    updatePagination();
    
    // Attach click handlers to pagination buttons
    const paginationContainer = document.querySelector('.flex.items-center.space-x-3');
    if (paginationContainer) {
        const allButtons = paginationContainer.querySelectorAll('button');
        
        allButtons.forEach(btn => {
            const text = btn.textContent.trim();
            
            // Previous button
            if (btn.querySelector('.ri-arrow-left-s-line')) {
                btn.addEventListener('click', function() {
                    if (currentPage > 1) goToPage(currentPage - 1);
                });
            }
            
            // Next button
            if (btn.querySelector('.ri-arrow-right-s-line')) {
                btn.addEventListener('click', function() {
                    if (currentPage < totalPages) goToPage(currentPage + 1);
                });
            }
            
            // Page number buttons (1, 2, 3, 4)
            if (text.match(/^[1-4]$/)) {
                btn.addEventListener('click', function() {
                    goToPage(parseInt(text));
                });
            }
        });
    }
});

// ============ CONSULTATION MODAL ============
function openConsultationModal() {
    const modal = document.getElementById('consultationModal');
    if (modal) {
        modal.classList.remove('hidden');
        const scrollbarWidth = getScrollbarWidth();
        document.documentElement.style.setProperty('--scrollbar-width', scrollbarWidth + 'px');
        document.body.classList.add('modal-open');
    }
}

function closeConsultationModal() {
    const modal = document.getElementById('consultationModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('modal-open');
        document.documentElement.style.setProperty('--scrollbar-width', '0px');
    }
}

// Attach event listeners to consultation modal buttons
document.addEventListener('DOMContentLoaded', function() {
    // Open button
    const openButton = document.getElementById('openConsultationModal');
    if (openButton) {
        openButton.addEventListener('click', openConsultationModal);
    }
    
    // Close button
    const closeButton = document.getElementById('closeConsultationModal');
    if (closeButton) {
        closeButton.addEventListener('click', closeConsultationModal);
    }
    
    // Close on overlay click
    const modal = document.getElementById('consultationModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeConsultationModal();
            }
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeConsultationModal();
        }
    });
    
    // Form submission
    const form = document.getElementById('consultationForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone')
            };
            
            // Log data (in real app, send to server)
            console.log('Consultation form submitted:', data);
            
            // Show success message
            alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
            
            // Reset form and close modal
            form.reset();
            closeConsultationModal();
        });
    }
});
