const fs = require('fs');
const path = require('path');

try {
  const filePath = path.join(__dirname, '..', 'src', 'data', 'quizzes.json');
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex replacement for all occurrences of "Бұл кімнің туы?"
  content = content.replace(/Бұл кімнің туы\?/g, 'Бұл қай елдің туы?');

  // Replace title for cities word search
  content = content.replace(/ҚР қалаларын іздеу/g, 'Қазақстан қалаларын табу');
  content = content.replace(/Поиск городов РК/g, 'Найти города Казахстана');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated quizzes.json');
} catch (e) {
  console.error('Error updating quizzes.json:', e);
}
