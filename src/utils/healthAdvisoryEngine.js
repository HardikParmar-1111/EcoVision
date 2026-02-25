/**
 * EcoVision Health Advisory Engine
 * Converts forecast data into actionable DOs & DON’Ts for campus safety.
 * This is a rule-based system (NOT AI-generated).
 */

export function generateHealthAdvisories(forecastData) {
    const { temp, rainProbability, windSpeed, aqi } = forecastData;
    const advisories = [];

    // 🌡 HIGH TEMPERATURE (Trigger: temp >= 38°C)
    if (temp >= 38) {
        advisories.push({
            type: "temperature",
            title: "High Temperature Advisory",
            severity: temp >= 42 ? "High" : "Moderate",
            condition: `Predicted peak of ${temp}°C`,
            dos: [
                "Drink water frequently, even if not thirsty",
                "Wear light-colored, loose cotton clothes",
                "Use cap/hat or umbrella while walking",
                "Take breaks in shaded or indoor areas",
                "Prefer morning or evening travel"
            ],
            donts: [
                "Do not stay in direct sunlight for long periods",
                "Avoid heavy physical activities outdoors",
                "Do not skip meals",
                "Avoid caffeinated or sugary drinks",
                "Do not ignore dizziness or headache"
            ]
        });
    }

    // 🌧 RAIN (Trigger: rainProbability >= 60%)
    if (rainProbability >= 60) {
        advisories.push({
            type: "rain",
            title: "Precipitation Advisory",
            severity: rainProbability >= 80 ? "High" : "Moderate",
            condition: `${rainProbability}% chance of rain`,
            dos: [
                "Carry umbrella or raincoat",
                "Wear non-slip footwear",
                "Protect electronic devices",
                "Walk carefully on wet surfaces",
                "Use covered pathways"
            ],
            donts: [
                "Avoid running on wet floors",
                "Do not touch damaged electrical points",
                "Avoid waterlogged areas",
                "Do not park near open drains",
                "Avoid two-wheelers during heavy rain"
            ]
        });
    }

    // 🌫 AIR QUALITY (Trigger: aqi >= 150)
    if (aqi >= 150) {
        advisories.push({
            type: "aqi",
            title: "Air Quality Advisory",
            severity: aqi >= 200 ? "High" : "Moderate",
            condition: `AQI predicted to reach ${aqi}`,
            dos: [
                "Wear a mask (N95 if available)",
                "Stay indoors as much as possible",
                "Keep windows closed during peak hours",
                "Drink warm fluids",
                "Use indoor plants if available"
            ],
            donts: [
                "Avoid outdoor exercise",
                "Do not burn waste",
                "Avoid smoking or passive smoke",
                "Do not ignore breathing discomfort",
                "Avoid crowded outdoor spaces"
            ]
        });
    }

    // 🌬 WIND (Trigger: windSpeed >= 30 km/h)
    if (windSpeed >= 30) {
        advisories.push({
            type: "wind",
            title: "High Wind Advisory",
            severity: windSpeed >= 50 ? "High" : "Moderate",
            condition: `Predicted wind speeds of ${windSpeed} km/h`,
            dos: [
                "Walk cautiously near trees and poles",
                "Secure bags and loose items",
                "Stay alert near construction zones",
                "Use protective eyewear if dust is present"
            ],
            donts: [
                "Avoid standing under trees",
                "Do not use umbrellas in strong winds",
                "Avoid rooftops or terraces",
                "Do not park vehicles near weak structures"
            ]
        });
    }

    return advisories;
}
