import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import ScannerPage from './pages/ScannerPage.jsx'
import TicketVerifyPage from './pages/TicketVerifyPage.jsx'
import HackerChat from './components/chat/HackerChat.jsx'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/scanner" element={<ScannerPage />} />
        <Route path="/ticket/:code" element={<TicketVerifyPage />} />
      </Routes>
      <HackerChat />
    </>
  )
}
