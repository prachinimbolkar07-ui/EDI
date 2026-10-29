import { useState } from 'react'

const seedOrgs = [
  { id: 1, name: 'Shiksha Trust', regNo: 'MH/2019/0412', status: 'Verified' },
  { id: 2, name: 'Jal Seva Foundation', regNo: 'MH/2021/1177', status: 'Pending' },
  { id: 3, name: 'Arogya Samaj', regNo: 'MH/2018/0560', status: 'Verified' },
]

const seedReviewers = [
  { id: 1, name: 'Reviewer A', wallet: '0x4aF1…92c3' },
  { id: 2, name: 'Reviewer B', wallet: '0x91Bc…07de' },
  { id: 3, name: 'Reviewer C', wallet: '0xE2a8…55f0' },
]

export default function Admin() {
  const [orgs, setOrgs] = useState(seedOrgs)
  const [reviewers, setReviewers] = useState(seedReviewers)
  const [name, setName] = useState('')
  const [wallet, setWallet] = useState('')

  const setStatus = (id, status) => setOrgs(orgs.map((o) => (o.id === id ? { ...o, status } : o)))

  function addReviewer(e) {
    e.preventDefault()
    setReviewers([...reviewers, { id: Date.now(), name, wallet }])
    setName('')
    setWallet('')
  }

  const pill = { Verified: 'Completed', Pending: 'Inreview', Rejected: 'Overdue' }

  return (
    <section className="wrap">
      <h1>Admin</h1>
      <p className="lead">Verify organisations before they can start campaigns, and manage who can review fund requests.</p>

      <h2>Organisations</h2>
      <table>
        <thead><tr><th>Name</th><th>Registration no.</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {orgs.map((o) => (
            <tr key={o.id}>
              <td>{o.name}</td>
              <td>{o.regNo}</td>
              <td><span className={'pill ' + pill[o.status]}>{o.status}</span></td>
              <td>
                {o.status === 'Pending' && (
                  <>
                    <button className="btn small" onClick={() => setStatus(o.id, 'Verified')}>Verify</button>{' '}
                    <button className="btn ghost small" onClick={() => setStatus(o.id, 'Rejected')}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted small-t">Verifying an organisation means its registration was checked. It does not guarantee how it will spend funds.</p>

      <h2>Authorised reviewers</h2>
      <table>
        <thead><tr><th>Name</th><th>Wallet address</th><th></th></tr></thead>
        <tbody>
          {reviewers.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td><code>{r.wallet}</code></td>
              <td><button className="btn ghost small" onClick={() => setReviewers(reviewers.filter((x) => x.id !== r.id))}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: '1.5em' }}>Add a reviewer</h3>
      <form className="panel" onSubmit={addReviewer}>
        <div className="two-eq">
          <div>
            <label htmlFor="rn">Name</label>
            <input id="rn" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="rw">Wallet address</label>
            <input id="rw" required value={wallet} onChange={(e) => setWallet(e.target.value)} placeholder="0x..." />
          </div>
        </div>
        <button className="btn small full">Add reviewer</button>
      </form>
    </section>
  )
}