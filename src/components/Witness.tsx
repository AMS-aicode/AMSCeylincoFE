import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { saveWitnessDetails, uploadWitnessSignature, getWitnessDetails } from '../services/witnessService';

const policyButtons = [
  { text: "Agent Agreement" },
  { text: "Code of Conduct" },
  { text: "Anti Corruption and Bribery Policy" },
  { text: "Anti Money Laundering Policy" },
  { text: "Password Usage Guidelines" },
];

const initialWitness = { name: "", nic: "", address: "" };
const initialPolicyAcceptances = {
  "Agent Agreement": false,
  "Code of Conduct": false,
  "Anti Corruption and Bribery Policy": false,
  "Anti Money Laundering Policy": false,
  "Password Usage Guidelines": false,
};

const Witness = ({ onBack, onNext, applicationId, initialValues, onRefresh }: { onBack?: () => void; onNext?: () => void; applicationId: string | number; initialValues?: any; onRefresh?: () => void }) => {
  // Witness details (2 required)
  const [witnesses, setWitnesses] = useState([
    { ...initialWitness },
    { ...initialWitness },
  ]);
  // Policy acceptances
  const [policyAcceptances, setPolicyAcceptances] = useState(initialPolicyAcceptances);
  // Signature upload
  const [signatureError, setSignatureError] = useState("");
  // Loading state for update/save
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [errors, setErrors] = useState<any>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [signature, setSignature] = useState<File | null>(null); // FIX: missing state
  const [openDoc, setOpenDoc] = useState<string>(""); // FIX: missing state

  // Helper to get correct signature preview URL
  const getSignaturePreviewUrl = (file: any) => {
    if (!file) return null;
    // If file is a string and looks like a URL or path, use it
    if (typeof file === 'string') {
      if (file.startsWith('http') || file.startsWith('/uploads/')) {
        return file;
      }
      // If it's just a filename, prepend uploads path
      return `/uploads/${file}`;
    }
    // If file is a File object (from upload), use local preview
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  // Pre-fill form when initialValues change (from AgentOnboarding)
  React.useEffect(() => {
    if (initialValues) {
      setWitnesses([
        { name: initialValues.witness1Name || '', nic: initialValues.witness1NIC || '', address: initialValues.witness1Address || '' },
        { name: initialValues.witness2Name || '', nic: initialValues.witness2NIC || '', address: initialValues.witness2Address || '' },
      ]);
      setPolicyAcceptances(initialValues.policyAcceptances || initialPolicyAcceptances);
    } else {
      setWitnesses([{ ...initialWitness }, { ...initialWitness }]);
      setPolicyAcceptances(initialPolicyAcceptances);
    }
  }, [initialValues]);

  // Show signature preview from backend if present
  React.useEffect(() => {
    // Always reset local signature on initialValues change
    setSignature(null);
    // Debug: log what signatureFile is being received from backend
    console.log('Witness initialValues.signatureFile:', initialValues?.signatureFile);
  }, [initialValues]);

  // In the render function, always compute preview URL from signature or initialValues.signatureFile
  const signaturePreviewUrl = signature ? getSignaturePreviewUrl(signature) : getSignaturePreviewUrl(initialValues?.signatureFile);

  // Handlers
  const handleWitnessChange = (idx: number, field: string, value: string) => {
    const updated = witnesses.map((w, i) =>
      i === idx ? { ...w, [field]: value } : w
    );
    setWitnesses(updated);
  };

  const handlePolicyClick = (policy: string) => setOpenDoc(policy);
  const handlePolicyAccept = (policy: string) => {
    setPolicyAcceptances((prev: any) => ({ ...prev, [policy]: !prev[policy] }));
  };

  // Signature upload handler
  const handleSignatureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignatureError("");
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setSignatureError("Only JPG, JPEG, or PNG files are allowed.");
      setSignature(null);
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setSignatureError("File size must be less than 2MB.");
      setSignature(null);
      return;
    }
    setSignature(file);
    // Upload to backend
    try {
      setLoading(true);
      const result = await uploadWitnessSignature(file);
      setUploadStatus(`Uploaded: ${result.filename}`);
      // Immediately save witness details with new signature file
      await saveWitnessDetails(applicationId, {
        witness1Name: witnesses[0].name,
        witness1NIC: witnesses[0].nic,
        witness1Address: witnesses[0].address,
        witness2Name: witnesses[1].name,
        witness2NIC: witnesses[1].nic,
        witness2Address: witnesses[1].address,
        signatureFile: result.filename, // use uploaded filename
        policyAcceptances,
      });
      // After save, trigger parent refresh to get latest signatureFile from backend
      if (onRefresh) await onRefresh();
    } catch (err) {
      setUploadStatus('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  // Validation
  const validate = () => {
    const newErrors: any = {};
    witnesses.forEach((w, idx) => {
      if (!w.name) newErrors[`witness${idx}Name`] = "Required";
      if (!w.nic) newErrors[`witness${idx}NIC`] = "Required";
      else if (!/^\d{9}[Vv]$/.test(w.nic))
        newErrors[`witness${idx}NIC`] = "NIC must be 9 digits followed by 'V'";
      if (!w.address) newErrors[`witness${idx}Address`] = "Required";
    });
    Object.entries(policyAcceptances).forEach(([k, v]) => {
      if (!v) newErrors[`policy_${k}`] = "Required";
    });
    // Validation passes if either a new signature is uploaded or a backend signature exists
    if (!signature && !initialValues?.signatureFile) newErrors.signature = "Signature required";
    if (signatureError) newErrors.signature = signatureError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Next button handler
  const handleNext = async () => {
    if (!validate()) return;
    setSubmitError(null);
    try {
      // If a signature was uploaded, use its filename from uploadWitnessSignature, else use backend value
      let signatureToSave = initialValues?.signatureFile;
      if (signature) {
        // If signature is a File, it was just uploaded, but we need its filename
        // Try to get the filename from uploadStatus ("Uploaded: filename")
        if (uploadStatus && uploadStatus.startsWith('Uploaded: ')) {
          signatureToSave = uploadStatus.replace('Uploaded: ', '').trim();
        } else if (signature.name) {
          signatureToSave = signature.name;
        }
      }
      await saveWitnessDetails(applicationId, {
        witness1Name: witnesses[0].name,
        witness1NIC: witnesses[0].nic,
        witness1Address: witnesses[0].address,
        witness2Name: witnesses[1].name,
        witness2NIC: witnesses[1].nic,
        witness2Address: witnesses[1].address,
        signatureFile: signatureToSave || '',
        policyAcceptances,
      });
      // After save, trigger parent refresh to get latest witness details from backend
      if (onRefresh) await onRefresh();
      if (onNext) onNext();
    } catch (err: any) {
      setSubmitError(err?.response?.data?.error || 'Failed to save witness details.');
    }
  };

  return (
    <Box sx={{ background: '#fff', borderRadius: 2, p: { xs: 2, md: 4 }, boxShadow: 1, maxWidth: 1100, mx: 'auto', my: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" color="primary" fontWeight={700} mb={2}>
          Registration Application <span style={{ color: '#888', fontWeight: 400 }}>Witness Details</span>
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {[0, 1].map((idx) => (
          <React.Fragment key={idx}>
            <Grid item xs={12} md={4}>
              <TextField
                label={`Witness ${idx + 1} Name *`}
                value={witnesses[idx].name}
                onChange={(e) => handleWitnessChange(idx, "name", e.target.value)}
                error={!!errors[`witness${idx}Name`]}
                helperText={errors[`witness${idx}Name`]}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label={`Witness ${idx + 1} NIC *`}
                value={witnesses[idx].nic}
                onChange={(e) => handleWitnessChange(idx, "nic", e.target.value)}
                error={!!errors[`witness${idx}NIC`]}
                helperText={errors[`witness${idx}NIC`]}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label={`Witness ${idx + 1} Address *`}
                value={witnesses[idx].address}
                onChange={(e) => handleWitnessChange(idx, "address", e.target.value)}
                error={!!errors[`witness${idx}Address`]}
                helperText={errors[`witness${idx}Address`]}
                fullWidth
              />
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 4 }}>
        {policyButtons.map((button) => (
          <Button
            key={button.text}
            variant="outlined"
            sx={{
              color: "#7C0316",
              borderColor: "#7C0316",
              borderRadius: "5px",
              textTransform: "none",
              py: 1,
              fontWeight: 600,
              fontSize: "1.1rem",
              minWidth: 220,
              m: 0.5,
            }}
            onClick={() => handlePolicyClick(button.text)}
          >
            {button.text}
          </Button>
        ))}
      </Box>
      <Box sx={{ mt: 3 }}>
        {policyButtons.map((button) => (
          <Box key={button.text} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Checkbox
              checked={policyAcceptances[button.text as keyof typeof policyAcceptances]}
              onChange={() => handlePolicyAccept(button.text)}
              sx={{ color: "black", "&.Mui-checked": { color: "#7C0316" } }}
            />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              I accept the {button.text}
            </Typography>
            {errors[`policy_${button.text}`] && (
              <Typography color="error" sx={{ ml: 2 }}>
                {errors[`policy_${button.text}`]}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Upload Signature *
        </Typography>
        <Card sx={{ maxWidth: 372, minHeight: 154, borderRadius: "10px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: errors.signature ? "2px solid #7C0316" : undefined }}>
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {signaturePreviewUrl ? (
                <img src={signaturePreviewUrl} alt="Signature Preview" style={{ maxWidth: 200, maxHeight: 80, marginBottom: 8 }} />
              ) : (
                <CloudUploadIcon sx={{ fontSize: 74, color: "#7C0316", mb: 1 }} />
              )}
              {!signaturePreviewUrl && (
                <Button variant="contained" component="label" sx={{ mt: 1, bgcolor: "#7C0316", color: "white" }}>
                  Upload
                  <input type="file" accept="image/jpeg,image/jpg,image/png" hidden onChange={handleSignatureChange} />
                </Button>
              )}
              <Typography variant="body2" sx={{ mt: 1 }}>
                Only JPG, JPEG, or PNG files. Max 2MB.
              </Typography>
              {errors.signature && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {errors.signature}
                </Typography>
              )}
              {uploadStatus && (
                <Typography variant="body2" sx={{ mt: 1 }} color="primary">
                  {uploadStatus}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
        <Button variant="outlined" color="error" type="button" onClick={onBack} sx={{ minWidth: 100, fontWeight: 600, borderRadius: 2, fontSize: '0.95rem', py: 1 }}>
          Back
        </Button>
        <Button variant="contained" color="error" type="button" onClick={onNext} sx={{ minWidth: 100, fontWeight: 600, borderRadius: 2, fontSize: '0.95rem', py: 1 }}>
          Next
        </Button>
      </Box>
      <Dialog open={!!openDoc} onClose={() => setOpenDoc("")} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {openDoc}
          <IconButton onClick={() => setOpenDoc("")}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            This is a sample document for <b>{openDoc}</b>. Replace this with the actual document content or PDF viewer.
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              [Sample content for {openDoc} goes here.]
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDoc("")}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Witness;
