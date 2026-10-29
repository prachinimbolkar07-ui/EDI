import { Link, useParams } from 'react-router-dom'
import CampaignCard from '../components/CampaignCard.jsx'
import { useCampaigns } from '../CampaignsContext.jsx'
import { inr } from '../data.js'

export default function NgoDetail() {
  const { name } = useParams()
  const { campaigns } = useCampaigns()
  const mine = campaigns.filter((c) => c.org === name)

  if (!mine.length) {
    return <section className="wrap"><h1>Organisation not found</h1><Link to="/ngos" className="link">Back to organisations</Link></section>
  }

  const raised = mine.reduce((s, c) => s + c.raised, 0)
  const released = mine.reduce((s, c) => s + c.released, 0)

  return (
    <section className="wrap">
      <Link to="/ngos" className="link">← All organisations</Link>
      <h1>{name}</h1>

      <div className="panel">
        <div className="stats">
          <div><span>Campaigns</span><strong>{mine.length}</strong></div>
          <div><span>Collected</span><strong>{inr(raised)}</strong></div>
          <div><span>Released</span><strong>{inr(released)}</strong></div>
          <div><span>Locked in contracts</span><strong>{inr(raised - released)}</strong></div>
        </div>
      </div>

      <h2>Campaigns</h2>
      <div className="grid">{mine.map((c) => <CampaignCard key={c.id} c={c} />)}</div>
    </section>
  )
}