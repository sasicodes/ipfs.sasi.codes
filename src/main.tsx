import React from 'react'
import ReactDOM from 'react-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <div className="w-full max-w-2xl py-10 mx-auto">
      <Toaster position='top-right' />
      <App />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
)
