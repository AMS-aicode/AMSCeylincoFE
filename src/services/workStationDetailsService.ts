import axios from 'axios';

//const API_BASE = '/api/applications';
const API_BASE = 'http://localhost:3002/api/v1/agent-onboarding/applications';
//const API_BASE = 'http://192.168.2.137:3002/api/v1/agent-onboarding/applications';

export const saveWorkStationDetails = async (applicationId: string | number, data: any) => {
  // Ensure introducedBySO is boolean and introducedBySOCode is set from introducedBy
  const payload = {
    ...data,
    introducedBySO: typeof data.introducedBySO === 'string' ? data.introducedBySO === 'Yes' : !!data.introducedBySO,
    introducedBySOCode: data.introducedBy || '', // Map form field to backend column
  };
  const res = await axios.put(`${API_BASE}/${applicationId}/workstation-details`, payload);
  return res.data;
};

export const getWorkStationDetails = async (applicationId: string | number) => {
  const res = await axios.get(`${API_BASE}/${applicationId}/workstation-details`);
  return res.data;
};
