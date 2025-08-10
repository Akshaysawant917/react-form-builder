import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { useSearchParams } from 'react-router-dom';

import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
    Typography,
    Paper,
    Container,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Alert,
    Chip,
    Avatar,
    CircularProgress,
} from '@mui/material';

import {
    PreviewOutlined,
    ErrorOutlineOutlined,
    CheckCircleOutlined,
    VisibilityOutlined,
} from '@mui/icons-material';

interface FormField {
    id: string;
    type: string;
    label: string;
    required: boolean;
    alias?: string;
    defaultValue?: any;
    validation?: {
        notEmpty?: boolean;
        minLength?: number;
        maxLength?: number;
        email?: boolean;
        passwordRule?: boolean;
    };
    derived?: {
        parents: string[];
        formula: string;
    };
    parents?: string[];
    formula?: string; // you can extend to real logic later
}

const PreviewForm = () => {
    const [searchParams] = useSearchParams();
    const formId = searchParams.get('formId');

    const savedForms = useSelector((state: RootState) => state.formBuilder.savedForms);

    const [formFields, setFormFields] = useState<FormField[]>([]);
    const [formValues, setFormValues] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formName, setFormName] = useState<string>('');

    // Load form schema by formId
    useEffect(() => {
        if (!formId) return;
        const form = savedForms.find((f) => f.id === formId);
        if (form) {
            setFormFields(form.fields);
            setFormName(form.name);
            // Initialize values with defaultValue or empty string
            const initialValues: Record<string, any> = {};
            form.fields.forEach((field: FormField) => {
                initialValues[field.id] = field.defaultValue || '';
            });
            setFormValues(initialValues);
        }
    }, [formId, savedForms]);

    // Simple validation function
    const validateField = (field: FormField, value: any): string => {
        if (field.required && (!value || value.toString().trim() === '')) {
            return 'This field is required';
        }
        if (field.validation) {
            if (field.validation.minLength && value.length < field.validation.minLength) {
                return `Minimum length is ${field.validation.minLength}`;
            }
            if (field.validation.maxLength && value.length > field.validation.maxLength) {
                return `Maximum length is ${field.validation.maxLength}`;
            }
            if (field.validation.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return 'Invalid email format';
                }
            }
            if (field.validation.passwordRule) {
                const passRegex = /^(?=.*[0-9]).{8,}$/;
                if (!passRegex.test(value)) {
                    return 'Password must be minimum 8 characters and contain a number';
                }
            }
        }
        return '';
    };

    function computeDerivedValue(formula: string, values: Record<string, any>, formFields: any[]) {
        let expr = formula;

        formFields.forEach((field) => {
            const alias = field.alias || field.id;
            let value = values[field.id];

            // If value is empty or null, default to 0 for math
            if (value === '' || value === undefined || value === null) {
                value = 0;
            }

            // Replace alias in the formula with the safe value
            expr = expr.replace(new RegExp(alias, 'g'), value);
        });

        try {
            // eslint-disable-next-line no-eval
            return eval(expr);
        } catch (err) {
            console.error('Eval error:', err);
            return '';
        }
    }

    // Handle input change
    const handleChange = (field: FormField, value: any) => {
        setFormValues((prev) => {
            const updatedValues = { ...prev, [field.id]: value };

            formFields.forEach((f) => {
                if (
                    f.derived?.parents && // makes sure parents exists
                    f.derived.formula &&
                    f.derived.parents.includes(field.id)
                ) {
                    const derivedVal = computeDerivedValue(f.derived.formula, updatedValues, formFields);
                    updatedValues[f.id] = derivedVal;
                }
            });

            return updatedValues;
        });

        // Validate on change
        const errorMsg = validateField(field, value);
        setErrors((prev) => ({ ...prev, [field.id]: errorMsg }));
    };

    // Render input based on type
    const renderField = (field: FormField) => {
        const value = formValues[field.id] ?? '';
        const error = errors[field.id] ?? '';
        const isDerived = !!field.derived;

        const fieldWrapper = (children: React.ReactNode) => (
            <Card 
                variant="outlined" 
                sx={{ 
                    mb: 3,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        borderColor: 'primary.main',
                    },
                    ...(isDerived && {
                        background: 'linear-gradient(135deg, #f8f9ff 0%, #e8eeff 100%)',
                        borderColor: 'secondary.main',
                    })
                }}
            >
                <CardContent sx={{ py: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: isDerived ? 1 : 0 }}>
                        {children}
                        {isDerived && (
                            <Chip 
                                label="Auto-calculated" 
                                size="small" 
                                color="secondary" 
                                variant="outlined"
                                sx={{ ml: 2 }}
                            />
                        )}
                    </Box>
                    {isDerived && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            This field is automatically calculated based on other form values
                        </Typography>
                    )}
                </CardContent>
            </Card>
        );

        switch (field.type) {
            case 'text':
            case 'number':
            case 'date':
                return fieldWrapper(
                    <TextField
                        type={field.type}
                        label={field.label}
                        value={value}
                        onChange={(e) => handleChange(field, e.target.value)}
                        error={!!error}
                        helperText={error}
                        fullWidth
                        required={field.required}
                        disabled={isDerived}
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: isDerived ? 'grey.50' : 'white',
                            }
                        }}
                    />
                );
            case 'textarea':
                return fieldWrapper(
                    <TextField
                        label={field.label}
                        value={value}
                        onChange={(e) => handleChange(field, e.target.value)}
                        error={!!error}
                        helperText={error}
                        fullWidth
                        multiline
                        rows={4}
                        required={field.required}
                        disabled={isDerived}
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: isDerived ? 'grey.50' : 'white',
                            }
                        }}
                    />
                );
            case 'select':
                return fieldWrapper(
                    <FormControl fullWidth required={field.required} error={!!error}>
                        <InputLabel>{field.label}</InputLabel>
                        <Select
                            value={value}
                            label={field.label}
                            onChange={(e) => handleChange(field, e.target.value)}
                            disabled={isDerived}
                            sx={{
                                backgroundColor: isDerived ? 'grey.50' : 'white',
                            }}
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="option1">Option 1</MenuItem>
                            <MenuItem value="option2">Option 2</MenuItem>
                        </Select>
                        {error && <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>{error}</Typography>}
                    </FormControl>
                );
            case 'radio':
                return fieldWrapper(
                    <FormControl component="fieldset" fullWidth required={field.required} error={!!error}>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                            {field.label}
                        </Typography>
                        <RadioGroup
                            value={value}
                            onChange={(e) => handleChange(field, e.target.value)}
                            sx={{ ml: 1 }}
                        >
                            <FormControlLabel 
                                value="option1" 
                                control={<Radio disabled={isDerived} />} 
                                label="Option 1" 
                            />
                            <FormControlLabel 
                                value="option2" 
                                control={<Radio disabled={isDerived} />} 
                                label="Option 2" 
                            />
                        </RadioGroup>
                        {error && <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>{error}</Typography>}
                    </FormControl>
                );
            case 'checkbox':
                return fieldWrapper(
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={!!value}
                                onChange={(e) => handleChange(field, e.target.checked)}
                                disabled={isDerived}
                            />
                        }
                        label={field.label}
                        sx={{ ml: 0 }}
                    />
                );
            default:
                return null;
        }
    };

    if (!formId) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 6, 
                        textAlign: 'center',
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%)',
                    }}
                >
                    <Avatar
                        sx={{
                            width: 64,
                            height: 64,
                            mx: 'auto',
                            mb: 3,
                            bgcolor: 'error.main',
                        }}
                    >
                        <ErrorOutlineOutlined sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Typography variant="h5" gutterBottom fontWeight={600}>
                        No Form Selected
                    </Typography>
                    <Typography color="text.secondary">
                        Please select a form from your saved forms to preview it.
                    </Typography>
                </Paper>
            </Container>
        );
    }

    if (formFields.length === 0) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 6, 
                        textAlign: 'center',
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f0ff 100%)',
                    }}
                >
                    <CircularProgress size={48} sx={{ mb: 3, color: 'primary.main' }} />
                    <Typography variant="h5" gutterBottom fontWeight={600}>
                        Loading Form
                    </Typography>
                    <Typography color="text.secondary">
                        Please wait while we load your form data...
                    </Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Form Header */}
            <Card elevation={3} sx={{ mb: 4 }}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <PreviewOutlined />
                        </Avatar>
                    }
                    title={
                        <Typography variant="h5" fontWeight={600}>
                            {formName}
                        </Typography>
                    }
                    subheader={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                            <Chip 
                                label={`${formFields.length} fields`} 
                                size="small" 
                                color="primary" 
                                variant="outlined" 
                            />
                            <Chip 
                                icon={<VisibilityOutlined />}
                                label="Preview Mode" 
                                size="small" 
                                color="secondary" 
                                variant="outlined" 
                            />
                        </Box>
                    }
                    sx={{ pb: 2 }}
                />
                <Divider />
                <CardContent>
                    <Alert 
                        severity="info" 
                        icon={<CheckCircleOutlined />}
                        sx={{ 
                            backgroundColor: 'info.50',
                            '& .MuiAlert-icon': {
                                color: 'info.main'
                            }
                        }}
                    >
                        This is a preview of your form. All fields are functional but submission is disabled.
                    </Alert>
                </CardContent>
            </Card>

            {/* Form Content */}
            <Card elevation={2}>
                <CardContent sx={{ p: 4 }}>
                    <Box component="form" noValidate>
                        {formFields.map((field) => (
                            <Box key={field.id}>
                                {renderField(field)}
                            </Box>
                        ))}

                        <Divider sx={{ my: 4 }} />

                        {/* Submit Section */}
                        <Box sx={{ textAlign: 'center' }}>
                            <Button 
                                variant="contained" 
                                size="large"
                                disabled
                                sx={{
                                    px: 6,
                                    py: 1.5,
                                    borderRadius: 3,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                }}
                            >
                                Submit Form (Preview Only)
                            </Button>
                            <Typography 
                                variant="caption" 
                                color="text.secondary" 
                                sx={{ display: 'block', mt: 2 }}
                            >
                                Form submission is disabled in preview mode
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default PreviewForm;