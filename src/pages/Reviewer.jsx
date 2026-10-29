import { inr } from '../data.js'
import { useRequests } from '../RequestsContext.jsx'

export default function Reviewer() {
  const { list, decide } = useRequests()

  return (
    <section className="wrap">
      <h1>Review requests</h1>
      <p className="lead">Check the purpose and proof, then approve or reject. A request needs 2 of 3 reviewers to approve before funds can be released.</p>

      <div className="grid">
        {list.map((r) => {
          const ready = r.approvals >= r.needed
          return (
            <div className="card static" key={r.id}>
              <span className="tag">{r.id}</span>
              <h3>{r.purpose}</h3>
              <p className="muted">{r.campaign}</p>
              <p><strong>{inr(r.amount)}</strong> requested · proof: {r.proof}</p>
              <div className="bar"><b style={{ width: Math.min(100, (r.approvals / r.needed) * 100) + '%' }} /></div>
              <p className="muted small-t">{r.approvals} of {r.needed} approvals needed (2 of 3 reviewers)</p>

              {ready && <p><span className="pill Completed">Ready to release</span></p>}

              {r.state === 'pending' ? (
                <div className="actions">
                  <button className="btn small" onClick={() => decide(r.id, 'approved')}>Approve</button>
                  <button className="btn ghost small" onClick={() => decide(r.id, 'rejected')}>Reject</button>
                </div>
              ) : (
                <span className={'pill ' + (r.state === 'approved' ? 'Completed' : 'Overdue')}>
                  {r.state === 'approved' ? 'You approved' : 'You rejected'}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}