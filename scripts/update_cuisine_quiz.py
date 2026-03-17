import json
import os

filepath = r'c:\Users\user\Desktop\Индира Апай сайт\src\data\quizzes.json'

with open(filepath, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Mapping of cuisine question IDs to image filenames
cuisine_images = {
    1: 'Кумыс.jpeg',
    2: 'Бешбармак.jpg',
    3: 'Бауырсак.jpg',
    4: 'Наурызкоже.jpg',
    5: 'Шубат.webp',
    6: 'Куырдак.jpg',
    7: 'Жент.jpg',
    8: 'Курт.jpg',
    9: 'Казы.jpg',
    10: 'Шелпек.jpg'
}

for quiz in data:
    if quiz['id'] == 'kz-cuisine':
        for q in quiz['questions']:
            qid = q.get('id')
            if qid in cuisine_images:
                q['image'] = f'/assets/images/quizzes/cuisine/{cuisine_images[qid]}'
                if 'visual' in q:
                    del q['visual']

with open(filepath, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Successfully updated cuisine quiz with local images.")
