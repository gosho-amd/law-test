import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function TestRunner() {
  const location = useLocation()
  const navigate = useNavigate()
  const { year, season } = location.state || {}

  return (
    <div style={{ padding: '20px' }}>
      <h1>Решаване на тест ({season} {year})</h1>
      <p>Тук ще се зареждат въпросите от JSON базата.</p>
      <button onClick={() => navigate('/results')}>Завърши изпита</button>
    </div>
  )
}
