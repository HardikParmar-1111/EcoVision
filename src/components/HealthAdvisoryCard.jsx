/**
 * HealthAdvisoryCard Component
 * Displays a single health advisory with DOs and DON’Ts.
 */
import React from 'react';
import { Thermometer, CloudRain, Wind, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

const HealthAdvisoryCard = ({ advisory }) => {
    const { type, title, severity, condition, dos, donts } = advisory;

    const getIcon = () => {
        switch (type) {
            case 'temperature': return <Thermometer size={24} />;
            case 'rain': return <CloudRain size={24} />;
            case 'wind': return <Wind size={24} />;
            case 'aqi': return <AlertTriangle size={24} />;
            default: return <AlertTriangle size={24} />;
        }
    };

    const getSeverityColor = () => {
        return severity === 'High' ? 'var(--danger)' : 'var(--warning)';
    };

    const getBgColor = () => {
        return severity === 'High' ? 'rgba(244, 63, 94, 0.05)' : 'rgba(245, 158, 11, 0.05)';
    };

    return (
        <div className="card" style={{
            borderLeft: `8px solid ${getSeverityColor()}`,
            background: getBgColor(),
            padding: '2rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ color: getSeverityColor(), padding: '0.8rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        {getIcon()}
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.2rem' }}>{title}</h3>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{condition}</span>
                    </div>
                </div>
                <div style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    background: getSeverityColor(),
                    color: 'white'
                }}>
                    {severity} RISK
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '700' }}>
                        <CheckCircle2 size={18} /> ✅ DOs
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {dos.map((item, i) => (
                            <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.6rem', lineHeight: '1.4', paddingLeft: '0.5rem', borderLeft: '2px solid rgba(16, 185, 129, 0.2)' }}>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '700' }}>
                        <XCircle size={18} /> ❌ DON&apos;Ts
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {donts.map((item, i) => (
                            <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.6rem', lineHeight: '1.4', paddingLeft: '0.5rem', borderLeft: '2px solid rgba(244, 63, 114, 0.2)' }}>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default HealthAdvisoryCard;
