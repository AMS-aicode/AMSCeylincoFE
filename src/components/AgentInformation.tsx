import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Avatar, Button, Tabs, Tab, Paper, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Grid from '@mui/material/Grid';
// import Grid from '@mui/material/Grid';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
// import Grid from '@mui/material/Grid';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { getPersonalDetails } from '../services/personalDetailsService';
import { getApplicationId } from '../globalAppId';

const tabLabels = [
  'KPI',
  'Business',
  'Personal Details',
  'Education Details',
  'Work Details',
  'Training & Development',
];

const documentList = [
  { label: 'LICENSE', url: '/path/to/license.jpg' },
  { label: 'PASSPORT', url: '/path/to/passport.jpg' },
  { label: 'PASSBOOK', url: '/path/to/passbook.jpg' },
  { label: 'CERTIFICATE', url: '/path/to/certificate.jpg' },
];

const AgentInformation = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(2); // Personal Details default
  const [agent, setAgent] = useState<any>(null);
  const applicationId = getApplicationId();

  useEffect(() => {
    if (applicationId) {
      getPersonalDetails(applicationId).then(setAgent);
    }
  }, [applicationId]);

  // Dummy data for demo (replace with real agent data)
  const agentName = agent?.firstName + (agent?.lastName ? ' ' + agent.lastName : '') || 'Amul Opatha';
  const agentSince = '2.7 Years';
  const agentType = 'Veteran';
  const phone = agent?.contactMobile || '+94 71 123 4567';
  const email = agent?.email || 'amulopatha@accel.com';
  const avatarUrl = '/path/to/avatar.jpg';
  const rating = 4;

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh' }}>
      {/* Top Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 3, py: 2, borderBottom: '1px solid #eee'}}>
        <IconButton sx={{ bgcolor: '#fff0f0', color: '#7C0316', boxShadow: 1, mr: 1 }} onClick={() => navigate('/agent-management')}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <Typography sx={{ fontWeight: 700, fontSize: 22, ml: 1 }}>
          Agent Information
        </Typography>
        <Box sx={{ flex: 1 }} />
        {/* User profile (top right) 
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src="/path/to/user.jpg" />
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 16 }}>Sanjiv</Typography>
            <Typography sx={{ fontSize: 12, color: '#888' }}>Head of Branch</Typography>
          </Box>
        </Box>*/}
      </Box>

      {/* Agent Profile Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 4, py: 3 }}>
        <Avatar src={avatarUrl} sx={{ width: 80, height: 80, mr: 3 }} />
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 22 }}>{agentName}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            {[1,2,3,4,5].map(i => i <= rating ? <StarIcon key={i} sx={{ color: '#FFD600', fontSize: 22 }} /> : <StarBorderIcon key={i} sx={{ color: '#FFD600', fontSize: 22 }} />)}
          </Box>
          <Typography sx={{ fontSize: 14, color: '#444', mt: 0.5 }}>Agent Since {agentSince}</Typography>
          <Typography sx={{ fontSize: 14, color: '#444' }}>Agent Type : {agentType}</Typography>
        </Box>
        <Box sx={{ ml: 5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 0.5 }}>COMMUNICATION DETAILS</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: 14 }}>{phone}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: 14 }}>{email}</Typography>
          </Box>
        </Box>
        {/* Nudge Buttons 
        <Box sx={{ ml: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
          <Button variant="contained" sx={{ bgcolor: '#7C0316', color: '#fff', fontWeight: 600, mb: 1, borderRadius: 2, px: 3 }}>NUDGE AGENT</Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" sx={{ borderColor: '#7C0316', color: '#7C0316', fontWeight: 600, borderRadius: 2, px: 2 }}>By Email</Button>
            <Button variant="outlined" sx={{ borderColor: '#7C0316', color: '#7C0316', fontWeight: 600, borderRadius: 2, px: 2 }}>In App</Button>
          </Box>
        </Box>
         */}
      </Box>

      {/* Tabs */}
      <Box sx={{ px: 4, borderBottom: '1px solid #f3dede', bgcolor: '#fbeeee' }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ minHeight: 48 }}>
          {tabLabels.map((label, i) => (
            <Tab key={label} label={label} sx={{ fontWeight: 600, fontSize: 16, minWidth: 120, color: tab === i ? '#7C0316' : '#333', bgcolor: tab === i ? '#fff' : 'transparent', borderRadius: 2, mx: 0.5 }} />
          ))}
        </Tabs>
      </Box>

      {/* Personal Details Tab */}
      {tab === 2 && (
        <Box sx={{ px: 4, py: 3 }}>
          <Typography sx={{ color: '#7C0316', fontWeight: 700, fontSize: 22, mb: 2 }}>Personal Details</Typography>
          <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField label="Nationality" value={agent?.nationality || 'SRI LANKAN - SINHALESE'} fullWidth InputProps={{ readOnly: true }} variant="outlined" sx={{ mb: 2 }} />
                <TextField label="NIC No" value={agent?.nicNo || '78584895'} fullWidth InputProps={{ readOnly: true }} variant="outlined" sx={{ mb: 2 }} />
                <TextField label="Address Line 1" value={agent?.addressLine1 || '118'} fullWidth InputProps={{ readOnly: true }} variant="outlined" sx={{ mb: 2 }} />
                <TextField label="City/Town" value={agent?.cityTown || ''} fullWidth InputProps={{ readOnly: true }} variant="outlined" sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Date Of Birth" value={agent?.dateOfBirth ? agent.dateOfBirth.slice(0,10) : '10/12/1990'} fullWidth InputProps={{ readOnly: true }} variant="outlined" sx={{ mb: 2 }} />
                <TextField label="Designation" value={agent?.designation || 'Unit Head'} fullWidth InputProps={{ readOnly: true }} variant="outlined" sx={{ mb: 2 }} />
                <TextField label="Address Line 2" value={agent?.addressLine2 || 'Yasisiripura'} fullWidth InputProps={{ readOnly: true }} variant="outlined" sx={{ mb: 2 }} />
              </Grid>
            </Grid>
          </Paper>

          {/* Bank Details */}
          <Typography sx={{ color: '#7C0316', fontWeight: 700, fontSize: 20, mb: 2 }}>Bank details</Typography>
          <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField label="Bank Name" value={agent?.bankName || 'City Bank'} fullWidth InputProps={{ readOnly: true }} variant="outlined" sx={{ mb: 2 }} />
                <TextField label="Bank Code" value={agent?.bankCode || '100'} fullWidth InputProps={{ readOnly: true }} variant="outlined" sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Branch Name" value={agent?.branchName || 'Anuradhapura'} fullWidth InputProps={{ readOnly: true }} variant="outlined" sx={{ mb: 2 }} />
                <TextField label="Account No" value={agent?.accountNo || '7687545639'} fullWidth InputProps={{ readOnly: true }} variant="outlined" sx={{ mb: 2 }} />
              </Grid>
            </Grid>
          </Paper>

          {/* Documents */}
          <Typography sx={{ color: '#7C0316', fontWeight: 700, fontSize: 20, mb: 2 }}>Documents</Typography>
          <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
            {documentList.map(doc => (
              <Box key={doc.label} sx={{ width: 150, textAlign: 'center', boxShadow: 1, borderRadius: 2, p: 1, bgcolor: '#fff' }}>
                <img src={doc.url} alt={doc.label} style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8 }} />
                <Typography sx={{ fontWeight: 600, fontSize: 15, mt: 1 }}>{doc.label}</Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button variant="contained" sx={{ bgcolor: '#003399', color: '#fff', fontWeight: 600, borderRadius: 2, px: 4 }}>NIC</Button>
            <Button variant="contained" sx={{ bgcolor: '#ff7f2a', color: '#fff', fontWeight: 600, borderRadius: 2, px: 4 }}>GS Report</Button>
          </Box>
        </Box>
      )}

      {/* Education Details Tab */}
      {tab === 3 && (
        <Box sx={{ px: 4, py: 3 }}>
          <Typography sx={{ color: '#7C0316', fontWeight: 700, fontSize: 22, mb: 2 }}>Education Details</Typography>
          <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 3, maxWidth: 480 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f7f7f7' }}>
                  <TableCell sx={{ fontWeight: 700, color: '#7C0316' }}>Exams</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#7C0316' }}>Pass/Done</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {['G.C.E. O/L', 'G.C.E. A/L', 'Degree'].map((exam) => (
                  <TableRow key={exam}>
                    <TableCell>{exam}</TableCell>
                    <TableCell><RadioButtonCheckedIcon sx={{ color: '#7C0316' }} /></TableCell>
                    <TableCell><IconButton><VisibilityIcon sx={{ color: '#7C0316' }} /></IconButton></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography sx={{ fontWeight: 700, fontSize: 18, mb: 2, mt: 4 }}>IBSL Examination Data</Typography>
          <Grid container spacing={3} sx={{ mb: 2 }}>
            <Grid item xs={12} md={4}>
              <TextField label="Examination Date" value="19/01/2025 12:30:00 PM" fullWidth InputProps={{ readOnly: true }} variant="outlined" sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Mode" value="Web Based" fullWidth InputProps={{ readOnly: true }} variant="outlined" sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Marks Obtained" value="78" fullWidth InputProps={{ readOnly: true }} variant="outlined" sx={{ mb: 2 }} />
            </Grid>
          </Grid>

          <Typography sx={{ fontWeight: 700, fontSize: 18, mb: 2, mt: 4 }}>Self Paced</Typography>
          <Grid container spacing={3} sx={{ mb: 2 }}>
            <Grid item xs={12} md={4}>
              <TextField label="AML(FIU) Test" value="Pass" fullWidth InputProps={{ readOnly: true }} variant="outlined" sx={{ mb: 2 }} />
            </Grid>
          </Grid>

          <Typography sx={{ fontWeight: 700, fontSize: 18, mb: 2, mt: 4 }}>O/L Examination Index Number & Year</Typography>
          <Grid container spacing={3} sx={{ mb: 2 }}>
            <Grid item xs={12} md={4}>
              <TextField label="Index Number" value="73668844" fullWidth InputProps={{ readOnly: true }} variant="outlined" sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Year" value="2007" fullWidth InputProps={{ readOnly: true }} variant="outlined" sx={{ mb: 2 }} />
            </Grid>
          </Grid>

          <Typography sx={{ fontWeight: 700, fontSize: 18, mb: 2, mt: 4 }}>Language Proficiency</Typography>
          <TableContainer component={Paper} sx={{ borderRadius: 2, maxWidth: 480, mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f7f7f7' }}>
                  <TableCell></TableCell>
                  <TableCell sx={{ color: '#7C0316', fontWeight: 700 }}>Read</TableCell>
                  <TableCell sx={{ color: '#7C0316', fontWeight: 700 }}>Write</TableCell>
                  <TableCell sx={{ color: '#7C0316', fontWeight: 700 }}>Speak</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {['Sinhala', 'English'].map((lang) => (
                  <TableRow key={lang}>
                    <TableCell>{lang}</TableCell>
                    <TableCell><CheckBoxIcon sx={{ color: 'green' }} /></TableCell>
                    <TableCell><CheckBoxIcon sx={{ color: 'green' }} /></TableCell>
                    <TableCell><CheckBoxIcon sx={{ color: 'green' }} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography sx={{ fontWeight: 700, fontSize: 16, mt: 4, mb: 1 }}>1st Language (Sinhala/Tamil)</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
            <RadioButtonCheckedIcon sx={{ color: '#7C0316' }} />
            <Typography>Yes</Typography>
            <RadioButtonCheckedIcon sx={{ color: '#fff', border: '2px solid #7C0316', borderRadius: '50%' }} />
            <Typography>No</Typography>
          </Box>
        </Box>
      )}

      {/* Work Details Tab */}
      {tab === 4 && (
        <Box sx={{ px: 4, py: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Typography sx={{ color: '#7C0316', fontWeight: 700, fontSize: 22 }}>Work Details</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ bgcolor: '#fff', borderRadius: 2, boxShadow: 1, px: 2, py: 1, textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 700, fontSize: 22 }}>87</Typography>
                <Typography sx={{ color: '#7C0316', fontWeight: 700, fontSize: 14, mt: -0.5 }}>ARI</Typography>
              </Box>
              <Box sx={{ bgcolor: '#fff', borderRadius: 2, boxShadow: 1, px: 2, py: 1, textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 700, fontSize: 22 }}>97</Typography>
                <Typography sx={{ color: '#7C0316', fontWeight: 700, fontSize: 14, mt: -0.5 }}>KPI</Typography>
              </Box>
            </Box>
          </Box>
          <Grid container spacing={3} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField label="Date of Joining" value="July 17, 2022" fullWidth InputProps={{ readOnly: true, endAdornment: <CalendarMonthIcon sx={{ color: '#7C0316' }} /> }} variant="outlined" sx={{ mb: 2 }} />
              <TextField label="Designation" value="Unit Head" fullWidth InputProps={{ readOnly: true }} variant="outlined" sx={{ mb: 2 }} />
              <TextField label="Branch" value="Anuradhapura" fullWidth InputProps={{ readOnly: true }} variant="outlined" sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="License No" value="DE87801-2025" fullWidth InputProps={{ readOnly: true }} variant="outlined" sx={{ mb: 2 }} />
              <TextField label="Supervisor" value="Sanjiv" fullWidth InputProps={{ readOnly: true }} variant="outlined" sx={{ mb: 2 }} />
              <TextField label="Group Department" value="NA Group" fullWidth InputProps={{ readOnly: true }} variant="outlined" sx={{ mb: 2 }} />
            </Grid>
          </Grid>

          {/* History Section */}
          <Typography sx={{ fontWeight: 700, fontSize: 20, mt: 4, mb: 2 }}>History</Typography>
          <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f7f7f7' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Transferred From</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Effective Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Remarks</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Transferred</TableCell>
                  <TableCell>Anuradhapura</TableCell>
                  <TableCell>Jan 17, 2025</TableCell>
                  <TableCell>Transferred due to operational requirements.</TableCell>
                  <TableCell>Completed</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f7f7f7' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Promoted To</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Effective Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Remarks</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Promotion</TableCell>
                  <TableCell>Unit Head</TableCell>
                  <TableCell>Dec 17, 2024</TableCell>
                  <TableCell>Consistently exceeds expectations & delivers high-quality results.</TableCell>
                  <TableCell>Completed</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pre Work Experience Section */}
          <Typography sx={{ color: '#7C0316', fontWeight: 700, fontSize: 20, mt: 4, mb: 2 }}>Pre Work Experience</Typography>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 16, mb: 1 }}>
              Previous work experience at an Insurance Company <span style={{ color: '#7C0316' }}>*</span>
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <RadioButtonCheckedIcon sx={{ color: '#7C0316' }} />
              <Typography>Yes</Typography>
              <RadioButtonCheckedIcon sx={{ color: '#fff', border: '2px solid #7C0316', borderRadius: '50%' }} />
              <Typography>No</Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontWeight: 500, mb: 1 }}>Period Worked :</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField value="28/02/2021" fullWidth InputProps={{ readOnly: true, endAdornment: <CalendarMonthIcon sx={{ color: '#7C0316' }} /> }} variant="outlined" />
                  <Typography sx={{ fontWeight: 700 }}>TO</Typography>
                  <TextField value="09/03/2022" fullWidth InputProps={{ readOnly: true, endAdornment: <CalendarMonthIcon sx={{ color: '#7C0316' }} /> }} variant="outlined" />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Name of the Employer & Branch" value="Softlogic Life Insurance/ Visaka Road" fullWidth InputProps={{ readOnly: true }} variant="outlined" sx={{ mb: 2 }} />
                <TextField label="Position Held" value="Insurance advisor" fullWidth InputProps={{ readOnly: true }} variant="outlined" />
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AgentInformation;
