import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Typography,
  FormHelperText,
  CircularProgress,
  Checkbox
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createPersonalDetails, updatePersonalDetails } from '../../services/personalDetailsService';
import { setApplicationId, getApplicationId } from '../../globalAppId';
import { getDropdownConfigs } from '../../services/dropdownService';

const initialState = {
  designation: '',
  title: '',
  initials: '',
  firstName: '',
  lastName: '',
  nameByInitials: '',
  civilStatus: '',
  hasChildren: '',
  nationality: '',
  dateOfBirth: '',
  passportNo: '',
  rejoin: '',
  preferredLanguage: '',
  nicNo: '',
  takafulAgent: '',
};

const validationSchema = Yup.object({
  designation: Yup.string().required('Required'),
  title: Yup.string().required('Required'),
  initials: Yup.string().max(10, 'Max 10 characters').required('Required'),
  firstName: Yup.string().max(50, 'Max 50 characters').required('Required'),
  lastName: Yup.string().max(50, 'Max 50 characters').required('Required'),
  nameByInitials: Yup.string().max(50, 'Max 50 characters').required('Required'),
  civilStatus: Yup.string().required('Required'),
  hasChildren: Yup.string().required('Required'),
  nationality: Yup.string().required('Required'),
  dateOfBirth: Yup.string()
    .required('Required')
    .test('age', 'Minimum age is 18 years', function (value) {
      if (!value) return false;
      const dob = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        return age - 1 >= 18;
      }
      return age >= 18;
    }),
  passportNo: Yup.string().max(9, 'Max 9 characters'),
  rejoin: Yup.string().required('Required'),
  preferredLanguage: Yup.string().required('Required'),
  nicNo: Yup.string()
    .required('Required')
    .matches(/^\d{9}[VvXx]$/, 'NIC must be 9 digits followed by V/X')
    .max(10, 'Max 10 characters'),
  takafulAgent: Yup.string().required('Required'),
});

export default function PersonalDetailsForm({ onNext, initialValues, applicationId }: { onNext?: (id?: string | number) => void, initialValues?: typeof initialState, applicationId?: string | number }) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [initialSnapshot, setInitialSnapshot] = useState(initialValues || initialState);
  const [dropdowns, setDropdowns] = useState({
    designations: [],
    titles: [],
    nationalities: [],
    languages: [],
    civilStatuses: [],
    // Add other dropdown keys if needed
  });
  const formik = useFormik({
    initialValues: initialValues || initialState,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      setSubmitError(null);
      console.log('Submitting Personal Details:', { applicationId, nicNo: values.nicNo });
      // Compare current values with initial snapshot
      const hasChanges = Object.keys(values).some(
        (key) => values[key as keyof typeof values] !== initialSnapshot[key as keyof typeof values]
      );
      if (!hasChanges) {
        // Use global applicationId if not passed
        const appId = applicationId || getApplicationId();
        if (onNext) onNext(appId);
        return;
      }
      try {
        const payload = {
          ...values,
          hasChildren: values.hasChildren === 'Yes',
          takafulAgent: values.takafulAgent === 'Yes',
          userId: 'HOB12345', // Replace with actual user ID if available
        };
        // Use global or prop applicationId
        const appId = applicationId || getApplicationId();
        console.log('Using Application ID:', appId);
        if (appId) {
          // Update existing application
          await updatePersonalDetails(Number(appId), payload);
          setApplicationId(Number(appId)); // set globally
          setInitialSnapshot(values); // Update snapshot after save
          if (onNext) onNext(appId);
        } else {
          // Create new application
          const response = await createPersonalDetails(payload);
          setApplicationId(response.applicationId); // set globally
          setInitialSnapshot(values); // Update snapshot after save
          if (onNext) onNext(response.applicationId || '1');
        }
      } catch (err: any) {
        setSubmitError(err?.response?.data?.error || 'Failed to save personal details.');
      }
    },
  });

  useEffect(() => {
    getDropdownConfigs().then((data) => {
      setDropdowns(prev => ({ ...prev, ...data }));
    });
  }, []);

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ background: '#fff', borderRadius: 2, p: { xs: 2, md: 4 }, boxShadow: 1, maxWidth: 1100, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Typography variant="h6" color="primary" fontWeight={700} mb={2}>
        Registration Application <span style={{ color: '#888', fontWeight: 400 }}>Personal Details</span>
      </Typography>
      </Box>
      <Grid container spacing={2} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        {/* Row 1 */}
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <FormControl fullWidth required error={formik.touched.designation && Boolean(formik.errors.designation)}>
            <InputLabel>Designation</InputLabel>
            <Select name="designation" value={formik.values.designation} label="Designation" onChange={formik.handleChange} onBlur={formik.handleBlur}>
              {dropdowns.designations && dropdowns.designations.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </Select>
            <FormHelperText>{formik.touched.designation && formik.errors.designation}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <FormControl fullWidth required error={formik.touched.title && Boolean(formik.errors.title)}>
            <InputLabel>Title</InputLabel>
            <Select name="title" value={formik.values.title} label="Title" onChange={formik.handleChange} onBlur={formik.handleBlur}>
              {dropdowns.titles && dropdowns.titles.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
            <FormHelperText>{formik.touched.title && formik.errors.title}</FormHelperText>
          </FormControl>
        </Grid>
        {/* Row 2 */}
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <TextField name="initials" label="Initials" value={formik.values.initials} onChange={formik.handleChange} onBlur={formik.handleBlur} required error={formik.touched.initials && Boolean(formik.errors.initials)} helperText={formik.touched.initials && formik.errors.initials} fullWidth inputProps={{ maxLength: 10 }} />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <TextField name="firstName" label="First Name" value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur} required error={formik.touched.firstName && Boolean(formik.errors.firstName)} helperText={formik.touched.firstName && formik.errors.firstName} fullWidth inputProps={{ maxLength: 50 }} />
        </Grid>
        {/* Row 3 */}
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <TextField name="lastName" label="Last Name" value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur} required error={formik.touched.lastName && Boolean(formik.errors.lastName)} helperText={formik.touched.lastName && formik.errors.lastName} fullWidth inputProps={{ maxLength: 50 }} />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <TextField name="nameByInitials" label="Name Denominated by Initials" value={formik.values.nameByInitials} onChange={formik.handleChange} onBlur={formik.handleBlur} required error={formik.touched.nameByInitials && Boolean(formik.errors.nameByInitials)} helperText={formik.touched.nameByInitials && formik.errors.nameByInitials} fullWidth inputProps={{ maxLength: 50 }} />
        </Grid>
        {/* Row 4 */}
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <FormControl fullWidth required error={formik.touched.civilStatus && Boolean(formik.errors.civilStatus)}>
            <InputLabel>Civil Status</InputLabel>
            <Select name="civilStatus" value={formik.values.civilStatus} label="Civil Status" onChange={formik.handleChange} onBlur={formik.handleBlur}>
              {dropdowns.civilStatuses && dropdowns.civilStatuses.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
            <FormHelperText>{formik.touched.civilStatus && formik.errors.civilStatus}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <FormControl fullWidth required error={formik.touched.nationality && Boolean(formik.errors.nationality)}>
            <InputLabel>Nationality</InputLabel>
            <Select name="nationality" value={formik.values.nationality} label="Nationality" onChange={formik.handleChange} onBlur={formik.handleBlur}>
              {dropdowns.nationalities && dropdowns.nationalities.map((n) => <MenuItem key={n} value={n}>{n}</MenuItem>)}
            </Select>
            <FormHelperText>{formik.touched.nationality && formik.errors.nationality}</FormHelperText>
          </FormControl>
        </Grid>
        {/* Row 5 */}
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <TextField name="dateOfBirth" label="Date Of Birth" type="date" value={formik.values.dateOfBirth} onChange={formik.handleChange} onBlur={formik.handleBlur} required error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)} helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth} fullWidth InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <FormControl required error={formik.touched.hasChildren && Boolean(formik.errors.hasChildren)} component="fieldset" fullWidth>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <Typography sx={{ mr: 2 }}>Children?</Typography>
              <RadioGroup row name="hasChildren" value={formik.values.hasChildren} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>
            <FormHelperText>{formik.touched.hasChildren && formik.errors.hasChildren}</FormHelperText>
          </FormControl>
        </Grid>
        {/* Row 6 */}
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <TextField name="nicNo" label="NIC No" value={formik.values.nicNo} onChange={formik.handleChange} onBlur={formik.handleBlur} required error={formik.touched.nicNo && Boolean(formik.errors.nicNo)} helperText={formik.touched.nicNo && formik.errors.nicNo} fullWidth inputProps={{ maxLength: 12 }} />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <TextField name="passportNo" label="Passport No" value={formik.values.passportNo} onChange={formik.handleChange} onBlur={formik.handleBlur} fullWidth inputProps={{ maxLength: 9 }} />
        </Grid>
        {/* Row 7 */}
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <FormControl required error={formik.touched.rejoin && Boolean(formik.errors.rejoin)} component="fieldset" fullWidth>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <Typography sx={{ mr: 2 }}>Rejoining?</Typography>
              <RadioGroup row name="rejoin" value={formik.values.rejoin} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>
            <FormHelperText>{formik.touched.rejoin && formik.errors.rejoin}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <FormControl fullWidth required error={formik.touched.preferredLanguage && Boolean(formik.errors.preferredLanguage)}>
            <InputLabel>Preferred Language</InputLabel>
            <Select name="preferredLanguage" value={formik.values.preferredLanguage} label="Preferred Language" onChange={formik.handleChange} onBlur={formik.handleBlur}>
              {dropdowns.languages && dropdowns.languages.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
            </Select>
            <FormHelperText>{formik.touched.preferredLanguage && formik.errors.preferredLanguage}</FormHelperText>
          </FormControl>
        </Grid>
        {/* Row 8 */}
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <FormControl required error={formik.touched.takafulAgent && Boolean(formik.errors.takafulAgent)} component="fieldset" fullWidth>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <Typography sx={{ mr: 2 }}>Takaful Agent?</Typography>
              <RadioGroup row name="takafulAgent" value={formik.values.takafulAgent} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>
            <FormHelperText>{formik.touched.takafulAgent && formik.errors.takafulAgent}</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, mt: 4, gap: 2 }}>
        <Button variant="outlined" color="secondary" disabled={formik.isSubmitting}>
          Save
        </Button>
        <Button type="submit" variant="contained" color="primary" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? <CircularProgress size={24} /> : 'Next'}
        </Button>
      </Box>
      {submitError && (
        <Typography color="error" sx={{ mt: 2 }}>{submitError}</Typography>
      )}
    </Box>
  );
}
