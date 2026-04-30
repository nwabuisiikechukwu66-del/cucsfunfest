import { ArrowSquareOut, Star } from '@phosphor-icons/react'
import './Features.css'

const FEATURED = [
  {
    id: 1,
    name: 'Stella AI',
    creator: 'Frank Oge',
    desc: 'AI-powered education platform for flashcards, active recall, and smart summaries from lectures/PDFs.',
    tags: ['Next.js', 'Python', 'FastAPI'],
    color: 'yellow',
    link: 'https://stellai.pro',
  },
  {
    id: 2,
    name: 'Inkognito',
    creator: 'HACKER VIRUS',
    desc: 'Anonymous confession platform and social hub. Share stories, chat with an AI mentor, or connect with strangers via video chat.',
    tags: ['React', 'WebRTC', 'AI'],
    color: 'pink',
    link: 'https://inkognito-sandy.vercel.app/',
  },
  {
    id: 3,
    name: 'CampusPay',
    creator: 'CS/2022 Group',
    desc: 'Peer-to-peer payment and expense splitting built for Nigerian campus life.',
    tags: ['FinTech', 'React Native', 'Paystack'],
    color: 'cyan',
    link: '#',
  },
  {
    id: 4,
    name: 'YourProject',
    creator: 'Your Name',
    desc: 'Contact us to feature your project here. Get your work seen by everyone at FunFest.',
    tags: ['???', '???', '???'],
    color: 'yellow',
    link: '#contact',
    isPlaceholder: true,
  },
]

export default function Features() {
  return (
    <section id="features" className="features section-pad">
      <div className="container">

        <div className="features__header">
          <span className="tag tag-cyan mono">BUILT BY CS</span>
          <h2 className="features__title">
            <span>STUDENT</span>
            <span className="features__title-accent"> CREATIONS</span>
          </h2>
          <p className="features__sub">
            CS students don't just study — they build. Here are some of the projects
            being showcased during FunFest week.
          </p>
        </div>

        <div className="features__grid">
          {FEATURED.map(item => (
            <div
              key={item.id}
              className={`feature-card feature-card--${item.color} ${item.isPlaceholder ? 'feature-card--placeholder' : ''}`}
            >
              <div className="feature-card__top">
                <div className="feature-card__icon">
                  <Star size={24} weight={item.isPlaceholder ? 'regular' : 'fill'} />
                </div>
                <a href={item.link} className="feature-card__link" target="_blank" rel="noreferrer">
                  <ArrowSquareOut size={18} />
                </a>
              </div>

              <h3 className="feature-card__name">{item.name}</h3>
              <div className="feature-card__creator mono">{item.creator}</div>
              <p className="feature-card__desc">{item.desc}</p>

              <div className="feature-card__tags">
                {item.tags.map(t => (
                  <span key={t} className="feature-card__tag mono">{t}</span>
                ))}
              </div>

              {item.isPlaceholder && (
                <div className="feature-card__cta">
                  <a href="#contact" className="btn btn-outline" style={{ fontSize: 13, padding: '10px 20px' }}>
                    FEATURE YOUR PROJECT
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
