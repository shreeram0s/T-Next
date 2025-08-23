import RegisterForm from './RegisterForm'
import AssignCoordinatorForm from './AssignCoordinatorForm'

export default function EventsList({ events, refresh }) {
  if (!events?.length) {
    return <p>No events yet. Add the first one!</p>
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th style={{width: '25%'}}>Title</th>
            <th style={{width: '20%'}}>Date</th>
            <th style={{width: '55%'}}>Details & Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(ev => (
            <tr key={ev.id}>
              <td>{ev.title}</td>
              <td>{ev.date}</td>
              <td>
                <div>
                  <strong>Coordinators:</strong>{" "}
                  {ev.coordinators?.length
                    ? ev.coordinators.map(c => `${c.name} (${c.phone})`).join(', ')
                    : 'None'}
                </div>
                <AssignCoordinatorForm eventId={ev.id} refresh={refresh} />
                <div style={{ marginTop: '8px' }}>
                  <strong>Participants:</strong>{" "}
                  {ev.participants?.length
                    ? ev.participants.map(p => p.name).join(', ')
                    : 'None'}
                </div>
                <RegisterForm eventId={ev.id} refresh={refresh} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
