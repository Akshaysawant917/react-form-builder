// src/pages/Home.tsx
import React from 'react';
import { Box, Typography, Button, Container, Card, Grid, Avatar, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  CreateOutlined,
  PreviewOutlined,
  DragIndicatorOutlined,
  CheckCircleOutlineOutlined,
  ArrowForwardOutlined
} from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();

  const handleCreateClick = () => {
    navigate('/create');
  };

  const features = [
    {
      icon: <CreateOutlined sx={{ fontSize: 40 }} />,
      title: 'Create Forms',
      description: 'Design custom forms with intuitive tools and professional layouts'
    },
    {
      icon: <DragIndicatorOutlined sx={{ fontSize: 40 }} />,
      title: 'Drag & Drop',
      description: 'Easily arrange and reorder form elements with simple gestures'
    },
    {
      icon: <PreviewOutlined sx={{ fontSize: 40 }} />,
      title: 'Live Preview',
      description: 'See your forms as you build them with real-time updates'
    },
    {
      icon: <CheckCircleOutlineOutlined sx={{ fontSize: 40 }} />,
      title: 'Validation',
      description: 'Add powerful validation rules to ensure data quality'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '90vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          position: 'relative',
          zIndex: 1,
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        {/* Hero Section */}
        <Box
          sx={{
            pt: { xs: 6, sm: 8, md: 12 },
            pb: { xs: 4, sm: 6, md: 8 },
            textAlign: 'center',
            color: 'white'
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem', lg: '4rem' },
              fontWeight: 700,
              mb: { xs: 2, md: 3 },
              background: 'linear-gradient(45deg, #ffffff 30%, #e8eaff 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 20px rgba(0,0,0,0.1)',
              lineHeight: 1.2
            }}
          >
            Professional Form Builder
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mb: { xs: 4, md: 6 },
              maxWidth: { xs: '100%', sm: 600, md: 700 },
              mx: 'auto',
              opacity: 0.95,
              fontWeight: 300,
              lineHeight: 1.6,
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
              px: { xs: 1, sm: 0 }
            }}
          >
            Create stunning, responsive forms with powerful validation and intuitive drag & drop functionality
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={handleCreateClick}
            endIcon={<ArrowForwardOutlined />}
            sx={{
              px: { xs: 4, sm: 6 },
              py: { xs: 1.5, sm: 2 },
              fontSize: { xs: '1rem', sm: '1.1rem' },
              fontWeight: 600,
              borderRadius: 3,
              background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              textTransform: 'none',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
                background: 'linear-gradient(45deg, #FF5252 30%, #26C6DA 90%)',
              }
            }}
          >
            Start Building Now
          </Button>
        </Box>

        {/* Features Section */}
        <Box sx={{ pb: { xs: 6, md: 8 } }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              textAlign: 'center',
              color: 'white',
              mb: { xs: 4, md: 6 },
              fontWeight: 600,
              opacity: 0.95,
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' }
            }}
          >
            Why Choose Our Form Builder?
          </Typography>

          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            sx={{
              justifyContent: 'center',
              alignItems: 'stretch'
            }}
          >
            {features.map((feature, index) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 6, lg: 3 }}
                key={index}
                sx={{ display: 'flex' }}
              >

                <Card
                  sx={{
                    p: { xs: 3, sm: 4 },
                    textAlign: 'center',
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      background: 'rgba(255, 255, 255, 0.15)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Box>
                    <Avatar
                      sx={{
                        width: { xs: 60, sm: 70, md: 80 },
                        height: { xs: 60, sm: 70, md: 80 },
                        mx: 'auto',
                        mb: { xs: 2, sm: 3 },
                        background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.2) 30%, rgba(255, 255, 255, 0.1) 90%)',
                        color: 'white'
                      }}
                    >
                      {feature.icon}
                    </Avatar>

                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        color: 'white',
                        mb: { xs: 1.5, sm: 2 },
                        fontWeight: 600,
                        fontSize: { xs: '1.1rem', sm: '1.25rem' }
                      }}
                    >
                      {feature.title}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: 1.6,
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Call to Action Section */}
        <Box
          sx={{
            textAlign: 'center',
            pb: { xs: 6, md: 8 }
          }}
        >
          <Card
            sx={{
              p: { xs: 4, sm: 6 },
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 4,
              maxWidth: { xs: '100%', sm: 600, md: 700 },
              mx: 'auto'
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                mb: { xs: 2, sm: 3 },
                fontWeight: 600,
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
              }}
            >
              Ready to Get Started?
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                mb: { xs: 3, sm: 4 },
                fontSize: { xs: '1rem', sm: '1.1rem' },
                lineHeight: 1.6,
                maxWidth: 500,
                mx: 'auto'
              }}
            >
              Join thousands of users who trust our form builder for their professional projects and streamline your workflow today
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center'
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={handleCreateClick}
                endIcon={<CreateOutlined />}
                sx={{
                  px: { xs: 4, sm: 5 },
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 3,
                  background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                  textTransform: 'none',
                  minWidth: { xs: '100%', sm: 'auto' },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                  }
                }}
              >
                Create Your First Form
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/myforms')}
                sx={{
                  px: { xs: 4, sm: 5 },
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 3,
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'white',
                  textTransform: 'none',
                  minWidth: { xs: '100%', sm: 'auto' },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'white',
                    background: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                View My Forms
              </Button>
            </Box>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;