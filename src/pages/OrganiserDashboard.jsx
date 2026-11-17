import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'
import { useCampaigns } from '../CampaignsContext.jsx'
import { useRequests } from '../RequestsContext.jsx'
import { useEvidence } from '../EvidenceContext.jsx'
import { inr } from '../data.js'
import { useAccounts } from '../AccountsContext.jsx'

const statusPill = {
  Verified: 'Completed',
  Reviewed: 'Completed',
  Pending: 'Inreview',
  'Needs changes': 'Inreview',
  Rejected: 'Overdue',
}
const requestPill = { pending: 'Inreview', approved: 'Completed', rejected: 'Overdue' }
const requestText = { pending: 'Waiting for reviewers', approved: 'Ready to release', rejected: 'Rejected' }

export default function OrganiserDashboard() {
  const { user } = useAuth()
  const { campaigns } = useCampaigns()
  const { list: requests } = useRequests()
  const { items } = useEvidence()
  const { orgs } = useAccounts()
const status = (orgs.find((o) => o.name === user.org) || {}).status || 'Pending'

  const mine = campaigns.filter((c) => c.org === user.org)
  const ids = mine.map((c) => c.id)
  const titles = mine.map((c) => c.title)

  const collected = mine.reduce((s, c) => s + c.raised, 0)
  const released = mine.reduce((s, c) => s + c.released, 0)

  const myRequests = requests.filter((r) => titles.includes(r.campaign))

  const evidence = [
    ...items.filter((i) => ids.includes(i.campaignId)).map((i) => ({ ...i, campaign: mine.find((c) => c.id === i.campaignId).title })),
    ...mine.flatMap((c) => c.evidence.map((e) => ({ ...e, campaign: c.title }))),
  ]

  const actions = [
    ...mine.flatMap((c) =>
      c.milestones.filter((m) => m.status === 'Overdue').map((m) => ({ text: 'Overdue milestone: ' + m.name, campaign: c.title, to: '/evidence', go: 'Upload proof' }))
    ),
    ...evidence
      .filter((e) => e.status === 'Needs changes' || e.status === 'Rejected')
      .map((e) => ({ text: e.status + ': ' + e.file, campaign: e.campaign, to: '/evidence', go: 'Upload again' })),
    ...myRequests
      .filter((r) => r.state === 'rejected')
      .map((r) => ({ text: 'Request rejected: ' + r.purpose, campaign: r.campaign, to: '/release', go: 'New request' })),
  ]

  return (
    <section className="wrap">
      <h1>{user.org} dashboard</h1>
      <p className="lead">
  Your campaigns, fund requests and proof in one place.{' '}
  <span className={'pill ' + (status === 'Verified' ? 'Completed' : status === 'Rejected' ? 'Overdue' : 'Inreview')}>
    {status === 'Verified' ? 'Verified organisation' : status === 'Rejected' ? 'Verification rejected' : 'Verification pending'}
  </span>
</p>
{status !== 'Verified' && (
  <div className="panel warn">
    <strong>{status === 'Rejected' ? 'Your organisation was not verified.' : 'Waiting for admin verification.'}</strong>
    <p className="small-t" style={{ margin: '6px 0 0' }}>
      Campaigns, fund requests and evidence upload are unlocked once an admin verifies your organisation.
    </p>
  </div>
)}

      <div className="actions" style={{ marginTop: 0, marginBottom: 20 }}>
        <Link className="btn small" to="/create">Start a campaign</Link>
        <Link className="btn ghost small" to="/release">Request funds</Link>
        <Link className="btn ghost small" to="/evidence">Upload evidence</Link>
      </div>

      <div className="panel">
        <div className="stats">
          <div><span>Campaigns</span><strong>{mine.length}</strong></div>
          <div><span>Collected</span><strong>{inr(collected)}</strong></div>
          <div><span>Released to you</span><strong>{inr(released)}</strong></div>
          <div><span>Still locked</span><strong>{inr(collected - released)}</strong></div>
        </div>
      </div>

      <h2>Action needed</h2>
      {actions.length === 0 ? (
        <p className="muted">Nothing needs your attention right now.</p>
      ) : (
        <div className="panel warn">
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {actions.map((a, i) => (
              <li key={i} style={{ marginBottom: 8 }}>
                {a.text} <span className="muted small-t">({a.campaign})</span>{' '}
                <Link className="link" to={a.to}>{a.go}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2>My campaigns</h2>
      {mine.length === 0 ? (
        <p className="muted">You have no campaigns yet. Start your first one above.</p>
      ) : (
        <table>
          <thead>
            <tr><th>Campaign</th><th>Goal</th><th>Collected</th><th>Released</th><th>Progress</th><th></th></tr>
          </thead>
          <tbody>
            {mine.map((c) => {
              const pct = Math.min(100, Math.round((c.raised / c.goal) * 100))
              return (
                <tr key={c.id}>
                  <td>{c.title}</td>
                  <td>{inr(c.goal)}</td>
                  <td>{inr(c.raised)}</td>
                  <td>{inr(c.released)}</td>
                  <td style={{ minWidth: 120 }}>
                    <div className="bar" style={{ margin: 0 }}><b style={{ width: pct + '%' }} /></div>
                    <span className="muted small-t">{pct}%</span>
                  </td>
                  <td><Link className="link" to={`/campaigns/${c.id}`}>Open</Link></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

      <h2>My fund requests</h2>
      {myRequests.length === 0 ? (
        <p className="muted">No requests yet.</p>
      ) : (
        <table>
          <thead>
            <tr><th>ID</th><th>Purpose</th><th>Amount</th><th>Approvals</th><th>Status</th></tr>
          </thead>
          <tbody>
            {myRequests.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.purpose}</td>
                <td>{inr(r.amount)}</td>
                <td>{r.approvals} of {r.needed}</td>
                <td><span className={'pill ' + requestPill[r.state]}>{requestText[r.state]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>My evidence</h2>
      {evidence.length === 0 ? (
        <p className="muted">No evidence uploaded yet.</p>
      ) : (
        <table>
          <thead>
            <tr><th>File</th><th>Campaign</th><th>Type</th><th>Review status</th></tr>
          </thead>
          <tbody>
            {evidence.map((e, i) => (
              <tr key={e.file + i}>
                <td>{e.url ? <a className="link" href={e.url} target="_blank" rel="noreferrer">{e.file}</a> : e.file}</td>
                <td>{e.campaign}</td>
                <td>{e.type}</td>
                <td><span className={'pill ' + statusPill[e.status]}>{e.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}