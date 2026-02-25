import { useState, useEffect, createContext, useContext } from 'react'
import { getWeatherData } from '../services/weatherService'
import { getDetailedAqiData } from '../services/aqiService'
import { getHistoricalAnalytics } from '../services/historicalService'
import { notificationService } from '../services/notificationService'
import { generateHealthAdvisories } from '../utils/healthAdvisoryEngine'
import { generateAdvisory, generateUniversitySuggestions } from '../utils/weatherAdvisoryEngine'

const EnvironmentalContext = createContext()

export const useEnvironmentalData = () => useContext(EnvironmentalContext)

// EcoVision Core: Location-Locked to CHARUSAT University
const CAMPUS_LOCATION = {
    lat: 22.5645,
    lng: 72.9289,
    name: 'CHARUSAT University, Anand',
    region: 'Gujarat, India'
}

export const EnvironmentalProvider = ({ children }) => {
    const [data, setData] = useState({
        aqi: 0,
        aqiCategory: 'Initializing...',
        temp: 0,
        humidity: 0,
        windSpeed: 0,
        condition: '...',
        lastUpdated: '...',
        loading: true,
        error: null,
        forecastDays: [],
        forecastSummary: {
            avgAqi: 0,
            maxTemp: 0,
            highlight: 'Scanning upcoming patterns...'
        },
        alerts: [],
        advisories: [],
        tomorrowAdvisories: [],
        todayWeatherAdvisory: null,
        tomorrowWeatherAdvisory: null,
        historicalComparison: null,
        demoMode: {
            active: false,
            condition: null // 'temperature' | 'rain' | 'aqi' | 'wind'
        }
    })

    const generateAdvisories = (weather, aqi) => {
        const suggestions = [];
        const currentTemp = weather.current.temp;
        const currentAqi = aqi.aqi;
        const wind = weather.current.windSpeed;
        const cond = weather.current.condition.toLowerCase();

        // 1. Temperature Logic
        if (currentTemp > 40) {
            suggestions.push({
                id: 'temp-high',
                title: 'Heatwave Advisory',
                message: 'Extreme temperature detected. Recommend limiting outdoor academic activities and increasing water availability across campus cooling areas.',
                type: 'danger'
            });
        } else if (currentTemp > 35) {
            suggestions.push({
                id: 'temp-med',
                title: 'High Thermal Load',
                message: 'Improving hostel ventilation and ensuring functional cooling systems is advised for student comfort.',
                type: 'warning'
            });
        }

        // 2. Air Quality Logic
        if (currentAqi > 200) {
            suggestions.push({
                id: 'aqi-critical',
                title: 'Severe AQI Alert',
                message: 'Atmospheric toxicity is high. Advise immediate reduction of outdoor exposure and cancellation of outdoor sports events.',
                type: 'danger'
            });
        } else if (currentAqi > 150) {
            suggestions.push({
                id: 'aqi-unhealthy',
                title: 'Air Quality Warning',
                message: 'Current AQI suggests avoiding outdoor physical education and high-intensity sports on campus.',
                type: 'warning'
            });
        } else if (currentAqi < 50) {
            suggestions.push({
                id: 'aqi-good',
                title: 'Safe Atmospheric Zone',
                message: 'Ideal conditions for outdoor events and university-wide recreational activities.',
                type: 'success'
            });
        }

        // 3. Rain & Storm Logic
        if (cond.includes('rain') || cond.includes('thunderstorm')) {
            suggestions.push({
                id: 'rain-alert',
                title: 'Precipitation Warning',
                message: 'Heavy rain detected/forecast. Alert maintenance team for drainage inspection and avoid ground-based events.',
                type: 'info'
            });
        }

        // 4. Wind & Structural Safety
        if (wind > 30) {
            suggestions.push({
                id: 'wind-alert',
                title: 'Structural Safety Advisory',
                message: 'High wind velocity detected. Secure temporary campus structures and reschedule vulnerable outdoor installations.',
                type: 'warning'
            });
        }

        return suggestions;
    };

    const getDemoData = (condition) => {
        switch (condition) {
            case 'temperature':
                return { temp: 42, rainProbability: 10, windSpeed: 15, aqi: 80 };
            case 'rain':
                return { temp: 28, rainProbability: 85, windSpeed: 20, aqi: 45 };
            case 'aqi':
                return { temp: 32, rainProbability: 5, windSpeed: 10, aqi: 210 };
            case 'wind':
                return { temp: 30, rainProbability: 15, windSpeed: 55, aqi: 65 };
            default:
                return null;
        }
    };

    const fetchEnvironmentalData = async () => {
        try {
            // Intelligent Data Fetching: Parallel Service Execution
            const [weather, aqiDetails, history] = await Promise.all([
                getWeatherData(),
                getDetailedAqiData(),
                getHistoricalAnalytics()
            ]);

            const aqi = aqiDetails.current;
            const advisories = generateAdvisories(weather, aqi);

            // Tomorrow's Health Advisories logic
            let tomorrowAdvisories = [];
            const tomorrowWeather = weather.forecast[1];
            const tomorrowAqiData = aqiDetails.forecast.find(f => f.dayIndex === 1);

            if (data.demoMode.active && data.demoMode.condition) {
                const demoData = getDemoData(data.demoMode.condition);
                if (demoData) {
                    tomorrowAdvisories = generateHealthAdvisories(demoData);
                }
            } else if (tomorrowWeather && tomorrowAqiData) {
                tomorrowAdvisories = generateHealthAdvisories({
                    temp: tomorrowWeather.maxTemp,
                    rainProbability: tomorrowWeather.rainProb,
                    windSpeed: weather.current.windSpeed, // Using current as proxy if forecast wind unavailable
                    aqi: tomorrowAqiData.maxAqi
                });
            }

            const alerts = []
            if (aqi.aqi > 100) {
                alerts.push({
                    id: 201,
                    type: 'Air Quality Alert',
                    severity: 'High',
                    message: `Current AQI (${aqi.aqi}) is ${aqi.category.toLowerCase()}. Minimize outdoor academic activities.`
                })
            }
            if (weather.current.temp > 40) {
                alerts.push({
                    id: 202,
                    type: 'Heat Warning',
                    severity: 'Critical',
                    message: 'Extreme temperature detected. Campus hydration protocols advised.'
                })
            }

            // Map AQI forecast into weather forecast days
            const forecastDays = weather?.forecast.map((day, i) => {
                const aqiDay = aqiDetails.forecast.find(f => f.dayIndex === i);
                return {
                    ...day,
                    aqi: aqiDay?.maxAqi || 0,
                    aqiCategory: aqiDay?.category || 'N/A'
                };
            }) || [];

            setData(prev => ({
                ...prev,
                aqi: aqi.aqi,
                aqiCategory: aqi.category,
                temp: weather?.current?.temp ?? 0,
                humidity: weather?.current?.humidity ?? 0,
                windSpeed: weather?.current?.windSpeed ?? 0,
                condition: weather?.current?.condition ?? '...',
                lastUpdated: new Date().toLocaleString(),
                loading: false,
                error: null,
                forecastDays,
                aqiHistory: aqiDetails.history || [],
                forecastSummary: {
                    avgAqi: aqi.aqi,
                    maxTemp: forecastDays.length > 0 ? Math.max(...forecastDays.map(d => d.maxTemp)) : 0,
                    highlight: aqi.aqi > 80
                        ? 'Predictive Insight: Elevated aerosols detected in regional air mass.'
                        : 'EcoVision Projection: Environmentally stable week ahead'
                },
                alerts,
                advisories,
                tomorrowAdvisories,
                historicalComparison: history.status === 'ok' ? history.comparison : null,
                // Particulate details for AQI page
                details: {
                    pm25: aqi.pm25,
                    pm10: aqi.pm10,
                    o3: aqi.o3,
                    station: aqi.station
                },
                todayWeatherAdvisory: forecastDays[0] ? {
                    date: forecastDays[0].date,
                    advisory: generateAdvisory({
                        maxTemp: forecastDays[0].maxTemp,
                        rain: forecastDays[0].rainProb,
                        wind: weather?.current?.windSpeed ?? null,
                        aqi: forecastDays[0].aqi
                    }),
                    suggestions: generateUniversitySuggestions({
                        maxTemp: forecastDays[0].maxTemp,
                        rain: forecastDays[0].rainProb,
                        wind: weather?.current?.windSpeed ?? null,
                        aqi: forecastDays[0].aqi
                    })
                } : null,
                tomorrowWeatherAdvisory: forecastDays[1] ? {
                    date: forecastDays[1].date,
                    advisory: generateAdvisory({
                        maxTemp: forecastDays[1].maxTemp,
                        rain: forecastDays[1].rainProb,
                        wind: null,
                        aqi: forecastDays[1].aqi
                    }),
                    suggestions: generateUniversitySuggestions({
                        maxTemp: forecastDays[1].maxTemp,
                        rain: forecastDays[1].rainProb,
                        wind: null,
                        aqi: forecastDays[1].aqi
                    })
                } : null
            }))

            // Trigger Background Notifications if thresholds exceeded
            notificationService.checkThresholds({
                aqi: aqi.aqi,
                aqiCategory: aqi.category,
                temp: weather?.current?.temp ?? 0,
                condition: weather?.current?.condition ?? ''
            });
        } catch (error) {
            console.error('EcoVision Engine Sync Failure:', error)
            setData(prev => ({
                ...prev,
                loading: false,
                error: 'Ecological Intelligence Sync Latency',
                aqiCategory: prev.aqiCategory === 'Initializing...' ? 'Data Offline' : prev.aqiCategory
            }))
        }
    }

    useEffect(() => {
        fetchEnvironmentalData()
        const sync = setInterval(fetchEnvironmentalData, 600000) // 10-minute sync
        return () => clearInterval(sync)
    }, [])

    const getAqiColor = (aqi) => {
        if (aqi <= 50) return '#10b981' // Good
        if (aqi <= 100) return '#f59e0b' // Moderate
        if (aqi <= 150) return '#f97316' // Unhealthy for Sensitive Groups
        return '#ef4444' // Unhealthy+
    }

    const requestNotificationPermission = async () => {
        return await notificationService.requestPermission();
    };

    const setDemoMode = (active, condition = null) => {
        setData(prev => ({
            ...prev,
            demoMode: { active, condition }
        }));
    };

    // Re-run health advisory generation when demo mode changes
    useEffect(() => {
        if (data.loading) return;

        let tomorrowAdvisories = [];
        if (data.demoMode.active && data.demoMode.condition) {
            const demoData = getDemoData(data.demoMode.condition);
            if (demoData) {
                tomorrowAdvisories = generateHealthAdvisories(demoData);
            }
        } else {
            // Restore from actual forecast
            const tomorrowWeather = data.forecastDays[1];
            const tomorrowAqiData = data.forecastDays[1]; // forecastDays already has aqi mixed in

            if (tomorrowWeather) {
                tomorrowAdvisories = generateHealthAdvisories({
                    temp: tomorrowWeather.maxTemp,
                    rainProbability: tomorrowWeather.rainProb,
                    windSpeed: data.windSpeed,
                    aqi: tomorrowWeather.aqi
                });
            }
        }

        setData(prev => ({ ...prev, tomorrowAdvisories }));
    }, [data.demoMode.active, data.demoMode.condition]);

    const value = {
        ...data,
        getAqiColor,
        CAMPUS_LOCATION,
        fetchEnvironmentalData,
        requestNotificationPermission,
        setDemoMode
    }

    return (
        <EnvironmentalContext.Provider value={value}>
            {children}
        </EnvironmentalContext.Provider>
    )
}
