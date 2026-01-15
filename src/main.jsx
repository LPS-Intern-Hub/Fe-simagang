import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

localStorage.setItem('token', 'PASTE_TOKEN_JWT_DI_SINI');

localStorage.setItem('user', JSON.stringify({ name: 'Dimas Rizky', role: 'Frontend Intern' }));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)