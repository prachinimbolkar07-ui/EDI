// Sample data only. Later, replace with calls to your Express API and smart contract.
export const inr = (n) => '₹' + n.toLocaleString('en-IN')
export const campaigns = [
  { id: 1, title: 'Books for 500 Village Students', category: 'Education', org: 'Shiksha Trust', goal: 100000, raised: 72000, released: 40000, deadline: '2026-12-15',
    about: 'Textbooks, notebooks and stationery for government school students in rural Maharashtra.',
    milestones: [
      { name: 'Buy textbooks', amount: 40000, status: 'Completed', due: '2026-10-20' },
      { name: 'Buy notebooks and stationery', amount: 25000, status: 'In review', due: '2026-11-10' },
      { name: 'Distribute kits in schools', amount: 35000, status: 'Overdue', due: '2026-10-25' } ],
    evidence: [
      { file: 'invoice-textbooks.pdf', type: 'Invoice', date: '2026-10-18', status: 'Verified' },
      { file: 'distribution-photos.zip', type: 'Photos', date: '2026-10-27', status: 'Needs changes' } ],
    trail: [
      { t: 'Donation received', d: '₹5,000 from 0x4aF1…92c3', when: '12 Oct, 10:42', tx: '0x9a21…f3d0' },
      { t: 'Release requested', d: '₹40,000 for textbooks', when: '15 Oct, 16:05', tx: '0x71be…0a44' },
      { t: 'Approved (2 of 3)', d: 'Reviewers A and B approved', when: '17 Oct, 11:20', tx: '0xc3d8…77e1' },
      { t: 'Funds released', d: '₹40,000 to Shiksha Trust', when: '17 Oct, 11:31', tx: '0x5e02…bb19' },
      { t: 'Evidence added', d: 'invoice-textbooks.pdf', when: '18 Oct, 09:14', tx: '0x18ac…d6f2' } ] },
  { id: 2, title: 'Clean Water Wells for Two Villages', category: 'Clean Water', org: 'Jal Seva Foundation', goal: 250000, raised: 90000, released: 0, deadline: '2027-01-30',
    about: 'Two hand-pump borewells and basic filtration units.',
    milestones: [ { name: 'Site survey', amount: 20000, status: 'Upcoming', due: '2026-11-30' } ],
    evidence: [],
    trail: [ { t: 'Campaign created', d: 'Goal ₹2,50,000', when: '01 Oct, 09:00', tx: '0x02ff…a911' } ] },
  { id: 3, title: 'Mobile Health Camp', category: 'Healthcare', org: 'Arogya Samaj', goal: 60000, raised: 58000, released: 30000, deadline: '2026-11-20',
    about: 'Free check-ups and medicines for 800 people.',
    milestones: [ { name: 'Medicines', amount: 30000, status: 'Completed', due: '2026-10-12' } ],
    evidence: [ { file: 'pharmacy-bill.pdf', type: 'Receipt', date: '2026-10-13', status: 'Reviewed' } ],
    trail: [ { t: 'Funds released', d: '₹30,000 for medicines', when: '11 Oct, 14:10', tx: '0xd4a7…1c0e' } ] },
]
export const requests = [
  { id: 'R-21', campaign: 'Books for 500 Village Students', purpose: 'Notebooks and stationery', amount: 25000, approvals: 1, needed: 2, proof: 'quote-notebooks.pdf' },
  { id: 'R-22', campaign: 'Mobile Health Camp', purpose: 'Camp logistics', amount: 12000, approvals: 1, needed: 2, proof: 'vendor-invoice.pdf' },
]