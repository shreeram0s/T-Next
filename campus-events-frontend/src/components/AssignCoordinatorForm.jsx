import { useState, useEffect } from 'react'
import { assignCoordinator, getCoordinators } from '../api'

export default function AssignCoordinatorForm({ eventId, refresh }) {
  const [coordId, setCoordId] = useState('')
  const [busy, setBusy] = useState(false)
  const [coordinators, setCoordinators] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCoordinators()
  }, [])

  const loadCoordinators = async () => {
    try {
      const coords = await getCoordinators()
      setCoordinators(coords)
    } catch (err) {
      console.error('Failed to load coordinators:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAssign = async (e) => {
    e.preventDefault()
    if (!coordId) return alert('Please select a coordinator')
    setBusy(true)
    try {
      await assignCoordinator(eventId, coordId)
      const coordinator = coordinators.find(c => c.id === parseInt(coordId))
      alert(`✅ Coordinator ${coordinator ? coordinator.name : coordId} assigned`)
      setCoordId('')
      if (refresh) refresh()
    } catch (err) {
      alert(err.message || 'Failed to assign coordinator')
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <div>Loading coordinators...</div>

  return (
    <form onSubmit={handleAssign} className="form" style={{marginTop: '6px'}}>
      <select 
        value={coordId} 
        onChange={e => setCoordId(e.target.value)}
        required
      >
        <option value="">Select Coordinator</option>
        {coordinators.map(coord => (
          <option key={coord.id} value={coord.id}>
            {coord.name} ({coord.phone})
          </option>
        ))}
      </select>
      <button type="submit" disabled={busy}>
        {busy ? 'Assigning…' : 'Assign'}
      </button>
    </form>
  )
}
