import { createContext, useContext, useState } from 'react'
import { campaigns as seed } from './data.js'

const CampaignsContext = createContext()

export function CampaignsProvider({ children }) {
  const [campaigns, setCampaigns] = useState(seed)
  const addCampaign = (c) => setCampaigns((list) => [c, ...list])
  return <CampaignsContext.Provider value={{ campaigns, addCampaign }}>{children}</CampaignsContext.Provider>
}

export const useCampaigns = () => useContext(CampaignsContext)