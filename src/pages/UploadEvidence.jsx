import { useState } from 'react'
import { inr } from '../data.js'
import { useCampaigns } from '../CampaignsContext.jsx'
import { useRequests } from '../RequestsContext.jsx'
import { useAuth } from '../AuthContext.jsx'

export default function ReleaseRequest() {
  const { user } = useAuth()
  const { campaigns } = useCampaigns()
  const { list, add } = useRequests()
  const mine = campaigns.filter((c) => c.org === user.org)

  const [campaignId, setCampaignId] = useState(mine[0] ? mine[0].id : '')
  const campaign = mine.find((c) => c.id === Number(campaignId)) || mine[0]
  const [milestone, setMilestone] = useState(campaign ? campaign.milestones[0].name : '')
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [purpose, setPurpose] = useState('')

  if (!campaign) {
    return (
      <section className="wrap narrow">
        <h1>No campaigns yet</h1>
        <p className="lead">Start a campaign first, then you can request funds for it.</p>
      </section>
    )
  }

  function changeCampaign(e) {
    const c = mine.find((x) => x.id === Number(e.target.value))
    setCampaignId(c.id)
    setMilestone(c.milestones[0].name)
  }

  function handleSubmit(e) {
    e.preventDefault()
    add({
      id: 'R-' + (30 + list.length),
      campaign: campaign.title,
      purpose: milestone + ': ' + purpose,
      amount: Number(amount),
      recipient,
      approvals: 0,
      needed: 2,
      proof: 'Not uploaded yet',
      state: 'pending',
    })
    setAmount('')
    setRecipient('')
    setPurpose('')
  }

  const available = campaign.raised - campaign.released
  const titles = mine.map((c) => c.title)
  const myRequests = list.filter((r) => titles.includes(r.campaign))
  const label = { pending: 'Waiting for approval', approved: 'Approved', rejected: 'Rejected' }

  return (
    <section className="wrap narrow">
      <h1>Request a fund release</h1>
      <p className="lead">Reviewers will check this request. Funds are released only after enough of them approve.</p>

      <form className="panel" onSubmit={handleSubmit}>
        <label htmlFor="camp">Campaign</label>
        <select id="camp" value={campaign.id} onChange={changeCampaign}>
          {mine.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <p className="muted small-t">Available to release: {inr(available)}</p>

        <label htmlFor="ms">Milestone</label>
        <select id="ms" value={milestone} onChange={(e) => setMilestone(e.target.value)}>
          {campaign.milestones.map((m) => <option key={m.name}>{m.name}</option>)}
        </select>

        <label htmlFor="amt">Amount (₹)</label>
        <input id="amt" type="number" min="1" max={available} required value={amount} onChange={(e) => setAmount(e.target.value)} />

        <label htmlFor="rec">Recipient (vendor or wallet address)</label>
        <input id="rec" required value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Example: Sharma Book Depot" />

        <label htmlFor="pur">Purpose</label>
        <textarea id="pur" rows="3" required value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Why do you need this money?" />

        <button className="btn full">Submit request</button>
      </form>

      <h2>Your requests</h2>
      {myRequests.length === 0 ? (
        <p className="muted">No requests yet. Fill in the form above to send your first one.</p>
      ) : (
        <table>
          <thead>
            <tr><th>ID</th><th>Purpose</th><th>Amount</th><th>Status</th></tr>
          </thead>
          <tbody>
            {myRequests.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.purpose}</td>
                <td>{inr(r.amount)}</td>
                <td>
                  <span className={'pill ' + (r.state === 'approved' ? 'Completed' : r.state === 'rejected' ? 'Overdue' : 'Inreview')}>
                    {label[r.state || 'pending']}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}