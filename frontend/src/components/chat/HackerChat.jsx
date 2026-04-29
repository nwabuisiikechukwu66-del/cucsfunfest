import { useState, useRef, useEffect } from 'react'
import { Terminal, X, PaperPlaneTilt, CaretDown } from '@phosphor-icons/react'
import './HackerChat.css'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || ''

const SYSTEM_PROMPT = `You are HACKER, the AI assistant for CUCS FunFest 2026 — the Caritas University Computer Science Departmental Week. You have a sharp, witty, tech-savvy personality. You're cool and direct. No fluff. No filler. You respond like a senior dev who's seen it all but still gets hyped about good events.

Key facts you know:
- Event: CUCS Departmental FunFest 2026
- Theme: Code. Culture. Community.
- Dates: June 15–20, 2026 (Mon, Tue, Thu, Fri, Sat)
- Monday June 15: Corporate/Tech Talks — OPENING DAY
- Tuesday June 16: Games Day / Football (100L vs 200L)
- Thursday June 18: Garri Day
- Friday June 19: Jersey Day, Football/Basketball Finals (400L)
- Saturday June 20: Dinner, Awards, Entertainment, Fashion — THE MAIN EVENT — 3PM PROMPT
- Venue: Auditorium, Caritas University Amorji Nike
- Tickets: Purchase on this website. Price depends on your year level.
- Final year students get a different price tier (you don't share the exact amount — tell them to check on the ticket section)
- Payment: Paystack (card/USSD) or bank transfer
- Contact: OBUM — 07087293234 / BIGJOE — 08159041361 (WhatsApp)
- Social: @caritas_csc on Instagram and X (Twitter)
- Built by frankdotdev (frankoge.com) — Hackverse Software Solutions

Rules:
- Keep responses under 80 words. Be punchy.
- Use terminal-style formatting occasionally: "→", ">_", "//", etc.
- Never say "I am an AI" — you're HACKER, period.
- Don't share that final year price is ₦5,000. Just say "register in the ticket section to see your price."
- If they ask something off-topic, redirect cleverly back to FunFest.
- Hype the event. Make people want to be there.`

const QUICK_QUESTIONS = [
  'When is the main event?',
  'How do I get a ticket?',
  'What happens on Monday?',
  'Who do I contact?',
  'What is FunFest?',
]

export default function HackerChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '>_ HACKER online.\n\nWelcome to CUCS FunFest 2026. Ask me anything — schedule, tickets, contact. I don\'t waste your time.',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(0)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setUnread(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return

    setInput('')
    const userMsg = { role: 'user', content: msg }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages,
            userMsg,
          ],
          max_tokens: 200,
          temperature: 0.8,
        }),
      })

      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content || '>_ Signal lost. Try again.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      if (!open) setUnread(u => u + 1)
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '>_ Connection error. Try again or hit up OBUM on WhatsApp: 07087293234'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      {/* Toggle button */}
      <button
        className={`hacker-toggle ${open ? 'hacker-toggle--open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle Hacker AI"
      >
        {open ? <X size={22} /> : <Terminal size={22} weight="bold" />}
        {!open && <span className="hacker-toggle__label mono">HACKER</span>}
        {!open && unread > 0 && (
          <span className="hacker-toggle__badge">{unread}</span>
        )}
      </button>

      {/* Chat panel */}
      <div className={`hacker-chat ${open ? 'hacker-chat--open' : ''}`}>
        {/* Header */}
        <div className="hacker-chat__header">
          <div className="hacker-chat__header-left">
            <Terminal size={18} weight="bold" color="var(--yellow)" />
            <div>
              <div className="hacker-chat__title mono">HACKER_v1.0</div>
              <div className="hacker-chat__status mono">
                <span className="hacker-chat__status-dot" />
                online · CUCS FunFest AI
              </div>
            </div>
          </div>
          <button className="hacker-chat__close" onClick={() => setOpen(false)}>
            <CaretDown size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="hacker-chat__messages">
          {messages.map((m, i) => (
            <div key={i} className={`hacker-msg hacker-msg--${m.role}`}>
              {m.role === 'assistant' && (
                <div className="hacker-msg__sender mono">HACKER_AI</div>
              )}
              <div className="hacker-msg__bubble">
                {m.content.split('\n').map((line, j) => (
                  <span key={j}>{line}{j < m.content.split('\n').length - 1 ? <br /> : null}</span>
                ))}
              </div>
            </div>
          ))}

          {loading && (
            <div className="hacker-msg hacker-msg--assistant">
              <div className="hacker-msg__sender mono">HACKER_AI</div>
              <div className="hacker-msg__bubble hacker-msg__loading mono">
                <span>_</span><span>_</span><span>_</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Quick questions */}
        {messages.length < 3 && (
          <div className="hacker-quick">
            {QUICK_QUESTIONS.map(q => (
              <button key={q} className="hacker-quick__btn mono" onClick={() => send(q)}>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="hacker-chat__input-area">
          <span className="hacker-chat__prompt mono">&gt;_</span>
          <textarea
            ref={inputRef}
            className="hacker-chat__input mono"
            placeholder="Ask about FunFest..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
          />
          <button
            className="hacker-chat__send"
            onClick={() => send()}
            disabled={!input.trim() || loading}
          >
            <PaperPlaneTilt size={18} weight="fill" />
          </button>
        </div>
      </div>
    </>
  )
}
