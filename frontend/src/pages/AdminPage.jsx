import { useState, useEffect } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api.js'
import { useNavigate } from 'react-router-dom'
import {
  SignIn, SignOut, Users, CurrencyNgn, QrCode, Warning,
  CheckCircle, Clock, ArrowRight, MagnifyingGlass, Download
} from '@phosphor-icons/react'
import { formatNaira, formatDate } from '../lib/utils.js'
import toast from 'react-hot-toast'
import './AdminPage.css'

const STATUS_COLORS = {
  paid: 'yellow',
  verified: 'yellow',
  pending: 'cyan',
  rejected: 'pink',
}

export default function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || '')
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const navigate = useNavigate()

  const login = useMutation(api.auth.adminLogin)
  const logout = useMutation(api.auth.adminLogout)
  const updateStatus = useMutation(api.attendees.updateStatus)
  const attendees = useQuery(api.attendees.getAllAttendees, token ? { adminToken: token } : 'skip')
  const stats = useQuery(api.attendees.getStats, token ? { adminToken: token } : 'skip')

  const handleLogin = async () => {
    setLoginLoading(true)
    try {
      const result = await login({ password })
      localStorage.setItem('admin_token', result.token)
      setToken(result.token)
      toast.success('Access granted.')
    } catch {
      toast.error('Wrong password.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout({ token })
    localStorage.removeItem('admin_token')
    setToken('')
  }

  const handleStatus = async (id, status) => {
    try {
      await updateStatus({ id, status, adminToken: token })
      toast.success(`Status updated to ${status}`)
    } catch {
      toast.error('Failed to update status')
    }
  }

  const filtered = (attendees || []).filter(a => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.ticketCode.toLowerCase().includes(q) ||
      a.regNumber.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    return matchSearch && matchStatus
  })

  const exportCSV = () => {
    if (!attendees?.length) return
    const header = ['Name', 'Reg Number', 'Email', 'Phone', 'Amount', 'Method', 'Status', 'Ticket Code', 'Scanned', 'Date']
    const rows = attendees.map(a => [
      a.name, a.regNumber, a.email, a.phone,
      a.amount, a.paymentMethod, a.status,
      a.ticketCode, a.scanned ? 'Yes' : 'No',
      formatDate(a.createdAt)
    ])
    const csv = [header, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'cucs-funfest-attendees.csv'
    a.click()
  }

  if (!token || attendees === null) {
    return (
      <div className="admin-login">
        <div className="admin-login__box">
          <div className="admin-login__logo mono">CUCS FUNFEST</div>
          <div className="admin-login__title">ADMIN ACCESS</div>
          <div className="admin-login__sub mono">Authorized personnel only</div>

          <div className="field" style={{ marginTop: 32 }}>
            <label className="field__label mono">ADMIN PASSWORD</label>
            <input
              className="field__input"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              autoFocus
            />
          </div>

          <button
            className="btn btn-yellow"
            style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
            onClick={handleLogin}
            disabled={loginLoading}
          >
            <SignIn size={20} weight="fill" />
            {loginLoading ? 'VERIFYING...' : 'ACCESS DASHBOARD'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dash">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header__left">
          <span className="mono" style={{ color: 'var(--yellow)', fontSize: 18, letterSpacing: '0.2em' }}>CUCS FUNFEST</span>
          <span className="mono" style={{ color: 'var(--gray)', fontSize: 12 }}>ADMIN DASHBOARD</span>
        </div>
        <div className="admin-header__right">
          <button className="btn btn-outline" style={{ fontSize: 13, padding: '8px 16px' }} onClick={() => navigate('/admin/scanner')}>
            <QrCode size={18} />
            GATE SCANNER
          </button>
          <button className="btn btn-pink" style={{ fontSize: 13, padding: '8px 16px' }} onClick={handleLogout}>
            <SignOut size={18} />
            LOGOUT
          </button>
        </div>
      </div>

      <div className="admin-body">
        {/* Stats */}
        {stats && (
          <div className="admin-stats">
            <div className="admin-stat admin-stat--yellow">
              <div className="admin-stat__value">{stats.paid}</div>
              <div className="admin-stat__label mono">CONFIRMED ATTENDEES</div>
            </div>
            <div className="admin-stat admin-stat--cyan">
              <div className="admin-stat__value">{stats.pending}</div>
              <div className="admin-stat__label mono">PENDING TRANSFERS</div>
            </div>
            <div className="admin-stat admin-stat--pink">
              <div className="admin-stat__value">{stats.scanned}</div>
              <div className="admin-stat__label mono">SCANNED IN</div>
            </div>
            <div className="admin-stat admin-stat--yellow">
              <div className="admin-stat__value">{formatNaira(stats.totalRevenue)}</div>
              <div className="admin-stat__label mono">TOTAL REVENUE</div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="admin-controls">
          <div className="admin-search">
            <MagnifyingGlass size={16} color="var(--gray)" />
            <input
              className="admin-search__input mono"
              placeholder="Search name, email, reg number, ticket code..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="admin-filters">
            {['all', 'paid', 'pending', 'verified', 'rejected'].map(s => (
              <button
                key={s}
                className={`admin-filter mono ${statusFilter === s ? 'admin-filter--active' : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="btn btn-outline" style={{ fontSize: 12, padding: '8px 14px' }} onClick={exportCSV}>
            <Download size={16} />
            EXPORT CSV
          </button>
        </div>

        {/* Table */}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="mono">NAME</th>
                <th className="mono">REG NO.</th>
                <th className="mono">EMAIL</th>
                <th className="mono">AMOUNT</th>
                <th className="mono">METHOD</th>
                <th className="mono">CODE</th>
                <th className="mono">STATUS</th>
                <th className="mono">SCANNED</th>
                <th className="mono">DATE</th>
                <th className="mono">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', color: 'var(--gray)', padding: 40, fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                    No records found.
                  </td>
                </tr>
              ) : filtered.map(a => (
                <tr key={a._id} className={`admin-row ${a.status === 'pending' ? 'admin-row--pending' : ''}`}>
                  <td><strong>{a.name}</strong></td>
                  <td className="mono" style={{ fontSize: 12 }}>{a.regNumber}</td>
                  <td style={{ fontSize: 13 }}>{a.email}</td>
                  <td className="mono">{formatNaira(a.amount)}</td>
                  <td>
                    <span className={`tag ${a.paymentMethod === 'card' ? 'tag-yellow' : 'tag-cyan'} mono`} style={{ fontSize: 10 }}>
                      {a.paymentMethod.toUpperCase()}
                    </span>
                  </td>
                  <td className="mono" style={{ fontSize: 11, color: 'var(--yellow)' }}>{a.ticketCode}</td>
                  <td>
                    <span className={`tag tag-${STATUS_COLORS[a.status] || 'yellow'} mono`} style={{ fontSize: 10 }}>
                      {a.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {a.scanned
                      ? <CheckCircle size={18} color="var(--yellow)" weight="fill" />
                      : <Clock size={18} color="var(--gray)" />
                    }
                  </td>
                  <td className="mono" style={{ fontSize: 11, color: 'var(--gray)' }}>
                    {formatDate(a.createdAt)}
                  </td>
                  <td>
                    {a.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="admin-action-btn admin-action-btn--green"
                          onClick={() => handleStatus(a._id, 'verified')}
                          title="Approve transfer"
                        >
                          ✓
                        </button>
                        <button
                          className="admin-action-btn admin-action-btn--red"
                          onClick={() => handleStatus(a._id, 'rejected')}
                          title="Reject"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
