'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Box, 
  Container, 
  Typography, 
  keyframes, 
  LinearProgress, 
  Paper,
  alpha,
  styled
} from '@mui/material';

// Country flag mapping
const countryFlags: Record<string, string> = {
  // pakistan: '/flags/pakistan-flag.svg',
  panama: '/flags/panama-flag.svg',
  // costarica: '/flags/costa-rica-flag.svg',
  // Default
  default: '/panama-flag.svg'
};

// Country name mapping
const countryNames: Record<string, string> = {
  // pakistan: 'Pakistan',
  panama: 'Panama',
  // costarica: 'Costa Rica',
  default: 'Panama'
};

// Define animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.8; transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

// Styled components
const GradientBackdrop = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(90deg, #D4E6FF 0%, #F8FBFF 50%, #FFFFFF 100%)',
  zIndex: -2,
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(90deg, rgba(212, 230, 255, 0.9) 0%, rgba(248, 251, 255, 0.7) 50%, rgba(255, 255, 255, 0.8) 100%)',
    zIndex: 1,
  }
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  width: '220px',
  height: '220px',
  position: 'relative',
  marginBottom: '2rem',
  borderRadius: '50%',
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  width: '300px',
  height: '6px',
  margin: '2rem auto',
  borderRadius: '6px',
  backgroundColor: alpha('#D9D9D9', 1),
  '& .MuiLinearProgress-bar': {
    borderRadius: '6px',
    background: `linear-gradient(90deg, #FD0038 0%, #FD0038 50%, #FD0038 100%)`,
    boxShadow: '0 0 10px rgba(52, 152, 219, 0.3)',
  }
}));

const PatternOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  backgroundImage: `
    radial-gradient(circle at 20% 20%, rgba(52, 152, 219, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 80% 30%, rgba(155, 89, 182, 0.06) 0%, transparent 35%),
    radial-gradient(circle at 60% 80%, rgba(52, 152, 219, 0.05) 0%, transparent 45%),
    radial-gradient(circle at 30% 70%, rgba(46, 204, 113, 0.04) 0%, transparent 30%),
    linear-gradient(45deg, transparent 48%, rgba(52, 152, 219, 0.02) 50%, transparent 52%),
    linear-gradient(-45deg, transparent 48%, rgba(155, 89, 182, 0.015) 50%, transparent 52%)
  `,
  backgroundSize: '600px 600px, 450px 450px, 380px 380px, 320px 320px, 120px 120px, 120px 120px',
  backgroundPosition: '0 0, 200px 100px, 400px 300px, 100px 400px, 0 0, 60px 60px',
  zIndex: -1,
  opacity: 0.7,
  animation: `${pulse} 25s infinite ease-in-out`,
}));

export default function WelcomePage() {
  const router = useRouter();
  const [country, setCountry] = useState<string>('panama');
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Check for selected country from localStorage
    if (typeof window !== 'undefined') {
      const selectedCountry = "panama";
      setCountry(selectedCountry);
    }
    
    // Animate progress bar to 100% over 5 seconds
    const timer = setInterval(() => {
      setProgress(oldProgress => {
        const newProgress = Math.min(oldProgress + 2, 100);
        return newProgress;
      });
    }, 100);
    
    // Redirect to wallet connection page after 5 seconds
    const redirectTimer = setTimeout(() => {
      router.push('/connect-wallet');
    }, 5000);
    
    return () => {
      clearTimeout(redirectTimer);
      clearInterval(timer);
    };
  }, [router]);
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      color: '#2c3e50',
    }}>
      {/* Background */}
      <GradientBackdrop />
      <PatternOverlay />
      
      
      {/* Subtle overlay for depth */}
      <Box sx={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at center, transparent 40%, rgba(52, 152, 219, 0.03) 100%)',
        zIndex: -1,
      }} />
      
      {/* Content */}
      <Container maxWidth="md" sx={{ 
        textAlign: 'center',
        zIndex: 1,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}>
        <Box sx={{
          animation: `${slideUp} 1s ease-out`,
          width: '100%',
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <LogoContainer>
              <Image 
                src="/ryt-logo-white.svg"
                alt="RYT Logo"
                fill
                style={{ objectFit: 'contain' }}
              />
            </LogoContainer>
            
            <Typography 
              variant="h3" 
              component="h3"
              sx={{
                fontWeight: 700,
                marginBottom: 2,
                animation: `${fadeIn} 1s ease-out`,
                letterSpacing: '0.02em',
                background: 'linear-gradient(90deg, #052457 0%, #052457 50%, #052457 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
                fontSize: { xs: '2rem', md: '3rem' },
                textAlign: 'center',
                lineHeight: 0.9,
              }}
            >
             Identidad Digital (DID) de Panamá
            </Typography>
            
            <Typography 
              variant="h5"
              sx={{
                color: 'rgba(44, 62, 80, 0.8)',
                marginBottom: 4,
                fontWeight: 400,
                animation: `${fadeIn} 1s ease-out 0.5s both, ${slideUp} 1s ease-out 0.5s both`,
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                textAlign: 'center',
                '& span': {
                  color: '#3498db',
                  fontWeight: 600,
                }
              }}
            >
              Asegurando la identidad en <span>Panamá</span>
            </Typography>
          </Box>
          
          <Box sx={{
            animation: `${fadeIn} 1s ease-out 1s both, ${slideUp} 1s ease-out 1s both`,
            position: 'relative',
            marginTop: 6,
            display: 'flex',
            justifyContent: 'center',
          }}>
            <Paper elevation={20} sx={{
              padding: '3rem',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(52, 152, 219, 0.2)',
              width: { xs: '100%', sm: '450px' },
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(52, 152, 219, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, transparent, rgba(52, 152, 219, 0.6), transparent)',
                animation: `${shimmer} 8s infinite linear`,
              }
            }}>
              <Typography sx={{ 
                fontWeight: 500, 
                color: '#2c3e50', 
                marginBottom: 3,
                fontSize: '1.1rem',
                letterSpacing: '0.02em',
                textAlign: 'center',
              }}>
                Inicializando conexión segura.....
              </Typography>
              
              <ProgressBar variant="determinate" value={progress} />
              
              <Typography variant="body2" sx={{ 
                opacity: 0.9,
                display: 'block',
                marginTop: 2,
                color: '#2c3e50',
                fontSize: '0.9rem',
                fontWeight: 400,
                textAlign: 'center',
                letterSpacing: '0.02em',
              }}>
                {progress}% Complete
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Container>
      
      {/* Decorative elements */}
      <Box sx={{
        position: 'absolute',
        top: { xs: 20, md: 40 },
        right: { xs: 20, md: 40 },
        width: { xs: 80, md: 120 },
        height: { xs: 80, md: 120 },
        borderRadius: '50%',
        background: 'radial-gradient(circle at center, rgba(52, 152, 219, 0.15) 0%, rgba(52, 152, 219, 0) 70%)',
        animation: `${pulse} 4s infinite ease-in-out`,
      }} />
      
      <Box sx={{
        position: 'absolute',
        bottom: { xs: 20, md: 40 },
        left: { xs: 20, md: 40 },
        width: { xs: 100, md: 150 },
        height: { xs: 100, md: 150 },
        borderRadius: '50%',
        background: 'radial-gradient(circle at center, rgba(155, 89, 182, 0.12) 0%, rgba(155, 89, 182, 0) 70%)',
        animation: `${pulse} 5s infinite ease-in-out`,
      }} />
    </Box>
  );
} 