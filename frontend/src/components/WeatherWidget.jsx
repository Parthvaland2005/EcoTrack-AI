import { useState, useEffect } from 'react'

function WeatherWidget() {
  const [weather, setWeather] = useState(null)
  const [aqi, setAqi] = useState(null)
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords
          try {
            // Get weather from Open-Meteo (free)
            const weatherRes = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            )
            const weatherData = await weatherRes.json()

            // Get Air Quality from Open-Meteo (free)
            const aqiRes = await fetch(
              `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm2_5`
            )
            const aqiData = await aqiRes.json()

            // Reverse geocode with Nominatim
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            )
            const geoData = await geoRes.json()

            setWeather(weatherData.current_weather)
            setAqi(aqiData.current)
            setCity(geoData.address.city || geoData.address.town || geoData.address.village || 'Your City')
          } catch {
            setError('Could not fetch data')
          }
          setLoading(false)
        },
        () => {
          setError('Location access denied')
          setLoading(false)
        }
      )
    } else {
      setError('Geolocation not supported')
      setLoading(false)
    }
  }, [])

  const getWeatherEmoji = (code) => {
    if (code === 0) return '☀️'
    if (code <= 3) return '⛅'
    if (code <= 67) return '🌧️'
    if (code <= 77) return '❄️'
    return '⛈️'
  }

  const getAQIInfo = (val) => {
    if (val <= 50) return { label: 'Good', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' }
    if (val <= 100) return { label: 'Moderate', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' }
    if (val <= 150) return { label: 'Unhealthy', color: '#f97316', bg: 'rgba(249,115,22,0.1)' }
    return { label: 'Poor', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' }
  }

  const getTip = (temp, aqiVal) => {
    if (aqiVal > 100) return '😷 Air quality is poor today. Wear a mask and limit outdoor activities.'
    if (temp > 30) return '🔥 Hot day — AC usage increases emissions. Use fans instead!'
    if (temp > 20) return '😊 Pleasant weather — great day to walk or cycle!'
    return '🧥 Cold day — limit heater usage to reduce emissions.'
  }

  if (loading) return <div className="card" style={{ padding: '20px', textAlign: 'center' }}>⏳ Loading environmental data...</div>
  if (error) return null

  const aqiInfo = aqi ? getAQIInfo(aqi.us_aqi) : null

  return (
    <div className="card fade-in" style={{ padding: '20px', marginTop: '15px', borderLeft: `6px solid ${aqiInfo?.color || 'var(--primary)'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>{getWeatherEmoji(weather.weathercode)}</span>
            <strong style={{ fontSize: '1.1rem' }}>{city}</strong>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Temp: <span style={{ fontWeight: '700', color: 'var(--text)' }}>{weather.temperature}°C</span>
            </div>
            {aqi && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                fontSize: '0.85rem', 
                background: aqiInfo.bg, 
                color: aqiInfo.color,
                padding: '4px 10px',
                borderRadius: '99px',
                fontWeight: '700'
              }}>
                💨 AQI: {aqi.us_aqi} ({aqiInfo.label})
              </div>
            )}
          </div>
        </div>
        <div style={{ 
          fontSize: '0.85rem', 
          maxWidth: '300px', 
          background: 'var(--primary-glow)', 
          padding: '12px', 
          borderRadius: '12px',
          color: 'var(--primary)',
          fontWeight: '500'
        }}>
          💡 {getTip(weather.temperature, aqi?.us_aqi || 0)}
        </div>
      </div>
    </div>
  )
}

export default WeatherWidget
