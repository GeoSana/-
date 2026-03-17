import os
import shutil
import json

# Paths
artifact_dir = r'C:\Users\user\.gemini\antigravity\brain\19a52772-0391-49da-89b2-87fcd0aef86d'
target_dir = r'c:\Users\user\Desktop\Индира Апай сайт\public\assets\images\quizzes\countries'
quizzes_path = r'c:\Users\user\Desktop\Индира Апай сайт\src\data\quizzes.json'

# Mapping generated files to target names
mapping = {
    "kazakhstan_steppe_quest_1773663987662.png": "kazakhstan.png",
    "france_paris_quest_1773664010568.png": "france.png",
    "italy_colosseum_quest_1773664026863.png": "italy.png",
    "japan_temple_quest_1773664042237.png": "japan.png",
    "brazil_rio_quest_1773664060012.png": "brazil.png",
    "india_taj_mahal_quest_1773664076901.png": "india.png",
    "china_great_wall_quest_1773664094301.png": "china.png"
}

# 1. Move files
if not os.path.exists(target_dir):
    os.makedirs(target_dir)

for src_name, dst_name in mapping.items():
    src_path = os.path.join(artifact_dir, src_name)
    dst_path = os.path.join(target_dir, dst_name)
    if os.path.exists(src_path):
        shutil.copy2(src_path, dst_path)
        print(f"Copied {src_name} to {dst_name}")
    else:
        print(f"Warning: {src_path} not found")

# 2. Update quizzes.json
with open(quizzes_path, 'r', encoding='utf-8') as f:
    quizzes = json.load(f)

# Find world-emoji quiz
for quiz in quizzes:
    if quiz['id'] == 'world-emoji':
        # Q1: Kazakhstan
        quiz['questions'][0]['image'] = "/assets/images/quizzes/countries/kazakhstan.png"
        # Q2: France
        quiz['questions'][1]['image'] = "/assets/images/quizzes/countries/france.png"
        # Q3: Italy
        quiz['questions'][2]['image'] = "/assets/images/quizzes/countries/italy.png"
        # Q4: Japan
        quiz['questions'][3]['image'] = "/assets/images/quizzes/countries/japan.png"
        # Q5: Brazil
        quiz['questions'][4]['image'] = "/assets/images/quizzes/countries/brazil.png"
        # Q6: India
        quiz['questions'][5]['image'] = "/assets/images/quizzes/countries/india.png"
        # Q7: China
        quiz['questions'][6]['image'] = "/assets/images/quizzes/countries/china.png"
        
        # Cleanup visual placeholder if present
        for q in quiz['questions']:
            if 'visual' in q:
                del q['visual']

with open(quizzes_path, 'w', encoding='utf-8') as f:
    json.dump(quizzes, f, ensure_ascii=False, indent=2)

print("Successfully updated world-emoji quiz in quizzes.json.")
