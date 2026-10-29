import { Link } from 'react-router-dom'
import { campaigns, inr } from '../data.js'

// Sample donations by this donor. Later these come from the blockchain / backend.
const mine = [
  { id: 1, amount: 5000, when: '12 Oct 2026', tx: '0x9a21…f3d0' },
  { id: 3, amount: 2000, when: '03 Oct 2026', tx: '0xb7c4…19aa' },
]

const evidencePill = { Verified: 'Completed', Reviewed: 'Completed', Pending: 'Inreview', 'Needs changes': 'Inreview', Rejected: 'Overdue' }

export default function Dashboard() {
  const total = mine.reduce((s, d) => s + d.amount, 0)

  const rows = mine.map((d) => {
    const c = campaigns.find((x) => x.id === d.id)
    const share = d.amount / c.raised
    const released = Math.round(share * c.released)
    return { d, c, share, released, locked: d.amount - released }
  })
  const totalReleased = rows.reduce((s, r) => s + r.released, 0)

  return (
    <section className="wrap">
      <h1>My dashboard</h1>
      <p className="lead">Your donations, and what has happened to the campaigns you support.</p>

      <div className="panel">
        <div className="stats">
          <div><span>You donated</span><strong>{inr(total)}</strong></div>
          <div><span>Your share released</span><strong>{inr(totalReleased)}</strong></div>
          <div><span>Your share still locked</span><strong>{inr(total - totalReleased)}</strong></div>
          <div><span>Campaigns supported</span><strong>{mine.length}</strong></div>
        </div>
      </div>

      <p className="muted small-t">
        Donations from all donors are pooled in one campaign contract, so we cannot trace your exact coins.
        “Your share” is an estimate: your donation divided by the campaign total, applied to the amount released.
      </p>

      {rows.map(({ d, c, share, released, locked }) => {
        const issues = [
          ...c.milestones.filter((m) => m.status === 'Overdue').map((m) => `Overdue: ${m.name}`),
          ...c.evidence.filter((e) => ['Pending', 'Needs changes', 'Rejected'].includes(e.status)).map((e) => `${e.status}: ${e.file}`),
        ]
        return (
          <div className="panel" key={d.id + d.tx}>
            <div className="row">
              <h3>{c.title}</h3>
              <Link className="link" to={`/campaigns/${c.id}`}>Open campaign</Link>
            </div>
            <p className="muted small-t">You donated {inr(d.amount)} on {d.when} · transaction <code>{d.tx}</code></p>

            <h4 style={{ marginTop: '1em' }}>Your {inr(d.amount)}</h4>
            <div className="bar"><b style={{ width: (released / d.amount) * 100 + '%' }} /></div>
            <div className="row small-t">
              <span><strong>{inr(released)}</strong> released from your share</span>
              <span><strong>{inr(locked)}</strong> still locked</span>
            </div>
            <p className="muted small-t">Your share of this campaign is {(share * 100).toFixed(1)}%.</p>

            <h4 style={{ marginTop: '1em' }}>Whole campaign</h4>
            <div className="stats">
              <div><span>Collected</span><strong>{inr(c.raised)}</strong></div>
              <div><span>Released</span><strong>{inr(c.released)}</strong></div>
              <div><span>Locked</span><strong>{inr(c.raised - c.released)}</strong></div>
            </div>

            <h4 style={{ marginTop: '1em' }}>Proof submitted</h4>
            {c.evidence.length ? (
              <p>
                {c.evidence.map((e) => (
                  <span key={e.file} style={{ marginRight: 8 }}>
                    {e.file} <span className={'pill ' + evidencePill[e.status]}>{e.status}</span>
                  </span>
                ))}
              </p>
            ) : <p className="muted small-t">No evidence uploaded yet.</p>}

            {issues.length > 0 && (
              <div className="panel warn">
                <strong>Needs attention</strong>
                <ul>{issues.map((i) => <li key={i}>{i}</li>)}</ul>
              </div>
            )}
          </div>
        )
      })}
    </section>
  )
}