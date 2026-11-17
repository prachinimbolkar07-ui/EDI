import { inr } from '../data.js'
import { useRequests, LEVELS, NEEDED } from '../RequestsContext.jsx'
import { useAuth } from '../AuthContext.jsx'

const pillClass = { approved: 'Completed', rejected: 'Overdue' }
const pillText = { approved: 'Approved', rejected: 'Rejected' }

export default function Reviewer() {
  const { list, vote } = useRequests()
  const { user } = useAuth()
  const me = user.name
  const myLevel = LEVELS.findIndex((l) => l.name === me)

  return (
    <section className="wrap">
      <h1>Review requests</h1>
      <p className="lead">
        Reviewers act in order: Level 1, then Level 2. A request needs at least {NEEDED} of 3 approvals.
        If Level 1 and Level 2 disagree, Level 3 decides. You are signed in as {me}
        {myLevel >= 0 ? ' (' + LEVELS[myLevel].title + ').' : '.'}
      </p>

      <div className="grid">
        {list.map((r) => {
          const myVote = r.votes[me]
          const myTurn = r.state === 'pending' && r.currentLevel === myLevel && !myVote
          return (
            <div className="card static" key={r.id}>
              <span className="tag">{r.id}</span>
              <h3>{r.purpose}</h3>
              <p className="muted">{r.campaign}</p>
              <p><strong>{inr(r.amount)}</strong> requested · proof: {r.proof}</p>

              <div className="bar"><b style={{ width: Math.min(100, (r.approvals / NEEDED) * 100) + '%' }} /></div>
              <p className="muted small-t">{r.approvals} of {NEEDED} approvals needed (out of 3 reviewers)</p>

              <h4 style={{ marginTop: '1em', fontSize: '.95rem' }}>Reviewers</h4>
              {LEVELS.map((l, i) => {
                const v = r.votes[l.name]
                let badge
                if (v) badge = <span className={'pill ' + pillClass[v]}>{pillText[v]}</span>
                else if (r.state === 'pending' && i === r.currentLevel) badge = <span className="pill Inreview">Reviewing now</span>
                else if (r.state !== 'pending') badge = <span className="pill">Not needed</span>
                else badge = <span className="pill">Waiting</span>
                return (
                  <div className="row" key={l.name} style={{ padding: '4px 0' }}>
                    <span>{l.title} · {l.name}{l.name === me ? ' (you)' : ''}</span>
                    {badge}
                  </div>
                )
              })}

              {r.state === 'approved' && <p><span className="pill Completed">Ready to release</span></p>}
              {r.state === 'rejected' && <p><span className="pill Overdue">Request rejected</span></p>}

              {myTurn && (
                <div className="actions">
                  <button className="btn small" onClick={() => vote(r.id, me, 'approved')}>Approve</button>
                  <button className="btn ghost small" onClick={() => vote(r.id, me, 'rejected')}>Reject</button>
                </div>
              )}
              {!myTurn && r.state === 'pending' && myLevel >= 0 && !myVote && (
                <p className="muted small-t">Not your turn yet. {LEVELS[r.currentLevel].title} is reviewing.</p>
              )}
              {myVote && <p className="muted small-t">You {myVote} this request.</p>}
            </div>
          )
        })}
      </div>
    </section>
  )
}