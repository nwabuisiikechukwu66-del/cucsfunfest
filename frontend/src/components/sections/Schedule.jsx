import { useState } from 'react'
import { CalendarBlank, Clock, Confetti, GameController, Coffee, TShirt, Trophy } from '@phosphor-icons/react'
import './Schedule.css'

const DAYS = [
  {
    day: 'MON',
    date: 'June 15',
    color: 'yellow',
    label: 'OPENING DAY',
    icon: CalendarBlank,
    title: 'Corporate & Tech Talks',
    desc: 'Industry guests, tech presentations, CS project showcases. The week kicks off with brains first.',
    activities: ['Corporate Talks', 'Tech Presentations', 'Project Showcases', 'Networking'],
  },
  {
    day: 'TUE',
    date: 'June 16',
    color: 'pink',
    label: 'GAMES DAY',
    icon: GameController,
    title: 'Games Day / Football',
    desc: '100L vs 200L in the most heated football match the department has ever seen. Plus indoor games.',
    activities: ['Football: 100L vs 200L', 'Indoor Games', 'Outdoor Games', 'Prizes'],
  },
  {
    day: 'THU',
    date: 'June 18',
    color: 'cyan',
    label: 'GARRI DAY',
    icon: Coffee,
    title: 'Garri Day',
    desc: 'Nigerian culture meets campus vibes. Garri, groundnuts, and genuine community energy.',
    activities: ['Garri Station', 'Community Bonding', 'Cultural Celebration', 'Good Vibes'],
  },
  {
    day: 'FRI',
    date: 'June 19',
    color: 'yellow',
    label: 'JERSEY DAY',
    icon: TShirt,
    title: 'Jersey Day + Winners',
    desc: 'Rock your jersey. Football and basketball finals. Winners announced. 400L reigns.',
    activities: ['Jersey Parade', 'Football Finals', 'Basketball Finals', 'Winners Announced: 400L'],
  },
  {
    day: 'SAT',
    date: 'June 20',
    color: 'pink',
    label: 'THE MAIN EVENT',
    icon: Trophy,
    title: 'Dinner, Awards & Entertainment',
    desc: 'The night everything has been building towards. Dinner, awards, fashion, entertainment. 3PM PROMPT.',
    activities: ['Dinner', 'Awards Ceremony', 'Fashion', 'Entertainment', 'THE GRANDE FINALE'],
    isMain: true,
  },
]

export default function Schedule() {
  const [active, setActive] = useState(4) // Default to main event

  const selected = DAYS[active]

  return (
    <section id="schedule" className="schedule section-pad">
      <div className="container">

        <div className="schedule__header">
          <span className="tag tag-pink mono">THE LINEUP</span>
          <h2 className="schedule__title">
            <span>FIVE DAYS.</span>
            <span className="schedule__title-accent">FIVE VIBES.</span>
          </h2>
          <p className="schedule__sub">
            Monday through Saturday — every day brings something different.
            Every day brings something unforgettable.
          </p>
        </div>

        {/* Day selector tabs */}
        <div className="schedule__tabs">
          {DAYS.map((d, i) => (
            <button
              key={d.day}
              className={`schedule__tab schedule__tab--${d.color} ${active === i ? 'schedule__tab--active' : ''} ${d.isMain ? 'schedule__tab--main' : ''}`}
              onClick={() => setActive(i)}
            >
              <span className="schedule__tab-day">{d.day}</span>
              <span className="schedule__tab-date mono">{d.date}</span>
              {d.isMain && <span className="schedule__tab-fire">★</span>}
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className={`schedule__detail schedule__detail--${selected.color} ${selected.isMain ? 'schedule__detail--main' : ''}`}>
          <div className="schedule__detail-left">
            <div className="schedule__detail-meta">
              <span className={`tag tag-${selected.color} mono`}>{selected.label}</span>
              {selected.isMain && (
                <span className="tag tag-yellow mono">3PM PROMPT</span>
              )}
            </div>

            <h3 className="schedule__detail-title">{selected.title}</h3>
            <p className="schedule__detail-desc">{selected.desc}</p>

            {selected.isMain && (
              <div className="schedule__detail-venue mono">
                <Clock size={14} />
                <span>3PM PROMPT · AUDITORIUM, CARITAS UNIVERSITY</span>
              </div>
            )}
          </div>

          <div className="schedule__detail-right">
            <div className="schedule__activities-label mono">ACTIVITIES</div>
            <ul className="schedule__activities">
              {selected.activities.map(a => (
                <li key={a} className="schedule__activity">
                  <span className="schedule__activity-dot" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          {selected.isMain && (
            <div className="schedule__main-banner">
              <Confetti size={20} weight="fill" />
              <span className="mono">THE GRANDE FINALE — THIS IS WHAT YOU'RE BUYING A TICKET FOR</span>
              <Confetti size={20} weight="fill" />
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
