'use client';

import { useState, useEffect } from 'react';
import { useDIDContext } from '../../context/DIDContext';
import { performOcrWithGPT4o } from '@/utils/openaiService';
import { IDInformation } from '@/types/id';

// Material UI imports
import {
  Box,
  Typography,
  LinearProgress,
  Fade,
  useTheme,
  alpha,
  styled,
  Alert
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

// Styled components

const DataField = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 2fr',
  gap: theme.spacing(2),
  padding: theme.spacing(2.5, 4),
  borderBottom: '1px solid #f1f5f9',
  alignItems: 'center',
  '&:last-child': {
    borderBottom: 'none',
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(1),
    padding: theme.spacing(2, 2),
  }
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 240,
  height: 200,
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
  border: `2px solid ${theme.palette.primary.main}`,
  margin: '0 auto',
  backgroundColor: alpha(theme.palette.primary.light, 0.1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& img': {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  }
}));

const SelfieImage = styled(ImageContainer)(({ theme }) => ({
  // Inherit all styles from ImageContainer
}));

const IDImage = styled(ImageContainer)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  // Inherit all styles from ImageContainer
}));

export default function ExtractionStep() {
  const { state, updateDIDData, markStepAsCompleted } = useDIDContext();
  const [extractionPhase, setExtractionPhase] = useState<'preparing' | 'extracting' | 'processing' | 'complete'>('preparing');
  const [extractedData, setExtractedData] = useState<IDInformation | null>(null);
  const [rawText, setRawText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [useOpenAI, setUseOpenAI] = useState<boolean>(true);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const theme = useTheme();
  
  // Mock data for display when not using OpenAI or as fallback
  const mockExtractedData: IDInformation = {
    fullName: "John Doe",
    dateOfBirth: "1990-01-01",
    gender: "Male",
    idNumber: "AB123456789",
    metadata: {
      documentType: "National ID",
      issuingCountry: "United States",
      fileType: "image/jpeg",
      fileSize: "Unknown"
    },
    confidence: 0.92,
    rawText: ""
  };

  // Extract data using OpenAI
  const extractDataWithOpenAI = async (imageUrl: string): Promise<IDInformation | null> => {
    try {
      if (!imageUrl) {
        throw new Error("No image URL provided for extraction");
      }
      
      setExtractionPhase('extracting');
      
      // Update progress for UI feedback
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 5;
        if (progress <= 90) {
          setExtractionProgress(progress);
        } else {
          clearInterval(progressInterval);
        }
      }, 300);
      
      // In demo mode, simulate delay then use mock data
      if (!useOpenAI) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setExtractedData(mockExtractedData);
        setRawText(JSON.stringify(mockExtractedData, null, 2));
        setExtractionPhase('processing');
        clearInterval(progressInterval);
        setExtractionProgress(95);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setExtractionProgress(100);
        return mockExtractedData;
      }
      
      // Real OpenAI extraction
      const result = await performOcrWithGPT4o(imageUrl);
      const extractedInfo = result.extractedInfo;
      setExtractedData(extractedInfo);
      setRawText(result.rawText || '');
      
      clearInterval(progressInterval);
      setExtractionProgress(95);
      setExtractionPhase('processing');
      await new Promise(resolve => setTimeout(resolve, 2000));
      setExtractionProgress(100);
      return extractedInfo;
    } catch (error: any) {
      console.error("Error extracting data with OpenAI:", error);
      setError(error.message || "Failed to extract information from your ID");
      // Fallback to mock data in case of error
      setExtractedData(mockExtractedData);
      setRawText(JSON.stringify(mockExtractedData, null, 2));
      setExtractionProgress(100);
      return null;
    }
  };

  // Simulate the extraction process with phases
  useEffect(() => {
    const performExtraction = async () => {
      try {
        // If already completed, just show the data
        if (state.didData.extractedInfo) {
          setExtractionPhase('complete');
          setExtractedData(state.didData.documentDetails as IDInformation || mockExtractedData);
          setExtractionProgress(100);
          return;
        }

        // Phase 1: Preparing
        setExtractionPhase('preparing');
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Phase 2 & 3: Extract data with OpenAI (or mock)
        const imageUrl = state.didData.ipfsUrl || '';
        const extractedInfo = await extractDataWithOpenAI(imageUrl);
        
        // Phase 4: Complete
        setExtractionPhase('complete');
        
        // Update the DID context with the extracted data
        const dataToSave = extractedInfo || mockExtractedData;
        updateDIDData({
          extractedInfo: true,
          fullName: dataToSave.fullName || mockExtractedData.fullName,
          documentNumber: dataToSave.idNumber || mockExtractedData.idNumber,
          dateOfBirth: dataToSave.dateOfBirth || mockExtractedData.dateOfBirth,
          documentType: dataToSave.metadata?.documentType || mockExtractedData.metadata.documentType,
          documentDetails: dataToSave,
          rawExtractionText: rawText
        });

        // Mark step as completed
        markStepAsCompleted(true);
      } catch (error: any) {
        console.error("Error during extraction:", error);
        setError("Failed to extract information from your ID. Please try again.");
        
        // Still show mock data to allow user to continue
        setExtractionPhase('complete');
        setExtractedData(mockExtractedData);
        updateDIDData({
          extractedInfo: true,
          fullName: mockExtractedData.fullName,
          documentNumber: mockExtractedData.idNumber,
          dateOfBirth: mockExtractedData.dateOfBirth,
          documentType: mockExtractedData.metadata.documentType,
          documentDetails: mockExtractedData
        });
        markStepAsCompleted(true);
      }
    };

    performExtraction();
  }, [updateDIDData, markStepAsCompleted]);


  const renderContent = () => {
    if (extractionPhase === 'preparing' || extractionPhase === 'extracting' || extractionPhase === 'processing') {
      return (
        <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
          <LinearProgress 
            variant="determinate" 
            value={extractionProgress} 
            sx={{ 
              height: 10, 
              borderRadius: 5,
              mb: 2,
              backgroundColor: alpha(theme.palette.primary.light, 1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                background: `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.light} 100%)`,
              }
            }} 
          />
          <Typography variant="body2" color="text.secondary" align="center">
            {extractionPhase === 'preparing' ? 'Preparing your ID for extraction...' : 
             extractionPhase === 'extracting' ? 'Extracting information using OpenAI...' : 
             'Processing and validating your information...'}
          </Typography>
        </Box>
      );
    } else if (extractionPhase === 'complete') {
      return (
        <Fade in={extractionPhase === 'complete'} timeout={800}>
          <Box sx={{ maxWidth: 1400, mx: 'auto', px: 2 }}>
            {/* Main Grid Layout */}
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '400px 1fr' },
              gap: { xs: 3, md: 5 },
              alignItems: 'start',
            }}>
              
              {/* Left Panel - Document Images */}
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}>
                {/* Header */}
                {/* <Box sx={{ 
                  textAlign: 'center',
                  py: 2,
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  borderRadius: 2,
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700,
                    color: '#1e293b',
                    mb: 0.5,
                    fontSize: '1.1rem',
                  }}>
                    Verification Assets
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: '#64748b',
                    fontSize: '0.875rem',
                  }}>
                    Identity documents & biometric data
                  </Typography>
                </Box> */}

                {/* Document Images Grid */}
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: 2.5,
                }}>
                  {/* ID Document */}
                  {state.didData.ipfsUrl && (
                    <Box sx={{ 
                      background: '#ffffff',
                      borderRadius: 3,
                      p: 2,
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        transform: 'translateY(-1px)',
                      }
                    }}>
                      <Typography variant="subtitle2" sx={{ 
                        color: '#374151',
                        mb: 1.5,
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}>
                        Government ID
                      </Typography>
                      <IDImage>
                        <img 
                          src={state.didData.ipfsUrl} 
                          alt="ID Document"
                        />
                      </IDImage>
                    </Box>
                  )}

                  {/* Liveness Verification */}
                  {state.didData.livenessImage && (
                    <Box sx={{ 
                      background: '#ffffff',
                      borderRadius: 3,
                      p: 2,
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        transform: 'translateY(-1px)',
                      }
                    }}>
                      <Typography variant="subtitle2" sx={{ 
                        color: '#374151',
                        mb: 1.5,
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}>
                        Biometric Verification
                      </Typography>
                      <SelfieImage>
                        <img 
                          src={state.didData.livenessImage} 
                          alt="Liveness Check"
                        />
                      </SelfieImage>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Right Panel - Extracted Information */}
              <Box sx={{ 
                background: '#ffffff',
                borderRadius: 3,
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
                
                {/* Header */}
                <Box sx={{ 
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                  px: 4,
                  py: 3,
                  color: 'white',
                  width: '100%',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CheckCircleIcon sx={{ 
                      fontSize: '1.5rem',
                      color: '#10b981',
                    }} />
                    <Box>
                      <Typography variant="h5" sx={{ 
                        fontWeight: 700,
                        fontSize: '1.4rem',
                        mb: 0.5,
                        letterSpacing: '-0.025em',
                      }}>
                        Identity Data
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#94a3b8',
                        fontSize: '0.875rem',
                      }}>
                        Extracted from official documents
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Content */}
                <Box sx={{ 
                  p: 0,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                  {extractedData && (
                    <Box sx={{ width: '100%' }}>
                      {/* Personal Information */}
                      <DataField>
                        <Box>
                          <Typography variant="body2" sx={{ 
                            color: '#6b7280',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}>
                            Full Name
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ 
                            color: '#111827',
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            lineHeight: 1.2,
                          }}>
                            {extractedData?.fullName || 'Not available'}
                          </Typography>
                        </Box>
                      </DataField>

                      <DataField>
                        <Box>
                          <Typography variant="body2" sx={{ 
                            color: '#6b7280',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}>
                            Date of Birth
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ 
                            color: '#111827',
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            lineHeight: 1.2,
                          }}>
                            {extractedData?.dateOfBirth || 'Not available'}
                          </Typography>
                        </Box>
                      </DataField>

                      <DataField>
                        <Box>
                          <Typography variant="body2" sx={{ 
                            color: '#6b7280',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}>
                            ID Number
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ 
                            color: '#111827',
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            lineHeight: 1.2,
                            fontFamily: 'monospace',
                          }}>
                            {extractedData?.idNumber || 'Not available'}
                          </Typography>
                        </Box>
                      </DataField>

                      {/* Document Information */}
                      {extractedData?.metadata && (
                        <>
                          {extractedData.metadata.documentType && (
                            <DataField>
                              <Box>
                                <Typography variant="body2" sx={{ 
                                  color: '#6b7280',
                                  fontSize: '0.875rem',
                                  fontWeight: 500,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em',
                                }}>
                                  Document Type
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="h6" sx={{ 
                                  color: '#111827',
                                  fontSize: '1.125rem',
                                  fontWeight: 600,
                                  lineHeight: 1.2,
                                }}>
                                  {extractedData.metadata.documentType}
                                </Typography>
                              </Box>
                            </DataField>
                          )}

                          {extractedData.metadata.issuingCountry && (
                            <DataField>
                              <Box>
                                <Typography variant="body2" sx={{ 
                                  color: '#6b7280',
                                  fontSize: '0.875rem',
                                  fontWeight: 500,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em',
                                }}>
                                  Issuing Country
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="h6" sx={{ 
                                  color: '#111827',
                                  fontSize: '1.125rem',
                                  fontWeight: 600,
                                  lineHeight: 1.2,
                                }}>
                                  {extractedData.metadata.issuingCountry}
                                </Typography>
                              </Box>
                            </DataField>
                          )}
                        </>
                      )}
                    </Box>
                  )}
                  
                </Box>

                {/* Footer - Confidence Score */}
                {extractedData && extractedData.confidence && (
                  <Box sx={{ 
                    background: '#f8fafc',
                    px: 4,
                    py: 3,
                    borderTop: '1px solid #e2e8f0',
                    width: '100%',
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ 
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}>
                        Extraction Confidence
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" sx={{ 
                          color: extractedData.confidence > 0.8 ? '#059669' : extractedData.confidence > 0.6 ? '#d97706' : '#dc2626',
                          fontSize: '1.25rem',
                          fontWeight: 700,
                        }}>
                          {Math.round(extractedData.confidence * 100)}%
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: '#6b7280',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                        }}>
                          {extractedData.confidence > 0.8 ? 'HIGH' : extractedData.confidence > 0.6 ? 'MEDIUM' : 'LOW'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      height: 6,
                      borderRadius: 3,
                      background: '#e5e7eb',
                      overflow: 'hidden',
                    }}>
                      <Box sx={{ 
                        height: '100%',
                        width: `${extractedData.confidence * 100}%`,
                        background: extractedData.confidence > 0.8 
                          ? 'linear-gradient(90deg, #059669, #10b981)'
                          : extractedData.confidence > 0.6 
                          ? 'linear-gradient(90deg, #d97706, #f59e0b)'
                          : 'linear-gradient(90deg, #dc2626, #ef4444)',
                        borderRadius: 3,
                        transition: 'width 0.5s ease',
                      }} />
                    </Box>
                  </Box>
                )}

                {error && (
                  <Box sx={{ 
                    px: 4, 
                    py: 3, 
                    background: '#fef2f2', 
                    borderTop: '1px solid #fecaca',
                    width: '100%',
                  }}>
                    <Alert 
                      severity="error" 
                      variant="outlined"
                      sx={{ 
                        fontSize: '0.875rem',
                        background: 'transparent',
                        border: 'none',
                      }}
                    >
                      {error}
                    </Alert>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Fade>
      );
    }
    
    return null;
  };

  return (
    <Box sx={{ py: 3 }}>
      <Typography 
        variant="h6" 
        align="center" 
      
        sx={{ maxWidth: 600, mx: 'auto', mb: 4, color: theme.palette.primary.main }}
      >
        Extracting and verifying your identity information
      </Typography>

      {renderContent()}
    </Box>
  );
} 