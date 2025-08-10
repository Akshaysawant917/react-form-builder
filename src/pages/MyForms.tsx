import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { useNavigate } from 'react-router-dom';

import {
  Typography,
  Box,
  Container,
  Card,
  CardContent,
  Paper,
  Avatar,
  Chip,
  IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  DescriptionOutlined,
  VisibilityOutlined,
  CalendarTodayOutlined,
  FolderOpenOutlined,
  AddCircleOutlineOutlined,
} from '@mui/icons-material';

const MyForms = () => {
  const savedForms = useSelector((state: RootState) => state.formBuilder.savedForms);
  const navigate = useNavigate();

  const openPreview = (id: string) => {
    navigate(`/preview?formId=${id}`);
  };

  const handleCreateNew = () => {
    navigate('/create');
  };

  if (savedForms.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 30% 70%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)',
                pointerEvents: 'none',
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 3,
                  bgcolor: 'primary.main',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                <FolderOpenOutlined sx={{ fontSize: 40 }} />
              </Avatar>

              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 2
                }}
              >
                No Forms Yet
              </Typography>

              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}
              >
                Create your first form to get started with our powerful form builder
              </Typography>

              <Box
                component="button"
                onClick={handleCreateNew}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 4,
                  py: 2,
                  borderRadius: 3,
                  border: 'none',
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                  }
                }}
              >
                <AddCircleOutlineOutlined />
                Create Your First Form
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            mb: 1
          }}
        >
          My Forms
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage and preview your saved forms
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {savedForms.map((form) => (
          <Grid key={form.id} size={{ xs: 12, sm: 12, md: 4, lg: 3 }}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                }
              }}
              onClick={() => openPreview(form.id)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      mr: 2,
                      bgcolor: 'primary.main',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    <DescriptionOutlined />
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {form.name}
                    </Typography>
                    <Chip
                      label={`${form.fields?.length || 0} fields`}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 3,
                    color: 'text.secondary'
                  }}
                >
                  <CalendarTodayOutlined sx={{ fontSize: 16 }} />
                  <Typography variant="body2">
                    {new Date(form.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pt: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Click to preview
                  </Typography>
                  <IconButton
                    size="small"
                    color="primary"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      }
                    }}
                  >
                    <VisibilityOutlined fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Add New Form Card */}
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 3 }}>
          <Card
            elevation={1}
            sx={{
              height: '100%',
              minHeight: 280,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed',
              borderColor: 'primary.main',
              backgroundColor: 'primary.50',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'primary.100',
                transform: 'translateY(-2px)',
              }
            }}
            onClick={handleCreateNew}
          >
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                }}
              >
                <AddCircleOutlineOutlined sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography
                variant="h6"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Create New Form
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Build a new form from scratch
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MyForms;