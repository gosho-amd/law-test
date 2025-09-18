import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import TestRunner from './TestRunner'
import Results from './Results'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/exam' element={<TestRunner />} />
        <Route path='/results' element={<Results />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
