import React from 'react'
import { createRoot } from 'react-dom/client'

const root = createRoot(document.getElementById('root'))

function show(error) {
  root.render(
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#b0402e' }}>Something went wrong</h2>
      <pre style={{ whiteSpace: 'pre-wrap', background: '#fdeceb', padding: 16, borderRadius: 8 }}>
        {String(error && error.message)}
        {'\n\n'}
        {error && error.stack ? error.stack.split('\n').slice(0, 8).join('\n') : ''}
      </pre>
    </div>
  )
}

async function start() {
  try {
    const { BrowserRouter } = await import('react-router-dom')
    const { default: App } = await import('./App.jsx')
    const { AuthProvider } = await import('./AuthContext.jsx')
    const { CampaignsProvider } = await import('./CampaignsContext.jsx')
    const { RequestsProvider } = await import('./RequestsContext.jsx')
    const { EvidenceProvider } = await import('./EvidenceContext.jsx')
    await import('./styles.css')

    root.render(
      <BrowserRouter>
        <AuthProvider>
          <CampaignsProvider>
            <RequestsProvider>
              <EvidenceProvider>
                <App />
              </EvidenceProvider>
            </RequestsProvider>
          </CampaignsProvider>
        </AuthProvider>
      </BrowserRouter>
    )
  } catch (error) {
    show(error)
  }
}

window.addEventListener('error', (e) => show(e.error || e.message))
start()