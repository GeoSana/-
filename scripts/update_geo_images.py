import os
import shutil
import json

# Paths
artifact_dir = r'C:\Users\user\.gemini\antigravity\brain\19a52772-0391-49da-89b2-87fcd0aef86d'
target_dir = r'c:\Users\user\Desktop\Индира Апай сайт\public\assets\images\quizzes\cities'
quizzes_path = r'c:\Users\user\Desktop\Индира Апай сайт\src\data\quizzes.json'

# Mapping generated files to target names
mapping = {
    "astana_cityscape_1773663448193.png": "astana.png",
    "aktobe_landscape_1773663462773.png": "aktobe.png",
    "baikonur_cosmodrome_1773663478541.png": "baikonur.png",
    "irtysh_river_1773663497238.png": "irtysh.png",
    "khan_tengri_peak_1773663513868.png": "khantengri.png",
    "russia_kazakhstan_border_1773663526780.png": "border.png",
    "kazakhstan_regions_map_1773663540748.png": "regions.png",
    "altai_mountains_kz_1773663556303.png": "altai.png",
    "caspian_sea_coast_1773663573409.png": "caspian.png",
    "karagiye_depression_1773663592423.png": "karagiye.png"
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

# Find kz-geo-general quiz
for quiz in quizzes:
    if quiz['id'] == 'kz-geo-general':
        # Question 1: Astana
        quiz['questions'][0]['image'] = "/assets/images/quizzes/cities/astana.png"
        # Question 2: Aktobe
        quiz['questions'][1]['image'] = "/assets/images/quizzes/cities/aktobe.png"
        # Question 3: Baikonur
        quiz['questions'][2]['image'] = "/assets/images/quizzes/cities/baikonur.png"
        # Question 4: Irtysh
        quiz['questions'][3]['image'] = "/assets/images/quizzes/cities/irtysh.png"
        # Question 5: Khan Tengri
        quiz['questions'][4]['image'] = "/assets/images/quizzes/cities/khantengri.png"
        # Question 6: Border
        quiz['questions'][5]['image'] = "/assets/images/quizzes/cities/border.png"
        # Question 7: Regions
        quiz['questions'][6]['image'] = "/assets/images/quizzes/cities/regions.png"
        # Question 8: Altai
        quiz['questions'][7]['image'] = "/assets/images/quizzes/cities/altai.png"
        # Question 9: Caspian
        quiz['questions'][8]['image'] = "/assets/images/quizzes/cities/caspian.png"
        # Question 10: Karagiye
        quiz['questions'][9]['image'] = "/assets/images/quizzes/cities/karagiye.png"

        # Also cleanup the 'visual' property if it exists from previous run
        for q in quiz['questions']:
            if 'visual' in q and q['visual'].startswith('/assets'):
                del q['visual']

with open(quizzes_path, 'w', encoding='utf-8') as f:
    json.dump(quizzes, f, ensure_ascii=False, indent=2)

print("Successfully updated quizzes.json with new image paths.")
