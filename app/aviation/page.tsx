/**
 * EuroWeb Ultra Aviation Page
 * Dedicated aviation control and monitoring system
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial Production
 * @license MIT
 */

import Aviation from "@/components/Aviation";
import AviationWeather from "@/components/AviationWeather";

export default function Page() {
    return (
        <main className="aviation-main">
            <Aviation />
            <div className="aviation-weather-section">
                <h2>🌤️ Weather Integration</h2>
                <AviationWeather />
            </div>
        </main>
    );
}
