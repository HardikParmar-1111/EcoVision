import { motion } from 'framer-motion'
import { Thermometer, Droplets, Wind, ShieldCheck, Sun, Cloud, Info } from 'lucide-react'
import { useEnvironmentalData } from '../context/EnvironmentalContext'

const Weather = () => {
    const {
        temp = 0,
        humidity = 0,
        windSpeed = 0,
        condition = 'Offline',
        CAMPUS_LOCATION = {},
        todayWeatherAdvisory,
        tomorrowWeatherAdvisory
    } = useEnvironmentalData()

    const weatherMetrics = [
        { label: 'Ambient Temperature', value: temp || 0, unit: '°C', icon: <Thermometer />, color: '#ef4444' },
        { label: 'Relative Humidity', value: humidity || 0, unit: '%', icon: <Droplets />, color: '#3b82f6' },
        { label: 'Wind Velocity', value: windSpeed || 0, unit: 'km/h', icon: <Wind />, color: '#10b981' }
    ]

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="weather-page"
        >
            <header style={{ marginBottom: '3.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--secondary)', letterSpacing: '-0.02em' }}>Temperature & Heat</h1>
                <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>CHARUSAT EcoVision High-Precision Weather Monitoring for CHARUSAT Campus</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
                {weatherMetrics.map((metric, i) => (
                    <div key={i} className="card" style={{ padding: '2.5rem' }}>
                        <div style={{
                            color: metric.color,
                            background: 'white',
                            width: '64px',
                            height: '64px',
                            borderRadius: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1.5rem',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
                        }}>
                            {metric.icon}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '0.5rem' }}>{metric.label}</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--secondary)', letterSpacing: '-0.04em' }}>{metric.value}</span>
                            <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-muted)' }}>{metric.unit}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2.5rem' }}>
                <div className="card" style={{ padding: '3rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Sun size={24} color="var(--warning)" /> Current Atmosphere
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                        <div style={{
                            background: 'rgba(245, 158, 11, 0.05)',
                            padding: '2.5rem',
                            borderRadius: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            {condition?.toLowerCase().includes('clear') || condition?.toLowerCase().includes('sun') ? <Sun size={64} color="#f59e0b" /> : <Cloud size={64} color="#64748b" />}
                            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--secondary)', marginTop: '1.5rem' }}>{condition || 'Unknown Atmosphere'}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
                                Atmospheric conditions at <strong>{CAMPUS_LOCATION.name}</strong> are verified through EcoVision cluster nodes. Relative thermal indices are within academic safety limits.
                            </p>
                            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem' }}>
                                <ShieldCheck size={20} /> CHARUSAT Security Sync Active
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ background: 'var(--secondary)', color: 'white', padding: '3.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Info size={20} color="var(--primary)" /> Academic Attribution
                    </h3>
                    <p style={{ opacity: 0.8, lineHeight: '1.7', fontSize: '0.95rem' }}>
                        CHARUSAT EcoVision Temperature & Heat Intelligence uses Open-Meteo cluster algorithms to provide real-time campus data. This module is essential for micro-meteorological studies.
                    </p>
                    <div style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                        <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>STATION ID</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '0.1em' }}>ECOV_T1_ANAND</div>
                    </div>
                </div>
            </div>

            {/* Weather Advisory Sections */}
            <div style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {todayWeatherAdvisory && (todayWeatherAdvisory.advisory.dos.length > 0 || todayWeatherAdvisory.advisory.donts.length > 0 || todayWeatherAdvisory.suggestions.length > 0) && (
                    <section>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <ShieldCheck size={28} color="var(--primary)" /> TODAY&apos;S CAMPUS ADVISORY ({todayWeatherAdvisory.date})
                        </h2>
                        <div className="card" style={{ padding: '2.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
                                {todayWeatherAdvisory.advisory.dos.length > 0 && (
                                    <div>
                                        <h4 style={{ color: 'var(--accent)', fontWeight: '800', marginBottom: '1rem', fontSize: '1rem' }}>✅ DOs</h4>
                                        <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-main)', lineHeight: '1.8' }}>
                                            {todayWeatherAdvisory.advisory.dos.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                    </div>
                                )}
                                {todayWeatherAdvisory.advisory.donts.length > 0 && (
                                    <div>
                                        <h4 style={{ color: 'var(--danger)', fontWeight: '800', marginBottom: '1rem', fontSize: '1rem' }}>❌ DON&apos;Ts</h4>
                                        <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-main)', lineHeight: '1.8' }}>
                                            {todayWeatherAdvisory.advisory.donts.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                    </div>
                                )}
                                {todayWeatherAdvisory.suggestions.length > 0 && (
                                    <div>
                                        <h4 style={{ color: 'var(--primary)', fontWeight: '800', marginBottom: '1rem', fontSize: '1rem' }}>🏛 UNIVERSITY SUGGESTIONS</h4>
                                        <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-main)', lineHeight: '1.8' }}>
                                            {todayWeatherAdvisory.suggestions.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {tomorrowWeatherAdvisory && (tomorrowWeatherAdvisory.advisory.dos.length > 0 || tomorrowWeatherAdvisory.advisory.donts.length > 0 || tomorrowWeatherAdvisory.suggestions.length > 0) && (
                    <section>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <Cloud size={28} color="var(--primary)" /> TOMORROW&apos;S CAMPUS ADVISORY ({tomorrowWeatherAdvisory.date})
                        </h2>
                        <div className="card" style={{ padding: '2.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
                                {tomorrowWeatherAdvisory.advisory.dos.length > 0 && (
                                    <div>
                                        <h4 style={{ color: 'var(--accent)', fontWeight: '800', marginBottom: '1rem', fontSize: '1rem' }}>✅ DOs</h4>
                                        <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-main)', lineHeight: '1.8' }}>
                                            {tomorrowWeatherAdvisory.advisory.dos.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                    </div>
                                )}
                                {tomorrowWeatherAdvisory.advisory.donts.length > 0 && (
                                    <div>
                                        <h4 style={{ color: 'var(--danger)', fontWeight: '800', marginBottom: '1rem', fontSize: '1rem' }}>❌ DON&apos;Ts</h4>
                                        <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-main)', lineHeight: '1.8' }}>
                                            {tomorrowWeatherAdvisory.advisory.donts.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                    </div>
                                )}
                                {tomorrowWeatherAdvisory.suggestions.length > 0 && (
                                    <div>
                                        <h4 style={{ color: 'var(--primary)', fontWeight: '800', marginBottom: '1rem', fontSize: '1rem' }}>🏛 UNIVERSITY SUGGESTIONS</h4>
                                        <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-main)', lineHeight: '1.8' }}>
                                            {tomorrowWeatherAdvisory.suggestions.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* Fail-safe message if no advisories exist for both */}
                {(!todayWeatherAdvisory || (!todayWeatherAdvisory.advisory.dos.length && !todayWeatherAdvisory.advisory.donts.length && !todayWeatherAdvisory.suggestions.length)) &&
                    (!tomorrowWeatherAdvisory || (!tomorrowWeatherAdvisory.advisory.dos.length && !tomorrowWeatherAdvisory.advisory.donts.length && !tomorrowWeatherAdvisory.suggestions.length)) && (
                        <div className="card" style={{ textAlign: 'center', padding: '3rem', opacity: 0.6 }}>
                            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>No weather advisories for campus safety at this time.</p>
                        </div>
                    )}
            </div>
        </motion.div>
    )
}

export default Weather
