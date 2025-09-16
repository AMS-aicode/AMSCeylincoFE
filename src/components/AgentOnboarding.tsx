import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Avatar, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router-dom';
import PersonalDetailsForm from './PersonalDetails/PersonalDetailsForm';
import AddressContactDetailsForm from './AddressContactDetailsForm';
import EducationDetailsForm, { defaultInitialValues as eduDefaultInitialValues } from './EducationDetails/EducationDetailsForm';
import ARIReport from '../components/ARIReport';
import Witness from '../components/Witness';
import WorkDetailsForm from './WorkDetailsForm';
import BankDetailsForm from './BankDetailsForm';
import WorkStationDetailsForm from './WorkStationDetailsForm';
import DocumentLegalComplianceForm from './DocumentLegalComplianceForm';
import { getPersonalDetails, getARIScore } from '../services/personalDetailsService';
//import { saveWorkExperience, getWorkExperience, WorkExperienceData } from '../services/workExperienceService';
import { saveWorkExperience, getWorkExperience } from '../services/workExperienceService';
import { saveBankDetails } from '../services/bankDetailsService';
import { saveAddressContactDetails, getAddressContactDetails } from '../services/addressContactDetailsService';
import { saveWorkStationDetails, getWorkStationDetails } from '../services/workStationDetailsService';
import type { WorkExperienceData } from '../services/workExperienceService';
import AgentSummaryList from './PersonalDetails/AgentSummaryList';
import { getApplicationId } from '../globalAppId';

// You can extend this to hold the application data across stages
const AgentOnboarding = () => {
  const [stage, setStage] = useState(0);
  const [applicationId, setApplicationId] = useState<number | undefined>(undefined);
  const [personalDetails, setPersonalDetails] = useState<any>(null);
  const [ariScore, setARIScore] = useState<any>(null);
  const [workDetails, setWorkDetails] = useState<any>(null);
  const [educationDetails, setEducationDetails] = useState<any>(null);
  const [latestWorkDetails, setLatestWorkDetails] = useState<any>(null);
  const [bankDetails, setBankDetails] = useState<any>(null);
  const [addressContactDetails, setAddressContactDetails] = useState<any>(null);
  const [workStationDetails, setWorkStationDetails] = useState<any>(null);
  const [documentComplianceDetails, setDocumentComplianceDetails] = useState<any>(null);
  const [witnessDetails, setWitnessDetails] = useState<any>(null);
  const [witnessDetailsLoading, setWitnessDetailsLoading] = useState(false);

  // Fetch work details when needed (optional, e.g. on stage change)
  const fetchWorkDetails = async (id: number) => {
    try {
      const data = await getWorkExperience(id);
      setWorkDetails(data?.workDetails?.[0] || null);
    } catch (e) {
      setWorkDetails(null);
    }
  };

  // Fetch Address & Contact Details for update functionality
  useEffect(() => {
    if (stage === 1 && applicationId !== undefined) {
      (async () => {
        try {
          const details = await getAddressContactDetails(Number(applicationId));
          setAddressContactDetails(mapAddressContactDetailsToForm(details));
        } catch (e) {
          setAddressContactDetails(undefined);
        }
      })();
    }
  }, [stage, applicationId]);

  // Fetch Work Station Details for update functionality
  useEffect(() => {
    if (stage === 5 && applicationId !== undefined) {
      (async () => {
        try {
          const details = await getWorkStationDetails(Number(applicationId));
          setWorkStationDetails({
            ...details,
            introducedBy: details.introducedBySOCode || '', // Map backend to form field
            introducedBySO: typeof details.introducedBySO === 'boolean' ? (details.introducedBySO ? 'Yes' : 'No') : (details.introducedBySO || 'No'),
          });
        } catch (e) {
          setWorkStationDetails(undefined);
        }
      })();
    }
  }, [stage, applicationId]);

  // Fetch Witness Details for update functionality
  const fetchWitnessDetails = async () => {
    if (applicationId !== undefined) {
      setWitnessDetailsLoading(true);
      try {
        const response = await import('../services/witnessService');
        const witnessData = await response.getWitnessDetails(Number(applicationId));
        let data = witnessData?.witnessDetails || witnessData;
        // Unwrap if data is nested under _previousDataValues
        if (data && data._previousDataValues) {
          data = data._previousDataValues;
        }
        setWitnessDetails(data);
      } catch (e) {
        setWitnessDetails(null);
      } finally {
        setWitnessDetailsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (stage === 6 && applicationId !== undefined) {
      fetchWitnessDetails();
    }
  }, [stage, applicationId]);

  const handlePersonalDetailsNext = async (id?: string | number) => {
    console.log('handlePersonalDetailsNext called with id:', id);
    if (id) setApplicationId(Number(id));
    // Fetch and set personal details after save, so state is always up to date
    const appId = id || applicationId;
    if (appId) {
      try {
        const data = await getPersonalDetails(appId);
        console.log('Fetched personal details after save:', data);
        setPersonalDetails({
          ...data,
          applicationId: appId,
          hasChildren: data.hasChildren ? "Yes" : "No",
          takafulAgent: data.takafulAgent ? "Yes" : "No",
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "",
        });
      } catch (e) {
        console.log('Failed to fetch personal details after save:', e);
        setPersonalDetails(null);
      }
    }
    setStage(1); // Go to Address & Contact Details
  };
  const handleAddressContactNext = async (values: any) => {
    setAddressContactDetails(values);
    if (applicationId === undefined) return;
    // Map frontend fields to backend model fields
    const payload = {
      applicationId: Number(applicationId),
      permanentAddressLine1: values.permAddress1,
      permanentAddressLine2: values.permAddress2,
      permanentCityTown: values.permCity,
      permanentProvince: values.permProvince,
      permanentDistrict: values.permDistrict,
      permanentDSecretariat: values.permDSecretariat,
      permanentElectorate: values.permElectorate,
      permanentGramaNiladari: values.permGramaNiladari,
      permanentPostalCode: values.permPostalCode,
      isCorrespondenceSameAsPermanent: values.sameAsPermanent,
      correspondenceAddressLine1: values.corrAddress1,
      correspondenceAddressLine2: values.corrAddress2,
      correspondenceCityTown: values.corrCity,
      correspondenceProvince: values.province,
      correspondenceDistrict: values.district,
      correspondenceDSecretariat: values.dSecretariat,
      correspondenceElectorate: values.electorate,
      correspondenceGramaNiladari: values.gramaNiladari,
      correspondencePostalCode: values.postalCode,
      email: values.email,
      contactHome: '', // Not present in form, set as empty or add field
      contactMobile: values.mobile,
      contactWhatsApp: values.whatsapp,
      contactEmergency: values.emergency
    };
    try {
      await saveAddressContactDetails(Number(applicationId), payload);
      setStage(2); // Go to Education Details
    } catch (e) {
      alert('Failed to save address & contact details frontend');
    }
  };
  const handleEducationDetailsNext = (values: any) => {
    setEducationDetails(values);
    setStage(3); // Go to Work Details
  };
  const handleWorkDetailsNext = async (values: WorkExperienceData) => {
    setLatestWorkDetails(values); // Save latest form values
    if (!applicationId) return;
    try {
      await saveWorkExperience(Number(applicationId), values);
      // Wait for the API call to finish, then update the stage
      setTimeout(() => setStage(4), 0); // Ensures only after submit, stage changes
    } catch (e) {
      alert('Failed to save work details');
    }
  };
  const handleBankDetailsNext = async (values: any) => {
    setBankDetails(values);
    if (!applicationId) return;
    try {
      await saveBankDetails(applicationId, {
        bankName: values.bankName,
        bankBranch: values.bankBranch,
        accountType: values.accountType,
        accountNumber: values.accountNumber,
        // You may need to handle file upload separately for passbookFile
      });
      setStage(5); // Go to Witness next
    } catch (e: any) {
      if (e?.response?.status === 409 && e?.response?.data?.error?.includes('account number')) {
        alert('Account number already exists.');
      } else {
        alert('Failed to save bank details');
      }
    }
  };
  const handleWorkStationDetailsNext = async (values: any) => {
    if (!applicationId) return;
    try {
      await saveWorkStationDetails(applicationId, values);
      setWorkStationDetails({
        ...values,
        introducedBy: values.introducedBy || '',
        introducedBySO: values.introducedBySO,
      }); // Save to state for back navigation
      setStage(6); // Go to Document & Legal Compliance
    } catch (e: any) {
      alert('Failed to save Work Station Details: ' + (e?.response?.data?.error || e.message));
    }
  };
  const handleDocumentComplianceNext = async (values: any) => {
    setDocumentComplianceDetails(values);
    setStage(7); // Go to Witness next
  };
  const handleWitnessNext = async () => {
    // Save witness details is handled in Witness.tsx via saveWitnessDetails API call
    // Just move to ARI screen after successful save
    setStage(8); // Go to ARIReport
  };
  const handleARISubmit = () => {
    // Submission logic here
    alert('Application submitted!');
  };

  // Handler for cancel/back from EducationDetailsForm and AddressContactDetailsForm
  const handleBackToPersonalDetails = async () => {
    const globalAppId = getApplicationId();
    console.log('Global Application ID:', globalAppId);
    const idToUse = applicationId !== undefined ? applicationId : globalAppId;
    if (idToUse !== undefined) {
      try {
        const data = await getPersonalDetails(idToUse);
        console.log('Fetched Personal Details:', data);
        console.log('Global Application ID 2:', globalAppId);
        setPersonalDetails({
          ...data,
          applicationId: globalAppId || data.applicationId,
          hasChildren: data.hasChildren ? "Yes" : "No",
          takafulAgent: data.takafulAgent ? "Yes" : "No",
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "",
        });
      } catch (e) {
        setPersonalDetails(null);
      }
    }
    setStage(0);
  };
  const handleBackToAddressContact = async () => {
    if (applicationId !== undefined) {
      try {
        const details = await getAddressContactDetails(Number(applicationId));
        setAddressContactDetails(mapAddressContactDetailsToForm(details));
      } catch (e) {
        setAddressContactDetails(undefined);
      }
    }
    setStage(1);
  };

  const navigate = useNavigate();
  return (
    <>
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #eee', background: '#fff' }}>
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ bgcolor: '#fff0f0', color: '#7C0316', mr: 1 }} onClick={() => navigate('/agent-management-menu')}>
              <ArrowBackIosNewIcon />
            </IconButton>
            <Typography variant="h5" color="#7C0316" fontWeight={700}>
              Agent Onboarding
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">Sanjiv</Typography>
            <Avatar alt="Sanjiv" src="" sx={{ width: 32, height: 32 }} />
          </Box>
        </Toolbar>
      </AppBar>
      {stage === -1 && (
        <AgentSummaryList />
      )}
      {stage === 0 && (
        <PersonalDetailsForm onNext={handlePersonalDetailsNext} initialValues={personalDetails} />
      )}
      {stage === 1 && (
        <AddressContactDetailsForm onNext={handleAddressContactNext} initialValues={addressContactDetails} onBack={handleBackToPersonalDetails} />
      )}
      {stage === 2 && (
        (() => {
          console.log('--- DEBUG: Entering EducationDetailsForm ---');
          console.log('personalDetails:', personalDetails);
          console.log('educationDetails:', educationDetails);
          let initialVals;
          if (personalDetails && personalDetails.nicNo) {
            if (!educationDetails) {
              initialVals = { ...eduDefaultInitialValues, preExamNIC: personalDetails.nicNo };
              console.log('educationDetails is null, using defaultInitialValues with NIC:', initialVals);
            } else {
              initialVals = { ...educationDetails, preExamNIC: educationDetails.preExamNIC || personalDetails.nicNo };
              console.log('educationDetails exists, setting preExamNIC to:', initialVals.preExamNIC);
            }
          } else {
            initialVals = educationDetails || eduDefaultInitialValues;
            console.log('No personalDetails.nicNo, using:', initialVals);
          }
          return (
            <EducationDetailsForm
              applicationId={applicationId ?? ''}
              onNext={handleEducationDetailsNext}
              onBack={handleBackToAddressContact}
              initialValues={initialVals}
            />
          );
        })()
      )}
      {stage === 3 && (
        <WorkDetailsForm
          applicationId={applicationId}
          initialValues={latestWorkDetails || workDetails}
          onNext={handleWorkDetailsNext}
          onBack={() => setStage(2)} // Go back to Education Details
        />
      )}
      {stage === 4 && (
        <BankDetailsForm
          initialValues={bankDetails || {}}
          onSubmit={handleBankDetailsNext}
          onCancel={() => setStage(3)}
        />
      )}
      {stage === 5 && (
        <WorkStationDetailsForm
          applicationId={applicationId}
          initialValues={workStationDetails}
          onNext={handleWorkStationDetailsNext}
          onBack={() => setStage(4)}
        />
      )}
      {stage === 6 && (
        <DocumentLegalComplianceForm
          applicationId={applicationId ?? ''}
          initialValues={documentComplianceDetails}
          onNext={handleDocumentComplianceNext}
          onBack={() => setStage(5)}
        />
      )}
      {stage === 7 && (
        witnessDetailsLoading ? (
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <span>Loading witness details...</span>
          </div>
        ) : (
          <>
            {console.log('AgentOnboarding witnessDetails.signatureFile:', witnessDetails?.signatureFile)}
            <Witness
              applicationId={applicationId ?? ''}
              initialValues={witnessDetails}
              onBack={() => setStage(6)}
              onNext={handleWitnessNext}
              onRefresh={fetchWitnessDetails}
            />
          </>
        )
      )}
      {stage === 8 && (
        <ARIReport ariData={ariScore} onCancel={() => setStage(7)} onSubmit={handleARISubmit} />
      )}
    </>
  );
};

export default AgentOnboarding;

// Simple error boundary for debugging
class ErrorBoundary extends React.Component<any, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // You can log errorInfo here
  }
  render() {
    if (this.state.hasError) {
      return <div style={{ color: '#7C0316', padding: 16 }}>Error: {String(this.state.error)}</div>;
    }
    return this.props.children;
  }
}

// Helper to map backend address/contact details to form fields
function mapAddressContactDetailsToForm(data: any) {
  if (!data) return undefined;
  return {
    email: data.email || '',
    mobile: data.contactMobile || '',
    whatsapp: data.contactWhatsApp || '',
    emergency: data.contactEmergency || '',
    permAddress1: data.permanentAddressLine1 || '',
    permAddress2: data.permanentAddressLine2 || '',
    permCity: data.permanentCityTown || '',
    permProvince: data.permanentProvince || '',
    permDistrict: data.permanentDistrict || '',
    permElectorate: data.permanentElectorate || '',
    permGramaNiladari: data.permanentGramaNiladari || '',
    permDSecretariat: data.permanentDSecretariat || '',
    permPostalCode: data.permanentPostalCode || '',
    sameAsPermanent: data.isCorrespondenceSameAsPermanent || false,
    corrAddress1: data.correspondenceAddressLine1 || '',
    corrAddress2: data.correspondenceAddressLine2 || '',
    corrCity: data.correspondenceCityTown || '',
    province: data.correspondenceProvince || '',
    district: data.correspondenceDistrict || '',
    electorate: data.correspondenceElectorate || '',
    gramaNiladari: data.correspondenceGramaNiladari || '',
    dSecretariat: data.correspondenceDSecretariat || '',
    postalCode: data.correspondencePostalCode || '',
  };
}
