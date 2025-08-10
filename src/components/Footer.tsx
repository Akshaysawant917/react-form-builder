// src/components/Footer.tsx
import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        py: 3,
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #ddd',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Your Company. All rights reserved.{' '}
        <Link href="https://yourwebsite.com" target="_blank" rel="noopener noreferrer">
          Visit our website
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
