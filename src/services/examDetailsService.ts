import axios from 'axios';

const API_BASE = 'http://localhost:3002/api/v1/agent-onboarding/applications';
//const API_BASE = 'http://192.168.2.137:3002/api/v1/agent-onboarding/applications';

export const updateExamDetails = async (applicationId: string | number, data: any) => {
  return axios.put(`${API_BASE}/${applicationId}/exam-details`, data);
};

export const getExamDetails = async (applicationId: string | number) => {
  return axios.get(`${API_BASE}/${applicationId}/exam-details`);
};
