import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function App() {
  const [tests, setTests] = useState([])
  const [year, setYear] = useState('')
  const [season, setSeason] = useState('')
  const [availableSeasons, setAvailableSeasons] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/all_tests.json')
      .then(res => res.json())
      .then(data => {
        console.log('Loaded tests:', data.length) // Debug log
        setTests(data)
      })
      .catch(error => {
        console.error('Error loading tests:', error)
      })
  }, [])

  // Calculate years only when tests are available
  const years = tests.length > 0 ? Array.from(
    new Set(
      tests.map(t => {
        console.log('Processing title:', t.testTitle) // Debug log
        const match = t.testTitle.match(/\((пролет|есен) (\d{4})г\.\)/i)
        console.log('Match result:', match) // Debug log
        return match ? match[2] : null
      }).filter(Boolean)
    )
  ).sort() : []

  console.log('Available years:', years) // Debug log

  useEffect(() => {
    if (year) {
      const seasons = Array.from(
        new Set(
          tests
            .filter(t => t.testTitle.includes(year))
            .map(t => {
              const match = t.testTitle.match(/\((пролет|есен)/i)
              return match ? match[1].toLowerCase() : null
            })
            .filter(Boolean)
        )
      )
      setAvailableSeasons(seasons)
    } else {
      setAvailableSeasons([])
    }
  }, [year, tests])

  useEffect(() => {
    if (year) {
      const seasons = Array.from(
        new Set(
          tests
            .filter(t => t.testTitle.includes(year))
            .map(t => {
              const match = t.testTitle.match(/\((пролет|есен)/i)
              return match ? match[1].toLowerCase() : null
            })
            .filter(Boolean)
        )
      )
      setAvailableSeasons(seasons)
    } else {
      setAvailableSeasons([])
    }
  }, [year, tests])

  const handleStart = () => {
    if (year && season) {
      navigate('/exam', { state: { year, season } })
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Избор на изпит</h1>
      <div>
        <label>Година: </label>
        <select value={year} onChange={e => setYear(e.target.value)}>
          <option value="">-- избери --</option>
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Сесия: </label>
        <select value={season} onChange={e => setSeason(e.target.value)} disabled={!availableSeasons.length}>
          <option value="">-- избери --</option>
          {availableSeasons.map(s => (
            <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>
      <button onClick={handleStart} disabled={!year || !season}>Започни изпит</button>
    </div>
  )
}
