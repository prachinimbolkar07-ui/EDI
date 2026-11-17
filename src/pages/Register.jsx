import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'
import { useAccounts } from '../AccountsContext.jsx'

export default function Register() {
  const { login } = useAuth()
  const { registerDonor, registerNgo } = useAccounts()
  const navigate = useNavigate()
  const [type, setType] = useState('Donor')
  const [error, setError] = useState('')
  const [f, setF] = useState({
    name: '', email: '', password: '', confirm: '',
    orgName: '', regNo: '', contact: '', phone: '', city: '', docName: '',
  })

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  function handleSubmit(e) {
    e.preventDefault()
    if (f.password.length < 6) return setError('Password must be at least 6 characters.')
    if (f.password !== f.confirm) return setError('Passwords do not match.')

    let problem
    if (type === 'Donor') {
      problem = registerDonor({ name: f.name, email: f.email, password: f.password })
      if (!problem) {
        login('Donor', f.name, '')
        navigate('/dashboard')
      }
    } else {
      problem = registerNgo({ orgName: f.orgName, regNo: f.regNo, contact: f.contact, email: f.email, phone: f.phone, city: f.city, docName: f.docName, password: f.password })
      if (!problem) {
        login('Organiser', f.contact, f.orgName.trim())
        navigate('/organiser')
      }
    }
    setError(problem || '')
  }

  return (
    <section className="wrap narrow">
      <h1>Create an account</h1>
      <p className="lead">Donors can start right away. Organisations are checked by an admin before they can run campaigns.</p>

      <div className="filters">
        <button type="button" className={'chip' + (type === 'Donor' ? ' on' : '')} onClick={() => setType('Donor')}>I want to donate</button>
        <button type="button" className={'chip' + (type === 'NGO' ? ' on' : '')} onClick={() => setType('NGO')}>I represent an organisation</button>
      </div>

      <form className="panel" onSubmit={handleSubmit}>
        {type === 'Donor' ? (
          <>
            <label htmlFor="name">Full name</label>
            <input id="name" required value={f.name} onChange={set('name')} />
          </>
        ) : (
          <>
            <label htmlFor="org">Organisation name</label>
            <input id="org" required value={f.orgName} onChange={set('orgName')} />

            <div className="two-eq">
              <div>
                <label htmlFor="reg">Registration number</label>
                <input id="reg" required value={f.regNo} onChange={set('regNo')} />
              </div>
              <div>
                <label htmlFor="city">City and state</label>
                <input id="city" required value={f.city} onChange={set('city')} placeholder="Pune, Maharashtra" />
              </div>
            </div>

            <label htmlFor="doc">Registration document</label>
            <input
              id="doc"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              required
              onChange={(e) => setF({ ...f, docName: e.target.files[0] ? e.target.files[0].name : '' })}
            />

            <div className="two-eq">
              <div>
                <label htmlFor="contact">Contact person</label>
                <input id="contact" required value={f.contact} onChange={set('contact')} />
              </div>
              <div>
                <label htmlFor="phone">Phone number</label>
                <input id="phone" type="tel" required value={f.phone} onChange={set('phone')} />
              </div>
            </div>
          </>
        )}

        <label htmlFor="email">{type === 'Donor' ? 'Email' : 'Official email'}</label>
        <input id="email" type="email" required value={f.email} onChange={set('email')} />

        <div className="two-eq">
          <div>
            <label htmlFor="pw">Password</label>
            <input id="pw" type="password" required value={f.password} onChange={set('password')} />
          </div>
          <div>
            <label htmlFor="cpw">Confirm password</label>
            <input id="cpw" type="password" required value={f.confirm} onChange={set('confirm')} />
          </div>
        </div>

        {error && <p style={{ color: 'var(--red)', fontWeight: 600 }}>{error}</p>}

        <button className="btn full">{type === 'Donor' ? 'Create account' : 'Register organisation'}</button>
        <p className="muted small-t">
          We never ask for private keys, seed phrases or bank details. You can connect a wallet later with MetaMask.
        </p>
        <p className="muted small-t">Already have an account? <Link className="link" to="/login">Log in</Link></p>
      </form>
    </section>
  )
}