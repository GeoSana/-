import React from 'react';
import Quizzes from '../features/Quizzes';
import { useGameState } from '../context/GameStateContext';

const QuizPage = () => {
  const { t } = useGameState();

  return (
    <section id="quizzes" style={{ paddingTop: '120px', minHeight: '80vh' }}>
      <div className="container">
        <div className="section-header">
          <h2>{t.testKnowledge}</h2>
          <p>{t.testKnowledgeDesc}</p>
        </div>
        <Quizzes />
      </div>
    </section>
  );
};

export default QuizPage;
