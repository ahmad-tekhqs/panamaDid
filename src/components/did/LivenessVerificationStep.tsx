'use client';

import { useState, useRef, useEffect } from 'react';
import { useDIDContext } from '../../context/DIDContext';

// Face Detection API types
interface FaceDetectorOptions {
  fastMode?: boolean;
  maxDetectedFaces?: number;
}

interface FaceDetector {
  detect: (target: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement) => Promise<DetectedFace[]>;
}

interface DetectedFace {
  boundingBox: DOMRectReadOnly;
  landmarks: any[];
}

// Extend Window interface for Face Detection API
declare global {
  interface Window { 
    FaceDetector?: {
      new(options?: FaceDetectorOptions): FaceDetector;
    };
  }
}

// Material UI imports
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  CircularProgress, 
  Alert, 
  Fade, 
  Stack,
  IconButton,
  useTheme,
  alpha,
  styled,
  Tooltip,
  Backdrop
} from '@mui/material';
import { 
  CameraAlt as CameraIcon,
  RestartAlt as RetakeIcon,
  FaceRetouchingNatural as FaceIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

// Styled components
const CameraContainer = styled(Paper)(({ theme }) => ({
  width: 320,
  height: 240,
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 30px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
  },
}));

const PlaceholderContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha(theme.palette.primary.light, 1),
  color: theme.palette.text.secondary,
}));

const CapturedImage = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 320,
  height: 240,
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
  border: `2px solid ${theme.palette.primary.main}`,
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  }
}));

const RetakeButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(1),
  right: theme.spacing(1),
  backgroundColor: alpha(theme.palette.common.black, 0.7),
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.9),
  },
}));

const PulsingCircle = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  backgroundColor: alpha(theme.palette.primary.main, 0.2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    border: `2px solid ${theme.palette.primary.main}`,
    animation: 'pulse 2s infinite',
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(0.95)',
      boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0.7)}`,
    },
    '70%': {
      transform: 'scale(1)',
      boxShadow: `0 0 0 10px ${alpha(theme.palette.primary.main, 0)}`,
    },
    '100%': {
      transform: 'scale(0.95)',
      boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0)}`,
    },
  },
}));


export default function LivenessVerificationStep() {
  const { state, updateDIDData, markStepAsCompleted } = useDIDContext();
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(state.didData.livenessImage || null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Face detection states
  const [faceDetected, setFaceDetected] = useState(false);
  const [autoCapture, setAutoCapture] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [useSimpleDetection, setUseSimpleDetection] = useState(false);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceDetectorRef = useRef<FaceDetector | null>(null);
  const faceCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const captureTimeout = useRef<NodeJS.Timeout | null>(null);
  const captureInProgress = useRef(false);
  
  const theme = useTheme();

  // Initialize face detector
  useEffect(() => {
    if (window.FaceDetector) {
      try {
        faceDetectorRef.current = new window.FaceDetector({
          fastMode: true,
          maxDetectedFaces: 1,
        });
        console.log('Face detector initialized with native API');
      } catch (error) {
        console.error('Error initializing face detector:', error);
        setUseSimpleDetection(true);
      }
    } else {
      console.warn('Face Detection API not supported, using simple detection');
      setUseSimpleDetection(true);
    }

    return () => {
      // Cleanup intervals and timeouts
      if (faceCheckInterval.current) {
        clearInterval(faceCheckInterval.current);
      }
      if (captureTimeout.current) {
        clearTimeout(captureTimeout.current);
      }
    };
  }, []);

  // Check if we already have liveness data and mark step as completed
  useEffect(() => {
    if (capturedImage && !state.isStepCompleted) {
      markStepAsCompleted(true);
    }
  }, [capturedImage, state.isStepCompleted, markStepAsCompleted]);

  // Start face detection when camera is active
  useEffect(() => {
    if (showCamera && !capturedImage) {
      faceCheckInterval.current = setInterval(() => {
        if (useSimpleDetection) {
          detectFacesSimple();
        } else {
          detectFacesWithAPI();
        }
      }, 500); // Check every 500ms
    } else {
      if (faceCheckInterval.current) {
        clearInterval(faceCheckInterval.current);
        faceCheckInterval.current = null;
      }
    }

    return () => {
      if (faceCheckInterval.current) {
        clearInterval(faceCheckInterval.current);
      }
    };
  }, [showCamera, capturedImage, useSimpleDetection]);

  // Clean up camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const startVerification = async () => {
    setError(null);
    setFaceDetected(false);
    setCountdown(null);
    captureInProgress.current = false;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" },
        audio: false 
      });
      setCameraStream(stream);
      setShowCamera(true);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please make sure you have granted camera permissions.');
    }
  };

  // Simple face detection using skin tone analysis
  const detectFacesSimple = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Only process if video is playing
      if (video.readyState !== 4) return;
      
      // Set canvas size for analysis (small for performance)
      canvas.width = 100;
      canvas.height = 100;
      
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      
      // Draw center of video to canvas
      const centerX = video.videoWidth / 2;
      const centerY = video.videoHeight / 2;
      ctx.drawImage(
        video,
        centerX - 100, centerY - 100, 200, 200,  // Source rectangle
        0, 0, 100, 100                          // Destination rectangle
      );
      
      // Get image data for skin tone analysis
      const imageData = ctx.getImageData(0, 0, 100, 100);
      const data = imageData.data;
      
      let skinPixelCount = 0;
      const totalPixels = data.length / 4;
      
      // Simple skin tone detection
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Basic skin tone heuristic
        if (
          r > 60 && g > 40 && b > 20 &&        // Lower bounds
          r > g && r > b &&                    // Red dominant
          Math.abs(r - g) > 15 &&              // Red-green difference
          r - g > 15 && r - b > 15 &&          // Red significantly higher
          Math.abs(g - b) < 15                 // Green and blue similar
        ) {
          skinPixelCount++;
        }
      }
      
      // Face detected if enough skin pixels found
      const skinRatio = skinPixelCount / totalPixels;
      const faceFound = skinRatio > 0.15; // Lowered threshold for better detection
      
      handleFaceDetection(faceFound);
    } catch (error) {
      console.error('Error in simple face detection:', error);
    }
  };

  // Face detection using browser API
  const detectFacesWithAPI = async () => {
    if (!faceDetectorRef.current || !videoRef.current) return;
    
    try {
      const faces = await faceDetectorRef.current.detect(videoRef.current);
      const faceFound = faces.length > 0;
      handleFaceDetection(faceFound);
    } catch (error) {
      console.error('Error in API face detection:', error);
      // Fallback to simple detection
      setUseSimpleDetection(true);
    }
  };

  // Handle face detection result and auto-capture
  const handleFaceDetection = (faceFound: boolean) => {
    setFaceDetected(faceFound);
    
    if (faceFound && autoCapture && !captureInProgress.current && countdown === null) {
      // Start countdown for auto-capture
      setCountdown(1);
      captureInProgress.current = true;
      
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(countdownInterval);
            // Auto-capture after countdown
            setTimeout(() => {
              performAutoCapture();
            }, 100);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      
    } else if (!faceFound && captureTimeout.current) {
      // Clear auto-capture if face disappears
      clearTimeout(captureTimeout.current);
      captureTimeout.current = null;
      setCountdown(null);
      captureInProgress.current = false;
    }
  };

  // Perform automatic capture
  const performAutoCapture = () => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data URL
    const imageSrc = canvas.toDataURL('image/png');
    handleCapture(imageSrc);
    
    // Reset capture state
    captureInProgress.current = false;
    setCountdown(null);
  };

  const handleCapture = (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setShowCamera(false);
    
    // Store the image in the DID context
    updateDIDData({
      livenessImage: imageSrc,
      livenessVerified: true,
      livenessTimestamp: new Date().toISOString()
    });
    
    // Simulate uploading and verification
    simulateVerification();
  };

  const handleCancelCapture = () => {
    setShowCamera(false);
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    // Clear the liveness data in the context
    updateDIDData({
      livenessImage: null,
      livenessVerified: false,
      livenessTimestamp: null
    });
    startVerification();
  };

  const simulateVerification = () => {
    setIsUploading(true);
    
    // Simulate API call for verification
    setTimeout(() => {
      setIsUploading(false);
      
      // Mark this step as completed
      markStepAsCompleted(true);
    }, 2000);
  };

  return (
    <Box sx={{ py: 3 }}>
      <Stack spacing={4} alignItems="center">
        <Typography 
          variant="h6" 
          align="center" 
          sx={{ maxWidth: 500, mx: 'auto', mb: 2, color: theme.palette.primary.main }}
        >
          {showCamera ? 
            faceDetected ? 
              countdown ? 
                `Face detected! Auto-capturing in ${countdown}...` :
                'Face detected! Capturing...' :
              'Please position your face in the camera' :
            'We need to verify that you\'re a real person. Please look at the camera and follow the instructions.'
          }
        </Typography>
        
        {/* Face detection status indicator */}
        {showCamera && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: faceDetected ? '#4caf50' : '#f44336',
                mr: 1,
                animation: faceDetected ? 'none' : 'pulse 1s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                  '100%': { opacity: 1 },
                },
              }}
            />
            <Typography variant="caption" color={faceDetected ? 'success.main' : 'error.main'}>
              {faceDetected ? 'Face detected' : 'Looking for face...'}
            </Typography>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          {capturedImage ? (
            <Fade in={!!capturedImage}>
              <CapturedImage>
                <img 
                  src={capturedImage} 
                  alt="Captured"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <RetakeButton
                  size="small"
                  onClick={handleRetake}
                  aria-label="Retake photo"
                >
                  <RetakeIcon fontSize="small" />
                </RetakeButton>
              </CapturedImage>
            </Fade>
          ) : (
            <CameraContainer elevation={3} sx={{
              border: faceDetected ? 
                `3px solid ${theme.palette.success.main}` : 
                `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              transition: 'border-color 0.3s ease',
            }}>
              {showCamera ? (
                <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      transform: 'scaleX(-1)' // Mirror effect for selfie mode
                    }}
                  />
                  
                  {/* Countdown overlay */}
                  {countdown !== null && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: alpha(theme.palette.primary.main, 0.9),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                      }}
                    >
                      <Typography
                        variant="h3"
                        sx={{
                          color: 'white',
                          fontWeight: 'bold',
                          animation: 'bounce 1s infinite',
                          '@keyframes bounce': {
                            '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                            '40%': { transform: 'translateY(-10px)' },
                            '60%': { transform: 'translateY(-5px)' },
                          },
                        }}
                      >
                        {countdown}
                      </Typography>
                    </Box>
                  )}
                  
                  {/* Face detection indicator */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      padding: 1,
                      borderRadius: 1,
                      backgroundColor: alpha(
                        faceDetected ? theme.palette.success.main : theme.palette.error.main, 
                        0.8
                      ),
                      color: 'white',
                    }}
                  >
                    <Typography variant="caption" fontWeight="bold">
                      {faceDetected ? '✓' : '✗'}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <PlaceholderContainer>
                  <PulsingCircle>
                    <FaceIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  </PulsingCircle>
                  <Typography variant="caption" sx={{ mt: 2 }}>
                    Camera feed will appear here
                  </Typography>
                </PlaceholderContainer>
              )}
            </CameraContainer>
          )}
          
          {error && (
            <Alert 
              severity="error" 
              variant="filled" 
              sx={{ maxWidth: 320 }}
            >
              {error}
            </Alert>
          )}
          
          {!showCamera && !capturedImage && !isUploading && (
            <Stack spacing={2} alignItems="center">
              <Button
                variant="contained"
                size="large"
                startIcon={<CameraIcon />}
                onClick={startVerification}
                sx={{ 
                  mt: 2,
                  minWidth: 200,
                  py: 1.5,
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
                Start Auto-Capture Verification
              </Button>
              
              <Typography variant="caption" color="text.secondary" align="center" sx={{ maxWidth: 400 }}>
                Face detection will automatically capture your photo when you look at the camera
              </Typography>
            </Stack>
          )}
          
          {/* Skip Verification option */}
          {/* {!showCamera && !capturedImage && !isUploading && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
              <Divider sx={{ width: '80%', mb: 3 }}>
                <Typography variant="caption" color="text.secondary">OR</Typography>
              </Divider>
              
              <Stack direction="column" spacing={1} alignItems="center">
                <Tooltip 
                  title="Skip liveness verification and use demo data. Your verification score will be lower." 
                  arrow
                  placement="top"
                >
                  <SkipButton
                    onClick={skipIDVerification}
                    startIcon={<SkipNextIcon />}
                    endIcon={<InfoOutlinedIcon fontSize="small" />}
                    size="large"
                  >
                    Skip Liveness Verification
                  </SkipButton>
                </Tooltip>
                <Typography variant="caption" color="text.secondary" align="center" sx={{ maxWidth: 400 }}>
                  Note: Skipping verification will result in a lower security score 
                  and will use demo data instead of your real information.
                </Typography>
              </Stack>
            </Box>
          )} */}
        </Box>
      </Stack>

      {/* Manual Cancel Option */}
      {showCamera && (
        <Box 
          sx={{ 
            position: 'fixed',
            bottom: 16, 
            left: '50%', 
            transform: 'translateX(-50%)',
            zIndex: 10,
          }}
        >
          <Tooltip title="Cancel Auto-Capture">
            <Button
              color="error"
              variant="outlined"
              onClick={handleCancelCapture}
              startIcon={<CancelIcon />}
              sx={{ 
                borderRadius: 25,
                px: 3,
                py: 1,
                backgroundColor: alpha('#fff', 0.9),
                backdropFilter: 'blur(10px)',
              }}
            >
              Cancel
            </Button>
          </Tooltip>
        </Box>
      )}
      
      {/* Hidden elements for capture */}
      <Box sx={{ display: 'none' }}>
        <canvas ref={canvasRef} />
      </Box>
      
      {/* Loading backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open={isUploading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress color="inherit" />
          <Typography>Verifying your identity...</Typography>
        </Box>
      </Backdrop>
    </Box>
  );
} 