import { createContext, useContext, useState } from 'react'

const EvidenceContext = createContext()

export function EvidenceProvider({ children }) {
  const [items, setItems] = useState([])
  const add = (item) => setItems((list) => [item, ...list])
  return <EvidenceContext.Provider value={{ items, add }}>{children}</EvidenceContext.Provider>
}

export const useEvidence = () => useContext(EvidenceContext)