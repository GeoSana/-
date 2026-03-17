import random
import string
import json

def generate_word_search(words, grid_size=12):
    grid = [['' for _ in range(grid_size)] for _ in range(grid_size)]
    
    # Directions: (dr, dc)
    directions = [
        (0, 1),   # H
        (0, -1),  # H Back
        (1, 0),   # V
        (-1, 0),  # V Back
        (1, 1),   # D
        (-1, -1), # D Back
        (1, -1),  # D2
        (-1, 1)   # D2 Back
    ]
    
    placed_words = []
    
    # Sort words by length descending to place longest words first
    words.sort(key=len, reverse=True)
    
    for word in words:
        placed = False
        attempts = 0
        while not placed and attempts < 200:
            dr, dc = random.choice(directions)
            r = random.randint(0, grid_size - 1)
            c = random.randint(0, grid_size - 1)
            
            # Check if fits
            end_r = r + dr * (len(word) - 1)
            end_c = c + dc * (len(word) - 1)
            
            if 0 <= end_r < grid_size and 0 <= end_c < grid_size:
                # Check for conflicts
                can_place = True
                for i in range(len(word)):
                    curr_r = r + dr * i
                    curr_c = c + dc * i
                    if grid[curr_r][curr_c] != '' and grid[curr_r][curr_c] != word[i]:
                        can_place = False
                        break
                
                if can_place:
                    for i in range(len(word)):
                        grid[r + dr * i][c + dc * i] = word[i]
                    placed = True
                    placed_words.append(word)
            attempts += 1
            
    # Fill remaining with random letters
    letters_ru = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"
    letters_kz = "АӘБВГДЕЁЖЗИЙКҚЛМНҢОӨПРСТУҰҮФХҺЦЧШЩЪЫІЬЭЮЯ"
    
    letters = letters_ru if all(c in letters_ru for c in "".join(words)) else letters_kz

    for r in range(grid_size):
        for c in range(grid_size):
            if grid[r][c] == '':
                grid[r][c] = random.choice(letters)
                
    return grid

# Words to find
target_words_ru = ["АСТАНА", "АЛМАТЫ", "ТАРАЗ", "АКТАУ", "ОТРАР", "СЕМЕЙ", "ШЫМКЕНТ", "КОКШЕТАУ", "ПАВЛОДАР", "АТЫРАУ", "АКТОБЕ", "ТУРКЕСТАН", "УРАЛЬСК", "КОСТАНАЙ"]
target_words_kz = ["АСТАНА", "АЛМАТЫ", "ТАРАЗ", "АҚТАУ", "ОТЫРАР", "СЕМЕЙ", "ШЫМКЕНТ", "КӨКШЕТАУ", "ПАВЛОДАР", "АТЫРАУ", "АҚТӨБЕ", "ТҮРКІСТАН", "ОРАЛ", "ҚОСТАНАЙ"]

grid_ru = generate_word_search(target_words_ru, grid_size=12)
grid_kz = generate_word_search(target_words_kz, grid_size=12)

result = {
    "ru": grid_ru,
    "kz": grid_kz
}

print(json.dumps(result, ensure_ascii=False))
