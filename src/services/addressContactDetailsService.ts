import axios from 'axios';

export const saveAddressContactDetails = async (applicationId: number, data: any) => {
  const response = await axios.put(`http://localhost:3002/api/v1/agent-onboarding/applications/${applicationId}/address-contact`,data);

  //const response = await axios.put(`http://192.168.2.137:3002/api/v1/agent-onboarding/applications/${applicationId}/address-contact`,data);
  return response.data;
};

export const getAddressContactDetails = async (applicationId: number) => {
  try {
    const response = await axios.get(`http://localhost:3002/api/v1/agent-onboarding/applications/${applicationId}/address-contact`);

    //const response = await axios.get(`http://192.168.2.137:3002/api/v1/agent-onboarding/applications/${applicationId}/address-contact`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      // No address/contact details exist yet
      return null;
    }
    throw error;
  }
};
