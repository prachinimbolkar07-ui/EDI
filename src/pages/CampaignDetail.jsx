import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { inr } from '../data.js'
import { useCampaigns } from '../CampaignsContext.jsx'
import { useEvidence } from '../EvidenceContext.jsx'

const evidencePill = {
  Verified: 'Completed',
  Reviewed: 'Completed',
  Pending: 'Inreview',
  'Needs changes': 'Inreview',
  Rejected: 'Overdue',
}

export default function CampaignDetail() {
  const { id } = useParams()
  const { items } = useEvidence()
  const { campaigns } = useCampaigns()
  const c = campaigns.find((x) => x.id === Number(id))
  const [amt, setAmt] = useState('')
  const [done, setDone] = useState(false)
  const [ext, setExt] = useState([])
  const [extForm, setExtForm] = useState({ milestone: '', date: '', reason: '' })
  const [issues, setIssues] = useState([])
  const [issueText, setIssueText] = useState('')

  if (!c) {
    return (
      <section className="wrap">
        <h1>Campaign not found</h1>
        <Link to="/campaigns" className="link">Back to campaigns</Link>
      </section>
    )
  }

  const evidence = [...items.filter((i) => i.campaignId === c.id), ...c.evidence]
  const pct = Math.round((c.raised / c.goal) * 100)
  const locked = c.raised - c.released
  const open = c.milestones.filter((m) => m.status !== 'Completed')
  const flags = [
    ...c.milestones.filter((m) => m.status === 'Overdue').map((m) => 'Overdue: ' + m.name),
    ...evidence.filter((e) => ['Pending', 'Needs changes', 'Rejected'].includes(e.status)).map((e) => e.status + ': ' + e.file),
    ...issues.map((i) => 'Issue reported: ' + i),
  ]

  function submitExt(e) {
    e.preventDefault()
    setExt([{ ...extForm, milestone: extForm.milestone || open[0].name }, ...ext])
    setExtForm({ milestone: '', date: '', reason: '' })
  }

  function submitIssue(e) {
    e.preventDefault()
    setIssues([issueText, ...issues])
    setIssueText('')
  }

  return (
    <section className="wrap">
      <Link to="/campaigns" className="link">← All campaigns</Link>
      <div><span className="tag">{c.category}</span></div>
      <h1>{c.title}</h1>
      <p className="lead">{c.about} Run by {c.org}.</p>

      <div className="two">
        <div>
          <div className="panel">
            <div className="stats">
              <div><span>Collected</span><strong>{inr(c.raised)}</strong></div>
              <div><span>Released</span><strong>{inr(c.released)}</strong></div>
              <div><span>Locked in contract</span><strong>{inr(locked)}</strong></div>
              <div><span>Goal</span><strong>{inr(c.goal)}</strong></div>
            </div>
            <div className="bar"><b style={{ width: pct + '%' }} /></div>
            <p className="muted small-t">Locked funds can only leave the contract after 2 of 3 reviewers approve a request.</p>
          </div>

          {flags.length > 0 && (
            <div className="panel warn">
              <h3>Needs attention</h3>
              <ul>{flags.map((f) => <li key={f}>{f}</li>)}</ul>
            </div>
          )}

          <h2>Milestones</h2>
          <table>
            <thead>
              <tr><th>Milestone</th><th>Amount</th><th>Due</th><th>Status</th></tr>
            </thead>
            <tbody>
              {c.milestones.map((m) => (
                <tr key={m.name}>
                  <td>{m.name}</td>
                  <td>{inr(m.amount)}</td>
                  <td>{m.due}</td>
                  <td><span className={'pill ' + m.status.replace(' ', '')}>{m.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>

          {open.length > 0 && (
            <div>
              <h3 className="sub">Request a deadline extension</h3>
              <form className="panel" onSubmit={submitExt}>
                <label htmlFor="xm">Milestone</label>
                <select id="xm" value={extForm.milestone} onChange={(e) => setExtForm({ ...extForm, milestone: e.target.value })}>
                  {open.map((m) => <option key={m.name}>{m.name}</option>)}
                </select>
                <label htmlFor="xd">New deadline</label>
                <input id="xd" type="date" required value={extForm.date} onChange={(e) => setExtForm({ ...extForm, date: e.target.value })} />
                <label htmlFor="xr">Reason</label>
                <textarea id="xr" rows="2" required value={extForm.reason} onChange={(e) => setExtForm({ ...extForm, reason: e.target.value })} />
                <button className="btn small full">Send to reviewers</button>
              </form>

              {ext.length > 0 && (
                <table>
                  <thead>
                    <tr><th>Milestone</th><th>New deadline</th><th>Reason</th><th>Decision</th></tr>
                  </thead>
                  <tbody>
                    {ext.map((x, i) => (
                      <tr key={i}>
                        <td>{x.milestone}</td>
                        <td>{x.date}</td>
                        <td>{x.reason}</td>
                        <td><span className="pill Inreview">Waiting for reviewers</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          <h2>Evidence</h2>
          {evidence.length > 0 ? (
            <table>
              <thead>
                <tr><th>File</th><th>Type</th><th>Added</th><th>Review status</th><th>Proof</th></tr>
              </thead>
              <tbody>
                {evidence.map((e) => (
                  <tr key={e.file + e.date}>
                    <td>{e.file}</td>
                    <td>{e.type}</td>
                    <td>{e.date}</td>
                    <td><span className={'pill ' + evidencePill[e.status]}>{e.status}</span></td>
                    <td>
                      {e.url ? (
                        <a className="link" href={e.url} target="_blank" rel="noreferrer">View file</a>
                      ) : (
                        <span className="muted small-t">Sample entry, no file</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="muted">No evidence uploaded yet.</p>
          )}
          <p className="muted small-t">
            Uploading a document does not prove the spending is genuine. Verified is shown only after a reviewer has checked it independently.
          </p>

          <h3 className="sub">Report an issue</h3>
          <form className="panel" onSubmit={submitIssue}>
            <label htmlFor="is">Something missing or doubtful?</label>
            <textarea id="is" rows="2" required value={issueText} onChange={(e) => setIssueText(e.target.value)} placeholder="Example: The invoice date does not match the release date." />
            <button className="btn ghost small full">Report issue</button>
          </form>

          <h2>Audit trail</h2>
          <div className="ledger plain">
            {c.trail.map((e) => (
              <div className="ev" key={e.tx}>
                <i />
                <div>
                  <strong>{e.t}</strong>
                  <span>{e.d} · {e.when}</span>
                  <code>{e.tx}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="panel sticky">
          <h3>Donate (test network)</h3>
          {done ? (
            <p className="ok">Thank you. Your test donation of {inr(Number(amt))} is waiting for wallet confirmation.</p>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setDone(true) }}>
              <label htmlFor="amt">Amount (₹)</label>
              <input id="amt" type="number" min="1" required value={amt} onChange={(e) => setAmt(e.target.value)} placeholder="500" />
              <button className="btn full">Donate with MetaMask</button>
              <p className="muted small-t">Prototype only. Connect the smart contract here later.</p>
            </form>
          )}
        </aside>
      </div>
    </section>
  )
}