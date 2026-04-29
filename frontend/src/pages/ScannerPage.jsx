import { useState, useEffect, useRef } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api.js'
import { useNavigate } from 'react-router-dom'
import { QrCode, ArrowLeft, CheckCircle, XCircle, Warning, Camera } from '@phosphor-icons/react'
import { Html5Qrcode } from 'html5-qrcode'
import toast from 'react-hot-toast'
import './ScannerPage.css'

export default function ScannerPage() {
  const [token] = useState(() => localStorage.getItem('admin_token') || '')
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null) // { valid, reason, name, tier, ticketCode, scannedAt }
  const [manualCode, setManualCode] = useState('')
  const [loading, setLoading] = useState(false)
  const scannerRef = useRef(null)
  const html5QrRef = useRef(null)
  const navigate = useNavigate()
  const verifyTicket = useMutation(api.attendees.verifyTicket)

  useEffect(() => {
    if (!token) navigate('/admin')
    return () => stopScanner()
  }, [])

  const startScanner = async () => {
    setResult(null)
    setScanning(true)
    try {
      html5QrRef.current = new Html5Qrcode('qr-reader')
      await html5QrRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          await stopScanner()
          await verify(decodedText)
        },
        () => {}
      )
    } catch (err) {
      toast.error('Camera access denied or unavailable.')
      setScanning(false)
    }
  }

  const stopScanner = async () => {
    try {
      if (html5QrRef.current?.isScanning) {
        await html5QrRef.current.stop()
      }
    } catch {}
    setScanning(false)
  }

  const verify = async (code) => {
    setLoading(true)
    try {
      const res = await verifyTicket({ ticketCode: code.trim().toUpperCase(), adminToken: token })
      setResult(res)
    } catch {
      setResult({ valid: false, reason: 'ERROR' })
    } finally {
      setLoading(false)
    }
  }

  const handleManual = () => {
    if (!manualCode.trim()) return
    verify(manualCode.trim())
    setManualCode('')
  }

  const reset = () => {
    setResult(null)
    setManualCode('')
  }

  const getResultMeta = () => {
    if (!result) return null
    if (result.valid) return {
      color: 'green',
      icon: CheckCircle,
      title: 'VALID TICKET',
      sub: `Welcome, ${result.name}`,
      detail: `Code: ${result.ticketCode}`,
    }
    const map = {
      NOT_FOUND: { color: 'red', icon: XCircle, title: 'TICKET NOT FOUND', sub: 'This code does not exist in the system.' },
      NOT_PAID: { color: 'red', icon: XCircle, title: 'PAYMENT NOT CONFIRMED', sub: `${result.name || 'Attendee'} — ticket not yet paid.` },
      ALREADY_SCANNED: { color: 'orange', icon: Warning, title: 'ALREADY SCANNED', sub: `${result.name} — ticket was already used.` },
      UNAUTHORIZED: { color: 'red', icon: XCircle, title: 'SESSION EXPIRED', sub: 'Please log in again.' },
      ERROR: { color: 'red', icon: XCircle, title: 'SYSTEM ERROR', sub: 'Try again or use manual entry.' },
    }
    return map[result.reason] || { color: 'red', icon: XCircle, title: 'INVALID', sub: 'Unknown error.' }
  }

  const meta = getResultMeta()

  return (
    <div className="scanner-page">
      <div className="scanner-header">
        <button className="btn btn-outline" style={{ fontSize: 13, padding: '8px 16px' }} onClick={() => navigate('/admin')}>
          <ArrowLeft size={18} />
          BACK TO DASHBOARD
        </button>
        <div className="scanner-header__title mono">GATE SCANNER</div>
      </div>

      <div className="scanner-body">

        {/* Result overlay */}
        {result && meta && (
          <div className={`scan-result scan-result--${meta.color}`}>
            <div className="scan-result__icon">
              <meta.icon size={80} weight="fill" />
            </div>
            <div className="scan-result__title">{meta.title}</div>
            <div className="scan-result__sub">{meta.sub}</div>
            {meta.detail && <div className="scan-result__detail mono">{meta.detail}</div>}
            {result.scannedAt && (
              <div className="scan-result__detail mono">
                Scanned: {new Date(result.scannedAt).toLocaleTimeString()}
              </div>
            )}
            <button className="btn btn-outline" style={{ marginTop: 24 }} onClick={reset}>
              SCAN ANOTHER
            </button>
          </div>
        )}

        {!result && (
          <>
            {/* Camera viewer */}
            <div className="scanner-cam-wrap">
              <div id="qr-reader" className="scanner-cam" />
              {!scanning && (
                <div className="scanner-cam-placeholder">
                  <QrCode size={64} color="var(--border)" />
                  <span className="mono" style={{ color: 'var(--gray)', fontSize: 13 }}>Camera not active</span>
                </div>
              )}
              {scanning && (
                <div className="scanner-overlay">
                  <div className="scanner-crosshair" />
                </div>
              )}
            </div>

            <div className="scanner-controls">
              {!scanning ? (
                <button className="btn btn-yellow" style={{ width: '100%', justifyContent: 'center' }} onClick={startScanner}>
                  <Camera size={20} weight="fill" />
                  START CAMERA SCAN
                </button>
              ) : (
                <button className="btn btn-pink" style={{ width: '100%', justifyContent: 'center' }} onClick={stopScanner}>
                  STOP CAMERA
                </button>
              )}
            </div>

            <div className="scanner-divider">
              <span className="mono">OR ENTER CODE MANUALLY</span>
            </div>

            <div className="scanner-manual">
              <input
                className="field__input mono"
                placeholder="CUCS-2026-XXXXXXXX"
                value={manualCode}
                onChange={e => setManualCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleManual()}
                style={{ letterSpacing: '0.1em', textAlign: 'center' }}
              />
              <button
                className="btn btn-yellow"
                style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
                onClick={handleManual}
                disabled={loading || !manualCode.trim()}
              >
                {loading ? 'VERIFYING...' : 'VERIFY CODE'}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
