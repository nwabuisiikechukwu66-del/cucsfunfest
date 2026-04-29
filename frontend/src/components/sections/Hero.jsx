import { useState, useEffect } from 'react'
import { ArrowDown, Lightning } from '@phosphor-icons/react'
import { getTimeRemaining } from '../../lib/utils.js'
import './Hero.css'

const EVENT_START = '2026-06-15T00:00:00'
const EVENT_MAIN = '2026-06-20T15:00:00'

function CountdownUnit({ value, label }) {
  return (
    <div className="countdown__unit">
      <div className="countdown__value">
        <span>{String(value).padStart(2, '0')}</span>
      </div>
      <div className="countdown__label mono">{label}</div>
    </div>
  )
}

function Countdown({ target, label, accent }) {
  const [time, setTime] = useState(getTimeRemaining(target))

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeRemaining(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  return (
    <div className={`countdown ${accent ? 'countdown--accent' : ''}`}>
      <div className="countdown__header">
        <span className="tag tag-pink mono">{label}</span>
      </div>
      {time.ended ? (
        <div className="countdown__ended mono">— EVENT LIVE —</div>
      ) : (
        <div className="countdown__grid">
          <CountdownUnit value={time.days} label="DAYS" />
          <div className="countdown__sep">:</div>
          <CountdownUnit value={time.hours} label="HRS" />
          <div className="countdown__sep">:</div>
          <CountdownUnit value={time.minutes} label="MIN" />
          <div className="countdown__sep">:</div>
          <CountdownUnit value={time.seconds} label="SEC" />
        </div>
      )}
    </div>
  )
}

const SLIDES = [
  {
    headline: 'DEPARTMENTAL',
    sub: 'FUN FEST',
    tag: 'CODE. CULTURE. COMMUNITY.',
    bg: 'slide-1',
  },
  {
    headline: 'INNOVATE.',
    sub: 'COLLABORATE.',
    tag: 'JUNE 15 – 20, 2026',
    bg: 'slide-2',
  },
  {
    headline: 'THE NIGHT',
    sub: 'OF LEGENDS',
    tag: 'SATURDAY — 20TH JUNE',
    bg: 'slide-3',
  },
]

export default function Hero() {
  const [slide, setSlide] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setSlide(s => (s + 1) % SLIDES.length)
        setAnimating(false)
      }, 400)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  const current = SLIDES[slide]

  const scrollDown = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="hero">
      {/* Background layers */}
      <div className="hero__bg">
        <div className="hero__bg-grid" />
        <div className="hero__bg-glow hero__bg-glow--pink" />
        <div className="hero__bg-glow hero__bg-glow--cyan" />
        <div className="hero__bg-glow hero__bg-glow--yellow" />
        <div className="hero__scanline" />
      </div>

      {/* Paint splatters */}
      <div className="hero__splat hero__splat--1" />
      <div className="hero__splat hero__splat--2" />
      <div className="hero__splat hero__splat--3" />

      <div className="hero__inner container">
        <div className="hero__meta">
          <span className="tag tag-yellow mono">CARITAS UNIVERSITY AMORJI NIKE</span>
          <span className="hero__dot" />
          <span className="tag tag-cyan mono">COMPUTER SCIENCE DEPT.</span>
        </div>

        <div className={`hero__headline ${animating ? 'hero__headline--exit' : 'hero__headline--enter'}`}>
          <div className="hero__presents mono">presents</div>
          <h1 className="hero__title grunge-text">
            <span className="hero__title-line1">{current.headline}</span>
            <span className="hero__title-line2">{current.sub}</span>
          </h1>
          <p className="hero__tagline">{current.tag}</p>
        </div>

        <div className="hero__dates">
          <div className="hero__date-item">
            <div className="hero__date-dot hero__date-dot--yellow" />
            <span className="mono">OPENS: 15TH JUNE 2026</span>
          </div>
          <div className="hero__date-item">
            <div className="hero__date-dot hero__date-dot--pink" />
            <span className="mono">MAIN EVENT: 20TH JUNE — 3PM PROMPT</span>
          </div>
          <div className="hero__date-item">
            <div className="hero__date-dot hero__date-dot--cyan" />
            <span className="mono">VENUE: AUDITORIUM, CARITAS UNIVERSITY</span>
          </div>
        </div>

        <div className="hero__countdowns">
          <Countdown target={EVENT_START} label="KICKOFF COUNTDOWN" />
          <Countdown target={EVENT_MAIN} label="MAIN EVENT COUNTDOWN" accent />
        </div>

        <div className="hero__ctas">
          <button
            className="btn btn-yellow"
            onClick={() => document.querySelector('#tickets')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Lightning size={20} weight="fill" />
            GET YOUR TICKET
          </button>
          <button
            className="btn btn-outline"
            onClick={() => document.querySelector('#schedule')?.scrollIntoView({ behavior: 'smooth' })}
          >
            VIEW SCHEDULE
          </button>
        </div>

        {/* Slide indicators */}
        <div className="hero__dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`hero__dot-btn ${i === slide ? 'hero__dot-btn--active' : ''}`}
              onClick={() => setSlide(i)}
            />
          ))}
        </div>
      </div>

      <button className="hero__scroll-cue" onClick={scrollDown}>
        <ArrowDown size={20} />
        <span className="mono">SCROLL</span>
      </button>
    </section>
  )
}
