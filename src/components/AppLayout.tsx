
import { Box, CssBaseline, Container } from '@mui/material';
import Sidebar from './Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#fff', width: '100vw', overflowX: 'hidden', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <CssBaseline />
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', background: '#fff', minHeight: '100vh', width: '100%' }}>
        <Container maxWidth={false} sx={{ flexGrow: 1, p: 4, background: '#fff', minHeight: '100vh', width: '100%' }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
