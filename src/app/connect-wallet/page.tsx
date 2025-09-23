'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ethers } from 'ethers';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper, 
  CircularProgress, 
  Chip,
  keyframes,
  alpha,
  styled
} from '@mui/material';
import Footer from '../../components/Footer';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import NetworkWifiIcon from '@mui/icons-material/NetworkWifi';

// Country flag mapping
const countryFlags: Record<string, string> = {
  pakistan: '/flags/pakistan-flag.svg',
  panama: '/flags/panama-flag.svg',
  costarica: '/flags/costa-rica-flag.svg',
  // Default
  default: '/pak.svg'
};

// Country name mapping
const countryNames: Record<string, string> = {
  pakistan: 'Pakistan',
  panama: 'Panama',
  costarica: 'Costa Rica',
  default: 'Global'
};

// Add window.ethereum type declaration
declare global {
  interface Window {
    ethereum: any;
  }
}

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

const rotateGradient = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

const GridLines = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  backgroundImage: 
    `linear-gradient(to right, ${alpha('#ffffff', 0.1)} 1px, transparent 1px),
    linear-gradient(to bottom, ${alpha('#ffffff', 0.1)} 1px, transparent 1px)`,
  backgroundSize: '40px 40px',
  zIndex: -1,
  opacity: 0.3,
}));

const WalletButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
  color: 'white',
  padding: '12px 32px',
  borderRadius: '32px',
  fontSize: '1.1rem',
  fontWeight: 600,
  letterSpacing: '0.5px',
  textTransform: 'none',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  boxShadow: '0 10px 25px rgba(52, 152, 219, 0.3)',
  border: 'none',
  '&:hover': {
    background: 'linear-gradient(135deg, #2980b9 0%, #1abc9c 100%)',
    transform: 'translateY(-3px)',
    boxShadow: '0 15px 35px rgba(52, 152, 219, 0.4)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: `conic-gradient(
      transparent, 
      transparent, 
      transparent, 
      ${alpha('#ffffff', 0.4)}
    )`,
    animation: `${rotateGradient} 4s linear infinite`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: '3px',
    borderRadius: '30px',
    background: alpha('#000000', 0.2),
    zIndex: -1,
  },
}));

const AddressChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha('#ffffff', 0.1),
  color: 'white',
  borderRadius: '16px',
  fontFamily: 'monospace',
  fontWeight: 600,
  border: `1px solid ${alpha('#ffffff', 0.3)}`,
  boxShadow: `0 0 15px ${alpha('#ffffff', 0.15)}`,
  '& .MuiChip-icon': {
    color: '#8bff8a',
  }
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  width: '240px',
  height: '4px',
  margin: '1.5rem auto',
  borderRadius: '4px',
  background: alpha('#ffffff', 0.1),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '30%',
    background: `linear-gradient(90deg, transparent, ${alpha('#ffffff', 0.7)}, transparent)`,
    animation: `${shimmer} 1.5s infinite ease-in-out`,
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
// Main component
export default function ConnectWalletPage() {
  const [account, setAccount] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [country, setCountry] = useState<string>('default');
  const [loadingWallet, setLoadingWallet] = useState<boolean>(false);
  const [redirecting, setRedirecting] = useState<boolean>(false);
  const router = useRouter();
  
  // Check for selected country from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const selectedCountry = localStorage.getItem('selectedCountry') || 'default';
      setCountry(selectedCountry);
    }
  }, []);
  
  // Check if wallet is already connected on page load
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          // Check if already connected
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
            setRedirecting(true);
            // Redirect to createDID page after a short delay
            setTimeout(() => {
              router.push('/createDID');
            }, 1500);
          }
        } catch (err) {
          console.error("Error checking wallet connection:", err);
        } finally {
          setIsChecking(false);
        }
      } else {
        setIsChecking(false);
      }
    };
    
    checkWalletConnection();
  }, [router]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setLoadingWallet(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []); // Popup MetaMask
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setLoadingWallet(false);
        setRedirecting(true);
        
        // Redirect to createDID page after successful connection
        setTimeout(() => {
          router.push('/createDID');
        }, 1500);
      } catch (err) {
        console.error("User denied wallet connection", err);
        setLoadingWallet(false);
      }
    } else {
      alert("MetaMask not detected. Install the extension first.");
    }
  };
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      color: '#2c3e50',
    }}>
      {/* Background */}
      <GradientBackdrop />
      <PatternOverlay />
      {/* <GridLines /> */}
      
      
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
        flex: 1,
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
                fontWeight: 800,
                marginBottom: 2,
                animation: `${fadeIn} 1s ease-out`,
                letterSpacing: '0.02em',
                background: 'linear-gradient(90deg, #052457 0%, #052457 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              Conecte su billetera
            </Typography>
            
            <Typography 
              variant="h5"
              sx={{
                color: 'rgba(44, 62, 80, 0.8)',
                marginBottom: 6,
                fontWeight: 400,
                maxWidth: '650px',
                mx: 'auto',
                animation: `${fadeIn} 1s ease-out 0.5s both, ${slideUp} 1s ease-out 0.5s both`,
                fontSize: { xs: '1.25rem', md: '1.5rem' }
              }}
            >
            Emita su DID en minutos para acceder de forma segura a servicios del Gobierno y aliados.
            </Typography>
          </Box>
          
          <Box sx={{
            animation: `${fadeIn} 1s ease-out 1s both, ${slideUp} 1s ease-out 1s both`,
            marginTop: 4,
            display: 'flex',
            justifyContent: 'center',
          }}>
            <Paper elevation={20} sx={{
              padding: '2.5rem',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(52, 152, 219, 0.2)',
              width: { xs: '90%', sm: '450px' },
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
              {isChecking ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: 2
                }}>
                  <CircularProgress 
                    size={60} 
                    thickness={4}
                    sx={{ 
                      color: '#3498db',
                      marginBottom: 2,
                    }}
                  />
                  <Typography 
                    variant="body1"
                    sx={{ 
                      color: '#2c3e50',
                      fontWeight: 500,
                      marginTop: 2,
                    }}
                  >
                    Checking wallet connection...
                  </Typography>
                  <Box sx={{
                    mt: 3,
                    position: 'relative',
                    width: '100%',
                    height: '3px',
                    background: alpha('#3498db', 0.2),
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '30%',
                        borderRadius: '4px',
                        background: `linear-gradient(90deg, transparent, ${alpha('#3498db', 0.8)}, transparent)`,
                        animation: `${shimmer} 1.5s infinite`,
                      }}
                    />
                  </Box>
                </Box>
              ) : !account ? (
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{
                    width: '100px',
                    height: '100px',
                    margin: '0 auto 24px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.1) 0%, rgba(155, 89, 182, 0.1) 100%)',
                    border: '2px solid rgba(52, 152, 219, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: `${pulse} 3s infinite`,
                  }}>
                    <AccountBalanceWalletOutlinedIcon 
                      sx={{ 
                        fontSize: '50px', 
                        color: '#052457' 
                      }} 
                    />
                  </Box>
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#052457',
                      marginBottom: 3,
                      fontWeight: 500,
                    }}
                  >
                    Connect to start your DID journey
                  </Typography>
                  
                  <WalletButton 
                    variant="contained"
                    onClick={connectWallet}
                    disabled={loadingWallet}
                    startIcon={
                      loadingWallet ? (
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                      ) : (
                        <NetworkWifiIcon />
                      )
                    }
                    sx={{ 
                      minWidth: '220px', 
                      opacity: loadingWallet ? 0.8 : 1,
                      backgroundImage: 'linear-gradient(90deg, #052457 0%, #0B4EBD 100%)',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundImage: 'linear-gradient(90deg, #052457 0%, #0B4EBD 100%)',
                backgroundColor: 'transparent',
                filter: 'brightness(1.05)',
              },
              '&.Mui-disabled': {
                color: '#fff',
                opacity: 1,
                backgroundImage: 'linear-gradient(90deg, #052457 0%, #0B4EBD 100%)',
              },
              
                    }}
                  >
                    {loadingWallet ? 'Connecting...' : 'Connect RYT Wallet'}
                  </WalletButton>
                </Box>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  py: 2 
                }}>
                  <Box 
                    sx={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '30%',
                      background: `radial-gradient(circle at center, ${alpha('#27ae60', 0.3)} 0%, ${alpha('#27ae60', 0.1)} 70%)`,
                      border: '2px solid #27ae60',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 0.5,
                      animation: `${pulse} 2s infinite`,
                    }}
                  >
                    <CheckCircleOutlineIcon sx={{ fontSize: 60, color: '#27ae60' }} />
                  </Box>
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 500,
                      color: '#052457',
                      marginBottom: 2,
                    }}
                  >
                    Wallet Connected
                  </Typography>
                  
                  <AddressChip
                    icon={<CheckCircleOutlineIcon />}
                    label={`${account.slice(0, 6)}...${account.slice(-4)}`}
                    sx={{ 
                      marginBottom: 0,
                      fontSize: '1rem',
                      py: 1,
                      px: 1,
                      color: '#052457',
                    }}
                  />
                  
                  <Typography sx={{ color: alpha('#2c3e50', 0.7) }}>
                    Redirecting to DID creation...
                  </Typography>
                  
                  <ProgressContainer />
                </Box>
              )}
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
      
      {/* Footer */}
      <Footer />
    </Box>
  );
} 