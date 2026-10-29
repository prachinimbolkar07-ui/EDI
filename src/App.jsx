import { Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Campaigns from './pages/Campaigns.jsx'
import CampaignDetail from './pages/CampaignDetail.jsx'
import CreateCampaign from './pages/CreateCampaign.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Reviewer from './pages/Reviewer.jsx'
import UploadEvidence from './pages/UploadEvidence.jsx'
import ReleaseRequest from './pages/ReleaseRequest.jsx'
import Login from './pages/Login.jsx'
import Admin from './pages/Admin.jsx'
import Ngos from './pages/Ngos.jsx'
import NgoDetail from './pages/NgoDetail.jsx'
import { useAuth } from './AuthContext.jsx'

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
        <Route path="/dashboard" element={<Only roles={['Donor']}><Dashboard /></Only>} />
        <Route path="/create" element={<Only roles={['Organiser']}><CreateCampaign /></Only>} />
        <Route path="/release" element={<Only roles={['Organiser']}><ReleaseRequest /></Only>} />
        <Route path="/evidence" element={<Only roles={['Organiser']}><UploadEvidence /></Only>} />
        <Route path="/review" element={<Only roles={['Reviewer']}><Reviewer /></Only>} />
        <Route path="/admin" element={<Only roles={['Admin']}><Admin /></Only>} />
        <Route path="*" element={<section className="wrap"><h1>Page not found</h1><p>Use the menu above to go back.</p></section>} />
      </Routes>
    </main>
    <Footer />
  </>)
}