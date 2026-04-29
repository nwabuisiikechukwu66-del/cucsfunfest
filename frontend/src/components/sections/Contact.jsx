import { WhatsappLogo, Phone, InstagramLogo, TwitterLogo } from '@phosphor-icons/react'
import { whatsappLink } from '../../lib/utils.js'
import './Contact.css'

const CONTACTS = [
  {
    name: 'OBUM',
    role: 'Event Coordinator',
    phone: '07087293234',
    initials: 'OB',
    color: 'yellow',
    message: 'Hi OBUM, I have a question about CUCS FunFest 2026. ',
  },
  {
    name: 'BIGJOE',
    role: 'Event Coordinator',
    phone: '08159041361',
    initials: 'BJ',
    color: 'pink',
    message: 'Hi BigJoe, I have a question about CUCS FunFest 2026. ',
  },
]

export default function Contact() {
  return (
    <section id="contact" className="contact section-pad">
      <div className="container">

        <div className="contact__layout">
          <div className="contact__left">
            <span className="tag tag-yellow mono">GET IN TOUCH</span>
            <h2 className="contact__title">
              <span>QUESTIONS?</span>
              <span className="contact__title-accent"> WE GOT YOU.</span>
            </h2>
            <p className="contact__desc">
              Reach out to our event coordinators directly on WhatsApp.
              They're real humans, they respond fast, and they'll sort you out.
            </p>

            <div className="contact__social">
              <div className="contact__social-label mono">FOLLOW THE HYPE</div>
              <div className="contact__social-links">
                <a
                  href="https://instagram.com/caritas_csc"
                  target="_blank"
                  rel="noreferrer"
                  className="social-link social-link--pink"
                >
                  <InstagramLogo size={20} weight="fill" />
                  <span>@caritas_csc</span>
                </a>
                <a
                  href="https://twitter.com/caritas_csc"
                  target="_blank"
                  rel="noreferrer"
                  className="social-link social-link--cyan"
                >
                  <TwitterLogo size={20} weight="fill" />
                  <span>@caritas_csc</span>
                </a>
              </div>
            </div>
          </div>

          <div className="contact__cards">
            {CONTACTS.map(c => (
              <div key={c.name} className={`contact-card contact-card--${c.color}`}>
                <div className="contact-card__avatar">
                  <div className={`contact-card__avatar-inner contact-card__avatar--${c.color}`}>
                    <span className="contact-card__initials">{c.initials}</span>
                  </div>
                  {/* Placeholder for actual photo */}
                  <div className="contact-card__avatar-placeholder mono">[ photo ]</div>
                </div>

                <div className="contact-card__info">
                  <div className="contact-card__name">{c.name}</div>
                  <div className="contact-card__role mono">{c.role}</div>
                  <div className="contact-card__phone mono">{c.phone}</div>
                </div>

                <div className="contact-card__actions">
                  <a
                    href={whatsappLink(c.phone, c.message)}
                    target="_blank"
                    rel="noreferrer"
                    className={`btn btn-${c.color === 'yellow' ? 'yellow' : 'pink'}`}
                    style={{ fontSize: 13, padding: '10px 20px' }}
                  >
                    <WhatsappLogo size={18} weight="fill" />
                    WHATSAPP
                  </a>
                  <a
                    href={`tel:${c.phone}`}
                    className="contact-card__call mono"
                  >
                    <Phone size={16} />
                    CALL
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
