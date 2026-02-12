'use client';

import { useState, useEffect, useRef } from 'react';
import { useDIDContext } from '../../context/DIDContext';
import { IDInformation } from '@/types/id';
import { createAndUploadDIDMetadata } from '../../utils/metadataService';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  LinearProgress, 
  Fade, 
  Chip,
  Stack,
  useTheme,
  alpha,
  styled,
  keyframes,
  Alert,
  AlertTitle,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  InputAdornment,
  FormHelperText,
  Divider,
  Grid
} from '@mui/material';
import { 
  VerifiedUser as VerifiedUserIcon,
  Security as SecurityIcon,
  Shield as ShieldIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Badge as BadgeIcon,
  Public as PublicIcon,
  CalendarMonth as CalendarIcon,
  Work as WorkIcon
} from '@mui/icons-material';

// ============================================================================
// TYPES
// ============================================================================

interface FormData {
  fullName: string;
  idNumber: string;
  nationality: string;
  dateOfBirth: string;
  email: string;
  capacityRequest: string;
  phoneNumber: string;
  address: string;
}

interface FormErrors {
  fullName?: string;
  idNumber?: string;
  nationality?: string;
  dateOfBirth?: string;
  email?: string;
  capacityRequest?: string;
  phoneNumber?: string;
  address?: string;
}

interface DocumentRow {
  id: string;
  documentType: string;
  file: File | null;
  fileName: string;
}

const DOCUMENT_TYPES = [
  { value: 'passport_bio', label: 'Passport Bio' },
  { value: 'passport_photo', label: 'Passport Photo' },
  { value: 'medical_certificate', label: 'Medical Certificate' },
  { value: 'certificate_of_competency', label: 'Current Certificate of Competency' },
  { value: 'sea_service_record', label: 'Sea Service Record' },
  { value: 'training_certificates', label: 'Training Course Certificates' },
];

// ============================================================================
// ANIMATION KEYFRAMES
// ============================================================================

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 ${alpha('#005EB8', 0.7)}; }
  70% { box-shadow: 0 0 0 15px ${alpha('#005EB8', 0)}; }
  100% { box-shadow: 0 0 0 0 ${alpha('#005EB8', 0)}; }
`;

const glowScan = keyframes`
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const VerificationContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 2,
  background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.7)}, ${alpha(theme.palette.background.paper, 0.4)})`,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.1)}`,
}));

const GlowingIcon = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  animation: `${pulse} 2s infinite`,
  '& svg': {
    fontSize: 40,
  },
}));

const ScanEffect = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '2px',
  background: `linear-gradient(90deg, ${alpha(theme.palette.secondary.main, 0)}, ${theme.palette.primary.main}, ${alpha(theme.palette.secondary.main, 0)})`,
  backgroundSize: '200% 200%',
  animation: `${glowScan} 2s ease-in-out infinite`,
  boxShadow: `0 0 10px ${theme.palette.primary.main}, 0 0 20px ${theme.palette.primary.main}`,
  zIndex: 10,
}));

const VerificationSuccessIcon = styled(Box)(({ theme }) => ({
  width: 100,
  height: 100,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.palette.primary.main,
  color: theme.palette.common.white,
  boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
  animation: `${float} 3s ease-in-out infinite`,
  '& svg': {
    fontSize: 60,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 1.5,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.1)}`,
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.875rem',
  },
}));

const DocumentCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 1.5,
  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: alpha(theme.palette.primary.main, 0.3),
    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.08)}`,
  },
}));

// ============================================================================
// HELPER: Generate unique ID
// ============================================================================

let rowIdCounter = 0;
function generateRowId() {
  return `doc-row-${Date.now()}-${++rowIdCounter}`;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function VerificationStep() {
  const { state, updateDIDData, markStepAsCompleted } = useDIDContext();
  const theme = useTheme();
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Check if demo mode is active
  const isDemoMode = state.skippedIDVerification && !state.didData.documentDetails;

  // ---- FORM STATE ----
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    idNumber: '',
    nationality: '',
    dateOfBirth: '',
    email: '',
    capacityRequest: '',
    phoneNumber: '',
    address: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // ---- DOCUMENT UPLOAD STATE ----
  const [documentRows, setDocumentRows] = useState<DocumentRow[]>([
    { id: generateRowId(), documentType: '', file: null, fileName: '' },
  ]);

  // ---- VERIFICATION STATE ----
  const [phase, setPhase] = useState<'form' | 'verifying' | 'completed'>('form');
  const [animationProgress, setAnimationProgress] = useState(0);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // ---- PRE-FILL FROM STATE ----
  useEffect(() => {
    const d = state.didData;
    const docDetails = d.documentDetails as IDInformation | undefined;
    const demoData = d.demoData as { firstName: string; lastName: string; dateOfBirth: string; nationality: string; documentType: string; documentNumber: string } | undefined;

    // Also check if we already saved userInfo previously (e.g., going back and forth)
    const savedUserInfo = d.userInfo as FormData | undefined;

    if (savedUserInfo) {
      setFormData(savedUserInfo);
    } else {
      setFormData({
        fullName: d.fullName || docDetails?.fullName || (demoData ? `${demoData.firstName} ${demoData.lastName}` : ''),
        idNumber: d.documentNumber || docDetails?.idNumber || demoData?.documentNumber || '',
        nationality: docDetails?.metadata?.issuingCountry || demoData?.nationality || '',
        dateOfBirth: d.dateOfBirth || docDetails?.dateOfBirth || demoData?.dateOfBirth || '',
        email: '',
        capacityRequest: '',
        phoneNumber: '',
        address: '',
      });
    }

    // Restore saved documents if going back
    if (d.userDocuments && Array.isArray(d.userDocuments) && d.userDocuments.length > 0) {
      setDocumentRows(d.userDocuments);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- VALIDATION ----
  const validate = (data: FormData): FormErrors => {
    const errs: FormErrors = {};

    if (!data.fullName.trim()) errs.fullName = 'Full name is required';
    if (!data.idNumber.trim()) errs.idNumber = 'ID number is required';
    if (!data.nationality.trim()) errs.nationality = 'Nationality is required';
    if (!data.dateOfBirth.trim()) {
      errs.dateOfBirth = 'Date of birth is required';
    }
    if (!data.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!data.capacityRequest.trim()) errs.capacityRequest = 'Capacity request is required';
    if (!data.phoneNumber.trim()) {
      errs.phoneNumber = 'Phone number is required';
    } else if (!/^[+]?[\d\s\-()]{7,20}$/.test(data.phoneNumber)) {
      errs.phoneNumber = 'Enter a valid phone number';
    }
    if (!data.address.trim()) errs.address = 'Address is required';

    return errs;
  };

  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error on change if touched
    if (touched[field]) {
      const newData = { ...formData, [field]: value };
      const newErrors = validate(newData);
      setErrors(prev => ({ ...prev, [field]: newErrors[field] }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const newErrors = validate(formData);
    setErrors(prev => ({ ...prev, [field]: newErrors[field] }));
  };

  // ---- DOCUMENT ROW HANDLERS ----
  const addDocumentRow = () => {
    setDocumentRows(prev => [
      ...prev,
      { id: generateRowId(), documentType: '', file: null, fileName: '' },
    ]);
  };

  const removeDocumentRow = (id: string) => {
    if (documentRows.length <= 1) return;
    setDocumentRows(prev => prev.filter(r => r.id !== id));
  };

  const updateDocumentType = (id: string, type: string) => {
    setDocumentRows(prev => prev.map(r => (r.id === id ? { ...r, documentType: type } : r)));
  };

  const handleFileSelect = (id: string, file: File | null) => {
    setDocumentRows(prev =>
      prev.map(r => (r.id === id ? { ...r, file, fileName: file?.name || '' } : r))
    );
  };

  // ---- SUBMIT & VERIFY ----
  const handleSubmit = async () => {
    // Touch all fields
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach(k => { allTouched[k] = true; });
    setTouched(allTouched);

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    // Save form data to context immediately
    updateDIDData({
      userInfo: { ...formData },
      userDocuments: documentRows.map(r => ({
        id: r.id,
        documentType: r.documentType,
        fileName: r.fileName,
        // Note: File objects can't be serialized, but we keep the metadata
      })),
      fullName: formData.fullName,
      documentNumber: formData.idNumber,
      dateOfBirth: formData.dateOfBirth,
    });

    // Start verification phase
    setPhase('verifying');
    setVerificationError(null);

    try {
      const verifyingDuration = 3500;
      const verifyingStart = Date.now();

      const verifyingInterval = setInterval(() => {
        const elapsed = Date.now() - verifyingStart;
        const progress = Math.min((elapsed / verifyingDuration) * 100, 100);
        setAnimationProgress(progress);
        if (progress >= 100) clearInterval(verifyingInterval);
      }, 50);

      // Create and upload DID metadata to IPFS
      let tokenURI = '';
      try {
        console.log('Creating and uploading DID metadata...');
        tokenURI = await createAndUploadDIDMetadata(state.didData, isDemoMode);
        console.log('Token URI created:', tokenURI);
      } catch (err) {
        console.error('Error creating metadata:', err);
      }

      await new Promise(resolve => setTimeout(resolve, verifyingDuration));
      clearInterval(verifyingInterval);

      // Build verified details
      const verifiedDetails = {
        fullName: formData.fullName,
        idNumber: formData.idNumber,
        nationality: formData.nationality,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
        capacityRequest: formData.capacityRequest,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        metadata: {
          documentType: state.didData.documentType || state.didData.demoData?.documentType || 'ID Document',
        },
      };

      // Update DID context with verified information
      updateDIDData({
        verifiedInfo: true,
        fullName: formData.fullName,
        documentNumber: formData.idNumber,
        documentType: verifiedDetails.metadata.documentType,
        verifiedDetails,
        verificationTimestamp: new Date().toISOString(),
        tokenURI: tokenURI || undefined,
        userInfo: { ...formData },
        userDocuments: documentRows.map(r => ({
          id: r.id,
          documentType: r.documentType,
          fileName: r.fileName,
        })),
      });

      setPhase('completed');
      markStepAsCompleted(true);
    } catch (err: any) {
      console.error('Verification error:', err);
      setVerificationError(err.message || 'Verification failed. Please try again.');
      setPhase('form');
    }
  };

  // ============================================================================
  // RENDER: COMPLETED STATE
  // ============================================================================

  if (phase === 'completed') {
    return (
      <Fade in timeout={800}>
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Stack spacing={3} alignItems="center">
            <VerificationSuccessIcon>
              <CheckCircleIcon />
            </VerificationSuccessIcon>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                background: `linear-gradient(90deg,${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Information Validated Successfully
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 450, mx: 'auto' }}>
              Your identity information has been verified and is ready for the next step.
            </Typography>

            {isDemoMode && (
              <Alert
                severity="info"
                variant="outlined"
                icon={<InfoIcon />}
                sx={{
                  mt: 2,
                  maxWidth: 450,
                  textAlign: 'left',
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.info.main, 0.05),
                }}
              >
                <AlertTitle>Using Demo Data</AlertTitle>
                You&apos;ve chosen to skip ID verification. Demo information is being used instead of
                real document verification. This results in a lower verification score.
              </Alert>
            )}

            <Box sx={{ mt: 2 }}>
              <Chip
                label={isDemoMode ? 'Demo Mode' : 'Verified & Secured'}
                color={isDemoMode ? 'secondary' : 'primary'}
                icon={<ShieldIcon />}
                sx={{
                  px: 2,
                  py: 3,
                  borderRadius: '16px',
                  fontWeight: 500,
                  boxShadow: `0 4px 8px ${alpha(
                    isDemoMode ? theme.palette.secondary.main : theme.palette.primary.main,
                    0.3
                  )}`,
                }}
              />
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 500,
                animation: `${pulse} 2s infinite`,
              }}
            >
              Click &apos;Next&apos; to proceed to the minting step
            </Typography>
          </Stack>
        </Box>
      </Fade>
    );
  }

  // ============================================================================
  // RENDER: VERIFYING STATE (Animation)
  // ============================================================================

  if (phase === 'verifying') {
    return (
      <VerificationContainer>
        <ScanEffect sx={{ top: animationProgress * 0.85 + '%' }} />

        <Stack spacing={4} alignItems="center">
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              fontWeight: 600,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {isDemoMode ? 'Preparing Demo Profile' : 'Verifying Your Identity'}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 450, mx: 'auto' }}>
            {isDemoMode
              ? 'Setting up your demo profile with sample information.'
              : 'Please wait while our advanced verification system analyzes and validates your information.'}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <GlowingIcon>
              <SecurityIcon />
            </GlowingIcon>
          </Box>

          <Box sx={{ width: '100%', maxWidth: 480, mx: 'auto', mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <VerifiedUserIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
              {isDemoMode ? 'Preparing demo profile...' : 'Verifying document authenticity...'}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={animationProgress}
              sx={{
                height: 8,
                borderRadius: 4,
                mb: 3,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                },
              }}
            />

            <Stack
              direction="row"
              spacing={2}
              sx={{
                mt: 4,
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.background.paper, 0.5),
                border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              <CircularProgress size={30} thickness={5} sx={{ color: theme.palette.primary.main }} />
              <Box>
                <Typography variant="body2" color="text.primary" fontWeight={500}>
                  {isDemoMode ? 'Demo Profile Generation' : 'Security Verification in Progress'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {isDemoMode
                    ? 'Creating secure demo credentials...'
                    : 'Multi-factor document analysis underway...'}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </VerificationContainer>
    );
  }

  // ============================================================================
  // RENDER: FORM STATE
  // ============================================================================

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          Validate Your Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please review and complete your personal information below. All fields are required.
        </Typography>
      </Box>

      {isDemoMode && (
        <Alert severity="info" variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
          <AlertTitle>Demo Mode</AlertTitle>
          You&apos;ve chosen to skip ID verification. Please fill in your information manually.
        </Alert>
      )}

      {verificationError && (
        <Alert severity="error" variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
          <AlertTitle>Verification Error</AlertTitle>
          {verificationError}
        </Alert>
      )}

      {/* ---- PERSONAL INFORMATION FORM ---- */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: 'blur(10px)',
          mb: 3,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
          <PersonIcon sx={{ color: theme.palette.primary.main, fontSize: 22 }} />
          <Typography variant="subtitle1" fontWeight={600} color="text.primary">
            Personal Information
          </Typography>
        </Stack>

        <Grid container spacing={2.5}>
          {/* Full Name */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <StyledTextField
              fullWidth
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => handleFieldChange('fullName', e.target.value)}
              onBlur={() => handleBlur('fullName')}
              error={!!errors.fullName && touched.fullName}
              helperText={touched.fullName ? errors.fullName : ''}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                },
              }}
              size="small"
            />
          </Grid>

          {/* ID Number */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <StyledTextField
              fullWidth
              label="ID Number"
              value={formData.idNumber}
              onChange={(e) => handleFieldChange('idNumber', e.target.value)}
              onBlur={() => handleBlur('idNumber')}
              error={!!errors.idNumber && touched.idNumber}
              helperText={touched.idNumber ? errors.idNumber : ''}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                },
              }}
              size="small"
            />
          </Grid>

          {/* Nationality */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <StyledTextField
              fullWidth
              label="Nationality"
              value={formData.nationality}
              onChange={(e) => handleFieldChange('nationality', e.target.value)}
              onBlur={() => handleBlur('nationality')}
              error={!!errors.nationality && touched.nationality}
              helperText={touched.nationality ? errors.nationality : ''}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PublicIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                },
              }}
              size="small"
            />
          </Grid>

          {/* Date of Birth */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <StyledTextField
              fullWidth
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
              onBlur={() => handleBlur('dateOfBirth')}
              error={!!errors.dateOfBirth && touched.dateOfBirth}
              helperText={touched.dateOfBirth ? errors.dateOfBirth : ''}
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                },
              }}
              size="small"
            />
          </Grid>

          {/* Email */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <StyledTextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              error={!!errors.email && touched.email}
              helperText={touched.email ? errors.email : ''}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                },
              }}
              size="small"
            />
          </Grid>

          {/* Capacity Request */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <StyledTextField
              fullWidth
              label="Capacity Request"
              value={formData.capacityRequest}
              onChange={(e) => handleFieldChange('capacityRequest', e.target.value)}
              onBlur={() => handleBlur('capacityRequest')}
              error={!!errors.capacityRequest && touched.capacityRequest}
              helperText={touched.capacityRequest ? errors.capacityRequest : ''}
              placeholder="e.g., Master, Chief Officer, Engineer"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                },
              }}
              size="small"
            />
          </Grid>

          {/* Phone Number */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <StyledTextField
              fullWidth
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
              onBlur={() => handleBlur('phoneNumber')}
              error={!!errors.phoneNumber && touched.phoneNumber}
              helperText={touched.phoneNumber ? errors.phoneNumber : ''}
              placeholder="+507 6000-0000"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                },
              }}
              size="small"
            />
          </Grid>

          {/* Address */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <StyledTextField
              fullWidth
              label="Address"
              value={formData.address}
              onChange={(e) => handleFieldChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              error={!!errors.address && touched.address}
              helperText={touched.address ? errors.address : ''}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                },
              }}
              size="small"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ---- DOCUMENT UPLOAD SECTION ---- */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: 'blur(10px)',
          mb: 3,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <CloudUploadIcon sx={{ color: theme.palette.primary.main, fontSize: 22 }} />
            <Typography variant="subtitle1" fontWeight={600} color="text.primary">
              Upload Documents
            </Typography>
            <Chip label="Optional" size="small" variant="outlined" sx={{ ml: 1, height: 22, fontSize: '0.7rem' }} />
          </Stack>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={addDocumentRow}
            sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}
          >
            Add Row
          </Button>
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          Upload supporting documents for your maritime credential application.
        </Typography>

        <Stack spacing={2}>
          {documentRows.map((row, index) => (
            <DocumentCard key={row.id} elevation={0}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                {/* Document Type Dropdown */}
                <FormControl size="small" sx={{ minWidth: 240, flex: 1 }}>
                  <InputLabel sx={{ fontSize: '0.85rem' }}>Document Type</InputLabel>
                  <Select
                    value={row.documentType}
                    onChange={(e) => updateDocumentType(row.id, e.target.value)}
                    label="Document Type"
                    sx={{
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      fontSize: '0.85rem',
                    }}
                  >
                    {DOCUMENT_TYPES.map((dt) => (
                      <MenuItem key={dt.value} value={dt.value} sx={{ fontSize: '0.85rem' }}>
                        {dt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* File Picker */}
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <input
                    type="file"
                    ref={(el) => { fileInputRefs.current[row.id] = el; }}
                    style={{ display: 'none' }}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleFileSelect(row.id, file);
                    }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => fileInputRefs.current[row.id]?.click()}
                    startIcon={<DescriptionIcon />}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2,
                      flex: 1,
                      justifyContent: 'flex-start',
                      borderColor: alpha(theme.palette.divider, 0.8),
                      color: row.fileName ? 'text.primary' : 'text.secondary',
                      fontWeight: row.fileName ? 500 : 400,
                      fontSize: '0.8rem',
                      py: 0.9,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {row.fileName || 'Choose file...'}
                  </Button>

                  {/* Remove button */}
                  {documentRows.length > 1 && (
                    <IconButton
                      size="small"
                      onClick={() => removeDocumentRow(row.id)}
                      sx={{
                        color: theme.palette.error.main,
                        '&:hover': { backgroundColor: alpha(theme.palette.error.main, 0.08) },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Stack>
            </DocumentCard>
          ))}
        </Stack>
      </Paper>

      {/* ---- SUBMIT BUTTON ---- */}
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          startIcon={<VerifiedUserIcon />}
          sx={{
            px: 5,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 600,
            fontSize: '0.95rem',
            textTransform: 'none',
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
            '&:hover': {
              boxShadow: `0 8px 28px ${alpha(theme.palette.primary.main, 0.4)}`,
            },
          }}
        >
          Verify & Submit
        </Button>
        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1.5 }}>
          Your information will be securely validated and stored on-chain
        </Typography>
      </Box>
    </Box>
  );
}
