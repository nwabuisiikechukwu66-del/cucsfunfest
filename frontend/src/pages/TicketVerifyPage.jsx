import { useParams } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api.js'
import { CheckCircle, XCircle, Ticket, Clock } from '@phosphor-icons/react'
import { QRCodeSVG } from 'qrcode.react'
import './TicketVerifyPage.css'

export default function TicketVerifyPage() {
  const { code } = useParams()

  // We use a public-safe lookup — only shows name, code, status (no sensitive info)
  // In production you'd want a separate public query
  // For now we show a nice ticket display

  return (
    <div className="ticket-verify">
      <div className="ticket-verify__card">
        <div className="ticket-verify__top">
          <div className="mono" style={{ color: 'var(--yellow)', letterSpacing: '0.3em', fontSize: 12 }}>
            CUCS FUNFEST 2026
          </div>
          <div className="ticket-verify__event">DEPARTMENTAL FUN FEST</div>
          <div className="mono" style={{ color: 'var(--cyan)', fontSize: 11, letterSpacing: '0.2em' }}>
            CODE. CULTURE. COMMUNITY.
          </div>
        </div>

        <div className="ticket-verify__qr">
          <QRCodeSVG
            value={`${window.location.origin}/ticket/${code}`}
            size={200}
            bgColor="transparent"
            fgColor="#FFD700"
            level="H"
          />
        </div>

        <div className="ticket-verify__code mono">{code}</div>

        <div className="ticket-verify__details">
          <div className="ticket-verify__detail">
            <span className="tag tag-yellow">DATE</span>
            <span>20TH JUNE 2026</span>
          </div>
          <div className="ticket-verify__detail">
            <span className="tag tag-pink">TIME</span>
            <span>3PM PROMPT</span>
          </div>
          <div className="ticket-verify__detail">
            <span className="tag tag-cyan">VENUE</span>
            <span>AUDITORIUM, CARITAS UNIV.</span>
          </div>
        </div>

        <div className="ticket-verify__admit mono">— ADMIT ONE —</div>

        <div className="ticket-verify__footer mono">
          Present this QR code at the gate.
          Do not share your ticket link with others.
        </div>

        <div className="ticket-verify__brand mono">
          Built by{' '}
          <a href="https://frankoge.com" target="_blank" rel="noreferrer" style={{ color: 'var(--yellow)' }}>
            frankdotdev
          </a>
        </div>
      </div>
    </div>
  )
}
