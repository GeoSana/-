import json
import codecs
import re

file_path = "src/data/quizzes.json"

try:
    # Read the JSON file, robustly handling encoding
    with open(file_path, "rb") as f:
        content_bytes = f.read()

    # Detect encoding and decode
    if content_bytes.startswith(codecs.BOM_UTF16_LE):
        content_str = content_bytes.decode('utf-16-le')
    elif content_bytes.startswith(codecs.BOM_UTF16_BE):
        content_str = content_bytes.decode('utf-16-be')
    else:
        content_str = content_bytes.decode('utf-8')

    # Remove BOM if present in utf-8
    if content_str.startswith('\ufeff'):
        content_str = content_str[1:]

    # Parse JSON to ensure it's valid
    data = json.loads(content_str)

    # Perform literal string replacements directly on the formatted JSON string
    updated_str = json.dumps(data, ensure_ascii=False, indent=2)

    updated_str = re.sub(r'Бұл кімнің туы\?', 'Бұл қай елдің туы?', updated_str)
    updated_str = re.sub(r'ҚР қалаларын іздеу', 'Қазақстан қалаларын табу', updated_str)
    updated_str = re.sub(r'Поиск городов РК', 'Найти города Казахстана', updated_str)

    # Write back forcing pure UTF-8 encoding (no BOM, standard for web)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(updated_str)
    print("Done! Formatted to standard UTF-8.")

except Exception as e:
    print(f"Error: {e}")
