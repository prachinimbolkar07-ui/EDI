import { useState } from 'react'
import { Link } from 'react-router-dom'
import CampaignCard from '../components/CampaignCard.jsx'
import { useCampaigns } from '../CampaignsContext.jsx'
import { useAuth } from '../AuthContext.jsx'

export default function Campaigns() {
  const { user } = useAuth()
  const { campaigns } = useCampaigns()
  const isOrg = user?.role === 'Organiser'
  const base = isOrg ? campaigns.filter((c) => c.org === user.org) : campaigns
  const cats = ['All', ...new Set(base.map((c) => c.category))]

  const [cat, setCat] = useState('All')
  const [q, setQ] = useState('')
  const list = base.filter((c) => (cat === 'All' || c.category === cat) && c.title.toLowerCase().includes(q.toLowerCase()))

  return (
    <section className="wrap">
      <div className="row">
        <h1>{isOrg ? 'My campaigns' : 'Campaigns'}</h1>
        {isOrg && <Link className="btn small" to="/create">Start a campaign</Link>}
      </div>
      {isOrg && <p className="lead">Campaigns run by {user.org}.</p>}

      <div className="filters">
        <input placeholder="Search campaigns" value={q} onChange={(e) => setQ(e.target.value)} />
        {cats.map((c) => <button key={c} className={'chip' + (c === cat ? ' on' : '')} onClick={() => setCat(c)}>{c}</button>)}
      </div>
      <div className="grid">{list.map((c) => <CampaignCard key={c.id} c={c} />)}</div>
      {!list.length && <p className="muted">{isOrg ? 'You have no campaigns yet. Start your first one.' : 'No campaigns match. Try another category or clear the search.'}</p>}
    </section>
  )
}