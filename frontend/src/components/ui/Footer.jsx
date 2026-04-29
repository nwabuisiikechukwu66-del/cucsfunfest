import { InstagramLogo, TwitterLogo, ArrowUp } from '@phosphor-icons/react'
import './Footer.css'

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="footer">
      <div className="footer__marquee">
        <div className="footer__marquee-track">
          {[...Array(4)].map((_, i) => (
            <span key={i}>
              CODE · CULTURE · COMMUNITY · CUCS FUNFEST 2026 · INNOVATE · COLLABORATE · CELEBRATE ·&nbsp;
            </span>
          ))}
        </div>
      </div>

      <div className="footer__inner container">
        <div className="footer__left">
          <div className="footer__logo mono">CUCS FUNFEST 2026</div>
          <div className="footer__sub mono">CARITAS UNIVERSITY AMORJI NIKE</div>
          <div className="footer__tagline">Code. Culture. Community.</div>
          <div className="footer__social">
            <a href="https://instagram.com/caritas_csc" target="_blank" rel="noreferrer" className="footer__social-link">
              <InstagramLogo size={20} />
            </a>
            <a href="https://twitter.com/caritas_csc" target="_blank" rel="noreferrer" className="footer__social-link">
              <TwitterLogo size={20} />
            </a>
          </div>
        </div>

        <div className="footer__right">
          <div className="footer__links">
            {['#hero', '#about', '#schedule', '#features', '#tickets', '#contact'].map(href => (
              <a
                key={href}
                href={href}
                className="footer__link mono"
                onClick={e => { e.preventDefault(); document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }) }}
              >
                {href.replace('#', '')}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span className="footer__credit mono">
            Built with precision by{' '}
            <a href="https://frankoge.com" target="_blank" rel="noreferrer" className="footer__credit-link">
              frankdotdev
            </a>
            {' '}— Hackverse Software Solutions
          </span>
          <span className="footer__copy mono">© 2026 CUCS · All rights reserved</span>
        </div>
        <button className="footer__top-btn" onClick={scrollTop}>
          <ArrowUp size={18} />
        </button>
      </div>
    </footer>
  )
}
