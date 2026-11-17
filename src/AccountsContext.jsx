import { createContext, useContext, useState } from 'react'
import { users as seedUsers } from './users.js'

// Sample organisations. All demo NGOs start as Verified.
const seedOrgs = [
  { name: 'Shiksha Trust', regNo: 'MH/2019/0412', status: 'Verified', email: 'shiksha@tracegood.com', phone: '9800000001', city: 'Pune', docName: 'registration-certificate.pdf' },
  { name: 'Jal Seva Foundation', regNo: 'MH/2021/1177', status: 'Verified', email: 'jalseva@tracegood.com', phone: '9800000002', city: 'Nashik', docName: 'registration-certificate.pdf' },
  { name: 'Arogya Samaj', regNo: 'MH/2018/0560', status: 'Verified', email: 'arogya@tracegood.com', phone: '9800000003', city: 'Nagpur', docName: 'registration-certificate.pdf' },
]

const AccountsContext = createContext()

export function AccountsProvider({ children }) {
  const [accounts, setAccounts] = useState(seedUsers)
  const [orgs, setOrgs] = useState(seedOrgs)

  const emailTaken = (email) => accounts.some((a) => a.email === email.trim().toLowerCase())

  // Each register function returns an error text, or '' when it worked
  function registerDonor({ name, email, password }) {
    if (emailTaken(email)) return 'An account with this email already exists.'
    setAccounts((a) => [...a, { email: email.trim().toLowerCase(), password, role: 'Donor', name, org: '' }])
    return ''
  }

  function registerNgo({ orgName, regNo, contact, email, phone, city, docName, password }) {
    if (emailTaken(email)) return 'An account with this email already exists.'
    if (orgs.some((o) => o.name.toLowerCase() === orgName.trim().toLowerCase())) return 'This organisation is already registered.'
    setAccounts((a) => [...a, { email: email.trim().toLowerCase(), password, role: 'Organiser', name: contact, org: orgName.trim() }])
    setOrgs((o) => [...o, { name: orgName.trim(), regNo, status: 'Pending', email: email.trim().toLowerCase(), phone, city, docName }])
    return ''
  }

  const setOrgStatus = (name, status) => setOrgs((o) => o.map((x) => (x.name === name ? { ...x, status } : x)))

  return (
    <AccountsContext.Provider value={{ accounts, orgs, registerDonor, registerNgo, setOrgStatus }}>
      {children}
    </AccountsContext.Provider>
  )
}

export const useAccounts = () => useContext(AccountsContext)