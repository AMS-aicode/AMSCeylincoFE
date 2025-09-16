import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  useMediaQuery,
  useTheme,
  FormHelperText
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { SelectChangeEvent } from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { getDropdownConfigs } from '../services/dropdownService';

// --- Types ---
interface BankDetailsFormProps {
  initialValues?: {
    bankName?: string;
    bankBranch?: string;
    accountType?: string;
    accountNumber?: string;
    passbookFile?: File | null;
  };
  onSubmit?: (values: {
    bankName: string;
    bankBranch: string;
    accountType: string;
    accountNumber: string;
    passbookFile: File | null;
  }) => void;
  onCancel?: () => void;
}

// Dummy data for dropdowns (replace with API data as needed)
const MAX_FILE_SIZE_MB = 1;

const validationSchema = Yup.object().shape({
  bankName: Yup.string().required('Please select a bank.'),
  bankBranch: Yup.string().required('Please select a branch.'),
  accountType: Yup.string().required('Please select an account type.'),
  accountNumber: Yup.string()
    .required('Account number is required.')
    .matches(/^\d{10,18}$/, 'Account number must be 10-18 digits.'),
  passbookFile: Yup.mixed()
    .required('Please upload a passbook PDF.')
    .test('fileType', 'Invalid file type. Only PDF allowed.', (value) => {
      if (!value) return false;
      return (value as File).type === 'application/pdf';
    })
    .test('fileSize', 'File size exceeded 1MB.', (value) => {
      if (!value) return false;
      return (value as File).size <= MAX_FILE_SIZE_MB * 1024 * 1024;
    }),
});

const BankDetailsForm: React.FC<BankDetailsFormProps> = ({ initialValues = {}, onSubmit, onCancel }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const navigate = useNavigate();

  const [dropdowns, setDropdowns] = useState({
    banks: [],
    bankBranches: [],
    accountTypes: [],
  });

  useEffect(() => {
    getDropdownConfigs().then((data) => {
      setDropdowns(prev => ({ ...prev, ...data }));
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      bankName: initialValues.bankName || '',
      bankBranch: initialValues.bankBranch || '',
      accountType: initialValues.accountType || '',
      accountNumber: initialValues.accountNumber || '',
      passbookFile: initialValues.passbookFile || null,
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit && onSubmit(values);
      // Removed navigation to /workstation-details; stage-based navigation should be handled by parent
    },
  });

  const handleBankChange = (e: SelectChangeEvent) => {
    formik.setFieldValue('bankName', e.target.value);
    formik.setFieldValue('bankBranch', '');
  };

  const handleBranchChange = (e: SelectChangeEvent) => {
    formik.setFieldValue('bankBranch', e.target.value);
  };

  const handleAccountTypeChange = (e: SelectChangeEvent) => {
    formik.setFieldValue('accountType', e.target.value);
  };

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    formik.setFieldValue('accountNumber', value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    formik.setFieldValue('passbookFile', file);
  };

  // Responsive grid columns
  const getGridCols = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  return (
    <Box
      sx={{
        background: '#fff',
        borderRadius: 2,
        p: { xs: 2, sm: 3, md: 4 },
        boxShadow: 2,
        maxWidth: 900,
        mx: 'auto',
        mt: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Typography variant="h6" color="primary" fontWeight={600} mb={2}>
        Registration Application <span style={{ color: '#888', fontWeight: 400 }}>Bank Details</span>
      </Typography>
      </Box>
      <form onSubmit={formik.handleSubmit} noValidate>
        <Grid container spacing={isMobile ? 2 : 3}>
          <Grid item={true} xs={12} sm={4}>
            <FormControl fullWidth variant="outlined" size="small" sx={{ minWidth: 200 }} error={!!formik.touched.bankName && !!formik.errors.bankName}>
              <InputLabel>Bank</InputLabel>
              <Select
                value={formik.values.bankName}
                label="Bank"
                onChange={handleBankChange}
                onBlur={formik.handleBlur}
                name="bankName"
              >
                {dropdowns.banks && dropdowns.banks.map((b) => (
                  <MenuItem key={b} value={b}>{b}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{formik.touched.bankName && formik.errors.bankName}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined" size="small" sx={{ minWidth: 200 }} error={!!formik.touched.bankBranch && !!formik.errors.bankBranch}>
              <InputLabel>Branch</InputLabel>
              <Select
                value={formik.values.bankBranch}
                label="Branch"
                onChange={handleBranchChange}
                onBlur={formik.handleBlur}
                name="bankBranch"
                disabled={!formik.values.bankName}
              >
                {dropdowns.bankBranches && dropdowns.bankBranches.map((br) => (
                  <MenuItem key={br} value={br}>{br}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{formik.touched.bankBranch && formik.errors.bankBranch}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined" size="small" sx={{ minWidth: 200 }} error={!!formik.touched.accountType && !!formik.errors.accountType}>
              <InputLabel>Account Type</InputLabel>
              <Select
                value={formik.values.accountType}
                label="Account Type"
                onChange={handleAccountTypeChange}
                onBlur={formik.handleBlur}
                name="accountType"
              >
                {dropdowns.accountTypes && dropdowns.accountTypes.map((a) => (
                  <MenuItem key={a} value={a}>{a}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{formik.touched.accountType && formik.errors.accountType}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={getGridCols() === 1 ? 12 : 6} md={6}>
            <TextField
              label="Account No."
              value={formik.values.accountNumber}
              onChange={handleAccountNumberChange}
              onBlur={formik.handleBlur}
              fullWidth
              required
              error={!!formik.touched.accountNumber && !!formik.errors.accountNumber}
              helperText={formik.touched.accountNumber && formik.errors.accountNumber}
              inputProps={{ maxLength: 18, inputMode: 'numeric', pattern: '[0-9]*' }}
              name="accountNumber"
            />
          </Grid>
          <Grid item xs={12} sm={getGridCols() === 1 ? 12 : 6} md={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 1,
                mt: 1,
              }}
            >
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon color="error" />}
                sx={{
                  color: 'error.main',
                  borderColor: 'error.main',
                  fontWeight: 600,
                  mb: 1,
                  '&:hover': { borderColor: 'error.dark', background: '#fff5f5' },
                }}
              >
                Upload Passbook
                <input
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={handleFileChange}
                  data-testid="passbook-upload"
                />
              </Button>
              <Box
                sx={{
                  border: '1px dashed #e53935',
                  borderRadius: 2,
                  width: '100%',
                  minHeight: 70,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#fff8f8',
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <CloudUploadIcon sx={{ fontSize: 36, color: 'error.main' }} />
                  <Typography variant="body2" color="error" fontWeight={500}>
                    Choose only .pdf file to upload
                  </Typography>
                  {formik.values.passbookFile && (
                    <Typography variant="caption" color="text.secondary">
                      {formik.values.passbookFile.name}
                    </Typography>
                  )}
                  {formik.touched.passbookFile && formik.errors.passbookFile && (
                    <Typography variant="caption" color="error">
                      {formik.errors.passbookFile as string}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'flex-end',
            gap: 2,
            mt: 4,
          }}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={onCancel}
            sx={{ minWidth: 120, fontWeight: 600 }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="error"
            type="submit"
            sx={{ minWidth: 120, fontWeight: 600 }}
            disabled={false}
          >
            Next
          </Button>
        </Box>
        {/* Defensive error boundary for file name and error display */}
        {formik.values.passbookFile && typeof formik.values.passbookFile === 'object' && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {formik.values.passbookFile && (formik.values.passbookFile as File).name ? (formik.values.passbookFile as File).name : ''}
            </Typography>
          </Box>
        )}
        {formik.touched.passbookFile && formik.errors.passbookFile && (
          <Typography variant="caption" color="error">
            {formik.errors.passbookFile as string}
          </Typography>
        )}
      </form>
    </Box>
  );
};

export default BankDetailsForm;
