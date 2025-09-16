import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7C0316', // Updated primary color
    },
    secondary: {
      main: '#1976d2', // Blue for accents
    },
    background: {
      default: '#f7f7fa',
      paper: '#fff',
    },
    error: {
      main: '#7C0316', // Updated error color
    },
    text: {
      primary: '#222',
      secondary: '#888',
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h5: {
      fontWeight: 700,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 700,
      fontSize: '1.1rem',
    },
    button: {
      fontWeight: 700,
      textTransform: 'uppercase',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#fff',
        },
      },
    },
  },
});

export default theme;
