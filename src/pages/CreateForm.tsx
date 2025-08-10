import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addField,
    updateField,
    removeField,
    setFormName,
    saveForm,
    reorderFields,
} from '../features/formBuilder/formBuilderSlice';
import type { Field } from '../features/formBuilder/formBuilderSlice';
import type { RootState } from '../app/store';
import { v4 as uuidv4 } from 'uuid';

import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Switch,
    FormControlLabel,
    IconButton,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Checkbox,
    Typography,
    Paper,
    Container,
    Divider,
    Card,
    CardContent,
    CardHeader,
    Chip,

    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import Grid from '@mui/material/Grid';


import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import ListAltIcon from '@mui/icons-material/ListAlt';

const fieldTypes = [
    'text',
    'number',
    'textarea',
    'select',
    'radio',
    'checkbox',
    'date',
];

const CreateForm = () => {
    const dispatch = useDispatch();
    const fields = useSelector((state: RootState) => state.formBuilder.fields);
    const formName = useSelector((state: RootState) => state.formBuilder.formName);

    const [type, setType] = useState('text');
    const [alias, setAlias] = useState('');
    const [label, setLabel] = useState('');
    const [required, setRequired] = useState(false);
    const [defaultValue, setDefaultValue] = useState('');

    const [isDerived, setIsDerived] = useState(false);
    const [derivedParents, setDerivedParents] = useState<string[]>([]);
    const [formula, setFormula] = useState('');

    // New validation states
    const [notEmpty, setNotEmpty] = useState(false);
    const [minLength, setMinLength] = useState<number | ''>('');
    const [maxLength, setMaxLength] = useState<number | ''>('');
    const [emailFormat, setEmailFormat] = useState(false);
    const [passwordRule, setPasswordRule] = useState(false);

    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        if (editingId) {
            const field = fields.find((f) => f.id === editingId);
            if (field) {
                setType(field.type);
                setLabel(field.label);
                setRequired(field.required);
                setDefaultValue(field.defaultValue?.toString() || '');
                setAlias(field.alias || '');

                if (field.derived) {
                    setIsDerived(true);
                    setDerivedParents(field.derived.parents);
                    setFormula(field.derived.formula);
                } else {
                    setIsDerived(false);
                    setDerivedParents([]);
                    setFormula('');
                }

                // Load validation if exists
                const v = field.validation || {};
                setNotEmpty(!!v.notEmpty);
                setMinLength(v.minLength ?? '');
                setMaxLength(v.maxLength ?? '');
                setEmailFormat(!!v.email);
                setPasswordRule(!!v.passwordRule);
            }
        } else {
            // Reset validation when not editing
            setNotEmpty(false);
            setMinLength('');
            setMaxLength('');
            setEmailFormat(false);
            setPasswordRule(false);
        }
    }, [editingId, fields]);

    const resetFieldForm = () => {
        setType('text');
        setLabel('');
        setRequired(false);
        setDefaultValue('');
        setAlias('');
        setIsDerived(false);
        setDerivedParents([]);
        setFormula('');

        // Reset validation
        setNotEmpty(false);
        setMinLength('');
        setMaxLength('');
        setEmailFormat(false);
        setPasswordRule(false);

        setEditingId(null);
    };

    const handleAddOrUpdateField = () => {
        if (!label.trim()) {
            alert('Please enter a label');
            return;
        }
        if (isDerived) {
            if (derivedParents.length === 0) {
                alert('Select at least one parent field for derived field');
                return;
            }
            if (!formula.trim()) {
                alert('Enter a formula for the derived field');
                return;
            }
        }
        if (!alias.trim()) {
            alert('Please enter an alias for the field');
            return;
        }
        const aliasExists = fields.some(f => f.alias === alias && f.id !== editingId);
        if (aliasExists) {
            alert('Alias must be unique');
            return;
        }

        // Validate min/max length sanity
        if (minLength !== '' && maxLength !== '' && Number(minLength) > Number(maxLength)) {
            alert('Min length cannot be greater than max length');
            return;
        }

        const validationObj = {
            notEmpty,
            minLength: minLength === '' ? undefined : Number(minLength),
            maxLength: maxLength === '' ? undefined : Number(maxLength),
            email: emailFormat,
            passwordRule: passwordRule,
        };

        const fieldData: Field = {
            id: editingId || uuidv4(),
            type,
            label,
            required,
            alias: alias.trim(),
            defaultValue,
            derived: isDerived
                ? {
                    parents: derivedParents,
                    formula: formula.trim(),
                }
                : undefined,
            validation: (type === 'text' || type === 'textarea') ? validationObj : undefined,
        };

        if (editingId) {
            dispatch(updateField(fieldData));
        } else {
            dispatch(addField(fieldData));
        }

        resetFieldForm();
    };

    const handleEdit = (field: Field) => {
        setEditingId(field.id);
    };

    const handleDelete = (id: string) => {
        dispatch(removeField(id));
        if (id === editingId) {
            resetFieldForm();
        }
    };

    const handleFormNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setFormName(e.target.value));
    };

    const handleSaveForm = () => {
        if (!formName.trim()) {
            alert('Please enter a form name before saving.');
            return;
        }
        if (fields.length === 0) {
            alert('Add at least one field before saving the form.');
            return;
        }
        dispatch(saveForm());
        alert('Form saved successfully!');
        resetFieldForm();
    };

    const toggleParentField = (id: string) => {
        setDerivedParents((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const handleMoveUp = (index: number) => {
        if (index <= 0) return;
        dispatch(reorderFields({ fromIndex: index, toIndex: index - 1 }));
    };

    const handleMoveDown = (index: number) => {
        if (index >= fields.length - 1) return;
        dispatch(reorderFields({ fromIndex: index, toIndex: index + 1 }));
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            py: 6
        }}>
            <Container maxWidth="xl">
                {/* Header Section */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            fontWeight: 800,
                            color: 'white',
                            mb: 2,
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}
                    >
                        Form Builder Studio
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'rgba(255,255,255,0.9)',
                            maxWidth: 600,
                            mx: 'auto'
                        }}
                    >
                        Create dynamic forms with validation rules, derived fields, and custom configurations
                    </Typography>
                </Box>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, lg: 7 }}>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 2 }}>
                            {/* Form Configuration Card */}
                            <Card
                                elevation={8}
                                sx={{
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}
                            >
                                <CardHeader
                                    title={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{
                                                p: 1,
                                                borderRadius: 2,
                                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <SettingsIcon sx={{ color: 'white', fontSize: 20 }} />
                                            </Box>
                                            <Typography variant="h6" fontWeight={600}>
                                                Form Configuration
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{
                                        pb: 2,
                                        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                        borderBottom: '1px solid #e2e8f0'
                                    }}
                                />
                                <CardContent sx={{ pt: 3 }}>
                                    <TextField
                                        label="Form Name"
                                        value={formName}
                                        onChange={handleFormNameChange}
                                        fullWidth
                                        variant="outlined"
                                        placeholder="Enter a descriptive name for your form"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover fieldset': {
                                                    borderColor: '#667eea',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#667eea',
                                                },
                                            }
                                        }}
                                    />
                                </CardContent>
                            </Card>

                            {/* Field Builder Card */}
                            <Card
                                elevation={8}
                                sx={{
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}
                            >
                                <CardHeader
                                    title={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{
                                                p: 1,
                                                borderRadius: 2,
                                                background: editingId
                                                    ? 'linear-gradient(45deg, #f59e0b, #d97706)'
                                                    : 'linear-gradient(45deg, #10b981, #059669)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {editingId ?
                                                    <EditIcon sx={{ color: 'white', fontSize: 20 }} /> :
                                                    <AddIcon sx={{ color: 'white', fontSize: 20 }} />
                                                }
                                            </Box>
                                            <Typography variant="h6" fontWeight={600}>
                                                {editingId ? "Edit Field" : "Add New Field"}
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{
                                        pb: 2,
                                        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                        borderBottom: '1px solid #e2e8f0'
                                    }}
                                />

                                <CardContent sx={{ pt: 3 }}>
                                    {/* Basic Field Configuration */}
                                    <Box sx={{ mb: 4 }}>
                                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 3, color: '#374151' }}>
                                            Basic Information
                                        </Typography>
                                        <Grid container spacing={3}>
                                            <Grid size={{ xs: 12, sm: 6 }}>

                                                <FormControl fullWidth>
                                                    <InputLabel>Field Type</InputLabel>
                                                    <Select
                                                        value={type}
                                                        label="Field Type"
                                                        onChange={(e) => setType(e.target.value)}
                                                        disabled={isDerived}
                                                        sx={{ borderRadius: 2 }}
                                                    >
                                                        {fieldTypes.map((ft) => (
                                                            <MenuItem key={ft} value={ft}>
                                                                {ft.charAt(0).toUpperCase() + ft.slice(1)}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6 }}>

                                                <TextField
                                                    label="Label"
                                                    value={label}
                                                    onChange={(e) => setLabel(e.target.value)}
                                                    fullWidth
                                                    placeholder="e.g., Full Name"
                                                    required
                                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6 }}>

                                                <TextField
                                                    label="Alias"
                                                    value={alias}
                                                    onChange={(e) => setAlias(e.target.value)}
                                                    fullWidth
                                                    placeholder="e.g., fullName"
                                                    required
                                                    helperText="Unique identifier for form processing"
                                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6 }}>

                                                <TextField
                                                    label="Default Value"
                                                    value={defaultValue}
                                                    onChange={(e) => setDefaultValue(e.target.value)}
                                                    fullWidth
                                                    placeholder="Optional default value"
                                                    disabled={isDerived}
                                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    {/* Field Options */}
                                    <Box sx={{
                                        mb: 4,
                                        p: 3,
                                        borderRadius: 3,
                                        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                                        border: '1px solid #cbd5e1'
                                    }}>
                                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: '#374151' }}>
                                            Field Options
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={isDerived}
                                                        onChange={(e) => setIsDerived(e.target.checked)}
                                                        color="primary"
                                                    />
                                                }
                                                label="Derived Field"
                                            />

                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={required}
                                                        onChange={(e) => setRequired(e.target.checked)}
                                                        disabled={isDerived}
                                                        color="error"
                                                    />
                                                }
                                                label="Required"
                                            />
                                        </Box>
                                    </Box>

                                    {/* Derived Field Configuration */}
                                    {isDerived && (
                                        <Accordion
                                            elevation={2}
                                            sx={{
                                                mb: 3,
                                                borderRadius: 2,
                                                '&:before': { display: 'none' },
                                                border: '2px solid #3b82f6',
                                                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
                                            }}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                sx={{
                                                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                                    borderRadius: '8px 8px 0 0'
                                                }}
                                            >
                                                <Typography variant="subtitle1" fontWeight={600} color="#1e40af">
                                                    🔗 Derived Field Configuration
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails sx={{ pt: 3 }}>
                                                <Box sx={{ mb: 3 }}>
                                                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#1e40af' }}>
                                                        Select Parent Field(s):
                                                    </Typography>
                                                    {fields.length === 0 ? (
                                                        <Typography color="text.secondary" sx={{
                                                            p: 2,
                                                            textAlign: 'center',
                                                            borderRadius: 2,
                                                            backgroundColor: 'rgba(0,0,0,0.05)'
                                                        }}>
                                                            No fields available to select as parents
                                                        </Typography>
                                                    ) : (
                                                        <Box sx={{
                                                            maxHeight: 200,
                                                            overflowY: 'auto',
                                                            border: '1px solid #cbd5e1',
                                                            borderRadius: 2,
                                                            p: 1
                                                        }}>
                                                            {fields
                                                                .filter((f) => f.id !== editingId)
                                                                .map((f) => (
                                                                    <FormControlLabel
                                                                        key={f.id}
                                                                        control={
                                                                            <Checkbox
                                                                                checked={derivedParents.includes(f.id)}
                                                                                onChange={() => toggleParentField(f.id)}
                                                                                color="primary"
                                                                            />
                                                                        }
                                                                        label={`${f.label} (${f.type})`}
                                                                        sx={{
                                                                            display: 'block',
                                                                            mb: 1,
                                                                            p: 1,
                                                                            borderRadius: 1,
                                                                            '&:hover': {
                                                                                backgroundColor: 'rgba(59, 130, 246, 0.05)'
                                                                            }
                                                                        }}
                                                                    />
                                                                ))}
                                                        </Box>
                                                    )}
                                                </Box>

                                                <TextField
                                                    label="Formula"
                                                    value={formula}
                                                    onChange={(e) => setFormula(e.target.value)}
                                                    fullWidth
                                                    multiline
                                                    rows={3}
                                                    placeholder="Example: field1 + field2 * 0.1"
                                                    helperText="Use parent field aliases as variables in your formula"
                                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                />
                                            </AccordionDetails>
                                        </Accordion>
                                    )}

                                    {/* Validation Rules */}
                                    {(type === 'text' || type === 'textarea') && !isDerived && (
                                        <Accordion
                                            elevation={2}
                                            sx={{
                                                mb: 3,
                                                borderRadius: 2,
                                                '&:before': { display: 'none' },
                                                border: '2px solid #f59e0b',
                                                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
                                            }}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                sx={{
                                                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                                    borderRadius: '8px 8px 0 0'
                                                }}
                                            >
                                                <Typography variant="subtitle1" fontWeight={600} color="#92400e">
                                                    ✓ Validation Rules
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails sx={{ pt: 3 }}>
                                                <Grid container spacing={3} sx={{ mb: 3 }}>
                                                    <Grid size={{ xs: 12, sm: 6 }}>

                                                        <TextField
                                                            label="Min Length"
                                                            type="number"
                                                            value={minLength}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setMinLength(val === '' ? '' : Number(val));
                                                            }}
                                                            inputProps={{ min: 0 }}
                                                            fullWidth
                                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 6 }}>

                                                        <TextField
                                                            label="Max Length"
                                                            type="number"
                                                            value={maxLength}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setMaxLength(val === '' ? '' : Number(val));
                                                            }}
                                                            inputProps={{ min: 0 }}
                                                            fullWidth
                                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                        />
                                                    </Grid>
                                                </Grid>

                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={emailFormat}
                                                                onChange={(e) => setEmailFormat(e.target.checked)}
                                                                color="primary"
                                                            />
                                                        }
                                                        label="Email Format Validation"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={passwordRule}
                                                                onChange={(e) => setPasswordRule(e.target.checked)}
                                                                color="primary"
                                                            />
                                                        }
                                                        label="Custom Password Rule"
                                                    />
                                                </Box>
                                            </AccordionDetails>
                                        </Accordion>
                                    )}

                                    {/* Action Button */}
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={handleAddOrUpdateField}
                                        size="large"
                                        startIcon={editingId ? <EditIcon /> : <AddIcon />}
                                        sx={{
                                            mt: 2,
                                            py: 1.5,
                                            borderRadius: 3,
                                            background: editingId
                                                ? 'linear-gradient(45deg, #f59e0b, #d97706)'
                                                : 'linear-gradient(45deg, #10b981, #059669)',
                                            '&:hover': {
                                                background: editingId
                                                    ? 'linear-gradient(45deg, #d97706, #b45309)'
                                                    : 'linear-gradient(45deg, #059669, #047857)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                                            },
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        {editingId ? 'Update Field' : 'Add Field'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, lg: 5 }}>

                        <Card
                            elevation={8}
                            sx={{
                                borderRadius: 3,

                                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                                border: '1px solid rgba(255,255,255,0.2)',


                            }}
                        >
                            <CardHeader
                                title={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{
                                            p: 1,
                                            borderRadius: 2,
                                            background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <ListAltIcon sx={{ color: 'white', fontSize: 20 }} />
                                        </Box>
                                        <Typography variant="h6" fontWeight={600}>
                                            Form Fields ({fields.length})
                                        </Typography>
                                    </Box>
                                }
                                sx={{
                                    pb: 2,
                                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                    borderBottom: '1px solid #e2e8f0'
                                }}
                            />

                            <CardContent >
                                {fields.length === 0 ? (
                                    <Box sx={{
                                        textAlign: 'center',
                                        py: 8,
                                        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                                        borderRadius: 3,
                                        border: '2px dashed #cbd5e1'
                                    }}>
                                        <Box sx={{
                                            width: 80,
                                            height: 80,
                                            mx: 'auto',
                                            mb: 3,
                                            borderRadius: '50%',
                                            background: 'linear-gradient(45deg, #e2e8f0, #cbd5e1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <AddIcon sx={{ fontSize: 40, color: '#64748b' }} />
                                        </Box>
                                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                                            No fields added yet
                                        </Typography>
                                        <Typography variant="body2" color="text.disabled">
                                            Add your first field to start building your form
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{ mt: 2 }}>
                                        {fields.map((field, index) => (
                                            <Paper
                                                key={field.id}
                                                elevation={2}
                                                sx={{
                                                    mb: 2,
                                                    borderRadius: 3,
                                                    overflow: 'hidden',
                                                    border: editingId === field.id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                                    background: editingId === field.id
                                                        ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
                                                        : 'white',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                                                    }
                                                }}
                                            >
                                                <ListItem sx={{ py: 2.5, px: 3 }}>
                                                    <ListItemText
                                                        primary={
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                                                <Typography variant="subtitle1" fontWeight={700} color="#1f2937">
                                                                    {field.label}
                                                                </Typography>
                                                                <Chip
                                                                    label={field.type}
                                                                    size="small"
                                                                    sx={{
                                                                        background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
                                                                        color: 'white',
                                                                        fontWeight: 600,
                                                                        fontSize: '0.75rem'
                                                                    }}
                                                                />
                                                                {field.required && (
                                                                    <Chip
                                                                        label="Required"
                                                                        size="small"
                                                                        sx={{
                                                                            background: 'linear-gradient(45deg, #ef4444, #dc2626)',
                                                                            color: 'white',
                                                                            fontWeight: 600,
                                                                            fontSize: '0.75rem'
                                                                        }}
                                                                    />
                                                                )}
                                                                {field.derived && (
                                                                    <Chip
                                                                        label="Derived"
                                                                        size="small"
                                                                        sx={{
                                                                            background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
                                                                            color: 'white',
                                                                            fontWeight: 600,
                                                                            fontSize: '0.75rem'
                                                                        }}
                                                                    />
                                                                )}
                                                            </Box>
                                                        }
                                                        secondary={
                                                            <Box>
                                                                <Typography variant="body2" color="#6b7280" sx={{ fontWeight: 500 }}>
                                                                    <strong>Alias:</strong> {field.alias}
                                                                </Typography>
                                                                {field.derived && (
                                                                    <Typography variant="body2" color="#6b7280" sx={{ mt: 0.5, fontWeight: 500 }}>
                                                                        <strong>Parents:</strong> {field.derived.parents.join(', ')}
                                                                    </Typography>
                                                                )}
                                                                {field.validation && (
                                                                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                        {field.validation.minLength && (
                                                                            <Chip label={`Min: ${field.validation.minLength}`} size="small" variant="outlined" />
                                                                        )}
                                                                        {field.validation.maxLength && (
                                                                            <Chip label={`Max: ${field.validation.maxLength}`} size="small" variant="outlined" />
                                                                        )}
                                                                        {field.validation.email && (
                                                                            <Chip label="Email" size="small" variant="outlined" color="primary" />
                                                                        )}
                                                                    </Box>
                                                                )}
                                                            </Box>
                                                        }
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                            <IconButton
                                                                onClick={() => handleMoveUp(index)}
                                                                disabled={index === 0}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: index === 0 ? 'transparent' : 'rgba(99, 102, 241, 0.1)',
                                                                    '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.2)' },
                                                                    color: index === 0 ? '#9ca3af' : '#6366f1'
                                                                }}
                                                            >
                                                                <ArrowUpwardIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={() => handleMoveDown(index)}
                                                                disabled={index === fields.length - 1}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: index === fields.length - 1 ? 'transparent' : 'rgba(99, 102, 241, 0.1)',
                                                                    '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.2)' },
                                                                    color: index === fields.length - 1 ? '#9ca3af' : '#6366f1'
                                                                }}
                                                            >
                                                                <ArrowDownwardIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={() => handleEdit(field)}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                                                    '&:hover': { backgroundColor: 'rgba(245, 158, 11, 0.2)' },
                                                                    color: '#f59e0b'
                                                                }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={() => handleDelete(field.id)}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                                                    '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
                                                                    color: '#ef4444'
                                                                }}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            </Paper>
                                        ))}
                                    </Box>
                                )}

                                <Divider sx={{ my: 4, borderColor: '#e2e8f0' }} />

                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleSaveForm}
                                    size="large"
                                    startIcon={<SaveIcon />}
                                    disabled={!formName.trim() || fields.length === 0}
                                    sx={{
                                        py: 2,
                                        borderRadius: 3,
                                        background: 'linear-gradient(45deg, #059669, #047857)',
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        textTransform: 'none',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #047857, #065f46)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 25px rgba(5, 150, 105, 0.4)'
                                        },
                                        '&:disabled': {
                                            background: 'linear-gradient(45deg, #9ca3af, #6b7280)',
                                            color: '#d1d5db'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Save Form
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default CreateForm;