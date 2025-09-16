import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Grid, Radio, RadioGroup, FormControlLabel, Button, useMediaQuery } from '@mui/material';

const ARIReport = ({
  ariData = {
    olEnglish: 4,
    workExperience: 0,
    children: 0,
    introducedSOAge: 0,
    scouts: 0,
    secondLanguage: 10,
    total: 37,
  },
  pepValue = 'no',
  onPepChange,
  onCancel,
  onSubmit,
  loading = false,
}: {
  ariData?: {
    childrenScore: number;
    olEnglishScore: number;
    olMathsScore: number;
    civilStatusScore: number;
    olEnglish: number;
    workExperience: number;
    children: number;
    introducedSOAge: number;
    scouts: number;
    secondLanguage: number;
    total: number;
  };
  pepValue?: 'yes' | 'no';
  onPepChange?: (value: 'yes' | 'no') => void;
  onCancel?: () => void;
  onSubmit?: () => void;
  loading?: boolean;
}) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:900px)');

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1200,
        mx: 'auto',
        mt: 4,
        bgcolor: '#fff',
        borderRadius: 3,
        boxShadow: 0,
        p: 0,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0 }}>
        <Typography variant="h5" sx={{ color: 'error.main', fontWeight: 700, mb: 0, pl: 4, pt: 4 }}>
          Registration Application <span style={{ color: '#888', fontWeight: 400 }}>Average Recruitment Indicator</span>
        </Typography>
        <Box sx={{ border: '5px solid #7C0316', borderRadius: '50%', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, color: '#222', mr: 4, mt: 4 }}>
          9/9
        </Box>
      </Box>
      <Grid container spacing={0} sx={{ mt: 2, mb: 0 }}>
        <Grid item xs={12} md={5} sx={{ pl: 4, pt: 2 }}>
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 0, maxWidth: 420 }}>
            <Table>
              <TableBody>
                <TableRow sx={{ background: '#f5e9ea' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: 20, color: 'error.main', borderTopLeftRadius: 12 }}>Category</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: 20, color: 'error.main', borderTopRightRadius: 12 }}>Points</TableCell>
                </TableRow>
                <TableRow><TableCell>Civil Status</TableCell><TableCell align="right">{ariData?.civilStatusScore ?? 0}</TableCell></TableRow>
                <TableRow><TableCell>Age</TableCell><TableCell align="right">{ariData?.ageScore ?? 5}</TableCell></TableRow>
                <TableRow><TableCell>Education</TableCell><TableCell align="right">{ariData?.educationScore ?? 0}</TableCell></TableRow>
                <TableRow><TableCell>O/L Maths</TableCell><TableCell align="right">{ariData?.olMathsScore ?? 15}</TableCell></TableRow>
                <TableRow><TableCell>O/L English</TableCell><TableCell align="right">{ariData?.olEnglishScore ?? 3}</TableCell></TableRow>
                <TableRow><TableCell>Work Experience</TableCell><TableCell align="right">{ariData?.workExperienceScore ?? 4}</TableCell></TableRow>
                <TableRow><TableCell>Children</TableCell><TableCell align="right">{ariData?.childrenScore ?? 0}</TableCell></TableRow>
                <TableRow><TableCell>Introduced SO Age</TableCell><TableCell align="right">{ariData?.introducerAgeScore ?? 0}</TableCell></TableRow>
                <TableRow><TableCell>Scouts / Prefect / etc</TableCell><TableCell align="right">{ariData?.extracurricularScore ?? 0}</TableCell></TableRow>
                <TableRow><TableCell>2<sup>nd</sup> Language</TableCell><TableCell align="right">{ariData?.secondLanguageScore ?? 10}</TableCell></TableRow>
                <TableRow sx={{ background: '#f5e9ea' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: 20, color: 'error.main', borderBottomLeftRadius: 12 }}>Total</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: 20, color: 'error.main', borderBottomRightRadius: 12 }}>{ariData?.totalScore ?? 37}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={7} sx={{ pl: 8, pt: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, mt: 1 }}>
              PEP Question
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 400, mb: 4, maxWidth: 700 }}>
              Are you a politically exposed person (PEP <span style={{ color: '#7C0316' }}>*</span>) or related to a PEP? (PEP - Politicians, senior government officers, judges and judicial officers, commissioned officers of armed forces/police, members of commissions/director boards/university councils, officers of international organizations.)
            </Typography>
            <RadioGroup
              row
              value={pepValue}
              onChange={e => onPepChange && onPepChange(e.target.value as 'yes' | 'no')}
              sx={{ mb: 8 }}
            >
              <FormControlLabel value="yes" control={<Radio sx={{ color: 'error.main', '&.Mui-checked': { color: 'error.main' }, width: 32, height: 32 }} />} label={<Typography sx={{ fontWeight: 700, fontSize: 24 }}>Yes</Typography>} sx={{ mr: 6 }} />
              <FormControlLabel value="no" control={<Radio sx={{ color: 'error.main', '&.Mui-checked': { color: 'error.main' }, width: 32, height: 32 }} />} label={<Typography sx={{ fontWeight: 700, fontSize: 24 }}>No</Typography>} />
            </RadioGroup>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 0, pr: 8, pb: 6, gap: 2 }}>
        <Button
          variant="outlined"
          color="error"
          sx={{ minWidth: 120, height: 40, borderRadius: '8px', fontWeight: 600, fontSize: '1rem', textTransform: 'none', borderWidth: 2, borderColor: '#7C0316', color: '#7C0316', mr: 2, letterSpacing: 1 }}
          onClick={onCancel}
          disabled={loading}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="error"
          sx={{ minWidth: 140, height: 40, borderRadius: '8px', fontWeight: 600, fontSize: '1rem', textTransform: 'none', bgcolor: '#7C0316', color: '#fff', letterSpacing: 1, opacity: loading ? 0.7 : 1 }}
          onClick={onSubmit}
          disabled={loading}
        >
          Raise Request
        </Button>
      </Box>
    </Box>
  );
};

export default ARIReport;
