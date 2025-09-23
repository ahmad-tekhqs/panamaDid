import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

// Panama Government palette (from flag)
// Primary = Panama Blue
const primaryColor = '#052457';
const primaryLightColor = '#80AEDC'; // tint for subtle surfaces
const primaryDarkColor = '#00468A';  // darker for hover/active
const primaryDarkerColor = '#003D70'; // deepest hover/focus tone
const primaryLight = '#EAF1FC';

// Accent = Panama Red (use as secondary)
const accentRed = '#D8131B';
const accentRedLight = '#F36A75';
const accentRedDark = '#B51C2A';

const createAppTheme = (mode: PaletteMode) => {
  let theme = createTheme({
    palette: {
      mode,
      primary: {
        main: primaryColor,
        light: primaryLight,
        dark: primaryDarkColor,
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: accentRed,
        light: accentRedLight,
        dark: accentRedDark,
        contrastText: '#FFFFFF',
      },
      background: {
        default: mode === 'light' ? '#F8FAFD' : '#0B0F19',
        paper: mode === 'light' ? '#FFFFFF' : '#111827',
      },
      text: {
        primary: mode === 'light' ? '#111827' : '#E5E7EB',
        secondary: mode === 'light' ? '#4B5563' : '#9CA3AF',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: {
        fontWeight: 500,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(0, 94, 184, 0.18)', // blue-tinted hover shadow
            },
          },
          containedPrimary: {
            background: `linear-gradient(45deg, ${primaryDarkColor} 0%, ${primaryColor} 100%)`,
            '&:hover': {
              background: `linear-gradient(45deg, ${primaryDarkerColor} 0%, ${primaryDarkColor} 100%)`,
            },
          },
          outlinedPrimary: {
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
              backgroundColor: 'rgba(0, 94, 184, 0.06)',
            },
          },
          containedSecondary: {
            background: `linear-gradient(45deg, ${accentRedDark} 0%, ${accentRed} 100%)`,
            '&:hover': {
              background: `linear-gradient(45deg, ${accentRedDark} 0%, ${accentRedDark} 100%)`,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 500 },
          colorPrimary: {
            backgroundColor: primaryLightColor,
            color: primaryDarkColor,
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: mode === 'light' ? '#BFC7D1 #F1F5F9' : '#3A3F4B #1A1F2A',
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              backgroundColor: mode === 'light' ? '#BFC7D1' : '#3A3F4B',
              borderRadius: 8,
              minHeight: 24,
            },
            '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
              backgroundColor: mode === 'light' ? '#A6AFBC' : '#4A5160',
            },
            '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
              backgroundColor: mode === 'light' ? '#A6AFBC' : '#4A5160',
            },
            '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
              backgroundColor: mode === 'light' ? '#F1F5F9' : '#1A1F2A',
            },
          },
        },
      },
    },
  });

  // Responsive type scales
  theme = responsiveFontSizes(theme);
  return theme;
};

export default createAppTheme;
