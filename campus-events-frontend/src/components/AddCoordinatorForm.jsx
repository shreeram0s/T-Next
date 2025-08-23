import { useState } from 'react'
import { addCoordinator } from '../api'

export default function AddCoordinatorForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !phone || !email) return alert('All fields required')
    setBusy(true)
    try {
      const res = await addCoordinator({ name, phone, email })
      alert(`✅ Coordinator added with ID: ${res.coordinator.id}`)
      setName('')
      setPhone('')
      setEmail('')
    } catch (err) {
      alert(err.message || 'Failed to add coordinator')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="field">
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="field">
        <label>Phone</label>
        <input value={phone} onChange={e => setPhone(e.target.value)} />
      </div>
      <div className="field">
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <button type="submit" disabled={busy}>
        {busy ? 'Adding…' : 'Add Coordinator'}
      </button>
    </form>
  )
}
