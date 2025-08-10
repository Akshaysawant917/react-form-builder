import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Avatar, 
  Chip, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  CreateOutlined,
  FolderOutlined,
  BuildOutlined,
  MenuOutlined,
  CloseOutlined,
} from '@mui/icons-material';

const NavBar = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    {
      label: 'Home',
      path: '/',
      icon: <HomeOutlined sx={{ fontSize: 18 }} />
    },
    {
      label: 'Create Form',
      path: '/create',
      icon: <CreateOutlined sx={{ fontSize: 18 }} />
    },
    {
      label: 'My Forms',
      path: '/myforms',
      icon: <FolderOutlined sx={{ fontSize: 18 }} />
    }
  ];

  return (
    <>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          {/* Logo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Avatar
              sx={{
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
                mr: { xs: 1, sm: 2 },
                background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.2) 30%, rgba(255, 255, 255, 0.1) 90%)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <BuildOutlined sx={{ color: 'white', fontSize: { xs: 16, sm: 20 } }} />
            </Avatar>
            <Box>
              <Typography 
                variant="h6" 
                component={Link}
                to="/"
                sx={{ 
                  fontWeight: 700,
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  background: 'linear-gradient(45deg, #ffffff 30%, #e8eaff 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  '&:hover': {
                    textShadow: '0 0 20px rgba(255,255,255,0.5)',
                  }
                }}
              >
                Form Builder
              </Typography>
              {!isMobile && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.7rem',
                    letterSpacing: 1,
                    textTransform: 'uppercase'
                  }}
                >
                  Professional Forms
                </Typography>
              )}
            </Box>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <Button
                    key={item.path}
                    color="inherit"
                    component={Link}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      px: 3,
                      py: 1,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      fontWeight: isActive ? 700 : 500,
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      color: isActive ? 'white' : 'rgba(255, 255, 255, 0.9)',
                      background: isActive 
                        ? 'rgba(255, 255, 255, 0.2)' 
                        : 'transparent',
                      backdropFilter: isActive ? 'blur(10px)' : 'none',
                      border: isActive 
                        ? '1px solid rgba(255, 255, 255, 0.3)' 
                        : '1px solid transparent',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      },
                      '& .MuiButton-startIcon': {
                        marginRight: 1,
                      }
                    }}
                  >
                    {item.label}
                    {isActive && (
                      <Chip
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          height: 16,
                          width: 16,
                          minWidth: 16,
                          borderRadius: '50%',
                          background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                          '& .MuiChip-label': {
                            display: 'none'
                          }
                        }}
                        label=""
                      />
                    )}
                  </Button>
                );
              })}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              sx={{
                color: 'white',
                background: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              <MenuOutlined />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            Menu
          </Typography>
          <IconButton 
            onClick={handleDrawerToggle}
            sx={{ color: 'white' }}
          >
            <CloseOutlined />
          </IconButton>
        </Box>
        
        <List sx={{ px: 2 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <ListItem 
                key={item.path}
                component={Link}
                to={item.path}
                onClick={handleDrawerToggle}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  color: 'white',
                  textDecoration: 'none',
                  background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 500,
                  }}
                />
                {isActive && (
                  <Chip
                    size="small"
                    sx={{
                      height: 12,
                      width: 12,
                      minWidth: 12,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                      '& .MuiChip-label': {
                        display: 'none'
                      }
                    }}
                    label=""
                  />
                )}
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </>
  );
};

export default NavBar;