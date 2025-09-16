import axios from 'axios';

export async function uploadWitnessSignature(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(
    'http://localhost:3002/api/v1/agent-onboarding/witness/upload',
    //'http://192.168.2.137:3002/api/v1/agent-onboarding/witness/upload',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
}

export const saveWitnessDetails = async (applicationId: string | number, data: any) => {
  //return axios.put(`http://192.168.2.137:3002/api/v1/agent-onboarding/applications/${applicationId}/witness-details`, data);
 return axios.put(`http://localhost:3002/api/v1/agent-onboarding/applications/${applicationId}/witness-details`, data);
}

export const getWitnessDetails = async (applicationId: string | number) => {
  const response = await axios.get(`http://localhost:3002/api/v1/agent-onboarding/applications/${applicationId}/witness-details`);
  //return axios.get(`http://192.168.2.137:3002/api/v1/agent-onboarding/applications/${applicationId}/witness-details`);
  return response.data;
};


