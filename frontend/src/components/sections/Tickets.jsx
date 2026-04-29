import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api.js'
import { checkFinalYear } from '../../lib/finalYearData.js'
import { generateTicketCode } from '../../lib/utils.js'
import { Ticket, ShieldCheck, Warning, Spinner, CheckCircle } from '@phosphor-icons/react'
import toast from 'react-hot-toast'
import './Tickets.css'

const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_REPLACE_ME'

function loadPaystack(callback) {
  if (window.PaystackPop) { callback(); return; }
  const script = document.createElement('script')
  script.src = 'https://js.paystack.co/v2/inline.js'
  script.onload = callback
  document.body.appendChild(script)
}

export default function Tickets() {
  const [step, setStep] = useState('form') // form | verifying | pricing | paying | success
  const [form, setForm] = useState({ name: '', regNumber: '', email: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [tier, setTier] = useState(null) // 'final' or 'other'
  const [ticketCode, setTicketCode] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card') // 'card' | 'transfer'
  const [transferRef, setTransferRef] = useState('')

  const createAttendee = useMutation(api.attendees.createAttendee)
  const submitTransfer = useMutation(api.attendees.submitTransferProof)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.regNumber.trim()) e.regNumber = 'Reg number is required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleVerify = () => {
    if (!validate()) return
    setStep('verifying')

    setTimeout(() => {
      const match = checkFinalYear(form.regNumber)
      setTier(match ? 'final' : 'other')
      setStep('pricing')
    }, 1200)
  }

  const getAmount = () => tier === 'final' ? 5000 : 10000

  const handlePaystack = () => {
    const code = generateTicketCode()
    setTicketCode(code)

    loadPaystack(() => {
      const handler = window.PaystackPop.setup({
        key: PAYSTACK_KEY,
        email: form.email,
        amount: getAmount() * 100, // kobo
        currency: 'NGN',
        ref: code,
        metadata: {
          custom_fields: [
            { display_name: 'Full Name', variable_name: 'full_name', value: form.name },
            { display_name: 'Reg Number', variable_name: 'reg_number', value: form.regNumber },
            { display_name: 'Phone', variable_name: 'phone', value: form.phone },
            { display_name: 'Ticket Code', variable_name: 'ticket_code', value: code },
            { display_name: 'Tier', variable_name: 'tier', value: tier },
          ]
        },
        onClose: () => toast('Payment cancelled.'),
        callback: async (response) => {
          try {
            await createAttendee({
              name: form.name,
              regNumber: form.regNumber,
              email: form.email,
              phone: form.phone,
              tier,
              amount: getAmount(),
              paymentMethod: 'card',
              paystackRef: response.reference,
              ticketCode: code,
              status: 'paid',
            })
            setStep('success')
          } catch (err) {
            toast.error('Payment recorded but ticket save failed. Contact support.')
          }
        },
      })
      handler.openIframe()
    })
  }

  const handleTransferSubmit = async () => {
    if (!transferRef.trim()) {
      toast.error('Please enter your transfer reference or description')
      return
    }
    const code = generateTicketCode()
    setTicketCode(code)
    try {
      await submitTransfer({
        name: form.name,
        regNumber: form.regNumber,
        email: form.email,
        phone: form.phone,
        tier,
        amount: getAmount(),
        transferRef,
        ticketCode: code,
      })
      setStep('success')
    } catch {
      toast.error('Submission failed. Please try again.')
    }
  }

  const reset = () => {
    setStep('form')
    setForm({ name: '', regNumber: '', email: '', phone: '' })
    setErrors({})
    setTier(null)
    setTransferRef('')
  }

  return (
    <section id="tickets" className="tickets section-pad">
      <div className="container">

        <div className="tickets__header">
          <span className="tag tag-yellow mono">GET IN</span>
          <h2 className="tickets__title">
            <span>SECURE YOUR</span>
            <span className="tickets__title-accent"> GATE PASS</span>
          </h2>
          <p className="tickets__sub">
            The auditorium has limited seats. The night of June 20th is not optional.
          </p>
        </div>

        <div className="tickets__layout">

          {/* Left: info */}
          <div className="tickets__info">
            <div className="ticket-card ticket-card--display">
              <div className="ticket-card__stub">
                <div className="ticket-card__stub-label mono">GATE PASS</div>
                <div className="ticket-card__stub-price">10K</div>
                <div className="ticket-card__stub-sub mono">STANDARD</div>
                <div className="ticket-card__stub-divider" />
                <div className="ticket-card__stub-code mono">CUCS2026FUNFEST</div>
              </div>
              <div className="ticket-card__body">
                <div className="ticket-card__logo mono">CUCS</div>
                <div className="ticket-card__event">DEPARTMENTAL FUN FEST</div>
                <div className="ticket-card__tagline mono">CODE. CULTURE. COMMUNITY.</div>
                <div className="ticket-card__details">
                  <div className="ticket-card__detail">
                    <span className="tag tag-yellow">DATE</span>
                    <span>20TH JUNE 2026</span>
                  </div>
                  <div className="ticket-card__detail">
                    <span className="tag tag-pink">TIME</span>
                    <span>3PM PROMPT</span>
                  </div>
                  <div className="ticket-card__detail">
                    <span className="tag tag-cyan">VENUE</span>
                    <span>AUDITORIUM</span>
                  </div>
                </div>
                <div className="ticket-card__admit mono">ADMIT ONE</div>
              </div>
            </div>

            {/* Transfer details */}
            <div className="transfer-info">
              <div className="transfer-info__label mono">BANK TRANSFER OPTION</div>
              <div className="transfer-info__row">
                <span className="mono">Account Name:</span>
                <span>CUCS FunFest 2026</span>
              </div>
              <div className="transfer-info__row">
                <span className="mono">Bank:</span>
                <span>— Contact OBUM or BIGJOE —</span>
              </div>
              <p className="transfer-info__note mono">
                After transfer, submit your reference below. Admin will verify and release your ticket via email.
              </p>
            </div>
          </div>

          {/* Right: form */}
          <div className="tickets__form-area">

            {step === 'form' && (
              <div className="ticket-form">
                <div className="ticket-form__title mono">// REGISTER TO PURCHASE</div>

                <div className="field">
                  <label className="field__label mono">FULL NAME</label>
                  <input
                    className={`field__input ${errors.name ? 'field__input--error' : ''}`}
                    placeholder="As on your school ID"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                  {errors.name && <span className="field__error mono">{errors.name}</span>}
                </div>

                <div className="field">
                  <label className="field__label mono">MATRICULATION / REG NUMBER</label>
                  <input
                    className={`field__input ${errors.regNumber ? 'field__input--error' : ''}`}
                    placeholder="e.g. CS/2022/1217"
                    value={form.regNumber}
                    onChange={e => setForm(f => ({ ...f, regNumber: e.target.value }))}
                  />
                  {errors.regNumber && <span className="field__error mono">{errors.regNumber}</span>}
                </div>

                <div className="field">
                  <label className="field__label mono">EMAIL ADDRESS</label>
                  <input
                    className={`field__input ${errors.email ? 'field__input--error' : ''}`}
                    type="email"
                    placeholder="Your ticket arrives here"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                  {errors.email && <span className="field__error mono">{errors.email}</span>}
                </div>

                <div className="field">
                  <label className="field__label mono">PHONE NUMBER (WHATSAPP)</label>
                  <input
                    className={`field__input ${errors.phone ? 'field__input--error' : ''}`}
                    placeholder="+234..."
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  />
                  {errors.phone && <span className="field__error mono">{errors.phone}</span>}
                </div>

                <button className="btn btn-yellow" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }} onClick={handleVerify}>
                  <Ticket size={20} weight="fill" />
                  CHECK TICKET PRICE
                </button>
              </div>
            )}

            {step === 'verifying' && (
              <div className="ticket-verifying">
                <Spinner size={48} className="spin" />
                <div className="mono" style={{ color: 'var(--yellow)', letterSpacing: '0.2em', marginTop: 16 }}>VERIFYING...</div>
                <div className="mono" style={{ color: 'var(--gray)', fontSize: 12, marginTop: 8 }}>Checking registration records</div>
              </div>
            )}

            {step === 'pricing' && (
              <div className="ticket-pricing">
                <div className="ticket-pricing__verified">
                  <ShieldCheck size={32} color="var(--yellow)" weight="fill" />
                  <span className="mono" style={{ color: 'var(--yellow)' }}>IDENTITY VERIFIED</span>
                </div>

                <div className="ticket-pricing__amount">
                  <div className="ticket-pricing__label mono">YOUR TICKET PRICE</div>
                  <div className="ticket-pricing__price">
                    ₦{getAmount().toLocaleString()}
                  </div>
                  <div className="ticket-pricing__note mono">ADMIT ONE · JUNE 20TH · 3PM PROMPT</div>
                </div>

                <div className="payment-methods">
                  <div className="payment-methods__label mono">PAYMENT METHOD</div>
                  <div className="payment-methods__tabs">
                    <button
                      className={`payment-tab ${paymentMethod === 'card' ? 'payment-tab--active' : ''}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <span className="mono">CARD / USSD</span>
                      <span style={{ fontSize: 11, color: 'var(--gray)' }}>via Paystack</span>
                    </button>
                    <button
                      className={`payment-tab ${paymentMethod === 'transfer' ? 'payment-tab--active' : ''}`}
                      onClick={() => setPaymentMethod('transfer')}
                    >
                      <span className="mono">BANK TRANSFER</span>
                      <span style={{ fontSize: 11, color: 'var(--gray)' }}>manual verify</span>
                    </button>
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <button className="btn btn-pink" style={{ width: '100%', justifyContent: 'center' }} onClick={handlePaystack}>
                    PAY ₦{getAmount().toLocaleString()} NOW
                  </button>
                )}

                {paymentMethod === 'transfer' && (
                  <div className="transfer-submit">
                    <div className="transfer-submit__label mono">ENTER TRANSFER REFERENCE / NARRATION</div>
                    <input
                      className="field__input"
                      placeholder="e.g. Payment for FunFest ticket - [your name]"
                      value={transferRef}
                      onChange={e => setTransferRef(e.target.value)}
                    />
                    <button className="btn btn-yellow" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }} onClick={handleTransferSubmit}>
                      SUBMIT FOR VERIFICATION
                    </button>
                    <p className="mono" style={{ fontSize: 11, color: 'var(--gray)', marginTop: 8, lineHeight: 1.5 }}>
                      Your ticket will be emailed after admin confirms your transfer.
                    </p>
                  </div>
                )}

                <button className="ticket-pricing__back mono" onClick={reset}>← Go back</button>
              </div>
            )}

            {step === 'success' && (
              <div className="ticket-success">
                <CheckCircle size={64} color="var(--yellow)" weight="fill" className="animate-float" />
                <h3 className="ticket-success__title">
                  {paymentMethod === 'card' ? 'YOU\'RE IN!' : 'SUBMISSION RECEIVED!'}
                </h3>
                {paymentMethod === 'card' ? (
                  <>
                    <p className="ticket-success__desc">
                      Your ticket has been confirmed. Check your email — your gate pass with a unique QR code is on its way.
                    </p>
                    <div className="ticket-success__code mono">
                      CODE: {ticketCode}
                    </div>
                  </>
                ) : (
                  <p className="ticket-success__desc">
                    Your transfer has been logged. Admin will verify your payment and send your ticket to <strong>{form.email}</strong> shortly.
                  </p>
                )}
                <p className="ticket-success__note mono">June 20th. 3PM. Auditorium. Don't be late.</p>
                <button className="btn btn-outline" style={{ marginTop: 16 }} onClick={reset}>
                  Register Another
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  )
}
