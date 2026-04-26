const OPENROUTER_API_KEY = "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";
const CORS_PROXY = 'https://api.allorigins.win/get?url=';

/**
 * Parses mixed text or a URL and asks Gemini to structure it as a quiz.
 */
export const extractQuizFromTextOrUrl = async (input, language = 'ru') => {
  try {
    let sourceText = input;

    // 1. Check if input is a URL (to scrape it)
    if (input.trim().startsWith('http://') || input.trim().startsWith('https://')) {
      const url = input.trim();
      const response = await fetch(`${CORS_PROXY}${encodeURIComponent(url)}`);
      
      if (!response.ok) throw new Error('Proxy fetching failed');
      const data = await response.json();
      
      // Basic text extraction from HTML string
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, 'text/html');
      
      // Remove scripts and styles
      Array.from(doc.querySelectorAll('script, style, nav, footer, iframe, img, svg')).forEach(el => el.remove());
      
      sourceText = doc.body.innerText.replace(/\s+/g, ' ').trim();
      
      if (!sourceText) {
        throw new Error('Could not extract readable text from this URL.');
      }
    }

    // 2. Ask Gemini to parse the text into Quiz JSON format
    const prompt = `Ты - AI ассистент образовательной платформы. Тебе дан текст, который может быть скопирован с сайта, из PDF или документа. 
В нем содержатся вопросы для теста/викторины (с вариантами ответов или без них).

Обязательные требования:
1. Найди все вопросы в тексте (отфильтруй мусор, рекламу, меню сайта).
2. Если вариантов ответов нет, ПРИДУМАЙ 3 логичных, соответствующих вопросу, но НЕВЕРНЫХ варианта, 
чтобы в сумме с правильным ответом всегда было ровно 4 варианта.
3. Тщательно переведи каждый вопрос и вариант ответа, чтобы они всегда были на двух языках: на русском (ru) и на казахском (kz).
4. Верни название теста (title) на двух языках (придумай, если его нет).
5. Верни описание теста (description) на двух языках (составь кратко, если его нет).

Ответ верни СТРОГО В ТАКОМ ФОРМАТЕ JSON без форматирования маркерами Markdown:
{
  "titleRu": "Название викторины",
  "titleKz": "Викторина атауы",
  "descRu": "Краткое описание",
  "descKz": "Қысқаша сипаттама",
  "questions": [
    {
      "textRu": "Вопрос 1",
      "textKz": "Сұрақ 1",
      "optionsRu": ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"],
      "optionsKz": ["Нұсқа 1", "Нұсқа 2", "Нұсқа 3", "Нұсқа 4"],
      "correctAnswer": 0
    }
  ]
}
Запомни: correctAnswer — индекс верного ответа от 0 до 3.
Запомни 2: Отвечай ТОЛЬКО чистым JSON, без \`\`\`json. Твоя задача только генерация объекта.

Вот текст для обработки:
${sourceText.substring(0, 15000)}`;

    console.log('Sending request to OpenRouter... Key length:', OPENROUTER_API_KEY ? OPENROUTER_API_KEY.length : 'UNDEFINED');
    const response = await fetch(`https://openrouter.ai/api/v1/chat/completions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API Error:', response.status, errorText);
      
      if (response.status === 503) {
        throw new Error('Сервер AI временно перегружен. Пожалуйста, подождите немного и повторите попытку.');
      } else if (response.status === 429) {
        throw new Error('Превышен лимит запросов в минуту к AI. Попробуйте через полминуты.');
      }
      
      throw new Error(`Error connecting to OpenRouter AI: ${response.status}`);
    }

    const result = await response.json();
    let jsonText = result.choices[0].message.content;
    
    // Safety cleanup just in case
    jsonText = jsonText.replace(/```json\n?|```/g, '').trim();
    
    const parsedData = JSON.parse(jsonText);
    return parsedData;

  } catch (error) {
    console.error('AI Import Error:', error);
    throw new Error('Не удалось спарсить текст. Попробуйте вставить только список вопросов.');
  }
};
