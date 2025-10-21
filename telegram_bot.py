#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import logging
from datetime import datetime
from flask import Flask, request, jsonify
import requests
from typing import Dict, Optional

# === НАСТРОЙКИ ===

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
app = Flask(__name__)

# === TELEGRAM НАСТРОЙКИ (ОБЯЗАТЕЛЬНО ЗАПОЛНИТЬ!) ===

TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN', '8202488658:AAEmLbY0ZFtUovO4vIPpExbsfkgIy9B2MEg')
CHAT_ID_CONSULTATIONS = os.getenv('CHAT_ID_CONSULTATIONS', '-1004956599962')
CHAT_ID_ORDERS = os.getenv('CHAT_ID_ORDERS', '-1004804285754')
TELEGRAM_API_URL = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"


# === ФУНКЦИИ ОТПРАВКИ ===

def send_telegram_message(chat_id: str, message: str, parse_mode: str = "HTML") -> bool:
    """Отправка сообщения в Telegram чат"""
    try:
        payload = {
            'chat_id': chat_id,
            'text': message,
            'parse_mode': parse_mode
        }
        
        response = requests.post(TELEGRAM_API_URL, json=payload, timeout=10)
        response.raise_for_status()
        
        logger.info(f"✅ Сообщение отправлено в чат {chat_id}")
        return True
        
    except requests.exceptions.RequestException as e:
        logger.error(f"❌ Ошибка отправки в Telegram: {e}")
        return False


# === ФОРМАТИРОВАНИЕ СООБЩЕНИЙ ===

def format_consultation_message(data: Dict) -> str:
    """Форматирование заявки на консультацию"""
    timestamp = datetime.now().strftime("%d.%m.%Y %H:%M:%S")
    
    message = f"""
🔔 <b>НОВАЯ ЗАЯВКА НА КОНСУЛЬТАЦИЮ</b>

📅 <b>Дата и время:</b> {timestamp}

👤 <b>Данные клиента:</b>
━━━━━━━━━━━━━━━━━━━━
• <b>Имя:</b> {data.get('firstName', 'Не указано')}
• <b>Фамилия:</b> {data.get('lastName', 'Не указано')}
• <b>Email:</b> {data.get('email', 'Не указан')}
• <b>Телефон:</b> {data.get('phone', 'Не указан')}

📝 <b>Источник:</b> {data.get('source', 'Главная страница')}

━━━━━━━━━━━━━━━━━━━━
💡 <i>Свяжитесь с клиентом в ближайшее время!</i>
"""
    return message.strip()


def format_order_message(data: Dict) -> str:
    """Форматирование заказа товара"""
    timestamp = datetime.now().strftime("%d.%m.%Y %H:%M:%S")
    
    # Информация о товаре (если есть)
    product_info = ""
    if data.get('productId'):
        product_info = f"""
🛒 <b>Информация о товаре:</b>
━━━━━━━━━━━━━━━━━━━━
• <b>ID товара:</b> {data.get('productId', 'Не указан')}
• <b>Название:</b> {data.get('productName', 'Не указано')}
• <b>Цена:</b> {data.get('productPrice', 'Не указана')}
"""
    
    message = f"""
🛍️ <b>НОВЫЙ ЗАКАЗ</b>

📅 <b>Дата и время:</b> {timestamp}

👤 <b>Данные клиента:</b>
━━━━━━━━━━━━━━━━━━━━
• <b>Имя:</b> {data.get('firstName', 'Не указано')}
• <b>Фамилия:</b> {data.get('lastName', 'Не указано')}
• <b>Email:</b> {data.get('email', 'Не указан')}
• <b>Телефон:</b> {data.get('phone', 'Не указан')}

📍 <b>Адрес доставки:</b>
━━━━━━━━━━━━━━━━━━━━
• <b>Улица:</b> {data.get('street', 'Не указана')}
• <b>Город:</b> {data.get('city', 'Не указан')}
• <b>Индекс:</b> {data.get('zipCode', 'Не указан')}
{product_info}
💰 <b>Итоговая сумма:</b> {data.get('totalAmount', 'Не указана')}

━━━━━━━━━━━━━━━━━━━━
⚡ <i>Обработайте заказ как можно скорее!</i>
"""
    return message.strip()


# === WEBHOOK ENDPOINTS ===

@app.route('/webhook/consultation', methods=['POST'])
def handle_consultation():
    """Обработка заявок на консультацию"""
    try:
        # Получаем данные из POST запроса
        data = request.get_json()
        
        if not data:
            logger.warning("⚠️ Получен пустой запрос на консультацию")
            return jsonify({'status': 'error', 'message': 'No data provided'}), 400
        
        logger.info(f"📥 Получена заявка на консультацию: {data}")
        
        required_fields = ['firstName', 'lastName', 'email', 'phone']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            logger.warning(f"⚠️ Отсутствуют обязательные поля: {missing_fields}")
            return jsonify({
                'status': 'error', 
                'message': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400
        
        message = format_consultation_message(data)
        success = send_telegram_message(CHAT_ID_CONSULTATIONS, message)
        
        if success:
            return jsonify({
                'status': 'success',
                'message': 'Consultation request sent to Telegram'
            }), 200
        else:
            return jsonify({
                'status': 'error',
                'message': 'Failed to send message to Telegram'
            }), 500
            
    except Exception as e:
        logger.error(f"❌ Ошибка обработки консультации: {e}", exc_info=True)
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/webhook/order', methods=['POST'])
def handle_order():
    """Обработка заказов товаров"""
    try:
        # Получаем данные из POST запроса
        data = request.get_json()
        
        if not data:
            logger.warning("⚠️ Получен пустой запрос на заказ")
            return jsonify({'status': 'error', 'message': 'No data provided'}), 400
        
        logger.info(f"📥 Получен заказ: {data}")
        
        required_fields = ['firstName', 'lastName', 'email', 'phone']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            logger.warning(f"⚠️ Отсутствуют обязательные поля: {missing_fields}")
            return jsonify({
                'status': 'error',
                'message': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400
        
        message = format_order_message(data)
        success = send_telegram_message(CHAT_ID_ORDERS, message)
        
        if success:
            return jsonify({
                'status': 'success',
                'message': 'Order sent to Telegram'
            }), 200
        else:
            return jsonify({
                'status': 'error',
                'message': 'Failed to send message to Telegram'
            }), 500
            
    except Exception as e:
        logger.error(f"❌ Ошибка обработки заказа: {e}", exc_info=True)
        return jsonify({'status': 'error', 'message': str(e)}), 500


# === СЛУЖЕБНЫЕ ENDPOINTS ===

@app.route('/health', methods=['GET'])
def health_check():
    """Проверка работоспособности"""
    return jsonify({
        'status': 'healthy',
        'service': 'HeatMax Pro Telegram Bot',
        'timestamp': datetime.now().isoformat()
    }), 200


@app.route('/', methods=['GET'])
def index():
    """Главная страница с информацией"""
    return """
    <html>
        <head>
            <title>HeatMax Pro Telegram Bot</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
                h1 { color: #9b8b4f; }
                .endpoint { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 5px; }
                code { background: #e0e0e0; padding: 2px 5px; border-radius: 3px; }
            </style>
        </head>
        <body>
            <h1>🤖 HeatMax Pro Telegram Bot</h1>
            <p>Бот для обработки заявок с сайта котлов HeatMax Pro</p>
            
            <h2>📡 Доступные Endpoints:</h2>
            
            <div class="endpoint">
                <strong>POST /webhook/consultation</strong><br>
                Прием заявок на консультацию
            </div>
            
            <div class="endpoint">
                <strong>POST /webhook/order</strong><br>
                Прием заказов товаров
            </div>
            
            <div class="endpoint">
                <strong>GET /health</strong><br>
                Проверка здоровья сервиса
            </div>
            
            <h2>✅ Статус:</h2>
            <p style="color: green; font-weight: bold;">Бот работает нормально</p>
        </body>
    </html>
    """


# === ЗАПУСК ===

if __name__ == '__main__':
    logger.info("🚀 Запуск Telegram бота для HeatMax Pro...")
    logger.info("📍 Сервер доступен на http://localhost:5001")
    logger.info("✅ Чат консультаций: -1004956599962")
    logger.info("✅ Чат заказов: -1004804285754")
    app.run(host='0.0.0.0', port=5001, debug=False)
