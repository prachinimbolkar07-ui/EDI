import { Link } from 'react-router-dom'
import { inr } from '../data.js'

export default function CampaignCard({ c }) {
  const pct = Math.round((c.raised / c.goal) * 100)
  return (
    <Link to={`/campaigns/${c.id}`} className="card">
      <span className="tag">{c.category}</span>
      <h3>{c.title}</h3>
      <p className="muted">by {c.org}</p>
      <div className="bar"><b style={{ width: pct + '%' }} /></div>
      <div className="row"><span><strong>{inr(c.raised)}</strong> raised of {inr(c.goal)}</span><span>{pct}%</span></div>
      <p className="muted small-t">{inr(c.released)} released so far</p>
    </Link>)
}
