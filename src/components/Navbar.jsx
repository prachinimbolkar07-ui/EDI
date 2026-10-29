import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'

const links = {
  Donor: [['/dashboard', 'My dashboard']],
  Organiser: [['/create', 'Start a campaign'], ['/release', 'Request funds'], ['/evidence', 'Upload evidence']],
  Reviewer: [['/review', 'Review requests']],
  Admin: [['/admin', 'Admin']],
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [account, setAccount] = useState('')
  const [open, setOpen] = useState(false)

  async function connect() {
    if (!window.ethereum) return alert('MetaMask not found. Install the MetaMask extension to connect a wallet.')
    const [a] = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setAccount(a)
  }

  const close = () => setOpen(false)
  const mine = user ? links[user.role] : []
  const isOrg = user?.role === 'Organiser'

  return (
    <header className="nav">
      <div className="nav-in">
        <Link to="/" className="brand" onClick={close}><i /> DonateWeb3</Link>

        <button className="menu-btn" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? 'Close' : 'Menu'}
        </button>

        <nav className={open ? 'open' : ''}>
          {isOrg
            ? <NavLink to="/campaigns" onClick={close}>My campaigns</NavLink>
            : <NavLink to="/ngos" onClick={close}>Organisations</NavLink>}
          {mine.map(([to, label]) => <NavLink key={to} to={to} onClick={close}>{label}</NavLink>)}
        </nav>

        <div className={'nav-actions' + (open ? ' open' : '')}>
          {user ? (
            <>
              <span className="muted small-t">{user.name} · {isOrg ? user.org : user.role}</span>
              <button className="btn ghost small" onClick={() => { logout(); close(); navigate('/') }}>Log out</button>
            </>
          ) : (
            <Link to="/login" className="btn ghost small" onClick={close}>Log in</Link>
          )}
          <button className="btn small" onClick={connect}>
            {account ? account.slice(0, 6) + '…' + account.slice(-4) : 'Connect wallet'}
          </button>
        </div>
      </div>
    </header>
  )
}