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
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  zIndex: -2,
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 27, 75, 0.7) 50%, rgba(30, 22, 60, 0.8) 100%)',
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
  backgroundColor: alpha('#ffffff', 0.15),
  '& .MuiLinearProgress-bar': {
    borderRadius: '6px',
    background: `linear-gradient(90deg, #ffffff 0%, #e2e8f0 50%, #cbd5e1 100%)`,
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
  }
}));

const PatternOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  backgroundImage: `
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
    linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.02) 50%, transparent 70%),
    linear-gradient(-45deg, transparent 30%, rgba(255, 255, 255, 0.02) 50%, transparent 70%)
  `,
  backgroundSize: '400px 400px, 300px 300px, 200px 200px, 200px 200px',
  backgroundPosition: '0 0, 100px 100px, 0 0, 0 0',
  zIndex: -1,
  opacity: 0.6,
  animation: `${pulse} 20s infinite ease-in-out`,
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
      color: 'white',
    }}>
      {/* Background */}
      <GradientBackdrop />
      <PatternOverlay />
      
      {/* Flag background */}
      <Box sx={{
        position: 'absolute',
        inset: 0,
        zIndex: -1,
        opacity: 0,
        animation: `${pulse} 8s infinite ease-in-out`,
      }}>
        
        <Image 
          src={countryFlags[country] || countryFlags.default}
          alt={`${countryNames[country]} Flag Background`}
          fill
          style={{ 
            objectFit: 'cover',
            opacity: 0.15
          }}

        />
        
      </Box>
      
      {/* Radial gradient overlay */}
      <Box sx={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.6) 100%)',
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
              variant="h1" 
              component="h1"
              sx={{
                fontWeight: 800,
                marginBottom: 2,
                animation: `${fadeIn} 1s ease-out`,
                letterSpacing: '0.02em',
                background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 30%, #cbd5e1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                textAlign: 'center',
                lineHeight: 0.9,
              }}
            >
              Welcome to RYT DID Creation
            </Typography>
            
            <Typography 
              variant="h5"
              sx={{
                background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #94a3b8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: 4,
                fontWeight: 300,
                animation: `${fadeIn} 1s ease-out 0.5s both, ${slideUp} 1s ease-out 0.5s both`,
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                textAlign: 'center',
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                '& span': {
                  background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 500,
                }
              }}
            >
              Securing Identity On Chain in <span>{countryNames[country]}</span>
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
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              width: { xs: '100%', sm: '450px' },
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0))',
                animation: `${shimmer} 4s infinite linear`,
              }
            }}>
              <Typography sx={{ 
                fontWeight: 500, 
                color: '#ffffff', 
                marginBottom: 3,
                fontSize: '1.1rem',
                letterSpacing: '0.02em',
                textAlign: 'center',
              }}>
                Initializing Secure Connection...
              </Typography>
              
              <ProgressBar variant="determinate" value={progress} />
              
              <Typography variant="body2" sx={{ 
                opacity: 0.9,
                display: 'block',
                marginTop: 2,
                color: 'white',
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
        background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%)',
        animation: `${pulse} 4s infinite ease-in-out`,
      }} />
      
      <Box sx={{
        position: 'absolute',
        bottom: { xs: 20, md: 40 },
        left: { xs: 20, md: 40 },
        width: { xs: 100, md: 150 },
        height: { xs: 100, md: 150 },
        borderRadius: '50%',
        background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 70%)',
        animation: `${pulse} 5s infinite ease-in-out`,
      }} />
    </Box>
  );
} 