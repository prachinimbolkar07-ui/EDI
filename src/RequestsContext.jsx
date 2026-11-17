import { createContext, useContext, useState } from 'react'
import { requests as seed } from './data.js'

// Reviewers in the order they act
export const LEVELS = [
  { name: 'Reviewer A', title: 'Level 1' },
  { name: 'Reviewer B', title: 'Level 2' },
  { name: 'Reviewer C', title: 'Level 3' },
]
export const NEEDED = 2

// Sample votes so the demo starts with some activity
const seedVotes = {
  'R-21': { 'Reviewer A': 'approved' },
  'R-22': {},
}

function summarise(r) {
  const values = LEVELS.map((l) => r.votes[l.name]).filter(Boolean)
  const approvals = values.filter((v) => v === 'approved').length
  const rejections = values.filter((v) => v === 'rejected').length

  let state = 'pending'
  if (approvals >= NEEDED) state = 'approved'
  else if (rejections >= NEEDED) state = 'rejected'

  const nextIndex = LEVELS.findIndex((l) => !r.votes[l.name])
  return {
    ...r,
    approvals,
    rejections,
    needed: NEEDED,
    state,
    currentLevel: state === 'pending' ? nextIndex : -1,
  }
}

const RequestsContext = createContext()

export function RequestsProvider({ children }) {
  const [list, setList] = useState(seed.map((r) => summarise({ ...r, votes: seedVotes[r.id] || {} })))

  const add = (request) => setList((l) => [summarise({ ...request, votes: {} }), ...l])

  const vote = (id, reviewer, decision) =>
    setList((l) =>
      l.map((r) => {
        if (r.id !== id) return r
        const idx = LEVELS.findIndex((x) => x.name === reviewer)
        // only the reviewer whose turn it is may vote, and only once
        if (r.state !== 'pending' || idx !== r.currentLevel || r.votes[reviewer]) return r
        return summarise({ ...r, votes: { ...r.votes, [reviewer]: decision } })
      })
    )

  return <RequestsContext.Provider value={{ list, add, vote }}>{children}</RequestsContext.Provider>
}

export const useRequests = () => useContext(RequestsContext)