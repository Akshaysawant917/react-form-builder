// src/components/Footer.tsx
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #ddd',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} instantfreetools. All rights reserved.{' '}
        <Link href="https://forms.instantfreetools.com/" target="_blank" rel="noopener noreferrer">
          Visit our website
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
