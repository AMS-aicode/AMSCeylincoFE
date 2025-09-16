import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useState } from 'react'
import theme from './theme';
import AppLayout from './components/AppLayout';
import AgentOnboarding from './components/AgentOnboarding';
import './App.css'
import Dashboard from './components/Dashboard';
import AgentSummaryList from './components/PersonalDetails/AgentSummaryList';
import AgentInformation from './components/AgentInformation';
import AgentManagementMenu from './components/AgentManagementMenu';
import LoginScreen from './components/LoginScreen';

function Placeholder() {
  return <div style={{ color: '#888', fontSize: 24, textAlign: 'center', marginTop: 40 }}>Welcome to Agent Onboarding UI</div>;
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route
            path="/agent-management"
            element={
              <AppLayout>
                <AgentSummaryList />
              </AppLayout>
            }
          />
          <Route
            path="/agent-management-menu"
            element={
              <AppLayout>
                <AgentManagementMenu />
              </AppLayout>
            }
          />
          <Route
            path="/agent-information"
            element={
              <AppLayout>
                <AgentInformation />
              </AppLayout>
            }
          />
          <Route
            path="/agent-onboarding"
            element={
              <AppLayout>
                <AgentOnboarding />
              </AppLayout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
