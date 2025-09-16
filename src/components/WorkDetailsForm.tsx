import React from 'react';
import { Formik, Form, FieldArray, getIn } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, IconButton, MenuItem, Select, InputLabel, TextField } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import type { WorkExperienceData } from '../services/workExperienceService';

const groupDepartments = ['NA Group', 'Other Group'];
const subDepClusters = ['AP15', 'AP16'];
const branches = ['NS09', 'NS10'];
const units = ['AP1503', 'AP1504'];
const supervisors = ['201245 - A. S. Gunatilleke', '201246 - B. Perera'];

const validationSchema = Yup.object().shape({
  hasInsuranceExperience: Yup.string().required(),
  experiences: Yup.array().of(Yup.object().shape({
    employerName: Yup.string().when('$hasInsuranceExperience', {
      is: 'Yes',
      then: s => s.required('Required'),
      otherwise: s => s,
    }),
    positionHeld: Yup.string().when('$hasInsuranceExperience', {
      is: 'Yes',
      then: s => s.required('Required'),
      otherwise: s => s,
    }),
    workPeriodFrom: Yup.string().when('$hasInsuranceExperience', {
      is: 'Yes',
      then: s => s.required('Required'),
      otherwise: s => s,
    }),
    workPeriodTo: Yup.string().when('$hasInsuranceExperience', {
      is: 'Yes',
      then: s => s.required('Required'),
      otherwise: s => s,
    }),
    contactNo: Yup.string().when('$hasInsuranceExperience', {
      is: 'Yes',
      then: s => s.required('Required').matches(/^\d{10}$/, 'Enter a valid 10-digit contact number'),
      otherwise: s => s,
    }),
  })),
});

interface WorkDetailsFormProps {
  applicationId: string | number;
  initialValues?: any;
  onNext: (values: WorkExperienceData) => void;
  onBack: () => void;
}

const WorkDetailsForm: React.FC<WorkDetailsFormProps> = ({ applicationId, initialValues, onNext, onBack }) => {
  return (
    <Formik
      initialValues={initialValues || {
        hasInsuranceExperience: 'No',
        experiences: [
          {
            employerName: '',
            positionHeld: '',
            workPeriodFrom: '',
            workPeriodTo: '',
            contactNo: '',
          },
        ],
      }}
      validationSchema={validationSchema}
      onSubmit={onNext}
    >
      {({ values, errors, touched, handleChange, setFieldValue }) => (
        <Form>
          <Box sx={{ background: '#fff', borderRadius: 2, p: { xs: 2, md: 4 }, boxShadow: 1, maxWidth: 1100, mx: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 700 ,mr: 1 }}>
              Registration Application 
              </Typography>
            <Typography variant="h6" sx={{ mb: 2, color: '#888', fontWeight: 400 }}>
              Work Details
            </Typography>
            </Box>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend" required>
                Previous work experience at an Insurance Company
              </FormLabel>
              <RadioGroup
                row
                name="hasInsuranceExperience"
                value={values.hasInsuranceExperience}
                onChange={e => setFieldValue('hasInsuranceExperience', e.target.value)}
              >
                <FormControlLabel value="Yes" control={<Radio color="error" />} label="Yes" />
                <FormControlLabel value="No" control={<Radio color="error" />} label="No" />
              </RadioGroup>
            </FormControl>

            {values.hasInsuranceExperience === 'Yes' && (
              <FieldArray name="experiences">
                {({ push }) => (
                  <>
                    {values.experiences.map((exp, idx) => {
                      const expTouched = getIn(touched, `experiences[${idx}]`) || {};
                      const expError = getIn(errors, `experiences[${idx}]`) || {};
                      return (
                        <Box key={idx} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                          <TextField
                            label="Name of the Employer & Branch"
                            name={`experiences[${idx}].employerName`}
                            value={exp.employerName}
                            onChange={handleChange}
                            fullWidth
                            required
                            size="small"
                            error={Boolean(expTouched.employerName && expError.employerName)}
                            helperText={expTouched.employerName && expError.employerName}
                          />
                          <TextField
                            label="Position Held"
                            name={`experiences[${idx}].positionHeld`}
                            value={exp.positionHeld}
                            onChange={handleChange}
                            fullWidth
                            required
                            size="small"
                            error={Boolean(expTouched.positionHeld && expError.positionHeld)}
                            helperText={expTouched.positionHeld && expError.positionHeld}
                          />
                          <TextField
                            label="Period Worked (From)"
                            type="date"
                            name={`experiences[${idx}].workPeriodFrom`}
                            value={exp.workPeriodFrom}
                            onChange={handleChange}
                            fullWidth
                            required
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            error={Boolean(expTouched.workPeriodFrom && expError.workPeriodFrom)}
                            helperText={expTouched.workPeriodFrom && expError.workPeriodFrom}
                          />
                          <TextField
                            label="Period Worked (To)"
                            type="date"
                            name={`experiences[${idx}].workPeriodTo`}
                            value={exp.workPeriodTo}
                            onChange={handleChange}
                            fullWidth
                            required
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            error={Boolean(expTouched.workPeriodTo && expError.workPeriodTo)}
                            helperText={expTouched.workPeriodTo && expError.workPeriodTo}
                          />
                          <TextField
                            label="Contact No."
                            name={`experiences[${idx}].contactNo`}
                            value={exp.contactNo}
                            onChange={handleChange}
                            fullWidth
                            required
                            size="small"
                            inputProps={{ maxLength: 10, pattern: '[0-9]*', inputMode: 'numeric' }}
                            error={Boolean(expTouched.contactNo && expError.contactNo)}
                            helperText={expTouched.contactNo && expError.contactNo}
                          />
                        </Box>
                      );
                    })}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <IconButton color="error" onClick={() => push({ employerName: '', positionHeld: '', workPeriodFrom: '', workPeriodTo: '', contactNo: '' })}>
                        <AddCircleOutlineIcon />
                      </IconButton>
                      <Typography variant="body2">Add More Experience</Typography>
                    </Box>
                  </>
                )}
              </FieldArray>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Button variant="outlined" color="error" type="button" onClick={onBack}>Back</Button>
              <Button variant="contained" color="error" type="submit">Next</Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default WorkDetailsForm;
