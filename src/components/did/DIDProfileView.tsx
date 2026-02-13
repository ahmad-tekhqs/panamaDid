'use client';

import { useState, useEffect } from 'react';
import { useDIDContext } from '../../context/DIDContext';
import { 
  Box, 
  Container,
  Typography,
  Paper,
  Stack,
  Chip,
  Divider,
  Avatar,
  Button,
  Card,
  CardContent,
  Tooltip,
  IconButton,
  useTheme,
  alpha,
  styled,
  Tab,
  Tabs,
  CircularProgress,
} from '@mui/material';
import { 
  VerifiedUser as VerifiedUserIcon,
  AccessTime as AccessTimeIcon,
  Visibility as VisibilityIcon,
  LinkOff as LinkOffIcon,
  ContentCopy as ContentCopyIcon,
  AccountBalanceWallet as WalletIcon,
  Check as CheckIcon,
  Image as ImageIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Security as SecurityIcon,
  Anchor as AnchorIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Public as PublicIcon,
  Work as WorkIcon,
  Home as HomeIcon,
  Badge as BadgeIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';

// ============================================================================
// HELPERS (moved from FinalizationStep)
// ============================================================================

interface UserInfo {
  fullName?: string;
  idNumber?: string;
  nationality?: string;
  dateOfBirth?: string;
  email?: string;
  capacityRequest?: string;
  phoneNumber?: string;
  address?: string;
}

function buildCredentialId(didData: Record<string, any>): string {
  const walletShort = (didData.walletAddress || '0x0000').slice(-6).toUpperCase();
  const tokenId = didData.didIdentifier || '00';
  return `DPP-${walletShort}-${tokenId}`;
}

function getApplicationType(didData: Record<string, any>): string {
  let formType = didData.registroFormType || 'F-76';
  let appType = didData.registroApplicationType || '';
  if (typeof window !== 'undefined') {
    formType = formType || localStorage.getItem('registroFormType') || 'F-76';
    appType = appType || localStorage.getItem('registroApplicationType') || '';
  }
  const labels: Record<string, string> = {
    titulo: 'Título de Competencia',
    refrendo: 'Refrendo',
    certificado: 'Certificado de Suficiencia',
    duplicado: 'Duplicado',
  };
  const appLabel = labels[appType] || 'Technical Documentation';
  return `${formType} — ${appLabel}`;
}

function buildImagePrompt(didData: Record<string, any>): string {
  const userInfo = (didData.userInfo || {}) as UserInfo;
  const fullName = userInfo.fullName || didData.fullName || 'Seafarer';
  const nationality = userInfo.nationality || 'Panama';
  const capacity = userInfo.capacityRequest || 'Maritime Professional';
  const credentialId = buildCredentialId(didData);
  const appType = getApplicationType(didData);

  return `Create a highly detailed, professional Digital Port Pass credential card for the Panama Maritime Authority (Autoridad Marítima de Panamá). This is a physical-looking official government maritime credential, landscape orientation.

Design specifications:
- HEADER BAR: Dark navy blue (#052457) top strip with "AUTORIDAD MARÍTIMA DE PANAMÁ" in gold/white text, Panama coat of arms emblem on the left, and "PASE PORTUARIO DIGITAL" subtitle
- LEFT SECTION: A silhouette placeholder portrait area with a thin gold border, styled like a passport photo slot. Below it: the credential holder name "${fullName}", nationality "${nationality}", capacity/rank "${capacity}"
- CENTER: A large QR code graphic (stylistic, does not need to scan) with "VERIFIED ON BLOCKCHAIN" below it in small text
- RIGHT SECTION: Credential details block with:
  - Credential ID: ${credentialId}
  - Application: ${appType}
  - Status: MINTED & VERIFIED (with a green checkmark)
  - Issue date: ${new Date().toLocaleDateString('es-PA')}
  - Form Version: v.03
- BOTTOM STRIP: Red (#D8131B) bar with "GOBIERNO NACIONAL — CON PASO FIRME" and maritime wave pattern
- BACKGROUND: Subtle ocean wave watermark pattern in very light blue, micro-printed security text, holographic foil effect on corners
- OVERALL STYLE: Blend of a modern government ID card and a digital blockchain credential. Colors: deep navy blue, panama red, white, and gold accents. Professional, authoritative, tamper-proof appearance. Include subtle ship/anchor/maritime motifs integrated into the background pattern.
- The card should look photorealistic — like a real physical credential photographed on a dark surface with slight shadow and depth.`;
}

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const ProfileSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  }
}));

const GlowingBadge = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'inline-flex',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.4)} 0%, ${alpha(theme.palette.primary.main, 0)} 70%)`,
    animation: 'pulse 2s infinite',
  },
  '@keyframes pulse': {
    '0%': { transform: 'scale(0.95)', opacity: 0.7 },
    '70%': { transform: 'scale(1)', opacity: 0.3 },
    '100%': { transform: 'scale(0.95)', opacity: 0.7 },
  }
}));

const DataField = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(1),
  padding: theme.spacing(0.75, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.primary.main, 0.03),
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.06),
  }
}));

const ImagePreview = styled(Box)(({ theme }) => ({
  width: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
  border: `2px solid ${theme.palette.primary.main}`,
  position: 'relative',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  '&:hover img': {
    transform: 'scale(1.02)',
  },
  '&:hover .overlay': {
    opacity: 1,
  }
}));

const ImageOverlay = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  zIndex: 2,
}));

const CredentialBadge = styled(Chip)(() => ({
  fontWeight: 600,
  fontSize: '0.7rem',
  height: 26,
  borderRadius: 13,
}));

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DIDProfileView() {
  const { state, updateDIDData } = useDIDContext();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  // Image generation state
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const didData = state.didData;
  const userInfo = (didData.userInfo || {}) as UserInfo;
  const credentialId = buildCredentialId(didData);
  const appType = getApplicationType(didData);

  // --- Generate passport image on mount if not already generated ---
  useEffect(() => {
    let mounted = true;

    // If we already have the image in state, just use it
    if (didData.generatedPassImage) {
      setGeneratedImageUrl(didData.generatedPassImage as string);
      return;
    }

    const generateImage = async () => {
      setIsGeneratingImage(true);
      setImageProgress(0);

      // Progress animation (slowly fill to 90% over 25s)
      const genStart = Date.now();
      const genInterval = setInterval(() => {
        if (!mounted) { clearInterval(genInterval); return; }
        const elapsed = Date.now() - genStart;
        const p = Math.min((elapsed / 25000) * 90, 90);
        setImageProgress(p);
      }, 200);

      try {
        const prompt = buildImagePrompt(didData);
        console.log('DIDProfileView: Generating Digital Port Pass image...');
        console.log('Prompt (first 200 chars):', prompt.slice(0, 200));

        const res = await fetch('/api/openai-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });
        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.message || 'Image generation failed');
        }

        const imageUrl = data.imageUrl || null;

        clearInterval(genInterval);
        if (!mounted) return;

        setImageProgress(100);

        if (imageUrl) {
          setGeneratedImageUrl(imageUrl);
          // Persist in DID state so it survives re-renders
          updateDIDData({
            generatedPassImage: imageUrl,
            completionTimestamp: didData.completionTimestamp || new Date().toISOString(),
          });
          console.log('DIDProfileView: Image generated and saved to state');
        }
      } catch (err: any) {
        clearInterval(genInterval);
        console.error('DIDProfileView: Image generation error:', err);
        if (mounted) {
          setImageError(err.message || 'Could not generate Digital Port Pass image.');
        }
      } finally {
        if (mounted) {
          setIsGeneratingImage(false);
        }
      }
    };

    generateImage();
    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopyDID = () => {
    const didString = `did:ryt:${didData.didIdentifier || didData.walletAddress || '0x0'}`;
    navigator.clipboard.writeText(didString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const formatTimestamp = (timestamp: number | string) => {
    if (!timestamp) return 'Not available';
    return new Date(timestamp).toLocaleString();
  };

  const mintTimestamp = didData.completionTimestamp
    ? new Date(didData.completionTimestamp).toLocaleString()
    : didData.mintingTimestamp
    ? formatTimestamp(didData.mintingTimestamp)
    : new Date().toLocaleString();

  return (
    <Container maxWidth="lg" sx={{ py: 1 }}>
      {/* Page Title */}
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1,
        }}
      >
        Digital Port Pass — Pase Portuario Digital
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
        Your seafarer credential has been minted and secured on the blockchain.
      </Typography>

      {/* ================================================================ */}
      {/* GENERATED PASSPORT IMAGE (Hero) — or Generation Progress */}
      {/* ================================================================ */}
      {isGeneratingImage && (
        <ProfileSection sx={{ mb: 4, textAlign: 'center', py: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={imageProgress}
                size={80}
                thickness={3}
                sx={{
                  color: imageProgress < 50 ? theme.palette.primary.main : '#D8131B',
                }}
              />
              <Box
                sx={{
                  top: 0, left: 0, bottom: 0, right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="caption" fontWeight={700} color="text.secondary">
                  {Math.round(imageProgress)}%
                </Typography>
              </Box>
            </Box>
            <Typography variant="h6" fontWeight={600} color="primary.main">
              Generating Digital Port Pass
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
              Creating your personalized credential image with AI. This may take 10-20 seconds...
            </Typography>

            {/* Progress checklist */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1, textAlign: 'left' }}>
              {[
                { label: 'Composing credential layout', done: imageProgress > 15 },
                { label: 'Applying Panama theme', done: imageProgress > 35 },
                { label: 'Embedding identity data', done: imageProgress > 55 },
                { label: 'Rendering final image', done: imageProgress > 80 },
              ].map((c, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                    {c.done ? '✅' : '⏳'}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', color: c.done ? 'text.primary' : 'text.disabled' }}>
                    {c.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </ProfileSection>
      )}

      {generatedImageUrl && !isGeneratingImage && (
        <ProfileSection sx={{ mb: 4, p: 0, overflow: 'hidden' }}>
          <ImagePreview sx={{ border: 'none', boxShadow: 'none', borderRadius: 0 }}>
            <img src={generatedImageUrl} alt="Digital Port Pass Credential" style={{ height: 'auto' }} />
          </ImagePreview>
        </ProfileSection>
      )}

      {imageError && !generatedImageUrl && !isGeneratingImage && (
        <ProfileSection sx={{ mb: 4, textAlign: 'center', py: 3 }}>
          <Typography variant="body2" color="warning.main" sx={{ fontSize: '0.85rem' }}>
            ⚠️ Image generation unavailable: {imageError}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            sx={{ mt: 1.5 }}
            onClick={() => {
              setImageError(null);
              setIsGeneratingImage(true);
              setImageProgress(0);

              const genStart = Date.now();
              const genInterval = setInterval(() => {
                const elapsed = Date.now() - genStart;
                const p = Math.min((elapsed / 25000) * 90, 90);
                setImageProgress(p);
              }, 200);

              (async () => {
                try {
                  const prompt = buildImagePrompt(didData);
                  const res = await fetch('/api/openai-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt }),
                  });
                  const data = await res.json();
                  if (!res.ok || data.error) throw new Error(data.message || 'Image generation failed');
                  clearInterval(genInterval);
                  setImageProgress(100);
                  if (data.imageUrl) {
                    setGeneratedImageUrl(data.imageUrl);
                    updateDIDData({ generatedPassImage: data.imageUrl });
                  }
                } catch (err: any) {
                  clearInterval(genInterval);
                  setImageError(err.message || 'Could not generate image.');
                } finally {
                  setIsGeneratingImage(false);
                }
              })();
            }}
          >
            Retry Image Generation
          </Button>
        </ProfileSection>
      )}

      {/* ================================================================ */}
      {/* HEADER CARD: Identity + Status */}
      {/* ================================================================ */}
      <ProfileSection sx={{ mb: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
          <GlowingBadge>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: theme.palette.primary.main,
                boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.5)}`,
              }}
            >
              <AnchorIcon sx={{ fontSize: 40 }} />
            </Avatar>
          </GlowingBadge>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="overline" color="text.secondary">
              Pase Portuario Digital (DPP)
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="primary.main" gutterBottom>
              {userInfo.fullName || didData.fullName || 'Seafarer'}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 2,
                mt: 1,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 2,
                fontFamily: 'monospace',
                fontSize: 'body1.fontSize',
                wordBreak: 'break-all',
              }}
            >
              <Typography component="span" sx={{ fontWeight: 500 }}>
                did:ryt:{didData.didIdentifier || didData.walletAddress || '0x0'}
              </Typography>
              <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
                <IconButton onClick={handleCopyDID} size="small">
                  {copied ? (
                    <CheckIcon fontSize="small" color="success" />
                  ) : (
                    <ContentCopyIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Stack direction="column" spacing={1} alignItems="center">
            <Chip
              icon={<VerifiedUserIcon />}
              label="Minted & Verified"
              color="primary"
              sx={{ fontWeight: 600, px: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              {mintTimestamp}
            </Typography>
            <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
              <CredentialBadge label={credentialId} variant="outlined" color="primary" size="small" />
              <CredentialBadge label="v.03" variant="outlined" size="small" />
            </Stack>
          </Stack>
        </Stack>

        {/* Trust anchors row */}
        <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" sx={{ mt: 2.5, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}` }}>
          {[
            { icon: '🔗', label: 'Blockchain Secured' },
            { icon: '🛡️', label: 'AMP Verified' },
            { icon: '📋', label: 'STCW Compliant' },
            { icon: '🌐', label: 'Globally Verifiable' },
          ].map((b, i) => (
            <Chip
              key={i}
              label={`${b.icon} ${b.label}`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem', fontWeight: 500, borderColor: alpha(theme.palette.primary.main, 0.2) }}
            />
          ))}
        </Stack>
      </ProfileSection>

      {/* ================================================================ */}
      {/* TABS */}
      {/* ================================================================ */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          mb: 3,
          '& .MuiTab-root': {
            fontWeight: 500,
            color: 'text.secondary',
            textTransform: 'none',
            minHeight: 48,
            fontSize: '0.9rem',
          },
          '& .Mui-selected': { color: 'primary.main', fontWeight: 700 },
          '& .MuiTabs-indicator': { height: 3, borderRadius: 3 },
        }}
      >
        <Tab icon={<PersonIcon />} label="Applicant" iconPosition="start" />
        <Tab icon={<ImageIcon />} label="Documents" iconPosition="start" />
        <Tab icon={<AssignmentIcon />} label="Credential" iconPosition="start" />
        <Tab icon={<WalletIcon />} label="Wallet" iconPosition="start" />
      </Tabs>

      {/* ================================================================ */}
      {/* TAB 0: APPLICANT INFO */}
      {/* ================================================================ */}
      <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
        <ProfileSection>
          <Typography variant="h6" gutterBottom color="primary.main" sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
            Applicant Information
          </Typography>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Box sx={{ flex: 1 }}>
              <DataField>
                <PersonIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1.1rem', mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Full Name</Typography>
                  <Typography variant="body2" fontWeight={500}>{userInfo.fullName || didData.fullName || 'N/A'}</Typography>
                </Box>
              </DataField>

              <DataField>
                <BadgeIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1.1rem', mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>ID Number</Typography>
                  <Typography variant="body2" fontWeight={500}>{userInfo.idNumber || didData.documentNumber || 'N/A'}</Typography>
                </Box>
              </DataField>

              <DataField>
                <PublicIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1.1rem', mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Nationality</Typography>
                  <Typography variant="body2" fontWeight={500}>{userInfo.nationality || 'N/A'}</Typography>
                </Box>
              </DataField>

              <DataField>
                <CalendarIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1.1rem', mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Date of Birth</Typography>
                  <Typography variant="body2" fontWeight={500}>{userInfo.dateOfBirth || didData.dateOfBirth || 'N/A'}</Typography>
                </Box>
              </DataField>
            </Box>

            <Box sx={{ flex: 1 }}>
              <DataField>
                <WorkIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1.1rem', mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Capacity Request</Typography>
                  <Typography variant="body2" fontWeight={500}>{userInfo.capacityRequest || 'N/A'}</Typography>
                </Box>
              </DataField>

              <DataField>
                <EmailIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1.1rem', mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Email (administrative notifications)</Typography>
                  <Typography variant="body2" fontWeight={500}>{userInfo.email || 'N/A'}</Typography>
                </Box>
              </DataField>

              <DataField>
                <PhoneIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1.1rem', mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Phone Number</Typography>
                  <Typography variant="body2" fontWeight={500}>{userInfo.phoneNumber || 'N/A'}</Typography>
                </Box>
              </DataField>

              <DataField>
                <HomeIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1.1rem', mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Address</Typography>
                  <Typography variant="body2" fontWeight={500}>{userInfo.address || 'N/A'}</Typography>
                </Box>
              </DataField>
            </Box>
          </Stack>
        </ProfileSection>
      </Box>

      {/* ================================================================ */}
      {/* TAB 1: DOCUMENTS */}
      {/* ================================================================ */}
      <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
        {/* Generated Port Pass */}
        {generatedImageUrl && (
          <ProfileSection sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary.main" sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
              Digital Port Pass Credential
            </Typography>
            <ImagePreview sx={{ height: 'auto' }}>
              <img src={generatedImageUrl} alt="Digital Port Pass" style={{ height: 'auto' }} />
              <ImageOverlay className="overlay">
                <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
                  <VisibilityIcon />
                </IconButton>
              </ImageOverlay>
            </ImagePreview>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              AI-generated credential image secured on blockchain
            </Typography>
          </ProfileSection>
        )}

        {/* Source Documents */}
        <ProfileSection>
          <Typography variant="h6" gutterBottom color="primary.main" sx={{ mb: 3, fontWeight: 600 }}>
            Source Documents
          </Typography>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
            {/* ID Document Image */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                ID Document
              </Typography>
              {didData.ipfsUrl ? (
                <ImagePreview sx={{ height: 250 }}>
                  <img src={didData.ipfsUrl} alt="ID Document" />
                  <ImageOverlay className="overlay">
                    <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
                      <VisibilityIcon />
                    </IconButton>
                  </ImageOverlay>
                </ImagePreview>
              ) : (
                <Box sx={{ width: '100%', height: 250, borderRadius: 4, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed', borderColor: 'grey.300' }}>
                  <Typography variant="body2" color="text.secondary">No ID image available</Typography>
                </Box>
              )}
              {didData.ipfsHash && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', wordBreak: 'break-all' }}>
                  IPFS Hash: {didData.ipfsHash}
                </Typography>
              )}
            </Box>

            {/* Selfie/Liveness Image */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Liveness Verification
              </Typography>
              {didData.livenessImage ? (
                <ImagePreview sx={{ height: 250 }}>
                  <img src={didData.livenessImage} alt="Liveness Verification" />
                  <ImageOverlay className="overlay">
                    <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
                      <VisibilityIcon />
                    </IconButton>
                  </ImageOverlay>
                </ImagePreview>
              ) : (
                <Box sx={{ width: '100%', height: 250, borderRadius: 4, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed', borderColor: 'grey.300' }}>
                  <Typography variant="body2" color="text.secondary">No selfie image available</Typography>
                </Box>
              )}
              {didData.livenessTimestamp && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Verified on {formatTimestamp(didData.livenessTimestamp)}
                </Typography>
              )}
            </Box>
          </Stack>
        </ProfileSection>
      </Box>

      {/* ================================================================ */}
      {/* TAB 2: CREDENTIAL DETAILS */}
      {/* ================================================================ */}
      <Box sx={{ display: activeTab === 2 ? 'block' : 'none' }}>
        <ProfileSection sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary.main" sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
            Credential Details
          </Typography>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Box sx={{ flex: 1 }}>
              <DataField>
                <SecurityIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1.1rem', mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Credential ID</Typography>
                  <Typography variant="body2" fontWeight={600} fontFamily="monospace">{credentialId}</Typography>
                </Box>
              </DataField>

              <DataField>
                <AssignmentIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1.1rem', mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Application Type</Typography>
                  <Typography variant="body2" fontWeight={500}>{appType}</Typography>
                </Box>
              </DataField>

              <DataField>
                <VerifiedUserIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1.1rem', mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Status</Typography>
                  <Chip label="Active — Minted & Verified" color="success" size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.7rem', mt: 0.25 }} />
                </Box>
              </DataField>
            </Box>

            <Box sx={{ flex: 1 }}>
              <DataField>
                <AccessTimeIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1.1rem', mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Minted On</Typography>
                  <Typography variant="body2" fontWeight={500}>{mintTimestamp}</Typography>
                </Box>
              </DataField>

              <DataField>
                <AssignmentIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1.1rem', mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Form Version</Typography>
                  <Typography variant="body2" fontWeight={500}>F-76 (TIT) V.03</Typography>
                </Box>
              </DataField>

              <DataField>
                <AssignmentIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1.1rem', mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Document Type</Typography>
                  <Typography variant="body2" fontWeight={500}>{didData.documentType || 'ID Document'}</Typography>
                </Box>
              </DataField>
            </Box>
          </Stack>
        </ProfileSection>

        {/* Transaction History */}
        <ProfileSection>
          <Typography variant="h6" gutterBottom color="primary.main" sx={{ mb: 3, fontWeight: 600 }}>
            Transaction History
          </Typography>

          {didData.transactionHash ? (
            <Card
              variant="outlined"
              sx={{
                mb: 2,
                borderRadius: 2,
                borderColor: alpha(theme.palette.primary.main, 0.3),
                bgcolor: alpha(theme.palette.primary.main, 0.02),
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle2" color="primary">Minting Transaction</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                      {didData.transactionHash}
                    </Typography>
                  </Box>
                  <Chip size="small" label="Success" color="success" variant="outlined" />
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">Timestamp</Typography>
                    <Typography variant="body2">{formatTimestamp(didData.mintingTimestamp)}</Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">Token ID</Typography>
                    <Typography variant="body2">{didData.didIdentifier || '—'}</Typography>
                  </Box>
                </Stack>

                <Box mt={2}>
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={() => window.open(`http://18.216.102.37:3001/tx/${didData.transactionHash}`, '_blank')}
                  >
                    View on RYT Explorer
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
              No transaction history available
            </Typography>
          )}
        </ProfileSection>
      </Box>

      {/* ================================================================ */}
      {/* TAB 3: WALLET */}
      {/* ================================================================ */}
      <Box sx={{ display: activeTab === 3 ? 'block' : 'none' }}>
        <ProfileSection>
          <Typography variant="h6" gutterBottom color="primary.main" sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
            Wallet Details
          </Typography>

          <Stack spacing={2}>
            <DataField>
              <WalletIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1.1rem' }} />
              <Box sx={{ width: '100%' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Connected Address</Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                  <Typography variant="body2" fontWeight={500} sx={{ wordBreak: 'break-all', fontSize: '0.875rem' }}>
                    {didData.walletAddress || 'Not connected'}
                  </Typography>
                  {didData.walletAddress && (
                    <Tooltip title="Copy Address">
                      <IconButton
                        size="small"
                        onClick={() => {
                          navigator.clipboard.writeText(didData.walletAddress);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                      >
                        {copied ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </Box>
            </DataField>

            <DataField>
              <VerifiedUserIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1.1rem' }} />
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Network</Typography>
                <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.875rem' }}>RYT Dev Testnet</Typography>
              </Box>
            </DataField>

            <DataField>
              <LinkOffIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1.1rem' }} />
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Wallet Connection</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.875rem' }}>
                    {didData.walletAddress ? 'Connected' : 'Not Connected'}
                  </Typography>
                  <Chip
                    size="small"
                    label={didData.walletAddress ? 'Active' : 'Inactive'}
                    color={didData.walletAddress ? 'success' : 'default'}
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: '20px' }}
                  />
                </Stack>
              </Box>
            </DataField>
          </Stack>
        </ProfileSection>
      </Box>
    </Container>
  );
}
