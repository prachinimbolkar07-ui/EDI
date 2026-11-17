import { Link } from 'react-router-dom'
import CampaignCard from '../components/CampaignCard.jsx'
import { useCampaigns } from '../CampaignsContext.jsx'
import { inr } from '../data.js'

export default function Home() {
  const { campaigns } = useCampaigns()
  const raised = campaigns.reduce((s, c) => s + c.raised, 0)
  const released = campaigns.reduce((s, c) => s + c.released, 0)

  return (
    <>
      <section className="hero">
        <div className="wrap hero-in" style={{ gridTemplateColumns: '1fr', maxWidth: 820 }}>
          <div>
            <h1>See where every rupee goes, from donation to receipt.</h1>
            <p className="lead">
              Donations are recorded on the blockchain. Funds are released only after reviewers approve.
              Organisers upload invoices and photos so you can check the proof yourself.
            </p>
            <div className="actions">
              <Link className="btn" to="/ngos">Browse organisations</Link>
              <Link className="btn ghost" to="/login">Log in</Link>
            </div>
            <div className="actions" style={{ gap: 40, marginTop: 40 }}>
              <div><strong style={{ fontSize: '1.8rem', display: 'block' }}>{inr(raised)}</strong><span style={{ color: '#c9d4de' }}>Raised</span></div>
              <div><strong style={{ fontSize: '1.8rem', display: 'block' }}>{inr(released)}</strong><span style={{ color: '#c9d4de' }}>Released with approval</span></div>
              <div><strong style={{ fontSize: '1.8rem', display: 'block' }}>{campaigns.length}</strong><span style={{ color: '#c9d4de' }}>Campaigns</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap">
        <h2>How a donation is tracked</h2>
        <ol className="steps">
          <li><strong>Donate</strong><p>Your donation is recorded on-chain with a transaction ID.</p></li>
          <li><strong>Request</strong><p>The organiser asks to release funds for a milestone.</p></li>
          <li><strong>Approve</strong><p>Reviewers must approve before the contract releases money.</p></li>
          <li><strong>Prove</strong><p>Invoices, receipts and photos are attached as proof.</p></li>
        </ol>
      </section>

      <section className="wrap">
        <div className="row">
          <h2>Active campaigns</h2>
          <Link to="/ngos" className="link">See all organisations</Link>
        </div>
        <div className="grid">
          {campaigns.map((c) => <CampaignCard key={c.id} c={c} />)}
        </div>
      </section>
    </>
  )
}