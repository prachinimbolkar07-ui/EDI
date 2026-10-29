import { Link } from 'react-router-dom'
import { useCampaigns } from '../CampaignsContext.jsx'
import { inr } from '../data.js'

export default function Ngos() {
  const { campaigns } = useCampaigns()
  const names = [...new Set(campaigns.map((c) => c.org))]

  return (
    <section className="wrap">
      <h1>Organisations</h1>
      <p className="lead">Choose an organisation to see its campaigns, fund releases and proof.</p>

      <div className="grid">
        {names.map((name) => {
          const mine = campaigns.filter((c) => c.org === name)
          const raised = mine.reduce((s, c) => s + c.raised, 0)
          const released = mine.reduce((s, c) => s + c.released, 0)
          return (
            <Link key={name} to={`/ngos/${encodeURIComponent(name)}`} className="card">
              <h3>{name}</h3>
              <p className="muted">{mine.length} {mine.length === 1 ? 'campaign' : 'campaigns'}</p>
              <p><strong>{inr(raised)}</strong> raised · <strong>{inr(released)}</strong> released</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}