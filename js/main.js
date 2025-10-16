// Navigation script
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const orderButton = document.querySelector('button:contains("Add to Cart")');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
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
        image: 'https://readdy.ai/api/search-image?query=efficient%20gas%20boiler%20with%20compact%20design%20and%20smart%20controls%2C%20professional%20product%20photography%2C%20clean%20white%20background%2C%20modern%20heating%20equipment%2C%20energy%20efficient&width=300&height=200&seq=cat001&orientation=landscape',
        price: '₽2,199',
        rating: '4.6',
        description: 'Компактный газовый котел с интеллектуальным термостатом - идеальное решение для небольших загородных домов. Оснащен системой автоматического отключения и цифровым управлением температурой.',
        type: 'Газовый котел',
        power: '22 kW',
        efficiency: '92%',
        warranty: '5 лет',
        availability: 'В наличии'
    },
    'OilMax Efficiency 30kW': {
        image: 'https://readdy.ai/api/search-image?query=high%20efficiency%20oil%20boiler%20with%20digital%20display%20and%20premium%20build%20quality%2C%20professional%20product%20photography%2C%20clean%20white%20background%2C%20residential%20heating%20equipment%2C%20reliable%20design&width=300&height=200&seq=cat002&orientation=landscape',
        price: '₽3,299',
        rating: '4.8',
        description: 'Высокоэффективный масляный котел для сельской местности. Прочная конструкция из нержавеющей стали обеспечивает долговечность и надежность в любых условиях.',
        type: 'Масляный котел',
        power: '30 kW',
        efficiency: '95%',
        warranty: '7 лет',
        availability: 'В наличии'
    },
    'EcoElectric Pro 18kW': {
        image: 'https://readdy.ai/api/search-image?query=electric%20boiler%20with%20advanced%20temperature%20control%20and%20eco-friendly%20design%2C%20professional%20product%20photography%2C%20clean%20white%20background%2C%20sustainable%20heating%20equipment%2C%20modern%20technology&width=300&height=200&seq=cat003&orientation=landscape',
        price: '₽1,899',
        rating: '4.5',
        description: 'Бесшумный электрический котел с зональным управлением температурой. Экологичное и безопасное решение для домов без газовой сети.',
        type: 'Электрический котел',
        power: '18 kW',
        efficiency: '100%',
        warranty: '3 года',
        availability: 'В наличии'
    },
    'MaxPower System 40kW': {
        image: 'https://readdy.ai/api/search-image?query=premium%20system%20boiler%20with%20stainless%20steel%20construction%20and%20advanced%20controls%2C%20professional%20product%20photography%2C%20clean%20white%20background%2C%20commercial%20grade%20heating%20equipment%2C%20durable%20design&width=300&height=200&seq=cat004&orientation=landscape',
        price: '₽4,199',
        rating: '4.9',
        description: 'Мощный системный котел для больших домов. Обладает встроенным расширительным сосудом и компенсационным клапаном для оптимальной производительности.',
        type: 'Системный котел',
        power: '40 kW',
        efficiency: '94%',
        warranty: '10 лет',
        availability: 'В наличии'
    },
    'CondenseMax 26kW': {
        image: 'https://readdy.ai/api/search-image?query=condensing%20gas%20boiler%20with%20high%20efficiency%20rating%20and%20compact%20footprint%2C%20professional%20product%20photography%2C%20clean%20white%20background%2C%20energy%20saving%20heating%20equipment%2C%20smart%20design&width=300&height=200&seq=cat005&orientation=landscape',
        price: '₽2,799',
        rating: '4.7',
        description: 'Конденсационный газовый котел с КПД 95% - экономит топливо за счет использования скрытой теплоты конденсации водяного пара.',
        type: 'Конденсационный котел',
        power: '26 kW',
        efficiency: '95%',
        warranty: '6 лет',
        availability: 'В наличии'
    },
    'BioPower Wood 32kW': {
        image: 'https://readdy.ai/api/search-image?query=biomass%20boiler%20with%20automatic%20feed%20system%20and%20eco-friendly%20operation%2C%20professional%20product%20photography%2C%20clean%20white%20background%2C%20renewable%20energy%20heating%20equipment%2C%20sustainable%20technology&width=300&height=200&seq=cat006&orientation=landscape',
        price: '₽4,899',
        rating: '4.4',
        description: 'Котел на биомассе с автоматической подачей топлива - экологичное решение на основе возобновляемых источников энергии.',
        type: 'Котел на биомассе',
        power: '32 kW',
        efficiency: '90%',
        warranty: '8 лет',
        availability: 'В наличии'
    }
};

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
        
        // Show modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('productModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
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



// ============ CONSULTATION MODAL ============
function openConsultationModal() {
    const modal = document.getElementById('consultationModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeConsultationModal() {
    const modal = document.getElementById('consultationModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
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
