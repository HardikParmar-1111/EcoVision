/**
 * EcoVision Weather Advisory Engine
 * Rule-based logic for campus safety advisories.
 */

export function generateAdvisory(weatherData) {
    if (!weatherData) return { dos: [], donts: [] };

    const { maxTemp, rain, wind, aqi } = weatherData;
    const dos = [];
    const donts = [];

    // TEMPERATURE
    if (maxTemp !== null && maxTemp >= 38) {
        dos.push("Carry a water bottle");
        dos.push("Prefer shaded areas on campus");
        donts.push("Stay long in direct sunlight");
    }

    // RAIN
    if (rain !== null && rain > 0) {
        dos.push("Carry umbrella or raincoat");
        dos.push("Wear non-slip footwear");
        donts.push("Walk through waterlogged paths");
    }

    // WIND
    if (wind !== null && wind >= 25) {
        dos.push("Stay cautious near trees and loose structures");
        donts.push("Use open terraces or rooftops");
    }

    // AQI
    if (aqi !== null && aqi > 150) {
        dos.push("Prefer indoor activities");
        dos.push("Keep windows closed during peak hours");
        donts.push("Spend long durations outdoors");
    }

    return { dos, donts };
}

export function generateUniversitySuggestions(weatherData) {
    if (!weatherData) return [];

    const { maxTemp, rain, wind, aqi } = weatherData;
    const suggestions = [];

    if (maxTemp !== null && maxTemp >= 38) {
        suggestions.push("Ensure drinking water availability");
    }

    if (rain !== null && rain > 0) {
        suggestions.push("Drainage checks");
        suggestions.push("Rain notice");
    }

    if (aqi !== null && aqi > 150) {
        suggestions.push("Limit outdoor events");
    }

    if (wind !== null && wind >= 25) {
        suggestions.push("Safety advisory for open areas");
    }

    return suggestions;
}
