const BASE_URL = "http://127.0.0.1:5000";

// Reusable HTTP helper
async function http(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const errMsg = await res.text();
    throw new Error(errMsg || "Request failed");
  }
  return res.json();
}

//
// ------------------- Health -------------------
export async function checkHealth() {
  return await http("/health");
}

//
// ------------------- Events -------------------
export async function getEvents() {
  return await http("/events");
}

export async function addEvent(title, date) {
  return await http("/events", {
    method: "POST",
    body: JSON.stringify({ title, date }),
  });
}

export async function updateEvent(eventId, updates) {
  return await http(`/events/${eventId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function deleteEvent(eventId) {
  return await http(`/events/${eventId}`, { method: "DELETE" });
}

export async function assignCoordinator(eventId, coordinatorId) {
  return await http(`/events/${eventId}/assign`, {
    method: "POST",
    body: JSON.stringify({ coordinator_id: coordinatorId }),
  });
}

export async function registerParticipant(eventId, participantId) {
  return await http(`/events/${eventId}/register`, {
    method: "POST",
    body: JSON.stringify({ participant_id: participantId }),
  });
}

//
// ------------------- Coordinators -------------------
export async function getCoordinators() {
  return await http("/coordinators");
}

export async function addCoordinator(name, phone, email) {
  return await http("/coordinators", {
    method: "POST",
    body: JSON.stringify({ name, phone, email }),
  });
}

export async function updateCoordinator(coordId, updates) {
  return await http(`/coordinators/${coordId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function deleteCoordinator(coordId) {
  return await http(`/coordinators/${coordId}`, { method: "DELETE" });
}

//
// ------------------- Participants -------------------
export async function getParticipants() {
  return await http("/participants");
}

export async function addParticipant(name, roll, email) {
  return await http("/participants", {
    method: "POST",
    body: JSON.stringify({ name, roll, email }),
  });
}

export async function updateParticipant(partId, updates) {
  return await http(`/participants/${partId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function deleteParticipant(partId) {
  return await http(`/participants/${partId}`, { method: "DELETE" });
}

export async function getParticipantEvents(partId) {
  return await http(`/participants/${partId}/events`);
}
