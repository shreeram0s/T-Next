import React, { useEffect, useState } from "react";
import {
  getEvents,
  addEvent,
  getCoordinators,
  addCoordinator,
  assignCoordinator,
  getParticipants,
  addParticipant,
  registerParticipant,
  getParticipantEvents,
} from "./api";

export default function App() {
  const [events, setEvents] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [participants, setParticipants] = useState([]);

  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [participantEvents, setParticipantEvents] = useState([]);

  // ✅ Message state for confirmations
  const [message, setMessage] = useState("");

  useEffect(() => {
    refreshData();
  }, []);

  async function refreshData() {
    try {
      setEvents(await getEvents());
      setCoordinators(await getCoordinators());
      setParticipants(await getParticipants());
    } catch (err) {
      setMessage("❌ Failed to fetch data: " + err.message);
    }
  }

  // ------------------- Event Creation -------------------
  async function handleAddEvent(e) {
    e.preventDefault();
    const title = e.target.title.value;
    const date = e.target.date.value;

    try {
      const result = await addEvent(title, date);
      setMessage(`✅ Event "${result.event.title}" added successfully!`);
      e.target.reset();
      refreshData();
    } catch (err) {
      setMessage("❌ Failed to add event: " + err.message);
    }
  }

  // ------------------- Coordinator Creation -------------------
  async function handleAddCoordinator(e) {
    e.preventDefault();
    const name = e.target.name.value;
    const phone = e.target.phone.value;
    const email = e.target.email.value;

    try {
      const result = await addCoordinator(name, phone, email);
      setMessage(`✅ Coordinator "${result.coordinator.name}" added successfully!`);
      e.target.reset();
      refreshData();
    } catch (err) {
      setMessage("❌ Failed to add coordinator: " + err.message);
    }
  }

  // ------------------- Participant Creation -------------------
  async function handleAddParticipant(e) {
    e.preventDefault();
    const name = e.target.name.value;
    const roll = e.target.roll.value;
    const email = e.target.email.value;

    try {
      const result = await addParticipant(name, roll, email);
      setMessage(`✅ Participant "${result.participant.name}" added successfully!`);
      e.target.reset();
      refreshData();
    } catch (err) {
      setMessage("❌ Failed to add participant: " + err.message);
    }
  }

  // ------------------- Assign Coordinator -------------------
  async function handleAssignCoordinator(e) {
    e.preventDefault();
    const eventId = Number(e.target.event.value);
    const coordId = Number(e.target.coordinator.value);

    try {
      await assignCoordinator(eventId, coordId);
      setMessage("✅ Coordinator assigned successfully!");
      e.target.reset();
      refreshData();
    } catch (err) {
      setMessage("❌ Failed to assign coordinator: " + err.message);
    }
  }

  // ------------------- Register Participant -------------------
  async function handleRegisterParticipant(e) {
    e.preventDefault();
    const eventId = Number(e.target.event.value);
    const partId = Number(e.target.participant.value);

    try {
      await registerParticipant(eventId, partId);
      setMessage("✅ Participant registered successfully!");
      e.target.reset();
      refreshData();
    } catch (err) {
      setMessage("❌ Failed to register participant: " + err.message);
    }
  }

  // ------------------- View Participant Events -------------------
  async function handleViewParticipantEvents(e) {
    e.preventDefault();
    const partId = Number(e.target.participant.value);

    try {
      setSelectedParticipant(partId);
      const result = await getParticipantEvents(partId);
      setParticipantEvents(result.events);
      setMessage("✅ Loaded participant's events successfully!");
    } catch (err) {
      setMessage("❌ Failed to load participant events: " + err.message);
    }
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🎉 College Event Management</h1>

      {/* ✅ Global message box */}
      {message && (
        <div
          style={{
            margin: "10px auto",
            padding: "10px",
            maxWidth: "800px",
            borderRadius: "8px",
            background: message.startsWith("✅") ? "#d4edda" : "#f8d7da",
            color: message.startsWith("✅") ? "#155724" : "#721c24",
            border: "1px solid",
          }}
        >
          {message}
        </div>
      )}

      {/* ------------------- Events Section ------------------- */}
      <section>
        <h2>📌 Events</h2>
        <form onSubmit={handleAddEvent}>
          <input name="title" placeholder="Event Title" required />
          <input name="date" type="date" required />
          <button type="submit">Add Event</button>
        </form>

        <ul>
          {events.map((e) => (
            <li key={e.id}>
              <strong>{e.title}</strong> ({e.date})
              <br />
              Coordinators:{" "}
              {e.coordinators.length > 0
                ? e.coordinators.map((c) => c.name).join(", ")
                : "None"}
              <br />
              Participants:{" "}
              {e.participants.length > 0
                ? e.participants.map((p) => p.name).join(", ")
                : "None"}
            </li>
          ))}
        </ul>
      </section>

      <hr />

      {/* ------------------- Coordinator Section ------------------- */}
      <section>
        <h2>👨‍💼 Coordinators</h2>
        <form onSubmit={handleAddCoordinator}>
          <input name="name" placeholder="Name" required />
          <input name="phone" placeholder="Phone" required />
          <input name="email" type="email" placeholder="Email" required />
          <button type="submit">Add Coordinator</button>
        </form>

        <ul>
          {coordinators.map((c) => (
            <li key={c.id}>
              {c.name} ({c.email}, {c.phone})
            </li>
          ))}
        </ul>
      </section>

      <hr />

      {/* ------------------- Participant Section ------------------- */}
      <section>
        <h2>🧑‍🎓 Participants</h2>
        <form onSubmit={handleAddParticipant}>
          <input name="name" placeholder="Name" required />
          <input name="roll" placeholder="Roll No" required />
          <input name="email" type="email" placeholder="Email" required />
          <button type="submit">Add Participant</button>
        </form>

        <ul>
          {participants.map((p) => (
            <li key={p.id}>
              {p.name} ({p.roll}, {p.email})
            </li>
          ))}
        </ul>
      </section>

      <hr />

      {/* ------------------- Assign Coordinator ------------------- */}
      <section>
        <h2>📎 Assign Coordinator to Event</h2>
        <form onSubmit={handleAssignCoordinator}>
          <select name="event" required>
            <option value="">Select Event</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
          <select name="coordinator" required>
            <option value="">Select Coordinator</option>
            {coordinators.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button type="submit">Assign</button>
        </form>
      </section>

      <hr />

      {/* ------------------- Register Participant ------------------- */}
      <section>
        <h2>📝 Register Participant to Event</h2>
        <form onSubmit={handleRegisterParticipant}>
          <select name="event" required>
            <option value="">Select Event</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
          <select name="participant" required>
            <option value="">Select Participant</option>
            {participants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button type="submit">Register</button>
        </form>
      </section>

      <hr />

      {/* ------------------- View My Events ------------------- */}
      <section>
        <h2>🎟 View Participant's Events</h2>
        <form onSubmit={handleViewParticipantEvents}>
          <select name="participant" required>
            <option value="">Select Participant</option>
            {participants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button type="submit">View</button>
        </form>

        {selectedParticipant && (
          <div>
            <h3>Events for Participant #{selectedParticipant}</h3>
            {participantEvents.length > 0 ? (
              <ul>
                {participantEvents.map((ev) => (
                  <li key={ev.id}>
                    {ev.title} ({ev.date})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No events registered.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
