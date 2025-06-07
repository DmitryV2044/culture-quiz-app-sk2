import json

def translate_period(period):
    translations = {
        "Prehistoric": "Доисторический период",
        "Ancient": "Античность",
        "Early Medieval": "Раннее Средневековье",
        "Medieval": "Средневековье",
        "Renaissance": "Возрождение",
        "Baroque": "Барокко",
        "Modern": "Новое время",
        "Contemporary": "Современное искусство",
        "Unknown": "Неизвестный период"
    }
    return translations.get(period, period)

def main():
    # Read the JSON file with periods
    with open('public/quiz_data_with_periods.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Translate periods for each artwork
    for artwork in data:
        artwork['period'] = translate_period(artwork['period'])
    
    # Save the updated JSON
    with open('public/quiz_data_with_russian_periods.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main() 