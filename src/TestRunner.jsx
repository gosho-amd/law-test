import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function TestRunner() {
  const location = useLocation()
  const navigate = useNavigate()
  const { year, season } = location.state || {}

  const [test, setTest] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/all_tests.json')
      .then(res => res.json())
      .then(data => {
        console.log('Looking for test:', season, year)
        // Find the specific test based on year and season
        const selectedTest = data.find(t => {
          const titleMatch = t.testTitle.match(/\((пролет|есен) (\d{4})г\.\)/i)
          if (titleMatch) {
            const testSeason = titleMatch[1].toLowerCase()
            const testYear = titleMatch[2]
            return testSeason === season && testYear === year
          }
          return false
        })

        console.log('Found test:', selectedTest)
        setTest(selectedTest)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading test:', error)
        setLoading(false)
      })
  }, [year, season])

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleFinish = () => {
    // Calculate results
    let correct = 0
    test.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++
      }
    })

    const results = {
      totalQuestions: test.questions.length,
      correctAnswers: correct,
      answers: answers,
      test: test
    }

    navigate('/results', { state: results })
  }

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Зареждане...</h1>
      </div>
    )
  }

  if (!test) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Тест не е намерен</h1>
        <button onClick={() => navigate('/')}>Назад към избор</button>
      </div>
    )
  }

  const currentQuestion = test.questions[currentQuestionIndex]

  return (
    <div style={{ padding: '20px' }}>
      <h1>Решаване на тест ({season} {year})</h1>
      <h2>{test.subject}</h2>

      <div style={{ marginBottom: '20px' }}>
        <strong>Въпрос {currentQuestionIndex + 1} от {test.questions.length}</strong>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <p><strong>{currentQuestion.questionText}</strong></p>

        <div style={{ marginTop: '15px' }}>
          {Object.entries(currentQuestion.options).map(([key, value]) => (
            <div key={key} style={{ marginBottom: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={key}
                  checked={answers[currentQuestion.id] === key}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  style={{ marginRight: '10px' }}
                />
                <span>{key}) {value}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          onClick={handlePrevious} 
          disabled={currentQuestionIndex === 0}
          style={{ padding: '10px 20px' }}
        >
          ← Предишен
        </button>

        <span>{currentQuestionIndex + 1} / {test.questions.length}</span>

        {currentQuestionIndex === test.questions.length - 1 ? (
          <button 
            onClick={handleFinish}
            style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Завърши изпита
          </button>
        ) : (
          <button 
            onClick={handleNext}
            style={{ padding: '10px 20px' }}
          >
            Следващ →
          </button>
        )}
      </div>
    </div>
  )
}
