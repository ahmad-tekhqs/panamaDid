import React from 'react';
import { Box, Typography, LinearProgress, Tooltip, styled, alpha } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { useDIDContext } from '../../context/DIDContext';

const ScoreContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '12px 20px',
  borderRadius: '12px',
  background: alpha('#D4E6FF', 1),
  border: `1px solid ${alpha('#5e35b1', 0.1)}`,
  marginBottom: '0.5rem',
  width: '100%',
  maxWidth: '300px',
  margin: '0 auto 1rem',
}));

const ScoreProgressWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  marginTop: '8px',
  position: 'relative',
}));

const getScoreColor = (score: number) => {
  //D8131B
  if (score < 30) return '#D8131B';
  if (score < 40) return '#ff9800'; // Orange for low scores
  if (score <= 60) return '#42a5f5'; // Blue for medium scores
  if (score <= 85) return '#4EDA5F'; // light green for medium scores
  if (score <= 100) return '#0B4EBD'; // Green for high scores
  return '#0B4EBD'; // Purple for very high scores
};

const ScoreTooltip = ({ score }: { score: number }) => {
  const getVerificationStatus = () => {
    if (score < 25) return 'Initial verification';
    if (score < 50) return 'Basic verification';
    if (score < 75) return 'Enhanced verification';
    return 'Advanced verification';
  };

  return (
    <Box>
      <Typography variant="body2" fontWeight={500}>
        {getVerificationStatus()}
      </Typography>
      <Typography variant="caption">
        Score: {score}/100
      </Typography>
    </Box>
  );
};

const VerificationScoreDisplay: React.FC = () => {
  const { state } = useDIDContext();
  const { didVerificationScore } = state;
  
  const scoreColor = getScoreColor(didVerificationScore);

  return (
    <ScoreContainer>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SecurityIcon 
            sx={{ 
              color: scoreColor,
              mr: 0.5,
              fontSize: '1.2rem'
            }} 
          />
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 700,
              fontSize: '1rem',
              color: '#052457'
            }}
          >
            Verification Score
          </Typography>
        </Box>
        <Tooltip title={<ScoreTooltip score={didVerificationScore} />} arrow>
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 700,
              color: scoreColor
            }}
          >
            {didVerificationScore}%
          </Typography>
        </Tooltip>
      </Box>
      
      <ScoreProgressWrapper>
        <LinearProgress
          variant="determinate"
          value={didVerificationScore}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: alpha('#000', 0.05),
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              backgroundColor: scoreColor,
            }
          }}
        />
      </ScoreProgressWrapper>
    </ScoreContainer>
  );
};

export default VerificationScoreDisplay; 