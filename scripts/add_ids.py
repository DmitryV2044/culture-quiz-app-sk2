import json

# Read the quiz data
with open('public/quiz_data.json', 'r', encoding='utf-8') as f:
    quiz_data = json.load(f)

# Add sequential IDs to each painting
for i, painting in enumerate(quiz_data, start=1):
    painting['id'] = i

# Write the updated data back to the file
with open('public/quiz_data.json', 'w', encoding='utf-8') as f:
    json.dump(quiz_data, f, ensure_ascii=False, indent=2)

print("Successfully added IDs to all paintings!") 