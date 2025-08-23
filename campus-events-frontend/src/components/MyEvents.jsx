import { useState } from 'react'
import { getMyEvents } from '../api'

export default function MyEvents() {
  const [partId, setPartId] = useState('')
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)

  const loadMyEvents = async () => {
    if (!partId) return alert('Enter your Participant ID')
    setLoading(true)
    try {
      const res = await getMyEvents(partId)
      setEvents(res.events)
    } catch (err) {
      alert(err.message || 'Failed to load my events')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="field">
        <input
          type="text"
          placeholder="Enter your Participant ID"
          value={partId}
          onChange={e => setPartId(e.target.value)}
        />
        <button onClick={loadMyEvents} disabled={loading}>
          {loading ? 'Loading…' : 'Show My Events'}
        </button>
      </div>
      {events.length > 0 && (
        <ul>
          {events.map(ev => (
            <li key={ev.id}>{ev.title} ({ev.date})</li>
          ))}
        </ul>
      )}
    </div>
  )
}
