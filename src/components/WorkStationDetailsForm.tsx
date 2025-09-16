import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Typography, FormControl, InputLabel, Select, MenuItem, TextField, RadioGroup, FormControlLabel, Radio, FormLabel } from '@mui/material';
import { saveWorkStationDetails } from '../services/workStationDetailsService';
import { getApplicationId } from '../globalAppId';
import { getDropdownConfigs } from '../services/dropdownService';

const validationSchema = Yup.object().shape({
  groupDepartment: Yup.string().required('Required'),
  subDepCluster: Yup.string().required('Required'),
  branch: Yup.string().required('Required'),
  unit: Yup.string().required('Required'),
  supervisorName: Yup.string().required('Required'),
  introducedBy: Yup.string(),
  introducedBySO: Yup.string().required('Required'),
});

export interface WorkStationDetailsFormProps {
  initialValues?: any;
  onNext: (values: any) => void;
  onBack: () => void;
}

const defaultInitialValues = {
  groupDepartment: '',
  subDepCluster: '',
  branch: '',
  unit: '',
  supervisorName: '',
  introducedBy: '',
  introducedBySO: 'No',
};

const WorkStationDetailsForm: React.FC<WorkStationDetailsFormProps & { applicationId?: number }> = ({ initialValues, onNext, onBack, applicationId }) => {
  const [dropdowns, setDropdowns] = React.useState({
    groupDepartments: [],
    subDepartmentClusters: [],
    branches: [],
    units: [],
    supervisorNames: [],
  });
  React.useEffect(() => {
    getDropdownConfigs().then((data) => {
      setDropdowns(prev => ({ ...prev, ...data }));
    });
  }, []);
  // Custom submit handler to save to backend then call onNext
  const handleSubmit = async (values: any) => {
    const appId = applicationId || getApplicationId();
    if (!appId) {
      alert('Application ID missing. Cannot save Work Station Details.');
      return;
    }
    // Convert introducedBySO to boolean and map introducedBy to introducedBySOCode
    const payload = {
      ...values,
      introducedBySO: values.introducedBySO === 'Yes',
      introducedBySOCode: values.introducedBy || '',
    };
    try {
      await saveWorkStationDetails(appId, payload);
      onNext(values);
    } catch (e: any) {
      alert('Failed to save Work Station Details: ' + (e?.response?.data?.error || e.message));
    }
  };
  return (
    <Formik
      initialValues={initialValues || defaultInitialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, submitForm }) => (
        <Form>
          <Box sx={{ background: '#fff', borderRadius: 2, p: { xs: 2, md: 4 }, boxShadow: 1, maxWidth: 700, mx: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 700 }}>
              Registration Application <span style={{ color: '#888', fontWeight: 400 }}>Work Station Details</span>
            </Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Group Department</InputLabel>
                <Select
                  name="groupDepartment"
                  value={values.groupDepartment}
                  label="Group Department"
                  onChange={handleChange}
                  error={Boolean(touched.groupDepartment && errors.groupDepartment)}
                >
                  {dropdowns.groupDepartments && dropdowns.groupDepartments.map(opt => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Sub Dep/Cluster</InputLabel>
                <Select
                  name="subDepCluster"
                  value={values.subDepCluster}
                  label="Sub Dep/Cluster"
                  onChange={handleChange}
                  error={Boolean(touched.subDepCluster && errors.subDepCluster)}
                >
                  {dropdowns.subDepartmentClusters && dropdowns.subDepartmentClusters.map(opt => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Branch</InputLabel>
                <Select
                  name="branch"
                  value={values.branch}
                  label="Branch"
                  onChange={handleChange}
                  error={Boolean(touched.branch && errors.branch)}
                >
                  {dropdowns.branches && dropdowns.branches.map(opt => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Unit</InputLabel>
                <Select
                  name="unit"
                  value={values.unit}
                  label="Unit"
                  onChange={handleChange}
                  error={Boolean(touched.unit && errors.unit)}
                >
                  {dropdowns.units && dropdowns.units.map(opt => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Supervisor Name</InputLabel>
                <Select
                  name="supervisorName"
                  value={values.supervisorName}
                  label="Supervisor Name"
                  onChange={handleChange}
                  error={Boolean(touched.supervisorName && errors.supervisorName)}
                >
                  {dropdowns.supervisorNames && dropdowns.supervisorNames.map(opt => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Introduced by (SO code)"
                name="introducedBy"
                value={values.introducedBy}
                onChange={handleChange}
                fullWidth
                size="small"
              />
              <FormControl component="fieldset" sx={{ mt: 1 }}>
                <FormLabel component="legend">Introduced by SO</FormLabel>
                <RadioGroup
                  row
                  name="introducedBySO"
                  value={values.introducedBySO}
                  onChange={handleChange}
                >
                  <FormControlLabel value="Yes" control={<Radio color="error" />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio color="error" />} label="No" />
                </RadioGroup>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Button variant="outlined" color="error" type="button" onClick={onBack}>
                Back
              </Button>
              <Button variant="contained" color="error" type="submit">
                Next
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default WorkStationDetailsForm;
