import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Run with: node scripts/generate_questions.js
// Ensure VITE_GEMINI_API_KEY is in .env in root

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const QUIZ_FILE = path.join(__dirname, '../src/data/quizzes.json');
const ENV_FILE = path.join(__dirname, '../.env');

// Read API Key from .env
let envContent = '';
try {
  envContent = fs.readFileSync(ENV_FILE, 'utf-8');
} catch (e) {
  console.log('No .env file found.');
}

const match = envContent.match(/VITE_GEMINI_API_KEY=(.+)/);
const API_KEY = match ? match[1].trim() : process.env.VITE_GEMINI_API_KEY;

if (!API_KEY || API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
  console.error("Please set a valid VITE_GEMINI_API_KEY in .env");
  process.exit(1);
}

const promptText = `
Сіз Қазақстанның географиясы, экономикасы, туризмі және флорасы/фаунасы туралы викторина сұрақтарын жасайтын экспертсіз.
Қазақстан туралы 15 мүлдем жаңа, бірегей қиындығы орташа және қиын сұрақтар құрастырыңыз. Олардың жауаптары анық әрі нақты болуы тиіс.
Мәліметтерді келесі құрылымдағы JSON массив түрінде шығарыңыз. Жауаптардың индексі 0-ден 3-ке дейін.

[
  {
    "id": 999, // генератор үшін бос қала берсін
    "question": {
      "ru": "Вопрос на русском",
      "kz": "Сұрақ қазақша"
    },
    "options": {
      "ru": ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"],
      "kz": ["Нұсқа 1", "Нұсқа 2", "Нұсқа 3", "Нұсқа 4"]
    },
    "correctAnswer": 0, // Дұрыс жауаптың индексі
    "explanation": {
      "ru": "Полезное объяснение...",
      "kz": "Қысқаша түсініктеме..."
    }
  }
]

ЕСКЕРТУ: Тек JSON массивті қайтарыңыз. \`\`\`json таңбаларын қолданбаңыз. Кодсыз тек таза массив мәтінін жазыңыз.
`;

async function generateQuestions() {
  console.log("Generating 15 questions via Gemini API...");
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: { temperature: 0.8 },
      })
    });

    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;
    
    // Clean up markdown wrapping if present
    text = text.replace(/^```json/g, '').replace(/```$/g, '').trim();
    
    const newQuestions = JSON.parse(text);
    if (!Array.isArray(newQuestions)) throw new Error("API didn't return an array.");

    console.log(`Successfully generated ${newQuestions.length} questions. Saving...`);
    
    // Read existing
    const quizzesData = JSON.parse(fs.readFileSync(QUIZ_FILE, 'utf-8'));
    const genQuiz = quizzesData.find(q => q.id === 'kz-geo-general');
    
    if (genQuiz) {
      let maxId = genQuiz.questions.reduce((max, q) => Math.max(max, q.id || 0), 0);
      newQuestions.forEach(q => {
        q.id = ++maxId;
      });
      genQuiz.questions.push(...newQuestions);
      fs.writeFileSync(QUIZ_FILE, JSON.stringify(quizzesData, null, 2));
      console.log(`Saved! Total questions in 'kz-geo-general': ${genQuiz.questions.length}`);
    } else {
      console.error("Quiz 'kz-geo-general' not found in file.");
    }

  } catch (error) {
    console.error("Error generating questions:", error.message);
  }
}

generateQuestions();
