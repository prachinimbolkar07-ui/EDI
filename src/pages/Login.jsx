import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'

const roles = ['Donor', 'Organiser', 'Reviewer', 'Admin']
const home = { Donor: '/dashboard', Organiser: '/release', Reviewer: '/review', Admin: '/admin' }
const about = {
  Donor: 'Donate to campaigns and track how funds are used.',
  Organiser: 'Create campaigns, request funds and submit evidence.',
  Reviewer: 'Check fund requests and evidence, then approve or reject.',
  Admin: 'Verify organisations and manage reviewers.',
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState('Donor')
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  function handleSubmit(e) {
    e.preventDefault()
    login(role, form.name || form.email.split('@')[0])
    navigate(home[role])
  }

  return (
    <section className="wrap narrow">
      <h1>{mode === 'login' ? 'Log in' : 'Create an account'}</h1>
      <p className="lead">Choose how you want to use DonateWeb3.</p>

      <div className="filters">
        {roles.map((r) => (
          <button key={r} type="button" className={'chip' + (r === role ? ' on' : '')} onClick={() => setRole(r)}>{r}</button>
        ))}
      </div>
      <p className="muted small-t">{about[role]}</p>

      <form className="panel" onSubmit={handleSubmit}>
        {mode === 'register' && (
          <>
            <label htmlFor="name">Full name</label>
            <input id="name" required value={form.name} onChange={set('name')} />
          </>
        )}

        <label htmlFor="email">Email</label>
        <input id="email" type="email" required value={form.email} onChange={set('email')} />

        <label htmlFor="pw">Password</label>
        <input id="pw" type="password" minLength="6" required value={form.password} onChange={set('password')} />

        <button className="btn full">{mode === 'login' ? 'Log in' : 'Create account'}</button>

        <p className="muted small-t">
          {mode === 'login' ? 'New here? ' : 'Already have an account? '}
          <button type="button" className="link" style={{ background: 'none', border: 0, cursor: 'pointer', padding: 0, font: 'inherit' }}
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Create an account' : 'Log in'}
          </button>
        </p>
        <p className="muted small-t">Prototype only: any email and password works. Real login comes with the backend.</p>
      </form>
    </section>
  )
}