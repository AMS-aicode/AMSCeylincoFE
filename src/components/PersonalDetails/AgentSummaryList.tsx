import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Select from '@mui/material/Select';

import CloseIcon from '@mui/icons-material/Close';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import MenuItem from '@mui/material/MenuItem';
import { IconButton, TextField, InputAdornment, Button } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SortIcon from '@mui/icons-material/Sort';
import { getAddressContactDetails } from '../../services/addressContactDetailsService';
import { setApplicationId } from '../../globalAppId';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Pagination } from '@mui/material';

import { getAllPersonalDetails } from '../../services/personalDetailsService';

interface AgentSummary {
  id: number;
  applicationId?: number;
  fullName: string;
  agentCode: string;
  designation: string;
  contactMobile: string;
  nicNo: string;
  status: 'Active' | 'Inactive';
}

const AgentSummaryList: React.FC = () => {
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const navigate = useNavigate();
  const [filteredAgents, setFilteredAgents] = useState<AgentSummary[] | null>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [sortDialogOpen, setSortDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDesignation, setFilterDesignation] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [employeeType, setEmployeeType] = useState('all');
  const [status, setStatus] = useState('active');
  const [byField, setByField] = useState('employeeNo');
  const [byFieldValue, setByFieldValue] = useState('');
  const [byCriteria, setByCriteria] = useState('');
  const [byCriteriaValue, setByCriteriaValue] = useState('');
  const rowsPerPage = 10;

  useEffect(() => {
    getAllPersonalDetails()
      .then(async (data) => {
        // Map database fields to AgentSummary fields for table
        const agents = Array.isArray(data)
          ? await Promise.all(data.map(async (agent: any, idx: number) => {
              let contactMobile = '';
              if (agent.applicationId) {
                const addressDetails = await getAddressContactDetails(agent.applicationId);
                contactMobile = addressDetails?.contactMobile || '';
              }
              return {
                id: agent.id || idx + 1,
                applicationId: agent.applicationId,
                fullName: agent.firstName + (agent.lastName ? ' ' + agent.lastName : ''),
                agentCode: agent.agentCode || '',
                designation: agent.designation || '',
                contactMobile,
                nicNo: agent.nicNo || '',
                status: agent.status || 'Active',
              };
            }))
          : [];
  // Sort agents by id descending (latest first)
  setAgents(agents.sort((a, b) => b.id - a.id));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch agent data');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Pagination logic
  // Filtering
  let dataToShow = filteredAgents !== null ? filteredAgents : agents;
  if (filterStatus) dataToShow = dataToShow.filter(a => a.status === filterStatus);
  if (filterDesignation) dataToShow = dataToShow.filter(a => a.designation.toLowerCase().includes(filterDesignation.toLowerCase()));
  // Sorting
  dataToShow = [...dataToShow].sort((a, b) => {
    let aVal = a[sortField as keyof AgentSummary];
    let bVal = b[sortField as keyof AgentSummary];
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  const paginatedAgents = dataToShow.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pageCount = Math.ceil(dataToShow.length / rowsPerPage);

  return (
    <Box sx={{ mt: 2 }}>
      {/* Top Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            sx={{ bgcolor: '#fff0f0', color: '#7C0316', boxShadow: 1, mr: 1 }}
            onClick={() => navigate('/agent-management-menu')}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography sx={{ color: '#111', fontWeight: 700, fontSize: 24, letterSpacing: 0.1, ml: 0 }}>
            Agent List
          </Typography>
        </Box>
        <Box sx={{ display: 'none', alignItems: 'center', gap: 2, ml: 'auto' }}>
          <TextField
            size="small"
            placeholder="Search"
            sx={{ bgcolor: '#fafbfc', borderRadius: 2, minWidth: 180, mr: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#7C0316' }} />
                </InputAdornment>
              ),
            }}
          />
          </Box>
          {/* comment for add button */}
         {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
          <IconButton
            sx={{ bgcolor: '#fff0f0', color: '#7C0316', mr: 1 }}
            onClick={() => navigate('/agent-onboarding')}
          >
            <AddCircleIcon sx={{ fontSize: 36 }} />
          </IconButton>
      </Box>*/}
      
      </Box>
      {/* Sub Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
        <Button startIcon={<SortIcon />} sx={{ bgcolor: '#fff0f0', color: '#7C0316', borderRadius: 2, fontWeight: 500, textTransform: 'none', px: 2 }} onClick={() => setSortDialogOpen(true)}>
          Sort
        </Button>
        <Button startIcon={<FilterAltIcon />} sx={{ bgcolor: '#fff0f0', color: '#7C0316', borderRadius: 2, fontWeight: 500, textTransform: 'none', px: 2 }} onClick={() => setFilterDialogOpen(true)}>
          Filter
        </Button>
      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Filter Agents</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
          <FormControl fullWidth>
            <Select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Designation"
            value={filterDesignation}
            onChange={e => setFilterDesignation(e.target.value)}
            size="small"
            variant="outlined"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setFilterStatus(''); setFilterDesignation(''); setFilterDialogOpen(false); }}>Reset</Button>
          <Button onClick={() => setFilterDialogOpen(false)} variant="contained" sx={{ bgcolor: '#7C0316', color: '#fff' }}>Apply</Button>
        </DialogActions>
      </Dialog>

      {/* Sort Dialog */}
      <Dialog open={sortDialogOpen} onClose={() => setSortDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Sort Agents</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
          <FormControl fullWidth>
            <Select
              value={sortField}
              onChange={e => setSortField(e.target.value)}
            >
              <MenuItem value="id">Latest</MenuItem>
              <MenuItem value="fullName">Name</MenuItem>
              <MenuItem value="agentCode">Agent Code</MenuItem>
              <MenuItem value="designation">Designation</MenuItem>
              <MenuItem value="status">Status</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <Select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setSortField('id'); setSortOrder('desc'); setSortDialogOpen(false); }}>Reset</Button>
          <Button onClick={() => setSortDialogOpen(false)} variant="contained" sx={{ bgcolor: '#7C0316', color: '#fff' }}>Apply</Button>
        </DialogActions>
      </Dialog>
        
        <Button
          variant="contained"
          sx={{ bgcolor: '#7C0316', color: '#fff', borderRadius: 2, fontWeight: 500, textTransform: 'none', ml: 1, px: 3, boxShadow: 1 }}
          onClick={() => {
            setEmployeeType('all');
            setStatus('active');
            setByField('employeeNo');
            setByFieldValue('');
            setByCriteria('');
            setByCriteriaValue('');
            setSearchDialogOpen(true);
          }}
        >
          Search
        </Button>
      {/* Employee Selection Criteria Dialog */}
      <Dialog open={searchDialogOpen} onClose={() => setSearchDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', bgcolor: '#fff', color: '#222', py: 2, fontWeight: 700, fontSize: 20 }}>
          <span style={{ flex: 1, fontWeight: 700 }}>Employee Selection Criteria</span>
          <IconButton onClick={() => setSearchDialogOpen(false)} sx={{ color: '#7C0316' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#fafbfc', p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl component="fieldset">
              <RadioGroup
                row
                value={employeeType}
                onChange={e => setEmployeeType(e.target.value)}
                sx={{ mb: 1 }}
              >
                <FormControlLabel value="all" control={<Radio sx={{ color: '#7C0316', '&.Mui-checked': { color: '#7C0316' } }} />} label={<span style={{ fontWeight: 600 }}>All Employees</span>} />
              </RadioGroup>
            </FormControl>
            <FormControl component="fieldset" sx={{ ml: 2 }}>
              <RadioGroup
                row
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <FormControlLabel value="active" control={<Radio sx={{ color: '#7C0316', '&.Mui-checked': { color: '#7C0316' } }} />} label={<span style={{ fontWeight: 500 }}>Active</span>} />
                <FormControlLabel value="inactive" control={<Radio sx={{ color: '#7C0316', '&.Mui-checked': { color: '#7C0316' } }} />} label={<span style={{ fontWeight: 500 }}>Inactive</span>} />
              </RadioGroup>
            </FormControl>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
              <Radio checked={false} sx={{ color: '#7C0316' }} disabled />
              <span style={{ fontWeight: 500, marginRight: 8 }}>By:</span>
              <TextField
                select
                size="small"
                value={byField}
                onChange={e => setByField(e.target.value)}
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="employeeNo">Employee No</MenuItem>
                <MenuItem value="agentCode">Agent Code</MenuItem>
                <MenuItem value="nicNo">NIC No</MenuItem>
              </TextField>
              <TextField
                size="small"
                value={byFieldValue}
                onChange={e => setByFieldValue(e.target.value)}
                sx={{ minWidth: 160 }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
              <span style={{ width: 32 }} />
              <span style={{ fontWeight: 500, marginRight: 8 }}>By Criteria:</span>
              <TextField
                select
                size="small"
                value={byCriteria}
                onChange={e => setByCriteria(e.target.value)}
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="designation">Designation</MenuItem>
                <MenuItem value="status">Status</MenuItem>
              </TextField>
              <TextField
                size="small"
                value={byCriteriaValue}
                onChange={e => setByCriteriaValue(e.target.value)}
                sx={{ minWidth: 160 }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#fafbfc', px: 3, py: 2, justifyContent: 'flex-end', gap: 2 }}>
          <Button
            onClick={() => {
              setFilteredAgents(null);
              setSearchDialogOpen(false);
              setPage(1);
            }}
            sx={{ color: '#7C0316', fontWeight: 600 }}
          >
            RESET
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: '#7C0316', color: '#fff', fontWeight: 600, px: 4 }}
            onClick={() => {
              let filtered = agents;
              // Status filter
              if (status === 'active') filtered = filtered.filter(a => a.status === 'Active');
              if (status === 'inactive') filtered = filtered.filter(a => a.status === 'Inactive');
              // By field filter
              if (byFieldValue.trim()) {
                if (byField === 'employeeNo') filtered = filtered.filter(a => String(a.id).includes(byFieldValue.trim()));
                if (byField === 'agentCode') filtered = filtered.filter(a => a.agentCode.toLowerCase().includes(byFieldValue.trim().toLowerCase()));
                if (byField === 'nicNo') filtered = filtered.filter(a => a.nicNo.toLowerCase().includes(byFieldValue.trim().toLowerCase()));
              }
              // By criteria filter
              if (byCriteria && byCriteriaValue.trim()) {
                if (byCriteria === 'designation') filtered = filtered.filter(a => a.designation.toLowerCase().includes(byCriteriaValue.trim().toLowerCase()));
                if (byCriteria === 'status') filtered = filtered.filter(a => a.status.toLowerCase().includes(byCriteriaValue.trim().toLowerCase()));
              }
              setFilteredAgents(filtered);
              setSearchDialogOpen(false);
              setPage(1);
            }}
          >
            SEARCH
          </Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ display: 'none', alignItems: 'center', gap: 2, ml: 'auto' }}>
          <TextField
            size="small"
            placeholder="Search"
            sx={{ bgcolor: '#fafbfc', borderRadius: 2, minWidth: 180, mr: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#7C0316' }} />
                </InputAdornment>
              ),
            }}
          />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
          <IconButton
            sx={{ bgcolor: '#fff0f0', color: '#7C0316', mr: 1 }}
            onClick={() => navigate('/agent-onboarding')}
          >
            <AddCircleIcon sx={{ fontSize: 36 }} />
          </IconButton>
      </Box>
      </Box>
  <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 2px 8px #eee' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: '#f7f7f7' }}>
              <TableCell sx={{ fontWeight: 700 }}>Sr.No</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Full Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Agent Code</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Designation</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>NIC No</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Contact No</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAgents.map((agent, idx) => (
              <TableRow key={agent.id}>
                <TableCell>{(page - 1) * rowsPerPage + idx + 1}</TableCell>
                <TableCell>{agent.fullName}</TableCell>
                <TableCell>{agent.agentCode}</TableCell>
                <TableCell>{agent.designation}</TableCell>
                <TableCell>{agent.nicNo}</TableCell>
                <TableCell>{agent.contactMobile}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: agent.status === 'Active' ? 'green' : '#7C0316', display: 'inline-block' }} />
                    <Typography component="span" sx={{ fontWeight: 500 }}>{agent.status}</Typography>
                    <Button
                      variant="text"
                      sx={{ color: '#0070c0', textTransform: 'none', fontWeight: 500, ml: 2, minWidth: 0, p: 0 }}
                      onClick={() => {
                        setApplicationId(agent.applicationId || agent.id);
                        navigate('/agent-information');
                      }}
                    >
                      Details
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default AgentSummaryList;
