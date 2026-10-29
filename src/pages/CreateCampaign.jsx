import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'
import { useCampaigns } from '../CampaignsContext.jsx'

const emptyMs = { name: '', amount: '', result: '', evidence: 'Invoice', due: '' }

export default function CreateCampaign() {
  const { user } = useAuth()
  const { addCampaign } = useCampaigns()
  const navigate = useNavigate()
  const [f, setF] = useState({ title: '', category: 'Education', goal: '', about: '' })
  const [ms, setMs] = useState([{ ...emptyMs }])

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const setM = (i, k, v) => setMs(ms.map((m, j) => (j === i ? { ...m, [k]: v } : m)))
  const planned = ms.reduce((s, m) => s + Number(m.amount || 0), 0)
  const overBudget = f.goal && planned > Number(f.goal)

  function handleSubmit(e) {
    e.preventDefault()
    if (overBudget) return
    const id = Date.now()
    addCampaign({
      id,
      title: f.title,
      category: f.category,
      org: user.org,
      goal: Number(f.goal),
      raised: 0,
      released: 0,
      about: f.about,
      milestones: ms.map((m) => ({ name: m.name, amount: Number(m.amount), status: 'Upcoming', due: m.due, result: m.result, evidence: m.evidence })),
      evidence: [],
      trail: [{ t: 'Campaign created', d: 'Goal ₹' + Number(f.goal).toLocaleString('en-IN'), when: new Date().toLocaleDateString('en-IN'), tx: 'new-' + id }],
    })
    navigate('/campaigns')
  }

  return (
    <section className="wrap narrow">
      <h1>Start a campaign</h1>
      <p className="lead">This campaign will be added under {user.org}. Add a clear goal and milestones so donors see what each release is for.</p>

      <form className="panel" onSubmit={handleSubmit}>
        <label htmlFor="t">Campaign title</label>
        <input id="t" required value={f.title} onChange={set('title')} />

        <div className="two-eq">
          <div>
            <label htmlFor="c">Category</label>
            <select id="c" value={f.category} onChange={set('category')}>
              {['Education', 'Healthcare', 'Clean Water', 'Disaster Relief', 'Other'].map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="g">Donation goal (₹)</label>
            <input id="g" type="number" min="1" required value={f.goal} onChange={set('goal')} />
          </div>
        </div>

        <label htmlFor="a">Why is this campaign needed?</label>
        <textarea id="a" rows="4" required value={f.about} onChange={set('about')} />

        <h3 style={{ marginTop: '1.5em' }}>Milestones</h3>
        {ms.map((m, i) => (
          <div className="panel" key={i}>
            <strong>Milestone {i + 1}</strong>
            <div className="two-eq">
              <div>
                <label htmlFor={'mn' + i}>Name</label>
                <input id={'mn' + i} required value={m.name} onChange={(e) => setM(i, 'name', e.target.value)} />
              </div>
              <div>
                <label htmlFor={'ma' + i}>Budget (₹)</label>
                <input id={'ma' + i} type="number" min="1" required value={m.amount} onChange={(e) => setM(i, 'amount', e.target.value)} />
              </div>
            </div>
            <label htmlFor={'mr' + i}>Expected result</label>
            <input id={'mr' + i} required value={m.result} onChange={(e) => setM(i, 'result', e.target.value)} placeholder="Example: 500 textbooks purchased" />
            <div className="two-eq">
              <div>
                <label htmlFor={'me' + i}>Required evidence</label>
                <select id={'me' + i} value={m.evidence} onChange={(e) => setM(i, 'evidence', e.target.value)}>
                  {['Invoice', 'Receipt', 'Photo', 'Progress report'].map((x) => <option key={x}>{x}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor={'md' + i}>Evidence deadline</label>
                <input id={'md' + i} type="date" required value={m.due} onChange={(e) => setM(i, 'due', e.target.value)} />
              </div>
            </div>
            {ms.length > 1 && (
              <button type="button" className="btn ghost small" style={{ marginTop: 12 }} onClick={() => setMs(ms.filter((_, j) => j !== i))}>
                Remove milestone
              </button>
            )}
          </div>
        ))}

        <button type="button" className="btn ghost small" onClick={() => setMs([...ms, { ...emptyMs }])}>Add milestone</button>

        <p className="small-t" style={overBudget ? { color: 'var(--red)', fontWeight: 600 } : { color: 'var(--muted)' }}>
          Planned milestone budget: ₹{planned.toLocaleString('en-IN')}
          {overBudget ? ' is more than the donation goal. Lower a milestone budget to continue.' : ''}
        </p>

        <button className="btn full">Submit campaign</button>
      </form>
    </section>
  )
}