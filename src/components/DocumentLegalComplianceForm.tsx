import React, { useState } from 'react';
import { Box, Typography, Grid, Button, Card, CardContent, useMediaQuery, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import { uploadDocument } from '../services/documentService';

const documentFields = [
	{
		name: 'nicDocument',
		label: 'NIC/ Driving License/ Passport',
		accept: '.jpg',
		required: true,
		type: 'image',
	},
	{
		name: 'photograph',
		label: 'Photograph',
		accept: '.jpg',
		required: true,
		type: 'image',
	},
	{
		name: 'bankPassbook',
		label: 'Bank passbook',
		accept: '.pdf',
		required: true,
		type: 'pdf',
	},
	{
		name: 'gsReport',
		label: 'GS Report',
		accept: '.pdf',
		required: true,
		type: 'pdf',
	},
	{
		name: 'hobMbdReport',
		label: 'HOB / MBD report',
		accept: '.pdf',
		required: true,
		type: 'pdf',
	},
	{
		name: 'interviewGuide',
		label: 'Initial Interview Guide',
		accept: '.pdf',
		required: true,
		type: 'pdf',
	},
	{
		name: 'groupAnnuityForm',
		label: 'Group Annuity Form',
		accept: '.pdf',
		required: true,
		type: 'pdf',
	},
];

const validate = (values: any) => {
	const errors: any = {};
	documentFields.forEach((field) => {
		if (field.required && !values[field.name]) {
			errors[field.name] = 'Required';
		} else if (values[field.name]) {
			const file = values[field.name];
			if (file && file.size > 1024 * 1024) {
				errors[field.name] = 'File must be less than 1MB';
			}
			if (field.accept === '.jpg' && file && file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
				errors[field.name] = 'Only .jpg files allowed';
			}
			if (field.accept === '.pdf' && file && file.type !== 'application/pdf') {
				errors[field.name] = 'Only .pdf files allowed';
			}
		}
	});
	return errors;
};

const DocumentLegalComplianceForm: React.FC<{ applicationId?: string | number, initialValues?: any, onBack?: () => void, onNext?: (values: any) => void }> = ({ applicationId, initialValues, onBack, onNext }) => {
	const isMobile = useMediaQuery('(max-width:600px)');
	const [modalOpen, setModalOpen] = useState(false);
	const [modalDoc, setModalDoc] = useState<any>(null);
	const [modalDocField, setModalDocField] = useState<string>('');

	const formik = useFormik({
		initialValues: initialValues || documentFields.reduce((acc, field) => ({ ...acc, [field.name]: null }), {}),
		validate,
		onSubmit: async (values) => {
			const appId = applicationId || window.localStorage.getItem('currentApplicationId') || '';
			let allUploadsSuccessful = true;
			for (const field of documentFields) {
				const file = values[field.name];
				if (file) {
					try {
						await uploadDocument(String(appId), field.label, file);
					} catch (err) {
						allUploadsSuccessful = false;
					}
				}
			}
			if (allUploadsSuccessful && typeof onNext === 'function') {
				onNext(values);
			}
		},
	});

	const handleFileUpload = async (fieldName: string, file: File) => {
		// Map fieldName to documentType
		const documentTypeMap: Record<string, string> = {
			nicDocument: 'NIC',
			photograph: 'Photograph',
			bankPassbook: 'Bank Passbook',
			gsReport: 'GS Report',
			hobMbdReport: 'HOB/MBD Report',
			interviewGuide: 'Initial Interview Guide',
			groupAnnuityForm: 'Group Annuity Form',
		};
		const documentType = documentTypeMap[fieldName];
		if (!documentType) return;
		try {
			// Replace with your applicationId source
			const appId = applicationId || window.localStorage.getItem('currentApplicationId') || '';
			const doc = await uploadDocument(String(appId), documentType, file);
			formik.setFieldValue(fieldName + 'Id', doc.documentId);
		} catch (err: any) {
			formik.setFieldError(fieldName, err?.response?.data?.error || 'Upload failed');
		}
	};

	const handleView = (field: any) => {
		setModalDoc(formik.values[field.name]);
		setModalDocField(field.name);
		setModalOpen(true);
	};

	const handleDelete = () => {
		formik.setFieldValue(modalDocField, null);
		setModalOpen(false);
		// TODO: Call backend API to delete document if needed
	};

	return (
		<Box
			sx={{
				background: '#fff',
				borderRadius: 3,
				p: { xs: 2, md: 4 },
				boxShadow: 1,
				maxWidth: 1200,
				mx: 'auto',
				my: 4,
			}}
		>
			<form onSubmit={formik.handleSubmit}>
				<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
					<Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 700 }}>
						Registration Application{' '}
						<span style={{ color: '#888', fontWeight: 400 }}>Attachments</span>
					</Typography>
				</Box>
				<Typography variant="body2" sx={{ color: 'error.main', mb: 2 }}>
					* Please note that each attachment should not exceed 1 MB *
				</Typography>
				<Grid container spacing={isMobile ? 2 : 4} alignItems="stretch">
					{documentFields.map((field) => (
						<Grid item xs={12} sm={6} md={4} key={field.name} sx={{ height: '100%' }}>
							<Card sx={{ borderRadius: 3, boxShadow: 0, mb: 2, background: '#fff', border: '1.5px solid #f2f2f2', minHeight: 220, width: '100%', maxWidth: 320, mx: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
								<CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 120 }}>
									<Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#222', mb: 1, textAlign: 'center' }}>
										{field.label} <span style={{ color: '#7C0316' }}>*</span>
									</Typography>

									<Typography variant="body2" sx={{ fontWeight: 500, textAlign: 'center', mb: 1 }}>
										Choose only {field.accept} file to upload
									</Typography>
									{formik.values[field.name] && (
										<Box sx={{ mt: 2, textAlign: 'center' }}>
											<Typography variant="body2" sx={{ fontWeight: 600, color: '#222', mb: 1 }}>
												{formik.values[field.name].name}
											</Typography>
											{field.accept === '.jpg' && (formik.values[field.name].type === 'image/jpeg' || formik.values[field.name].type === 'image/jpg') ? (
												<img
													src={URL.createObjectURL(formik.values[field.name])}
													alt={formik.values[field.name].name}
													style={{ width: 54, height: 54, margin: '0 auto' }}
												/>
											) : null}
											{field.accept === '.pdf' && formik.values[field.name].type === 'application/pdf' ? (
												<img
													src="/assets/pdf-icon.svg"
													alt="PDF icon"
													style={{ width: 54, height: 54, margin: '0 auto' }}
												/>
											) : null}
										</Box>
									)}
									{!formik.values[field.name] && (
										<Button variant="contained" component="label" sx={{ bgcolor: '#7C0316', color: 'white', fontWeight: 600, fontSize: '0.95rem', borderRadius: 2, px: 3, py: 1, mt: 1 }}>
											Upload
											<input
												type="file"
												accept={field.accept}
												hidden
												onChange={e => {
													if (e.currentTarget.files && e.currentTarget.files[0]) {
														formik.setFieldValue(field.name, e.currentTarget.files[0]);
														handleFileUpload(field.name, e.currentTarget.files[0]);
													}
												}}
											/>
										</Button>
									)}
									{formik.errors[field.name] && formik.touched[field.name] && typeof formik.errors[field.name] === 'string' && (
										<Typography color="error" sx={{ mt: 1, fontSize: '0.95rem' }}>
											{formik.errors[field.name]}
										</Typography>
									)}
									<Button
										variant="text"
										sx={{ color: 'error.main', fontWeight: 600, fontSize: '0.95rem', mt: 1 }}
										disabled={!formik.values[field.name]}
										onClick={() => handleView(field)}
									>
										VIEW
									</Button>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
				<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
					<Button variant="outlined" color="error" type="button" onClick={typeof onBack === 'function' ? onBack : undefined}>
						Back
					</Button>
					<Button variant="contained" color="error" type="submit">
						Next
					</Button>
				</Box>
			</form>
			<Modal open={modalOpen} onClose={() => setModalOpen(false)}>
				<Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 3, minWidth: 340, maxWidth: 480 }}>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
						<Typography variant="h6" sx={{ color: 'error.main', fontWeight: 700 }}>
							{modalDocField ? documentFields.find(f => f.name === modalDocField)?.label : ''}
						</Typography>
						<IconButton onClick={() => setModalOpen(false)} sx={{ color: 'error.main' }}>
							<CloseIcon />
						</IconButton>
					</Box>
					<Box sx={{ textAlign: 'center', mb: 2 }}>
						{modalDoc && (modalDoc.type === 'image/jpeg' || modalDoc.type === 'image/jpg') ? (
							<img src={URL.createObjectURL(modalDoc)} alt={modalDoc.name} style={{ maxWidth: '100%', maxHeight: 220 }} />
						) : modalDoc && modalDoc.type === 'application/pdf' ? (
							<iframe src={URL.createObjectURL(modalDoc)} title={modalDoc.name} style={{ width: '100%', height: 220, border: 'none' }} />
						) : null}
						<Typography variant="body2" sx={{ fontWeight: 600, color: '#222', mt: 1 }}>
							{modalDoc?.name}
						</Typography>
					</Box>
					<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
						<Button variant="outlined" color="error" onClick={handleDelete}>Delete</Button>
						<Button variant="contained" color="error" onClick={() => setModalOpen(false)}>Save</Button>
					</Box>
				</Box>
			</Modal>
		</Box>
	);
};

export default DocumentLegalComplianceForm;
