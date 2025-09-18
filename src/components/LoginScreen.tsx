import React, { useState } from 'react';
import LoginImg from '../assets/Ceylinco.png';
import { useNavigate } from 'react-router-dom';
import useNoScroll from '../hooks/useNoScroll';

import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
  IconButton
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const roles = [
  { label: 'LIA', value: 'LIA' },
  { label: 'Unit Head', value: 'Unit Head' },
  { label: 'Head of Branch', value: 'Head of Branch' },
  { label: 'RSM', value: 'RSM' },
  { label: 'Zonal', value: 'Zonal' },
  { label: 'Manager Business Development', value: 'Manager Business Development' },
  { label: 'Life Operation Officer', value: 'Life Operation Officer' },
  { label: 'Agency Admin', value: 'Agency Admin' },
];

export default function LoginScreen() {
  const [role, setRole] = useState('LIA');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useNoScroll();

  // Hardcoded credentials for demo (expand as needed)
  const hardcoded = {
    'Head of Branch': { userId: 'C55451', password: 'Admin' },
    'LIA': { userId: 'LIA001', password: 'LIApass' },
    'Unit Head': { userId: 'UH001', password: 'UHpass' },
    'RSM': { userId: 'RSM001', password: 'RSMpass' },
    'Zonal': { userId: 'ZON001', password: 'ZONpass' },
    'Manager Business Development': { userId: 'MBD001', password: 'MBDpass' },
    'Life Operation Officer': { userId: 'LOO001', password: 'LOOpass' },
    'Agency Admin': { userId: 'ADMIN001', password: 'ADMINpass' },
  };

  const handleLogin = () => {
    if (!userId.trim()) {
      setError('User ID is required.');
      return;
    } else if (!password.trim()) {
      setError('Password is required.');
      return;
    }

    // Validate credentials for selected role
    const creds = hardcoded[role];
    if (creds && userId === creds.userId && password === creds.password) {
      setError('');
      navigate('/dashboard');
    } else {
      setError('Invalid credentials.');
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      background: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        borderRadius: 10,
        overflow: 'hidden',
        width: { xs: '100%', md: 800 },
        minHeight: 600,
        boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
        background: 'transparent',
      }}>
        {/* Left: Login Form (Red Box) */}
        <Box sx={{
          bgcolor: '#7C0316',
          color: '#fff',
          flex: 1,
          px: { xs: 4, md: 6 },
          py: { xs: 3, md: 6 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderRadius: 10,
          minHeight: 600, // Changed from 100 to 400 for taller login box
          height: { xs: 500, md: 500 }, // Set explicit height for more control
          position: 'relative',
          boxShadow: '0 2px 16px rgba(214,0,0,0.10)',
        }}>
          {/* Faded circle behind Login text */}
          <Box sx={{
            position: 'absolute',
            top: 20,
            left: 25,
            width: 70,
            height: 70,
            bgcolor: 'rgba(18, 4, 4, 0.27)',
            borderRadius: '50%',
            zIndex: 0,
          }} />
          <Typography variant="h3" fontWeight={600} mb={2} sx={{ letterSpacing: 1, position: 'relative', zIndex: 1, textAlign: 'left' }}>
            Login
          </Typography>
          <Box component="form" sx={{ mt: 2, position: 'relative', zIndex: 1 }} onSubmit={e => { e.preventDefault(); handleLogin(); }}>
            {/* Custom label above dropdown */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, ml: 0.5 }}>
              <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: 18, minWidth: 110, textAlign: 'left' }}>
                User Role
              </Typography>
              <span style={{ color: '#fff', fontWeight: 700, marginLeft: 2 }}></span>
            </Box>
            <TextField
              select
              value={role}
              onChange={e => setRole(e.target.value)}
              fullWidth
              sx={{
                mb: 3,
                '& .MuiInputBase-root': {
                  bgcolor: '#fff',
                  color: '#7C0316',
                  fontWeight: 500,
                  fontSize: 18,
                  borderRadius: 2,
                  border: '2px solid #7C0316',
                  boxShadow: 'none',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#7C0316',
                  borderWidth: '2px',
                },
                '& .MuiSelect-icon': {
                  color: '#7C0316',
                  right: 12,
                },
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      bgcolor: '#fff',
                      color: '#7C0316',
                    },
                  },
                },
                IconComponent: (props) => (
                  <svg {...props} width="24" height="24" viewBox="0 0 24 24" style={{ color: '#7C0316' }}>
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                ),
              }}
            >
              {roles.map(r => (
                <MenuItem key={r.value} value={r.value} sx={{ color: '#7C0316', bgcolor: '#fff', fontWeight: 500, fontSize: 18, textAlign: 'left', display: 'flex', justifyContent: 'flex-start' }}>
                  {r.label}
                </MenuItem>
              ))}
            </TextField>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, ml: 0.5 }}>
              <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: 18, minWidth: 110, textAlign: 'left' }}>
                User ID
              </Typography>
              <span style={{ color: '#fff', fontWeight: 700, marginLeft: 2 }}></span>
            </Box>
            <TextField
              value={userId}
              onChange={e => setUserId(e.target.value)}
              fullWidth
              sx={{
                mb: 3,
                mt: 1,
                '& .MuiInputBase-root': { bgcolor: '#fff', color: '#7C0316', fontWeight: 500 },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
              }}
              inputProps={{ style: { textAlign: 'center' } }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, ml: 0.5 }}>
              <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: 18, minWidth: 110, textAlign: 'left' }}>
                Password
              </Typography>
              <span style={{ color: '#fff', fontWeight: 700, marginLeft: 2 }}></span>
            </Box>
            <TextField
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              sx={{
                mb: 1,
                mt: 1,
                '& .MuiInputBase-root': { bgcolor: '#fff', color: '#7C0316', fontWeight: 500 },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
              }}
              inputProps={{ style: { textAlign: 'center' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#7C0316' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <Typography variant="caption" sx={{ color: '#fff', mb: 2, textAlign: 'center', fontSize: 14, width: '70%' }}>
                Forgot Password?
              </Typography>
              {error && (
                <Typography sx={{ color: '#fff' }} mb={2}>
                  {error}
                </Typography>
              )}
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#fff',
                  color: '#7C0316',
                  fontWeight: 700,
                  fontSize: 24,
                  borderRadius: 24,
                  py: 1.2,
                  mt: 1,
                  boxShadow: 'none',
                  width: '70%',
                  maxWidth: 340,
                  textTransform: 'none',
                  letterSpacing: 1,
                  alignSelf: 'center',
                  '&:hover': { bgcolor: '#fff' },
                }}
                type="submit"
              >
                LOGIN
              </Button>
            </Box>
          </Box>
        </Box>
        {/* Right: Illustration */}
        <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#fff',
          position: 'relative',
        }}>

          {/* Illustration */}
          <Box sx={{ mt: 8, mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', width: 400, height: 500 }}>
            <img
              src={LoginImg}
              alt="Login Illustration"
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          </Box>
          {/*
          <Typography variant="h6" fontWeight={700} sx={{ color: '#7C0316', mt: 2, fontSize: 22 }}>
            WELCOME
          </Typography>
          <Typography variant="body2" sx={{ color: '#616060ff', mt: 1, fontSize: 16 }}>
            Agency Management Simplified
          </Typography>
          */}
        </Box>
      </Box>
    </Box>
  );
}
