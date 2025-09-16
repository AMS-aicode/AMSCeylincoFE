// src/services/workExperienceService.ts
import axios from 'axios';

export interface WorkExperienceData {
  hasInsuranceExperience: string;
  experiences: {
    employerName: string;
    positionHeld: string;
    workPeriodFrom: string;
    workPeriodTo: string;
    contactNo: string;
  }[];
  workStation: {
    groupDepartment: string;
    subDepCluster: string;
    branch: string;
    unit: string;
    supervisorName: string;
    introducedBy: string;
    introducedBySO: string;
  };
}

export const saveWorkExperience = async (applicationId: number, data: any) => {
  // Flatten the data to match backend model
  const exp = data.experiences && data.experiences.length > 0 ? data.experiences[0] : {};
  const payload = {
    applicationId,
    hasPreviousWorkExperience: false, // Set default or get from form if available
    workExperienceDuration: null,     // Set default or get from form if available
    hasInsuranceExperience: data.hasInsuranceExperience === 'Yes',
    employerName: exp.employerName || '',
    positionHeld: exp.positionHeld || '',
    workPeriodFrom: exp.workPeriodFrom || null,
    workPeriodTo: exp.workPeriodTo || null,
    employerContactNo: exp.contactNo || '',
    groupDepartment: data.workStation?.groupDepartment || '',
    subDepCluster: data.workStation?.subDepCluster || '',
    branch: data.workStation?.branch || '',
    unit: data.workStation?.unit || '',
    supervisorName: data.workStation?.supervisorName || '',
    introducedBy: data.workStation?.introducedBy || '',
    introducedBySO: data.workStation?.introducedBySO || '',
    // Add other fields as needed to match your backend model
  };
  const response = await axios.put(`http://localhost:3002/api/v1/agent-onboarding/applications/${applicationId}/work-experience`,payload);

  //const response = await axios.put(`http://192.168.2.137:3002/api/v1/agent-onboarding/applications/${applicationId}/work-experience`,payload);
  return response.data;
}

export const getWorkExperience = async (applicationId: number) => {
  const response = await axios.get(`http://localhost:3002/api/v1/agent-onboarding/applications/${applicationId}/work-experience`);
  //const response = await axios.get(`http://192.168.2.137:3002/api/v1/agent-onboarding/applications/${applicationId}/work-experience`);
  return response.data;
};