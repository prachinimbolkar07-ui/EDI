import { createContext, useContext, useState } from 'react'
import { requests as seed } from './data.js'

const RequestsContext = createContext()

export function RequestsProvider({ children }) {
  const [list, setList] = useState(seed.map((r) => ({ ...r, state: 'pending' })))

  const add = (request) => setList((l) => [request, ...l])

  const decide = (id, state) =>
    setList((l) =>
      l.map((r) =>
        r.id === id
          ? { ...r, state, approvals: state === 'approved' ? r.approvals + 1 : r.approvals }
          : r
      )
    )

  return <RequestsContext.Provider value={{ list, add, decide }}>{children}</RequestsContext.Provider>
}

export const useRequests = () => useContext(RequestsContext)