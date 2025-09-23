'use client';

import React from 'react';
import { Box, Typography, Container, styled } from '@mui/material';
import Image from 'next/image';

const FooterContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  background: 'transparent',
  borderTop: '1px solid rgba(5, 36, 87, 0.1)',
  marginTop: theme.spacing(4),
}));

const FooterContent = styled(Container)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3, 2,0,2),
  gap: theme.spacing(1.5),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(0.5),
    padding: theme.spacing(2,2,-2,2),
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '80px',
  height: '24px',
  flexShrink: 0,
  [theme.breakpoints.down('sm')]: {
    width: '70px',
    height: '20px',
  },
}));

export default function Footer() {
  return (
    <FooterContainer>
      <FooterContent maxWidth="lg">
        <Typography
          variant="body2"
          sx={{
            color: '#052457',
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            fontWeight: 500,
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          Portal oficial del Gobierno de Panamá
        </Typography>
        
        <Typography
          variant="body2"
          sx={{
            color: '#666',
            fontSize: { xs: '0.7rem', sm: '0.8rem' },
            fontWeight: 400,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          Powered by:
          <LogoContainer>
            <Image
              src="/ryt-logo-color.svg"
              alt="RYT Logo"
              fill
              style={{ objectFit: 'contain' }}
            />
          </LogoContainer>
        </Typography>
      </FooterContent>
    </FooterContainer>
  );
}
