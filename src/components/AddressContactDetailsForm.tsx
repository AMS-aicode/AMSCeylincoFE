import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Grid
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getDropdownConfigs } from '../services/dropdownService';

// Props for onboarding integration
interface AddressContactDetailsFormProps {
  onNext: (values: any) => void;
  onBack: () => void;
  initialValues?: any;
}

const defaultValues = {
  email: '',
  mobile: '',
  whatsapp: '',
  emergency: '',
  permAddress1: '',
  permAddress2: '',
  permCity: '',
  permProvince: '',
  permDistrict: '',
  permElectorate: '',
  permGramaNiladari: '',
  permDSecretariat: '',
  permPostalCode: '',
  sameAsPermanent: false,
  corrAddress1: '',
  corrAddress2: '',
  corrCity: '',
  province: '',
  district: '',
  electorate: '',
  gramaNiladari: '',
  dSecretariat: '',
  postalCode: '',
};

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  mobile: Yup.string()
    .required('Required')
    .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
  whatsapp: Yup.string()
    .matches(/^\d{10}$/, 'WhatsApp number must be exactly 10 digits')
    .nullable(),
  emergency: Yup.string()
    .matches(/^\d{10}$/, 'Emergency number must be exactly 10 digits')
    .nullable(),
  permAddress1: Yup.string().required('Required'),
  permAddress2: Yup.string(),
  permCity: Yup.string().required('Required'),
  permProvince: Yup.string().required('Required'),
  permDistrict: Yup.string().required('Required'),
  permElectorate: Yup.string().required('Required'),
  permGramaNiladari: Yup.string().required('Required'),
  permDSecretariat: Yup.string().required('Required'),
  permPostalCode: Yup.string().required('Required'),
  corrAddress1: Yup.string().required('Required'),
  corrAddress2: Yup.string(),
  corrCity: Yup.string().required('Required'),
  province: Yup.string().required('Required'),
  district: Yup.string().required('Required'),
  electorate: Yup.string().required('Required'),
  gramaNiladari: Yup.string().required('Required'),
  dSecretariat: Yup.string().required('Required'),
  postalCode: Yup.string().required('Required'),
});

function mapAddressContactDetailsToForm(data: any) {
  if (!data) return undefined;
  return {
    email: data.email || '',
    mobile: data.contactMobile || '',
    whatsapp: data.contactWhatsApp || '',
    emergency: data.contactEmergency || '',
    permAddress1: data.permanentAddressLine1 || '',
    permAddress2: data.permanentAddressLine2 || '',
    permCity: data.permanentCityTown || '',
    permProvince: data.permanentProvince || '',
    permDistrict: data.permanentDistrict || '',
    permElectorate: data.permanentElectorate || '',
    permGramaNiladari: data.permanentGramaNiladari || '',
    permDSecretariat: data.permanentDSecretariat || '',
    permPostalCode: data.permanentPostalCode || '',
    sameAsPermanent: data.isCorrespondenceSameAsPermanent || false,
    corrAddress1: data.correspondenceAddressLine1 || '',
    corrAddress2: data.correspondenceAddressLine2 || '',
    corrCity: data.correspondenceCityTown || '',
    province: data.correspondenceProvince || '',
    district: data.correspondenceDistrict || '',
    electorate: data.correspondenceElectorate || '',
    gramaNiladari: data.correspondenceGramaNiladari || '',
    dSecretariat: data.correspondenceDSecretariat || '',
    postalCode: data.correspondencePostalCode || '',
  };
}

const AddressContactDetailsForm: React.FC<AddressContactDetailsFormProps> = ({ onNext, onBack, initialValues }) => {
  const formik = useFormik({
    initialValues: initialValues || defaultValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onNext(values);
    },
  });

  const [corrDisabled, setCorrDisabled] = React.useState(false);
  const handleSameAsPermanentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    formik.setFieldValue('sameAsPermanent', checked);
    setCorrDisabled(checked);
    if (checked) {
      formik.setFieldValue('corrAddress1', formik.values.permAddress1);
      formik.setFieldValue('corrAddress2', formik.values.permAddress2);
      formik.setFieldValue('corrCity', formik.values.permCity);
      formik.setFieldValue('province', formik.values.permProvince);
      formik.setFieldValue('district', formik.values.permDistrict);
      formik.setFieldValue('electorate', formik.values.permElectorate);
      formik.setFieldValue('gramaNiladari', formik.values.permGramaNiladari);
      formik.setFieldValue('dSecretariat', formik.values.permDSecretariat);
      formik.setFieldValue('postalCode', formik.values.permPostalCode);
    }
  };

  // Helper to handle permanent address changes
  const handlePermanentAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    formik.handleChange(e);
    // If correspondence is same as permanent, uncheck it
    if (formik.values.sameAsPermanent) {
      formik.setFieldValue('sameAsPermanent', false);
      setCorrDisabled(false);
    }
  };

  React.useEffect(() => {
    if (formik.values.sameAsPermanent) {
      setCorrDisabled(true);
    } else {
      setCorrDisabled(false);
    }
  }, [formik.values.sameAsPermanent]);

  // In AddressContactDetailsForm, add useEffect to update formik fields when initialValues change
  React.useEffect(() => {
    if (initialValues) {
      formik.setValues(initialValues);
    }
    // If sameAsPermanent is true, disable correspondence fields
    if (initialValues && initialValues.sameAsPermanent) {
      setCorrDisabled(true);
    }
  }, [initialValues]);

  const [dropdowns, setDropdowns] = React.useState({
    addressLine2: [],
    cityTown: [],
    province: [],
    district: [],
    electorate: [],
    gramaNiladari: [],
    dSecretariat: [],
    postalCode: [],
  });

  React.useEffect(() => {
    getDropdownConfigs().then((data) => {
      setDropdowns(prev => ({ ...prev, ...data }));
    });
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: 1100, mx: 'auto', mt: { xs: 1, sm: 2 }, mb: { xs: 2, sm: 4 } }}>
      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#fff', borderRadius: 2 }}>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          {/* Contact Details */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mr: 1 ,mb: 2}}>
                          Registration Application
          </Typography>
          <Typography variant="h6" sx={{ color: '#888', fontWeight: 400 ,mb: 2}}>
            Contact Details
          </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
            <Box>
              <TextField
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!formik.touched.email && typeof formik.errors.email === 'string'}
                helperText={formik.touched.email && typeof formik.errors.email === 'string' ? formik.errors.email : ''}
                fullWidth
              />
            </Box>
            <Box>
              <TextField
                name="mobile"
                label="Mobile"
                value={formik.values.mobile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!formik.touched.mobile && typeof formik.errors.mobile === 'string'}
                helperText={formik.touched.mobile && typeof formik.errors.mobile === 'string' ? formik.errors.mobile : ''}
                fullWidth
              />
            </Box>
            <Box>
              <TextField
                name="whatsapp"
                label="WhatsApp No."
                value={formik.values.whatsapp}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!formik.touched.whatsapp && typeof formik.errors.whatsapp === 'string'}
                helperText={formik.touched.whatsapp && typeof formik.errors.whatsapp === 'string' ? formik.errors.whatsapp : ''}
                fullWidth
              />
            </Box>
            <Box>
              <TextField
                name="emergency"
                label="Emergency No."
                value={formik.values.emergency}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!formik.touched.emergency && typeof formik.errors.emergency === 'string'}
                helperText={formik.touched.emergency && typeof formik.errors.emergency === 'string' ? formik.errors.emergency : ''}
                fullWidth
              />
            </Box>
          </Box>

          {/* Permanent Address */}
          <Typography variant="h6" fontWeight={600} mt={4} mb={2} sx={{ color: '#7C0316' }}>
            Permanent Address
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <TextField
                name="permAddress1"
                label="Address Line 1"
                value={formik.values.permAddress1}
                onChange={handlePermanentAddressChange}
                onBlur={formik.handleBlur}
                error={!!formik.touched.permAddress1 && typeof formik.errors.permAddress1 === 'string'}
                helperText={formik.touched.permAddress1 && typeof formik.errors.permAddress1 === 'string' ? formik.errors.permAddress1 : ''}
                fullWidth
              />
            </Box>
            <Box>
              <TextField
                name="permAddress2"
                label="Address Line 2"
                value={formik.values.permAddress2}
                onChange={handlePermanentAddressChange}
                onBlur={formik.handleBlur}
                error={!!formik.touched.permAddress2 && typeof formik.errors.permAddress2 === 'string'}
                helperText={formik.touched.permAddress2 && typeof formik.errors.permAddress2 === 'string' ? formik.errors.permAddress2 : ''}
                fullWidth
                select
              >
                {dropdowns.addressLine2 && dropdowns.addressLine2.map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                name="permCity"
                label="City/Town"
                value={formik.values.permCity}
                onChange={handlePermanentAddressChange}
                onBlur={formik.handleBlur}
                error={!!formik.touched.permCity && typeof formik.errors.permCity === 'string'}
                helperText={formik.touched.permCity && typeof formik.errors.permCity === 'string' ? formik.errors.permCity : ''}
                fullWidth
                select
              >
                {dropdowns.cityTown && dropdowns.cityTown.map((city) => (
                  <MenuItem key={city} value={city}>{city}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                name="permProvince"
                label="Province"
                value={formik.values.permProvince}
                onChange={e => {
                  formik.handleChange(e);
                  if (formik.values.sameAsPermanent) {
                    formik.setFieldValue('sameAsPermanent', false);
                  }
                }}
                onBlur={formik.handleBlur}
                error={!!formik.touched.permProvince && typeof formik.errors.permProvince === 'string'}
                helperText={formik.touched.permProvince && typeof formik.errors.permProvince === 'string' ? formik.errors.permProvince : ''}
                fullWidth
                select
              >
                {dropdowns.province && dropdowns.province.map((province) => (
                  <MenuItem key={province} value={province}>{province}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                name="permDistrict"
                label="District"
                value={formik.values.permDistrict}
                onChange={e => {
                  formik.handleChange(e);
                  if (formik.values.sameAsPermanent) {
                    formik.setFieldValue('sameAsPermanent', false);
                  }
                }}
                onBlur={formik.handleBlur}
                error={!!formik.touched.permDistrict && typeof formik.errors.permDistrict === 'string'}
                helperText={formik.touched.permDistrict && typeof formik.errors.permDistrict === 'string' ? formik.errors.permDistrict : ''}
                fullWidth
                select
              >
                {dropdowns.district && dropdowns.district.map((district) => (
                  <MenuItem key={district} value={district}>{district}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                name="permElectorate"
                label="Electorate"
                value={formik.values.permElectorate}
                onChange={e => {
                  formik.handleChange(e);
                  if (formik.values.sameAsPermanent) {
                    formik.setFieldValue('sameAsPermanent', false);
                  }
                }}
                onBlur={formik.handleBlur}
                error={!!formik.touched.permElectorate && typeof formik.errors.permElectorate === 'string'}
                helperText={formik.touched.permElectorate && typeof formik.errors.permElectorate === 'string' ? formik.errors.permElectorate : ''}
                fullWidth
                select
              >
                {dropdowns.electorate && dropdowns.electorate.map((el) => (
                  <MenuItem key={el} value={el}>{el}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                name="permGramaNiladari"
                label="Grama Niladari"
                value={formik.values.permGramaNiladari}
                onChange={e => {
                  formik.handleChange(e);
                  if (formik.values.sameAsPermanent) {
                    formik.setFieldValue('sameAsPermanent', false);
                  }
                }}
                onBlur={formik.handleBlur}
                error={!!formik.touched.permGramaNiladari && typeof formik.errors.permGramaNiladari === 'string'}
                helperText={formik.touched.permGramaNiladari && typeof formik.errors.permGramaNiladari === 'string' ? formik.errors.permGramaNiladari : ''}
                fullWidth
                select
              >
                {dropdowns.gramaNiladari && dropdowns.gramaNiladari.map((g) => (
                  <MenuItem key={g} value={g}>{g}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                name="permDSecretariat"
                label="D. Secretariat"
                value={formik.values.permDSecretariat}
                onChange={e => {
                  formik.handleChange(e);
                  if (formik.values.sameAsPermanent) {
                    formik.setFieldValue('sameAsPermanent', false);
                  }
                }}
                onBlur={formik.handleBlur}
                error={!!formik.touched.permDSecretariat && typeof formik.errors.permDSecretariat === 'string'}
                helperText={formik.touched.permDSecretariat && typeof formik.errors.permDSecretariat === 'string' ? formik.errors.permDSecretariat : ''}
                fullWidth
                select
              >
                {dropdowns.dSecretariat && dropdowns.dSecretariat.map((d) => (
                  <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                name="permPostalCode"
                label="Postal Code"
                value={formik.values.permPostalCode}
                onChange={e => {
                  formik.handleChange(e);
                  if (formik.values.sameAsPermanent) {
                    formik.setFieldValue('sameAsPermanent', false);
                  }
                }}
                onBlur={formik.handleBlur}
                error={!!formik.touched.permPostalCode && typeof formik.errors.permPostalCode === 'string'}
                helperText={formik.touched.permPostalCode && typeof formik.errors.permPostalCode === 'string' ? formik.errors.permPostalCode : ''}
                fullWidth
                select
              >
                {dropdowns.postalCode && dropdowns.postalCode.map((p) => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="sameAsPermanent"
                  checked={formik.values.sameAsPermanent}
                  onChange={handleSameAsPermanentChange}
                  sx={{ color: 'green' }}
                />
              }
              label={<span style={{ color: '#7C0316', fontWeight: 500 }}>Corresponding address is same as the permanent address.</span>}
              sx={{ ml: 0 }}
            />
          </Box>

          {/* Correspondence Address */}
          <Typography variant="h6" fontWeight={600} mt={4} mb={2} sx={{ color: '#7C0316' }}>
            Correspondence Address
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <TextField
                name="corrAddress1"
                label="Address Line 1"
                value={formik.values.corrAddress1}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!formik.touched.corrAddress1 && typeof formik.errors.corrAddress1 === 'string'}
                helperText={formik.touched.corrAddress1 && typeof formik.errors.corrAddress1 === 'string' ? formik.errors.corrAddress1 : ''}
                fullWidth
                disabled={corrDisabled}
              />
            </Box>
            <Box>
              <TextField
                name="corrAddress2"
                label="Address Line 2"
                value={formik.values.corrAddress2}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!formik.touched.corrAddress2 && typeof formik.errors.corrAddress2 === 'string'}
                helperText={formik.touched.corrAddress2 && typeof formik.errors.corrAddress2 === 'string' ? formik.errors.corrAddress2 : ''}
                fullWidth
                select
                disabled={corrDisabled}
              >
                {dropdowns.addressLine2 && dropdowns.addressLine2.map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                name="corrCity"
                label="City/Town"
                value={formik.values.corrCity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!formik.touched.corrCity && typeof formik.errors.corrCity === 'string'}
                helperText={formik.touched.corrCity && typeof formik.errors.corrCity === 'string' ? formik.errors.corrCity : ''}
                fullWidth
                select
                disabled={corrDisabled}
              >
                {dropdowns.cityTown && dropdowns.cityTown.map((city) => (
                  <MenuItem key={city} value={city}>{city}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                name="province"
                label="Province"
                value={formik.values.province}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!formik.touched.province && typeof formik.errors.province === 'string'}
                helperText={formik.touched.province && typeof formik.errors.province === 'string' ? formik.errors.province : ''}
                fullWidth
                select
                disabled={corrDisabled}
              >
                {dropdowns.province && dropdowns.province.map((province) => (
                  <MenuItem key={province} value={province}>{province}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                name="electorate"
                label="Electorate"
                value={formik.values.electorate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!formik.touched.electorate && typeof formik.errors.electorate === 'string'}
                helperText={formik.touched.electorate && typeof formik.errors.electorate === 'string' ? formik.errors.electorate : ''}
                fullWidth
                select
                disabled={corrDisabled}
              >
                {dropdowns.electorate && dropdowns.electorate.map((el) => (
                  <MenuItem key={el} value={el}>{el}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                name="district"
                label="District"
                value={formik.values.district}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!formik.touched.district && typeof formik.errors.district === 'string'}
                helperText={formik.touched.district && typeof formik.errors.district === 'string' ? formik.errors.district : ''}
                fullWidth
                select
                disabled={corrDisabled}
              >
                {dropdowns.district && dropdowns.district.map((district) => (
                  <MenuItem key={district} value={district}>{district}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                name="gramaNiladari"
                label="Grama Niladari"
                value={formik.values.gramaNiladari}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!formik.touched.gramaNiladari && typeof formik.errors.gramaNiladari === 'string'}
                helperText={formik.touched.gramaNiladari && typeof formik.errors.gramaNiladari === 'string' ? formik.errors.gramaNiladari : ''}
                fullWidth
                select
                disabled={corrDisabled}
              >
                {dropdowns.gramaNiladari && dropdowns.gramaNiladari.map((g) => (
                  <MenuItem key={g} value={g}>{g}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                name="dSecretariat"
                label="D. Secretariat"
                value={formik.values.dSecretariat}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!formik.touched.dSecretariat && typeof formik.errors.dSecretariat === 'string'}
                helperText={formik.touched.dSecretariat && typeof formik.errors.dSecretariat === 'string' ? formik.errors.dSecretariat : ''}
                fullWidth
                select
                disabled={corrDisabled}
              >
                {dropdowns.dSecretariat && dropdowns.dSecretariat.map((d) => (
                  <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                name="postalCode"
                label="Postal Code"
                value={formik.values.postalCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!formik.touched.postalCode && typeof formik.errors.postalCode === 'string'}
                helperText={formik.touched.postalCode && typeof formik.errors.postalCode === 'string' ? formik.errors.postalCode : ''}
                fullWidth
                select
                disabled={corrDisabled}
              >
                {dropdowns.postalCode && dropdowns.postalCode.map((p) => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
          <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" sx={{ borderColor: '#7C0316', color: '#7C0316' }} type="button" onClick={onBack}>Back</Button>
            <Button variant="contained" sx={{ bgcolor: '#7C0316', color: '#fff' }} type="submit">Next</Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddressContactDetailsForm;
