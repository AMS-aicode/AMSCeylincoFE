import { Box, Typography, Grid, Card, CardContent, AppBar, Toolbar, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

// Removed useLocation import
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import InfoIcon from '@mui/icons-material/Info';
import HandshakeIcon from '@mui/icons-material/Handshake';
import { useNavigate } from 'react-router-dom';

const cardData = [
	{
		label: 'Agent Information',
		icon: (
			<Box sx={{ position: 'relative', width: 64, height: 64 }}>
				<ContactPageOutlinedIcon sx={{ fontSize: 56, color: '#222' }} />
				<Box
					sx={{
						position: 'absolute',
						bottom: 8,
						right: 8,
						width: 28,
						height: 28,
						bgcolor: '#7C0316',
						borderRadius: '50%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						boxShadow: 2,
					}}
				>
					<InfoIcon sx={{ color: '#fff', fontSize: 18 }} />
				</Box>
			</Box>
		),
		route: '/agent-management',
		gradient: 'radial-gradient(circle at 80% 20%, #ffd6d6 0%, #ffe3e3 100%)',
	},
	{
		label: 'Agent Onboarding',
		icon: (
			<Box sx={{ position: 'relative', width: 64, height: 64 }}>
				<ContactPageOutlinedIcon sx={{ fontSize: 56, color: '#222' }} />
				<Box
					sx={{
						position: 'absolute',
						bottom: 8,
						right: 8,
						width: 28,
						height: 28,
						bgcolor: '#7C0316',
						borderRadius: '50%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						boxShadow: 2,
					}}
				>
					<HandshakeIcon sx={{ color: '#fff', fontSize: 18 }} />
				</Box>
			</Box>
		),
		route: '/agent-onboarding',
		gradient: 'radial-gradient(circle at 80% 20%, #ffd6d6 0%, #ffe3e3 100%)',
	},
];

	export default function AgentManagementMenu() {
		const navigate = useNavigate();
		// Removed useLocation since highlighting is disabled
		return (
			<>
				<AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #eee', background: '#fff' }}>
					<Toolbar sx={{ minHeight: 64 }}>
						<IconButton sx={{ bgcolor: '#fff0f0', color: '#7C0316', mr: 2 }}>
							<ArrowBackIosNewIcon />
						</IconButton>
						<Typography variant="h5" color="#7C0316" fontWeight={700}>
							Agent Management
						</Typography>
					</Toolbar>
				</AppBar>
				<Box sx={{ mt: 2 }}>
					<Grid container spacing={4} justifyContent="flex-start">
						{cardData.map(card => (
							<Grid item xs={12} sm={6} md={4} key={card.label}>
								<Card
									sx={{
										borderRadius: 4,
										boxShadow: '0 2px 8px rgba(213,0,0,0.08)',
										background: card.gradient,
										cursor: 'pointer',
										transition: 'transform 0.2s',
										'&:hover': {
											transform: 'scale(1.04)',
											boxShadow: '0 4px 16px rgba(213,0,0,0.12)',
										},
										minHeight: 140,
										maxWidth: 260,
										mx: 'auto',
										display: 'flex',
										alignItems: 'center',
										px: 2,
										border: '2px solid transparent',
										// Only one boxShadow property
									}}
									onClick={() => navigate(card.route)}
								>
									<CardContent
										sx={{
											display: 'flex',
											alignItems: 'center',
											gap: 2,
											py: 3,
										}}
									>
										{card.icon}
										<Box>
											<Typography
												variant="h6"
												sx={{
													fontWeight: 700,
													color: '#222',
													fontSize: '1.15rem',
													lineHeight: 1.2,
												}}
											>
												{card.label}
											</Typography>
										</Box>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				</Box>
			</>
		);
	}
