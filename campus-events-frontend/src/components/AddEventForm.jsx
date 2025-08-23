import { useState } from 'react'

export default function AddEventForm({ onSubmit }) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !date.trim()) return alert('Title & Date required')
    setBusy(true)
    try {
      await onSubmit({ title: title.trim(), date })
      setTitle('')
      setDate('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="field">
        <label>Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Hackathon" />
      </div>
      <div className="field">
        <label>Date</label>
        <input value={date} onChange={e => setDate(e.target.value)} placeholder="2025-09-01" />
      </div>
      <button type="submit" disabled={busy}>
        {busy ? 'Adding…' : 'Add Event'}
      </button>
    </form>
  )
}
