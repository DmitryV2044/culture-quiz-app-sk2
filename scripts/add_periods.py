import json
import re
from datetime import datetime

def parse_date(date_str):
    # Remove any extra spaces and convert to lowercase
    date_str = date_str.lower().strip()
    
    # Extract year if present
    year_match = re.search(r'(\d{4})', date_str)
    if year_match:
        year = int(year_match.group(1))
        return year
    
    # Handle BC dates
    if 'до нашей эры' in date_str or 'до н.э.' in date_str:
        year_match = re.search(r'(\d+)', date_str)
        if year_match:
            return -int(year_match.group(1))
    
    # Handle century-based dates
    century_match = re.search(r'(\d+)\s*век', date_str)
    if century_match:
        century = int(century_match.group(1))
        base_year = (century - 1) * 100
        
        if 'начало' in date_str:
            return base_year + 5
        elif 'первая половина' in date_str:
            return base_year + 25
        elif 'середина' in date_str:
            return base_year + 50
        elif 'вторая половина' in date_str:
            return base_year + 75
        elif 'конец' in date_str:
            return base_year + 95
        else:
            return base_year + 50  # default to middle of century
    
    # Handle specific years mentioned
    if 'район' in date_str:
        year_match = re.search(r'(\d{4})', date_str)
        if year_match:
            return int(year_match.group(1))
    
    # Handle specific decades
    if '30-е' in date_str or '40-е' in date_str:
        if '20 века' in date_str:
            return 1935
    if '50-е' in date_str:
        if '20 века' in date_str:
            return 1955
    if '60-е' in date_str:
        if '20 века' in date_str:
            return 1965
    
    return None

def get_period(year):
    if year is None:
        return "Unknown"
    
    if year < -3000:
        return "Prehistoric"
    elif year < -1000:
        return "Ancient"
    elif year < 500:
        return "Early Medieval"
    elif year < 1400:
        return "Medieval"
    elif year < 1600:
        return "Renaissance"
    elif year < 1800:
        return "Baroque"
    elif year < 1900:
        return "Modern"
    else:
        return "Contemporary"

def main():
    # Read the JSON file
    with open('public/quiz_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Process each artwork
    for artwork in data:
        year = parse_date(artwork['date'])
        artwork['period'] = get_period(year)
        artwork['year'] = year  # Adding year for potential future use
    
    # Save the updated JSON
    with open('public/quiz_data_with_periods.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main() 