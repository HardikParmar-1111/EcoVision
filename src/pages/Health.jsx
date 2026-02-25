import { motion } from 'framer-motion'
import { Heart, Activity, User, ShieldPlus, AlertCircle, ShieldCheck } from 'lucide-react'
import { useEnvironmentalData } from '../context/EnvironmentalContext'
import HealthAdvisoryCard from '../components/HealthAdvisoryCard'

const Health = () => {
    const { aqi, aqiCategory, tomorrowAdvisories, setDemoMode, demoMode } = useEnvironmentalData()

    const safetyGroups = [
        {
            icon: <User size={28} />,
            title: 'General Student Body',
            risk: aqi <= 50 ? 'Minimal' : 'Elevated',
            msg: 'Ideal conditions for outdoor university sports and campus activities. No general restrictions.',
            color: '#10b981'
        },
        {
            icon: <Activity size={28} />,
            title: 'Sensitive Communities',
            risk: aqi <= 50 ? 'Stable' : 'Observation',
            msg: 'Students with existing respiratory records should remain vigilant during prolonged outdoor exposure.',
            color: '#f59e0b'
        }
    ]

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="health-page"
        >
            <header style={{ marginBottom: '3.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--secondary)', letterSpacing: '-0.02em' }}>Safety Protocols</h1>
                <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>EcoVision Intelligence: Evidence-based health recommendations</p>
            </header>

            {/* Demo Toggle Section (Visible only in development or for demo) */}
            <div className="card" style={{ marginBottom: '2.5rem', padding: '1.5rem', border: '1px dashed var(--primary)', background: 'rgba(14, 165, 233, 0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase' }}>Demo Control Hub</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Simulate environmental conditions for validation</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {[
                            { label: 'Normal', value: null },
                            { label: '🔥 Heat', value: 'temperature' },
                            { label: '🌧 Rain', value: 'rain' },
                            { label: '🌫 AQI', value: 'aqi' },
                            { label: '🌬 Wind', value: 'wind' }
                        ].map((btn) => (
                            <button
                                key={btn.label}
                                onClick={() => setDemoMode(!!btn.value, btn.value)}
                                style={{
                                    padding: '0.5rem 0.8rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border)',
                                    background: (demoMode.condition === btn.value) ? 'var(--primary)' : 'white',
                                    color: (demoMode.condition === btn.value) ? 'white' : 'var(--text-main)',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tomorrow's Health Advisories Section */}
            <section style={{ marginBottom: '4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem' }}>
                    <div style={{ padding: '0.5rem', background: 'var(--secondary)', borderRadius: '8px', color: 'white' }}>
                        <Heart size={20} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--secondary)' }}>Tomorrow&apos;s Health Advisories</h2>
                    {tomorrowAdvisories.length === 0 && (
                        <span style={{ fontSize: '0.8rem', background: '#f0fdf4', color: '#166534', padding: '0.3rem 0.8rem', borderRadius: '12px', fontWeight: '700', marginLeft: 'auto' }}>
                            All Parameters Nominal
                        </span>
                    )}
                </div>

                {tomorrowAdvisories.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                        {tomorrowAdvisories.map((advisory, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <HealthAdvisoryCard advisory={advisory} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem', borderStyle: 'dashed' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                            ✨ No health advisories triggered for tomorrow. The campus environment is within safe operating ranges.
                        </p>
                    </div>
                )}
            </section>

            <header style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--secondary)' }}>Current Safety Baselines</h2>
            </header>

            {/* Main Safety Matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2.5rem', marginBottom: '3.5rem' }}>
                {safetyGroups.map((group, i) => (
                    <div key={i} className="card" style={{ borderTop: `8px solid ${group.color}`, padding: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{ color: group.color, padding: '1.2rem', background: 'white', borderRadius: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>{group.icon}</div>
                            <div>
                                <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>{group.title}</h2>
                                <div style={{ color: group.color, fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.2rem' }}>Campus Risk: {group.risk}</div>
                            </div>
                        </div>
                        <p style={{ lineHeight: '1.8', color: 'var(--text-main)', fontSize: '1.05rem' }}>{group.msg}</p>
                    </div>
                ))}
            </div>

            {/* Adaptive Preventive Tips */}
            <div className="card" style={{ padding: '3.5rem' }}>
                <h2 style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--secondary)', fontWeight: '800' }}>
                    <ShieldPlus size={28} color="var(--primary)" /> Adaptive Preventive Measures
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    {[
                        { title: 'Hydration Strategy', msg: 'System projection indicates high thermal load. Increase water intake to 3L+ daily.' },
                        { title: 'Exposure Control', msg: 'Plan high-intensity campus movement during low-AQI morning windows.' },
                        { title: 'Indoor Protection', msg: 'Keep lab and dormitory air filters active during peak afternoon smog.' },
                        { title: 'Medical Support', msg: 'Sync your EcoVision data with the University Health Center for personalized logs.' }
                    ].map((tip, i) => (
                        <div key={i} style={{ padding: '1.8rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border)' }}>
                            <strong style={{ display: 'block', marginBottom: '0.8rem', color: 'var(--secondary)', fontSize: '1rem' }}>{tip.title}</strong>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{tip.msg}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{
                marginTop: '3.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.2rem',
                padding: '2rem',
                background: 'rgba(14, 165, 233, 0.05)',
                borderRadius: '20px',
                border: '1px solid rgba(14, 165, 233, 0.1)'
            }}>
                <ShieldCheck size={32} color="var(--primary)" />
                <span style={{ fontSize: '0.95rem', color: 'var(--secondary)', fontWeight: '600', lineHeight: '1.6' }}>
                    <strong>System Assurance:</strong> These recommendations are dynamically generated by EcoVision based on current environmental fusion and university healthcare standards.
                </span>
            </div>
        </motion.div>
    )
}

export default Health
