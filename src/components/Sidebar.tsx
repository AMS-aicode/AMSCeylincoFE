import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, Button } from '@mui/material';
import ceylifelogo from '../assets/ceylifelogo.png';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SchoolIcon from '@mui/icons-material/School';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, route: '/dashboard' },
  { text: 'Agent Management', icon: <GroupIcon />, route: '/agent-management-menu' },
  { text: 'Commission', icon: <MonetizationOnIcon /> },
  { text: 'Incentives & Allowances', icon: <MonetizationOnIcon /> },
  { text: 'Approval Tray', icon: <AssignmentIcon /> },
  { text: 'Loan Management', icon: <AccountBalanceIcon /> },
  { text: 'Funds Management', icon: <AccountBalanceIcon /> },
  { text: 'Training & Development', icon: <SchoolIcon /> },
  { text: 'Download Reports', icon: <FileDownloadIcon /> },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        background: '#fff', // Ensure sidebar area outside paper is white
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: '#fff', // Sidebar paper background white
          borderRight: '1px solid #eee',
        },
      }}
    >
      <Toolbar sx={{ minHeight: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <img src={ceylifelogo} alt="Ceylife Logo" style={{ height: 55, width: 'auto', display: 'block' }} />
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => {
          // Highlight Agent Management for /agent-management, /agent-onboarding, and /agent-information
          const isAgentManagementActive = item.text === 'Agent Management' && (
            location.pathname.startsWith('/agent-management') ||
            location.pathname.startsWith('/agent-onboarding') ||
            location.pathname.startsWith('/agent-information')
          );
          return (
            <ListItem
              key={item.text}
              disablePadding
              sx={{
                background: isAgentManagementActive ? '#fff0f0' : (item.route && location.pathname === item.route ? '#fff0f0' : 'inherit'),
                borderRight: isAgentManagementActive ? '4px solid #7C0316' : (item.route && location.pathname === item.route ? '4px solid #7C0316' : 'none'),
                '&:hover': { background: '#f7f7fa' },
              }}
            >
              <ListItemButton selected={!!(isAgentManagementActive || (item.route && location.pathname === item.route))} onClick={() => item.route && navigate(item.route)}>
                <ListItemIcon sx={{ color: isAgentManagementActive ? 'error.main' : (item.route && location.pathname === item.route ? 'error.main' : 'inherit') }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    color: isAgentManagementActive ? 'error.main' : (item.route && location.pathname === item.route ? 'error.main' : 'text.primary'),
                    fontWeight: isAgentManagementActive ? 700 : (item.route && location.pathname === item.route ? 700 : 400),
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          fullWidth
          onClick={() => navigate('/')}
        >
          LOGOUT
        </Button>
      </Box>
    </Drawer>
  );
}
