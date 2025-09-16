import axios from 'axios';

const API_BASE = 'http://localhost:3002/api/v1/agent-onboarding/applications';
//const API_BASE = 'http://192.168.2.137:3002/api/v1/agent-onboarding/applications';

export async function uploadDocument(applicationId: string, documentType: string, file: File) {
  // Map frontend documentType to backend ENUM value
  const documentTypeEnumMap: Record<string, string> = {
    'NIC/ Driving License/ Passport': 'NIC',
    'Photograph': 'Photograph',
    'Bank passbook': 'Bank Passbook',
    'GS Report': 'GS Report',
    'HOB / MBD report': 'HOB/MBD Report',
    'Initial Interview Guide': 'Initial Interview Guide',
    'Group Annuity Form': 'Group Annuity Form',
  };
  const backendType = documentTypeEnumMap[documentType] || documentType;
  if (!applicationId) {
    throw new Error('Application ID is required for document upload');
  }
  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentType', backendType);
  // Use PUT for update, POST for create
  const res = await axios.put(`http://localhost:3002/api/v1/agent-onboarding/applications/${applicationId}/documents/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data.document;
}

export function getDocumentUrl(applicationId: string | number, documentId: string) {
  return `http://localhost:3002/api/v1/agent-onboarding/applications/${applicationId}/documents/${documentId}`;
}
