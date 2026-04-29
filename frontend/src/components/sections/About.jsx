import { Code, Users, Trophy, Cpu } from '@phosphor-icons/react'
import './About.css'

const PILLARS = [
  {
    icon: Code,
    color: 'yellow',
    title: 'CODE',
    desc: 'Corporate talks, tech presentations, showcases by the sharpest minds in the department.',
  },
  {
    icon: Users,
    color: 'pink',
    title: 'CULTURE',
    desc: 'Games, football, jersey day, garri day — raw departmental energy, one week straight.',
  },
  {
    icon: Trophy,
    color: 'cyan',
    title: 'COMMUNITY',
    desc: 'Awards, dinner, fashion, entertainment. The night that crowns a legacy. June 20th.',
  },
]

const STATS = [
  { value: '6', label: 'DAYS OF FIRE', color: 'yellow' },
  { value: '5+', label: 'EVENTS & ACTIVITIES', color: 'pink' },
  { value: '2026', label: 'YEAR TO REMEMBER', color: 'cyan' },
  { value: '162+', label: 'FINAL YEAR STUDENTS', color: 'yellow' },
]

export default function About() {
  return (
    <section id="about" className="about section-pad">
      <div className="container">

        <div className="about__header">
          <span className="tag tag-yellow mono">WHAT IS THIS</span>
          <h2 className="about__title">
            <span className="about__title-main">THE BIGGEST</span>
            <span className="about__title-sub">CS WEEK IN CARITAS HISTORY</span>
          </h2>
          <p className="about__desc">
            Caritas University Computer Science Department is shutting the campus DOWN.
            One week. Multiple events. One unstoppable finale. This is not your regular
            departmental week — this is FunFest. The hype is real. The energy is built.
            The only question is: are you in?
          </p>
        </div>

        <div className="about__pillars">
          {PILLARS.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className={`pillar pillar--${color}`}>
              <div className="pillar__icon">
                <Icon size={32} weight="bold" />
              </div>
              <h3 className="pillar__title">{title}</h3>
              <p className="pillar__desc">{desc}</p>
              <div className="pillar__line" />
            </div>
          ))}
        </div>

        <div className="about__stats">
          {STATS.map(({ value, label, color }) => (
            <div key={label} className={`stat stat--${color}`}>
              <div className="stat__value">{value}</div>
              <div className="stat__label mono">{label}</div>
            </div>
          ))}
        </div>

        <div className="about__marquee">
          <div className="about__marquee-track">
            {[...Array(3)].map((_, i) => (
              <span key={i} className="about__marquee-item">
                CODE · CULTURE · COMMUNITY · INNOVATE · COLLABORATE · CELEBRATE · CUCS FUNFEST 2026 ·&nbsp;
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
