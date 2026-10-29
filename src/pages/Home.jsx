import { Link } from 'react-router-dom'
import CampaignCard from '../components/CampaignCard.jsx'
import { campaigns, inr } from '../data.js'

export default function Home() {
  const t = campaigns[0]
  return (<>
    <section className="hero"><div className="wrap hero-in">
      <div>
        <h1>See where every rupee goes, from donation to receipt.</h1>
        <p className="lead">Donations are recorded on the blockchain. Funds are released only after reviewers approve. Organisers upload invoices and photos so you can check the proof yourself.</p>
        <div className="actions"><Link className="btn" to="/campaigns">Browse campaigns</Link><Link className="btn ghost" to="/create">Start a campaign</Link></div>
      </div>
      <div className="ledger" aria-label="Sample audit trail">
        <h4>Live audit trail · {t.title}</h4>
        {t.trail.slice(0, 4).map((e) => (<div className="ev" key={e.tx}><i /><div><strong>{e.t}</strong><span>{e.d}</span><code>{e.tx}</code></div></div>))}
      </div>
    </div></section>
    <section className="wrap"><h2>How a donation is tracked</h2>
      <ol className="steps">
        {[['Donate', 'Your donation is recorded on-chain with a transaction ID.'], ['Request', 'The organiser asks to release funds for a milestone.'], ['Approve', 'Several reviewers must approve before the contract releases money.'], ['Prove', 'Invoices, receipts and photos are attached to the release.']].map(([a, b]) => <li key={a}><strong>{a}</strong><p>{b}</p></li>)}
      </ol></section>
    <section className="wrap"><div className="row"><h2>Active campaigns</h2><Link to="/campaigns" className="link">See all campaigns</Link></div>
      <div className="grid">{campaigns.map((c) => <CampaignCard key={c.id} c={c} />)}</div>
      <p className="muted">Together: {inr(campaigns.reduce((s, c) => s + c.raised, 0))} raised, {inr(campaigns.reduce((s, c) => s + c.released, 0))} released.</p></section>
  </>)
}