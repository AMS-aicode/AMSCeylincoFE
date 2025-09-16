// Commission Dashboard Card (Donut Chart)
const CommissionDashboardCard = () => {
    // Data and colors
    const commissionData = [64799, 63952, 35260, 20789];
    const commissionColors = ['#205ecf', '#8a2323', '#ff9c4a', '#4b6e1e'];
    const commissionLabels = [
        'Gross Commission',
        'Nett Commission',
        'Hold Commission',
        'Minus Commission',
    ];
    const total = commissionData.reduce((a, b) => a + b, 0);
    // Calculate donut chart slices
    let acc = 0;
    // Increase donut width by reducing the inner radius (donut hole)
    const outerR = 60, innerR = 30, cx = 80, cy = 80;
    const arcs = commissionData.map((val, i) => {
        const start = acc;
        const angle = (val / total) * 360;
        acc += angle;
        const large = angle > 180 ? 1 : 0;
        const startRad = (Math.PI / 180) * (start - 90);
        const endRad = (Math.PI / 180) * (start + angle - 90);
        const x1 = cx + outerR * Math.cos(startRad);
        const y1 = cy + outerR * Math.sin(startRad);
        const x2 = cx + outerR * Math.cos(endRad);
        const y2 = cy + outerR * Math.sin(endRad);
        const x3 = cx + innerR * Math.cos(endRad);
        const y3 = cy + innerR * Math.sin(endRad);
        const x4 = cx + innerR * Math.cos(startRad);
        const y4 = cy + innerR * Math.sin(startRad);
        return {
            d: `M${x1},${y1} A${outerR},${outerR} 0 ${large},1 ${x2},${y2} L${x3},${y3} A${innerR},${innerR} 0 ${large},0 ${x4},${y4} Z`,
            color: commissionColors[i],
            value: val,
            label: commissionLabels[i],
            midAngle: start + angle / 2,
        };
    });
    // For value labels on arcs
    const valueLabels = arcs.map((arc, i) => {
        const angle = (Math.PI / 180) * (arc.midAngle - 90);
        // Place labels just outside the inner radius for best visibility
        const x = cx + 44 * Math.cos(angle);
        const y = cy + 44 * Math.sin(angle) + 2;
        return (
            <text
                key={i}
                x={x}
                y={y}
                fontSize="10"
                fill="#fff"
                fontWeight="600"
                textAnchor="middle"
                style={{ textShadow: '0 1px 4px #8888' }}
            >
                {arc.value.toLocaleString()}
            </text>
        );
    });
    return (
        <div className="dashboard-card commission-dashboard-card">
            <div className="commission-card-header">
                <div className="commission-header-block">
                    <div className="commission-amount">LKR 184,800</div>
                    <div className="commission-label-row">
                        <span className="commission-label">Total Commission</span>
                        <span className="commission-percentage">+29.3%</span>
                    </div>
                </div>
            </div>
            <div className="commission-donut-wrapper">
                <svg width="200" height="200" viewBox="0 0 160 160" className="commission-donut">
                    {arcs.map((arc, i) => (
                        <path key={i} d={arc.d} fill={arc.color} />
                    ))}
                    {/* Donut hole (smaller for thicker donut) */}
                    <circle cx="80" cy="80" r="30" fill="#fff" />
                    {/* Center label */}
                    <text x="80" y="80" textAnchor="middle" fontSize="15" fill="#b0b8c9" fontWeight="400" dy="7">In LKR</text>
                    {valueLabels}
                </svg>
            </div>
            <div className="commission-legend-grid">
                <div className="legend-item"><span className="legend-dot" style={{ background: '#205ecf' }} /> Gross Commission</div>
                <div className="legend-item"><span className="legend-dot" style={{ background: '#8a2323' }} /> Nett Commission</div>
                <div className="legend-item"><span className="legend-dot" style={{ background: '#ff9c4a' }} /> Hold Commission</div>
                <div className="legend-item"><span className="legend-dot" style={{ background: '#4b6e1e' }} /> Minus Commission</div>
            </div>
        </div>
    );
};
import React from 'react';
import './Dashboard.css';


// Dummy data for the first 4 cards
const policiesSoldData = [
    { week: 'week 1', Retirement: 22, Pension: 14, Annuity: 12 },
    { week: 'week 2', Retirement: 28, Pension: 18, Annuity: 16 },
    { week: 'week 3', Retirement: 41, Pension: 22, Annuity: 28 },
    { week: 'week 4', Retirement: 35, Pension: 19, Annuity: 21 },
];
const premiumCollectedData = [22000, 41000, 67000, 82000];
const commissionData = [64799, 20789, 35260, 63952]; // gross, minus, nett, hold
const incentivesData = [9000, 12000, 15500, 21000];
const allowancesData = [7000, 9500, 12000, 15000];

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            {/* Date Range and Performance Analytics */}
            <div className="dashboard-header">
                <div className="dashboard-date-range">
                    <span className="calendar-icon">📅</span>
                    <span className="date-range">03 Jan - 04 Feb 2025</span>
                </div>
                <button className="performance-analytics-btn">Performance Analytics</button>
            </div>

            {/* Top Cards */}
            <div className="dashboard-top-cards">
                <div className="dashboard-card policies-sold" style={{ padding: 0, overflow: 'visible', boxShadow: '0 2px 12px rgba(80,120,200,0.07)' }}>
                    <div style={{ padding: '24px 24px 0 24px', background: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: 44, fontWeight: 700, color: '#111', lineHeight: 1 }}>616</div>
                                <div style={{ fontSize: 20, color: '#4971b8', fontWeight: 500, marginTop: 2 }}>Total<br />Policies Sold</div>
                            </div>
                            <div style={{ background: '#fff3e0', color: '#d17b00', fontWeight: 600, fontSize: 18, borderRadius: 8, border: '1px solid #ffd6a0', padding: '4px 18px', marginTop: 6, boxShadow: '0 1px 4px #ffe0b2' }}>+1.8 %</div>
                        </div>
                    </div>
                    <div style={{ background: '#fff', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, marginTop: 8, padding: '0 0 8px 0', boxShadow: '0 2px 12px rgba(80,120,200,0.03)' }}>
                        <svg width="100%" height="180" viewBox="0 0 260 180" style={{ background: 'none', borderRadius: 12, marginTop: 0 }}>
                            {/* Y Axis grid lines and labels */}
                            {[0, 10, 20, 30, 40, 50].map((y) => (
                                <g key={y}>
                                    <line x1="48" x2="240" y1={140 - y * 2} y2={140 - y * 2} stroke="#e0e3ea" strokeWidth="1" />
                                    <text x="38" y={144 - y * 2} fontSize="13" fill="#8a97b3" textAnchor="end">{y}</text>
                                </g>
                            ))}
                            {/* X Axis labels */}
                            {policiesSoldData.map((week, i) => (
                                <text key={week.week} x={68 + i * 55} y={165} fontSize="15" fill="#8a97b3" textAnchor="middle">{week.week}</text>
                            ))}
                            {/* Bars: Retirement (blue), Pension (red), Annuity (green) */}
                            {policiesSoldData.map((week, i) => (
                                <g key={i}>
                                    {/* Retirement */}
                                    <rect x={58 + i * 45} y={140 - week.Retirement * 2} width="12" height={week.Retirement * 2} fill="#2d6cdf" rx="3" />
                                    {/* Pension */}
                                    <rect x={72 + i * 45} y={140 - week.Pension * 2} width="12" height={week.Pension * 2} fill="#8a2323" rx="3" />
                                    {/* Annuity */}
                                    <rect x={86 + i * 45} y={140 - week.Annuity * 2} width="12" height={week.Annuity * 2} fill="#5b7c1a" rx="3" />
                                </g>
                            ))}
                            {/* Y Axis label */}
                            <text x="18" y="70" fontSize="15" fill="#8a97b3" textAnchor="middle" transform="rotate(-90 18 70)">Policies Sold</text>
                        </svg>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginTop: 8, marginBottom: 2 }}>
                            <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: 7, background: '#2d6cdf', marginRight: 6 }}></span>
                            <span style={{ fontSize: 15, color: '#4971b8', marginRight: 10 }}>Retirement</span>
                            <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: 7, background: '#8a2323', marginRight: 6 }}></span>
                            <span style={{ fontSize: 15, color: '#4971b8', marginRight: 10 }}>Pension</span>
                            <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: 7, background: '#5b7c1a', marginRight: 6 }}></span>
                            <span style={{ fontSize: 15, color: '#4971b8' }}>Annuity</span>
                        </div>
                    </div>
                </div>
                {/* Premium Collected Card - Redesigned */}
                <div className="dashboard-card premium-collected redesigned-premium-card">
                    <div className="premium-card-header">
                        <div className="premium-amount">LKR 1,848,000</div>
                        <div className="premium-label-row">
                            <span className="premium-label">Total Premium Collected</span>
                            <span className="premium-percentage positive">+2.48 %</span>
                        </div>
                    </div>
                    <div className="premium-card-chart" style={{ position: 'relative', minHeight: 140, background: 'transparent' }}>
                        <div className="premium-y-axis-labels">
                            <span style={{ top: 6 }}>80,000</span>
                            <span style={{ top: 31 }}>60,000</span>
                            <span style={{ top: 56 }}>40,000</span>
                            <span style={{ top: 81 }}>20,000</span>
                        </div>
                        <svg width="100%" height="140" viewBox="0 0 200 100" className="premium-line-chart">
                            {/* Y grid lines - more visible */}
                            <line x1="40" y1="20" x2="200" y2="20" stroke="#b0b8c9" strokeWidth="1.2" strokeDasharray="4 2" />
                            <line x1="40" y1="45" x2="200" y2="45" stroke="#b0b8c9" strokeWidth="1.2" strokeDasharray="4 2" />
                            <line x1="40" y1="70" x2="200" y2="70" stroke="#b0b8c9" strokeWidth="1.2" strokeDasharray="4 2" />
                            <polyline
                                fill="none"
                                stroke="#2d6cdf"
                                strokeWidth="3"
                                points={premiumCollectedData.map((v, i) => `${40 + i * 50},${100 - (v / 100000 * 80)}`).join(' ')}
                            />
                            {premiumCollectedData.map((v, i) => (
                                <circle key={i} cx={40 + i * 50} cy={100 - (v / 100000 * 80)} r="6" fill="#2d6cdf" stroke="#fff" strokeWidth="2" />
                            ))}
                        </svg>
                        <div className="premium-chart-labels-abs">
                            <span style={{ left: 80 }}>week 1</span>
                            <span style={{ left: 130 }}>week 2</span>
                            <span style={{ left: 180 }}>week 3</span>
                            <span style={{ left: 230 }}>week 4</span>
                        </div>
                    </div>
                </div>
                {/* Total Commission Card - Donut Chart */}
                <CommissionDashboardCard />
                <div className="dashboard-card incentives-allowances">
                    <div className="card-header">
                        <div>
                            <div className="card-title">LKR 92,400</div>
                            <div className="card-subtitle">Total Incentives & Allowances</div>
                        </div>
                        <div className="card-percentage positive">+13.48 %</div>
                    </div>
                    <div className="card-chart">
                        {/* Custom SVG bar chart for Incentives & Allowances */}
                        <div style={{ width: '100%', height: 210, padding: '0 8px 0 0', boxSizing: 'border-box' }}>
                            <svg width="100%" height="210" viewBox="0 0 320 210">
                                {/* Y grid lines and labels */}
                                {[25000, 20000, 15000, 10000, 5000].map((y, idx) => (
                                    <g key={y}>
                                        <line x1="50" x2="310" y1={30 + idx * 36} y2={30 + idx * 36} stroke="#b0c4de" strokeWidth="1" />
                                        <text x="44" y={34 + idx * 36} fontSize="13" fill="#7a8ca7" textAnchor="end" fontFamily="Inter, Arial, sans-serif">{(y / 1000).toString().replace('.0', '') + 'k'}</text>
                                    </g>
                                ))}
                                {/* Y axis label */}
                                <text x="10" y="120" fontSize="13" fill="#7a8ca7" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" transform="rotate(-90 10 120)">Incentives &amp; Allowances in LKR</text>
                                {/* X axis labels and bars */}
                                {['week 1', 'week 2', 'week 3', 'week 4'].map((label, i) => {
                                    // Bar heights (max 25,000)
                                    const inc = incentivesData[i];
                                    const all = allowancesData[i];
                                    const incH = Math.max(0, Math.min(inc, 25000)) / 25000 * 180;
                                    const allH = Math.max(0, Math.min(all, 25000)) / 25000 * 180;
                                    const x = 70 + i * 60;
                                    return (
                                        <g key={label}>
                                            {/* Allowances bar (green) */}
                                            <rect x={x + 10} y={210 - 20 - allH} width="16" height={allH} rx="4" fill="#6b7e2c" />
                                            {/* Incentives bar (red) */}
                                            <rect x={x - 10} y={210 - 20 - incH} width="16" height={incH} rx="4" fill="#7c0316" />
                                            {/* X axis label */}
                                            <text x={x} y={205} fontSize="15" fill="#4971b8" textAnchor="middle" fontFamily="Inter, Arial, sans-serif">{label}</text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28, marginTop: 8 }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 14, borderRadius: 7, background: '#7c0316', display: 'inline-block' }}></span><span style={{ color: '#7c0316', fontWeight: 600, fontSize: 15 }}>Incentives</span></span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 14, borderRadius: 7, background: '#6b7e2c', display: 'inline-block' }}></span><span style={{ color: '#6b7e2c', fontWeight: 600, fontSize: 15 }}>Allowances</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Cards */}
            <div className="dashboard-bottom-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
                <div className="dashboard-card agent-360" style={{ background: 'linear-gradient(135deg, #8bc49bff 0%, #8dbc8fff 100%)', borderRadius: 18, boxShadow: '0 2px 8px #e3eafc', padding: '24px 20px' }}>
                    <div className="card-header" style={{ marginBottom: 12 }}>
                        <div className="card-title" style={{ fontWeight: 700, fontSize: 22, color: '#000' }}>Agent 360</div>
                        <button className="see-all-btn" style={{ background: '#fff', color: '#1a7f37', borderRadius: 8, padding: '4px 16px', fontWeight: 600, border: 'none', fontSize: 14, cursor: 'pointer' }}>See All</button>
                    </div>
                    <div className="agent-360-stats" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div style={{ textAlign: 'center' }}>
                            <div className="stat-value" style={{ fontWeight: 700, fontSize: 22, color: '#fff' }}>93</div>
                            <div className="stat-label" style={{ color: '#e0e0e0', fontSize: 14 }}>Active</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div className="stat-value" style={{ fontWeight: 700, fontSize: 22, color: '#fff' }}>7</div>
                            <div className="stat-label" style={{ color: '#e0e0e0', fontSize: 14 }}>Onboarded</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div className="stat-value" style={{ fontWeight: 700, fontSize: 22, color: '#fff' }}>18</div>
                            <div className="stat-label" style={{ color: '#e0e0e0', fontSize: 14 }}>Promoted</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div className="stat-value" style={{ fontWeight: 700, fontSize: 22, color: '#fff' }}>27</div>
                            <div className="stat-label" style={{ color: '#e0e0e0', fontSize: 14 }}>Transferred</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div className="stat-value" style={{ fontWeight: 700, fontSize: 22, color: '#fff' }}>11</div>
                            <div className="stat-label" style={{ color: '#e0e0e0', fontSize: 14 }}>Reclassified</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div className="stat-value" style={{ fontWeight: 700, fontSize: 22, color: '#fff' }}>4</div>
                            <div className="stat-label" style={{ color: '#e0e0e0', fontSize: 14 }}>Terminated</div>
                        </div>
                    </div>
                </div>
                <div className="dashboard-card pipeline-report" style={{ background: 'linear-gradient(135deg, #f6e0d6ff 0%, #f5d5b3ff 100%)', borderRadius: 18, boxShadow: '0 2px 8px #e3eafc', padding: '24px 20px' }}>
                    <div className="card-header">
                        <div className="card-title">Projected Pipeline Report</div>
                        <button className="see-all-btn">See All</button>
                    </div>
                    <div className="pipeline-funnel">
                        <div style={{ width: '100%', alignSelf: 'center' }} className="funnel-stage">10%-30% <span>SUSPECT(128)</span></div>
                        <div style={{ width: '90%', alignSelf: 'center' }} className="funnel-stage">30%-60% <span>PROSPECT(92)</span></div>
                        <div style={{ width: '80%', alignSelf: 'center' }} className="funnel-stage">70%-90% <span>LEADS(72)</span></div>
                        <div style={{ width: '70%', alignSelf: 'center' }} className="funnel-stage">100% <span>CUSTOMER(62)</span></div>
                    </div>
                </div>
                <div className="dashboard-card team-kpi" style={{ background: 'linear-gradient(135deg, #8bc49bff 0%, #8dbc8fff 100%)', borderRadius: 18, boxShadow: '0 2px 8px #e3eafc', padding: '24px 20px' }}>
                    <div className="card-header">
                        <div className="card-title">Team KPI</div>
                        <button className="see-all-btn">View Report</button>
                    </div>
                    <div className="kpi-gauge">
                        {/* SVG Meter for Team KPI - responsive */}
                        <div style={{ width: '100%', maxWidth: 180, margin: '0 auto' }}>
                            <svg width="100%" height="100" viewBox="0 0 80 48" preserveAspectRatio="xMidYMid meet" style={{ display: 'block', width: '100%' }}>
                                <path d="M10 40 A30 30 0 0 1 70 40" fill="none" stroke="#e0e0e0" strokeWidth="8" />
                                <path d="M10 40 A30 30 0 0 1 64 22" fill="none" stroke="#1a7f37" strokeWidth="8" />
                                <circle cx="40" cy="40" r="6" fill="#fff" stroke="#1a7f37" strokeWidth="2" />
                                <rect x="38" y="18" width="4" height="22" rx="2" fill="#1a7f37" transform="rotate(-25 40 40)" />
                            </svg>
                        </div>
                        <div className="gauge-value">85</div>
                        <div className="gauge-label">Dark Green</div>
                    </div>
                </div>
                <div className="dashboard-card individual-kpi" style={{ background: 'linear-gradient(135deg, #8bc49bff 0%, #8dbc8fff 100%)', borderRadius: 18, boxShadow: '0 2px 8px #e3eafc', padding: '24px 20px' }}>
                    <div className="card-header">
                        <div className="card-title">Individual KPI</div>
                        <button className="see-all-btn">View Report</button>
                    </div>
                    <div className="kpi-gauge">
                        {/* SVG Meter for Individual KPI - responsive */}
                        <div style={{ width: '100%', maxWidth: 180, margin: '0 auto' }}>
                            <svg width="100%" height="100" viewBox="0 0 80 48" preserveAspectRatio="xMidYMid meet" style={{ display: 'block', width: '100%' }}>
                                <path d="M10 40 A30 30 0 0 1 70 40" fill="none" stroke="#e0e0e0" strokeWidth="8" />
                                <path d="M10 40 A30 30 0 0 1 68 28" fill="none" stroke="#43a047" strokeWidth="8" />
                                <circle cx="40" cy="40" r="6" fill="#fff" stroke="#43a047" strokeWidth="2" />
                                <rect x="38" y="18" width="4" height="22" rx="2" fill="#43a047" transform="rotate(-15 40 40)" />
                            </svg>
                        </div>
                        <div className="gauge-value">89</div>
                        <div className="gauge-label">Green</div>
                    </div>
                </div>



            </div>
        </div>
    );
};

export default Dashboard;
