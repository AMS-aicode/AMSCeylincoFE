import axios from 'axios';

export const createPersonalDetails = async (data: any) => {
  console.log('Creating personal details with data:', data);
  const response = await axios.post('http://localhost:3002/api/v1/agent-onboarding/applications', data);
  //const response = await axios.post('http://192.168.2.137:3002/api/v1/agent-onboarding/applications', data);
  console.log('Response from createPersonalDetails:', response.data);
  return response.data;
};

export const updatePersonalDetails = async (applicationId: number, data: any) => {
  const response = await axios.put(`http://localhost:3002/api/v1/agent-onboarding/applications/${applicationId}/personal-details`,data);

  //const response = await axios.put(`http://192.168.2.137:3002/api/v1/agent-onboarding/applications/${applicationId}/personal-details`,data);
  return response.data;
};

export const getPersonalDetails = async (applicationId: string | number) => {
  const response = await axios.get(`http://localhost:3002/api/v1/agent-onboarding/applications/${applicationId}/personal-details`);
  //const response = await axios.get(`http://192.168.2.137:3002/api/v1/agent-onboarding/applications/${applicationId}/personal-details`);
  return response.data;
};

export const getAllPersonalDetails = async () => {
  const response = await axios.get('http://localhost:3002/api/v1/agent-onboarding/applications/personal-details');
  //const response = await axios.get('http://192.168.2.137:3002/api/v1/agent-onboarding/applications/personal-details');
  return response.data;
};

export const getARIScore = async (applicationId: string | number) => {
  //const response = await axios.get(`http://192.168.2.137:3002/api/v1/agent-onboarding/applications/${applicationId}/ari-score`);
  const response = await axios.get(`http://localhost:3002/api/v1/agent-onboarding/applications/${applicationId}/ari-score`);
  return response.data;
};
