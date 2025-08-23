import { useState } from 'react'
import { addParticipant, registerParticipant } from '../api'

export default function RegisterForm({ eventId, refresh }) {
  const [name, setName] = useState('')
  const [roll, setRoll] = useState('')
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const part = await addParticipant({ name, roll, email })
      const pid = part.participant.id
      await registerParticipant(eventId, pid)
      alert(`✅ Registered! Your Participant ID is: ${pid}`)
      setName(''); setRoll(''); setEmail('')
      if (refresh) refresh()
    } catch (err) {
      alert(err.message || 'Failed to register')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleRegister} className="form" style={{marginTop: '6px'}}>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Roll No" value={roll} onChange={e => setRoll(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <button type="submit" disabled={busy}>
        {busy ? 'Registering…' : 'Register'}
      </button>
    </form>
  )
}
