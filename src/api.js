import { campaigns, requests } from './data.js'

// Abhi ye functions sample data (data.js) dete hain.
// Backend ready hone par sirf in functions ke andar fetch() likhna hai.
// Example: return fetch('http://localhost:5000/api/campaigns').then((r) => r.json())

export async function getCampaigns() {
  return campaigns
}

export async function getCampaign(id) {
  return campaigns.find((c) => c.id === Number(id))
}

export async function getReleaseRequests() {
  return requests
}

export async function createCampaign(data) {
  console.log('TODO: send to backend', data)
  return { ok: true }
}

export async function uploadEvidence(file, details) {
  console.log('TODO: upload file to storage', file.name, details)
  return { ok: true }
}

export async function donate(campaignId, amount) {
  console.log('TODO: call smart contract donate()', campaignId, amount)
  return { ok: true }
}