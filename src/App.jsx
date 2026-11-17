import { Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Campaigns from './pages/Campaigns.jsx'
import CampaignDetail from './pages/CampaignDetail.jsx'
import CreateCampaign from './pages/CreateCampaign.jsx'
import Dashboard from './pages/Dashboard.jsx'
import OrganiserDashboard from './pages/OrganiserDashboard.jsx'
import Reviewer from './pages/Reviewer.jsx'
import UploadEvidence from './pages/UploadEvidence.jsx'
import ReleaseRequest from './pages/ReleaseRequest.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Admin from './pages/Admin.jsx'
import Ngos from './pages/Ngos.jsx'
import NgoDetail from './pages/NgoDetail.jsx'
import { useAuth } from './AuthContext.jsx'
import { useAccounts } from './AccountsContext.jsx'

function Only({ roles, children }) {
  const { user } = useAuth()
  if (user && roles.includes(user.role)) return children
  return (
    <section className="wrap narrow">
      <h1>This page is for {roles.join(' / ')} accounts</h1>
      <p className="lead">{user ? `You are logged in as ${user.role}.` : 'Please log in first.'}</p>
      <Link className="btn" to="/login">Go to log in</Link>
    </section>
  )
}

function VerifiedOnly({ children }) {
  const { user } = useAuth()
  const { orgs } = useAccounts()
  const org = orgs.find((o) => o.name === user.org)
  const status = org ? org.status : 'Pending'
  if (status === 'Verified') return children
  return (
    <section className="wrap narrow">
      <h1>{status === 'Rejected' ? 'Verification was rejected' : 'Verification pending'}</h1>
      <p className="lead">
        {status === 'Rejected'
          ? 'The admin could not verify your organisation. Please contact the platform admin.'
          : 'An admin is checking your organisation. You can create campaigns, request funds and upload evidence once it is verified.'}
      </p>
      <Link className="btn" to="/organiser">Back to dashboard</Link>
    </section>
  )
}

const org = (page) => (
  <Only roles={['Organiser']}>
    <VerifiedOnly>{page}</VerifiedOnly>
  </Only>
)

export default function App() {
  return (<>
    <Navbar />
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/campaigns/:id" element={<CampaignDetail />} />
        <Route path="/ngos" element={<Ngos />} />
        <Route path="/ngos/:name" element={<NgoDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Only roles={['Donor']}><Dashboard /></Only>} />
        <Route path="/organiser" element={<Only roles={['Organiser']}><OrganiserDashboard /></Only>} />
        <Route path="/create" element={org(<CreateCampaign />)} />
        <Route path="/release" element={org(<ReleaseRequest />)} />
        <Route path="/evidence" element={org(<UploadEvidence />)} />
        <Route path="/review" element={<Only roles={['Reviewer']}><Reviewer /></Only>} />
        <Route path="/admin" element={<Only roles={['Admin']}><Admin /></Only>} />
        <Route path="*" element={<section className="wrap"><h1>Page not found</h1><p>Use the menu above to go back.</p></section>} />
      </Routes>
    </main>
    <Footer />
  </>)
}