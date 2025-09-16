import axios from 'axios';

//const API_BASE = '/api/v1/onboarding/applications';
const API_BASE = 'http://localhost:3002/api/v1/agent-onboarding/applications';
//const API_BASE = 'http://192.168.2.137:3002/api/v1/agent-onboarding/applications';
export async function getBankDetails(applicationId: string | number) {
  const res = await axios.get(`${API_BASE}/${applicationId}/bank-details`);
  return res.data.bankDetails;
}

export async function saveBankDetails(applicationId: string | number, data: any) {
  const res = await axios.put(`${API_BASE}/${applicationId}/bank-details`, data);
  return res.data;
}
