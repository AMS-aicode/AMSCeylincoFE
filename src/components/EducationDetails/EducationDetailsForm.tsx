import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  useMediaQuery,
  Checkbox,
  TextField,
  Grid
} from '@mui/material';
import { updateEducation } from '../../services/educationService';
import { updateExamDetails } from '../../services/examDetailsService';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const examList = [
  { key: 'ol', label: 'G.C.E. O/L' },
  { key: 'al', label: 'G.C.E. A/L' },
  { key: 'diploma', label: 'Diploma' },
  { key: 'degree', label: 'Degree' },
];

const gradeOptions = ['A', 'B', 'C', 'S', 'W'];

const validationSchema = Yup.object({
  qualification: Yup.object({
    ol: Yup.string().required('Required'),
    al: Yup.string().required('Required'),
    diploma: Yup.string().required('Required'),
    degree: Yup.string().required('Required'),
  }),
  olGrades: Yup.object({
    english: Yup.string().required('Required'),
    maths: Yup.string().required('Required'),
  }),
  degreeCategory: Yup.array().when('qualification.degree', {
    is: (val: string) => val === 'pass',
    then: (schema) => schema.min(1, 'Select at least one degree category'),
    otherwise: (schema) => schema,
  }),
  extracurricular: Yup.string().required('Required'),
  ibslExamDate: Yup.string().required('Required'),
  ibslAdmissionNo: Yup.string().required('Required'),
  ibslMarks: Yup.string().required('Required'),
  ibslMode: Yup.string().required('Required'),
  amlTest: Yup.string().required('Required'),
  tapResults: Yup.string().required('Required'),
  preExamDate: Yup.string().required('Required'),
  preExamNIC: Yup.string()
    .required('Required')
    .matches(/^\d{9}[VvXx]$/, 'NIC must be 9 digits followed by V/X')
    .max(10, 'Max 10 characters'),
  preExamMarks: Yup.string().required('Required'),
  preExamMode: Yup.string().required('Required'),
  olIndexNumber: Yup.string().required('Required'),
  olYear: Yup.string().required('Required'),
});

interface EducationDetailsFormProps {
  applicationId: string | number;
  onNext?: (values: any) => void;
  onBack?: () => void;
  initialValues?: any;
}

export const defaultInitialValues = {
  qualification: {
    ol: '',
    al: '',
    diploma: '',
    degree: '',
  },
  uploads: {
    ol: null as File | null,
    al: null as File | null,
    diploma: null as File | null,
    degree: null as File | null,
  },
  olGrades: {
    english: '',
    maths: '',
  },
  degreeCategory: [] as string[],
  languageProficiency: [
    { language: 'Sinhala', read: false, write: false, speak: false },
    { language: 'English', read: false, write: false, speak: false },
    { language: 'Tamil', read: false, write: false, speak: false },
  ],
  extracurricular: '',
  ibslExamDate: '',
  ibslAdmissionNo: '',
  ibslMarks: '',
  ibslMode: '',
  amlTest: '',
  tapResults: '',
  preExamDate: '',
  preExamNIC: '',
  preExamMarks: '',
  preExamMode: '',
  olIndexNumber: '',
  olYear: '',
};

const EducationDetailsForm = ({ applicationId, onNext, onBack, initialValues }: EducationDetailsFormProps) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [submitStatus, setSubmitStatus] = React.useState<string | null>(null);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Formik
      initialValues={initialValues || defaultInitialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitStatus(null);
        try {
          // Map form values to backend model
          const payload = {
            gceOLStatus: values.qualification.ol === 'pass' ? 'Pass' : 'Fail',
            gceALStatus: values.qualification.al === 'pass' ? 'Pass' : 'Fail',
            diplomaStatus: values.qualification.diploma === 'pass' ? 'Pass' : 'Fail',
            degreeStatus: values.qualification.degree === 'pass' ? 'Pass' : 'Fail',
            olEnglishGrade: values.olGrades.english,
            olMathsGrade: values.olGrades.maths,
            degreeCategories: values.degreeCategory,
            extracurricularActivities: values.extracurricular === 'yes',
            secondLanguage: values.languageProficiency.some((l: any) => l.language !== 'English' && (l.read || l.write || l.speak)),
          };
          await updateEducation(applicationId, payload);

          // Exam Details payload
          const examPayload = {
            ibslExams: {
              examDate: values.ibslExamDate,
              admissionNo: values.ibslAdmissionNo,
              marks: values.ibslMarks,
              mode: values.ibslMode,
            },
            selfPacedSection: {
              amlTest: values.amlTest,
              tapResults: values.tapResults,
            },
            preContractExamData: {
              examDate: values.preExamDate,
              nic: values.preExamNIC,
              marks: values.preExamMarks,
              mode: values.preExamMode,
            },
            olExamIndexes: {
              indexNumber: values.olIndexNumber,
              year: values.olYear,
            },
          };
          await updateExamDetails(applicationId, examPayload);

          setSubmitStatus('success');
          if (onNext) onNext(values);
        } catch (err: any) {
          setSubmitStatus(err?.response?.data?.error || 'Failed to update.');
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, setFieldValue, errors, touched, isSubmitting }) => (
        <Form>
          <Box sx={{ background: '#fff', minHeight: '100vh', p: isMobile ? 1 : 4 }}>
            <Box sx={{ width: '100%', maxWidth: 1100, mx: 'auto', mt: { xs: 1, sm: 2 }, mb: { xs: 2, sm: 4 } }}>
              <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#fff', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mr: 1 }}>
                    Registration Application
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#888', fontWeight: 400 }}>
                    Education Details
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>
                  Qualification
                </Typography>
                {errors.qualification && typeof errors.qualification === 'string' && touched.qualification && (
                  <Typography color="error" variant="body2" sx={{ mb: 1 }}>{errors.qualification}</Typography>
                )}
                <TableContainer component={Paper} sx={{ borderRadius: 3, mb: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: '#f5e9ea' }}>
                        <TableCell sx={{ fontWeight: 700 }}>Exams</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Pass/Done</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Fail/Not Done</TableCell>
                        <TableCell sx={{ fontWeight: 700, textAlign: 'center', verticalAlign: 'middle', width: 220 }}>Upload Document</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {examList.map(exam => (
                        <TableRow key={exam.key}>
                          <TableCell>{exam.label}</TableCell>
                          <TableCell>
                            <Radio
                              checked={values.qualification[exam.key as keyof typeof values.qualification] === 'pass'}
                              onChange={() => setFieldValue(`qualification.${exam.key}`, 'pass')}
                              sx={{ color: '#7C0316', '&.Mui-checked': { color: '#7C0316' } }}
                            />
                          </TableCell>
                          <TableCell>
                            <Radio
                              checked={values.qualification[exam.key as keyof typeof values.qualification] === 'fail'}
                              onChange={() => setFieldValue(`qualification.${exam.key}`, 'fail')}
                              sx={{ color: '#7C0316', '&.Mui-checked': { color: '#7C0316' } }}
                            />
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center', verticalAlign: 'middle' }}>
                            {exam.key === 'diploma' ? (
                              <Typography variant="body2" sx={{ color: '#888', fontWeight: 500 }}>NA</Typography>
                            ) : values.uploads[exam.key as keyof typeof values.uploads] ? (
                              <Typography variant="caption" sx={{ ml: 1, color: '#388e3c', fontWeight: 500 }}>
                                {values.uploads[exam.key as keyof typeof values.uploads]?.name}
                              </Typography>
                            ) : (
                              <Button
                                variant="text"
                                component="label"
                                sx={{
                                  color: '#222',
                                  textTransform: 'none',
                                  fontWeight: 500,
                                  fontSize: 16,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  background: 'none',
                                  p: 0,
                                  minWidth: 0,
                                  justifyContent: 'center',
                                }}
                                startIcon={<CloudUploadIcon sx={{ color: 'error.main', fontSize: 36 }} />}
                              >
                                {exam.key === 'degree' ? 'Upload Degree Certificate' : exam.key === 'ol' ? 'Upload O/L Certificate' : exam.key === 'al' ? 'Upload A/L Certificate' : 'Upload'}
                                <input
                                  type="file"
                                  hidden
                                  accept=".pdf,.jpg,.jpeg"
                                  onChange={e => setFieldValue(`uploads.${exam.key}`, e.currentTarget.files && e.currentTarget.files[0])}
                                />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TableContainer component={Paper} sx={{ borderRadius: 3, mb: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: '#f5e9ea' }}>
                        <TableCell></TableCell>
                        {gradeOptions.map(grade => (
                          <TableCell key={grade} sx={{ fontWeight: 700, color: '#7C0316' }}>Grade</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {['english', 'maths'].map(subject => (
                        <TableRow key={subject}>
                          <TableCell sx={{ fontWeight: 600 }}>
                            {subject === 'english' ? 'O/L - English' : 'O/L -Maths'}
                          </TableCell>
                          {gradeOptions.map(grade => (
                            <TableCell key={grade} align="center">
                              <Radio
                                checked={values.olGrades[subject as keyof typeof values.olGrades] === grade}
                                onChange={() => setFieldValue(`olGrades.${subject}`, grade)}
                                sx={{ color: '#7C0316', '&.Mui-checked': { color: '#7C0316' } }}
                              />
                              <span>{grade}</span>
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Degree Category Section */}
                {values.qualification.degree === 'pass' && (
                  <>
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 4, mb: 2 }}>
                      Degree Category
                    </Typography>
                    {touched.degreeCategory && errors.degreeCategory && (
                      <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                        {typeof errors.degreeCategory === 'string' ? errors.degreeCategory : ''}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 3 }}>
                      <Box sx={{ flex: 1, minWidth: 250 }}>
                        <FormControlLabel
                          control={<Checkbox checked={values.degreeCategory.includes('hr')}
                            onChange={e => {
                              const checked = e.target.checked;
                              setFieldValue('degreeCategory', checked
                                ? [...values.degreeCategory, 'hr']
                                : values.degreeCategory.filter((v: string) => v !== 'hr')
                              );
                            }}
                            sx={{ color: 'green', '&.Mui-checked': { color: 'green' } }}
                          />}
                          label="Degree in Human Resources"
                        />
                        <FormControlLabel
                          control={<Checkbox checked={values.degreeCategory.includes('sales')}
                            onChange={e => {
                              const checked = e.target.checked;
                              setFieldValue('degreeCategory', checked
                                ? [...values.degreeCategory, 'sales']
                                : values.degreeCategory.filter((v: string) => v !== 'sales')
                              );
                            }}
                            sx={{ color: 'green', '&.Mui-checked': { color: 'green' } }}
                          />}
                          label="Degree in Sales and Marketing"
                        />
                        <FormControlLabel
                          control={<Checkbox checked={values.degreeCategory.includes('other')}
                            onChange={e => {
                              const checked = e.target.checked;
                              setFieldValue('degreeCategory', checked
                                ? [...values.degreeCategory, 'other']
                                : values.degreeCategory.filter((v: string) => v !== 'other')
                              );
                            }}
                            sx={{ color: 'green', '&.Mui-checked': { color: 'green' } }}
                          />}
                          label="Other"
                        />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 250 }}>
                        <FormControlLabel
                          control={<Checkbox checked={values.degreeCategory.includes('banking')}
                            onChange={e => {
                              const checked = e.target.checked;
                              setFieldValue('degreeCategory', checked
                                ? [...values.degreeCategory, 'banking']
                                : values.degreeCategory.filter((v: string) => v !== 'banking')
                              );
                            }}
                            sx={{ color: 'green', '&.Mui-checked': { color: 'green' } }}
                          />}
                          label="Degree in Banking and Insurance"
                        />
                        <FormControlLabel
                          control={<Checkbox checked={values.degreeCategory.includes('ict')}
                            onChange={e => {
                              const checked = e.target.checked;
                              setFieldValue('degreeCategory', checked
                                ? [...values.degreeCategory, 'ict']
                                : values.degreeCategory.filter((v: string) => v !== 'ict')
                              );
                            }}
                            sx={{ color: 'green', '&.Mui-checked': { color: 'green' } }}
                          />}
                          label="Degree in ICT"
                        />
                      </Box>
                    </Box>
                  </>
                )}

                {/* Language Proficiency Section */}
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 4, mb: 2 }}>
                  Language Proficiency
                </Typography>
                <TableContainer component={Paper} sx={{ borderRadius: 3, mb: 3, maxWidth: 700 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: '#f5e9ea' }}>
                        <TableCell></TableCell>
                        <TableCell align="center" sx={{ color: '#7C0316', fontWeight: 700 }}>Read</TableCell>
                        <TableCell align="center" sx={{ color: '#7C0316', fontWeight: 700 }}>Write</TableCell>
                        <TableCell align="center" sx={{ color: '#7C0316', fontWeight: 700 }}>Speak</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {values.languageProficiency.map((row: any, idx: number) => (
                        <TableRow key={row.language}>
                          <TableCell sx={{ fontWeight: 600 }}>{row.language}</TableCell>
                          <TableCell align="center">
                            <Checkbox
                              checked={row.read}
                              onChange={() => setFieldValue(`languageProficiency[${idx}].read`, !row.read)}
                              sx={{ color: 'green', '&.Mui-checked': { color: 'green' } }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Checkbox
                              checked={row.write}
                              onChange={() => setFieldValue(`languageProficiency[${idx}].write`, !row.write)}
                              sx={{ color: 'green', '&.Mui-checked': { color: 'green' } }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Checkbox
                              checked={row.speak}
                              onChange={() => setFieldValue(`languageProficiency[${idx}].speak`, !row.speak)}
                              sx={{ color: 'green', '&.Mui-checked': { color: 'green' } }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Extracurricular Section */}
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 4, mb: 2 }}>
                  Scouts/ Prefect/ Sports/ Cadet/Head Prefect/ Captain of Sports
                </Typography>
                <RadioGroup
                  row
                  name="extracurricular"
                  value={values.extracurricular || ''}
                  onChange={e => setFieldValue('extracurricular', e.target.value)}
                  sx={{ mb: 2 }}
                >
                  <FormControlLabel value="yes" control={<Radio sx={{ color: '#7C0316', '&.Mui-checked': { color: '#7C0316' } }} />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio sx={{ color: '#7C0316', '&.Mui-checked': { color: '#7C0316' } }} />} label="No" />
                </RadioGroup>
                {touched.extracurricular && errors.extracurricular && (
                  <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                    {typeof errors.extracurricular === 'string' ? errors.extracurricular : ''}
                  </Typography>
                )}
                <Box sx={{ borderBottom: '1px solid #e0bfc2', mb: 3 }} />

                {/* IBSL Examination Data */}
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 4, mb: 2 }}>
                  IBSL Examination Data
                </Typography>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Examination Date"
                      type="datetime-local"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={values.ibslExamDate || ''}
                      onChange={e => setFieldValue('ibslExamDate', e.target.value)}
                      error={Boolean(touched.ibslExamDate && typeof errors.ibslExamDate === 'string')}
                      helperText={typeof errors.ibslExamDate === 'string' ? errors.ibslExamDate : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Admission No"
                      fullWidth
                      value={values.ibslAdmissionNo || ''}
                      onChange={e => setFieldValue('ibslAdmissionNo', e.target.value)}
                      error={Boolean(touched.ibslAdmissionNo && typeof errors.ibslAdmissionNo === 'string')}
                      helperText={typeof errors.ibslAdmissionNo === 'string' ? errors.ibslAdmissionNo : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Marks Obtained"
                      fullWidth
                      value={values.ibslMarks || ''}
                      onChange={e => setFieldValue('ibslMarks', e.target.value)}
                      error={Boolean(touched.ibslMarks && typeof errors.ibslMarks === 'string')}
                      helperText={typeof errors.ibslMarks === 'string' ? errors.ibslMarks : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Mode"
                      fullWidth
                      value={values.ibslMode || ''}
                      onChange={e => setFieldValue('ibslMode', e.target.value)}
                      error={Boolean(touched.ibslMode && typeof errors.ibslMode === 'string')}
                      helperText={typeof errors.ibslMode === 'string' ? errors.ibslMode : ''}
                    />
                  </Grid>
                </Grid>

                {/* Self Paced Section */}
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 4, mb: 2 }}>
                  Self Paced
                </Typography>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="AML(FIU) Test"
                      fullWidth
                      value={values.amlTest || ''}
                      onChange={e => setFieldValue('amlTest', e.target.value)}
                      error={Boolean(touched.amlTest && typeof errors.amlTest === 'string')}
                      helperText={typeof errors.amlTest === 'string' ? errors.amlTest : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="TAP Results"
                      fullWidth
                      value={values.tapResults || ''}
                      onChange={e => setFieldValue('tapResults', e.target.value)}
                      error={Boolean(touched.tapResults && typeof errors.tapResults === 'string')}
                      helperText={typeof errors.tapResults === 'string' ? errors.tapResults : ''}
                    />
                  </Grid>
                </Grid>

                {/* Pre-Contract Exam Data */}
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 4, mb: 2 }}>
                  Pre-Contract Exam Data
                </Typography>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Examination Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={values.preExamDate || ''}
                      onChange={e => setFieldValue('preExamDate', e.target.value)}
                      error={Boolean(touched.preExamDate && typeof errors.preExamDate === 'string')}
                      helperText={typeof errors.preExamDate === 'string' ? errors.preExamDate : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="NIC No"
                      fullWidth
                      value={values.preExamNIC || ''}
                      onChange={e => setFieldValue('preExamNIC', e.target.value)}
                      error={Boolean(touched.preExamNIC && typeof errors.preExamNIC === 'string')}
                      helperText={typeof errors.preExamNIC === 'string' ? errors.preExamNIC : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Marks Obtained"
                      fullWidth
                      value={values.preExamMarks || ''}
                      onChange={e => setFieldValue('preExamMarks', e.target.value)}
                      error={Boolean(touched.preExamMarks && typeof errors.preExamMarks === 'string')}
                      helperText={typeof errors.preExamMarks === 'string' ? errors.preExamMarks : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Mode"
                      fullWidth
                      value={values.preExamMode || ''}
                      onChange={e => setFieldValue('preExamMode', e.target.value)}
                      error={Boolean(touched.preExamMode && typeof errors.preExamMode === 'string')}
                      helperText={typeof errors.preExamMode === 'string' ? errors.preExamMode : ''}
                    />
                  </Grid>
                </Grid>

                {/* O/L Examination Index Number & Year */}
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 4, mb: 2 }}>
                  O/L Examination Index Number & Year
                </Typography>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Index Number"
                      fullWidth
                      value={values.olIndexNumber || ''}
                      onChange={e => setFieldValue('olIndexNumber', e.target.value)}
                      error={Boolean(touched.olIndexNumber && typeof errors.olIndexNumber === 'string')}
                      helperText={typeof errors.olIndexNumber === 'string' ? errors.olIndexNumber : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Year"
                      fullWidth
                      value={values.olYear || ''}
                      onChange={e => setFieldValue('olYear', e.target.value)}
                      error={Boolean(touched.olYear && typeof errors.olYear === 'string')}
                      helperText={typeof errors.olYear === 'string' ? errors.olYear : ''}
                    />
                  </Grid>
                </Grid>

                {/* Add More, Cancel, Update Buttons */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 4 }}>
                  {/* <Button
                    variant="contained"
                    color="error"
                    sx={{ borderRadius: '50%', minWidth: 56, minHeight: 56, mr: 2, fontSize: 28, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  
                  +
                </Button> */}
                  <Box sx={{ flex: 1 }} />
                  <Button variant="outlined" color="error" sx={{ mr: 2, fontWeight: 700, px: 4 }} onClick={onBack}>
                    Back
                  </Button>
                  <Button variant="contained" color="error" sx={{ fontWeight: 700, px: 4 }} type="submit" disabled={isSubmitting}>
                    Next
                  </Button>
                </Box>
                {submitStatus && (
                  <Typography color={submitStatus === 'success' ? 'green' : 'error'} sx={{ mt: 2 }}>
                    {submitStatus === 'success' ? 'Education details updated successfully.' : submitStatus}
                  </Typography>
                )}
              </Paper>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default EducationDetailsForm;
