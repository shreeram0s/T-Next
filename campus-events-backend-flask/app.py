from flask import Flask, jsonify, request
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)

# ------------------- In-memory "database" -------------------
events = []
coordinators = []
participants = []


# ------------------- Health Check -------------------
@app.get("/health")
def health():
    return jsonify({"status": "ok"}), 200


# ------------------- Event Operations -------------------
@app.get("/events")
def get_events():
    expanded_events = []
    for event in events:
        event_copy = event.copy()
        # Expand coordinators
        event_copy["coordinators"] = [c for c in coordinators if c["id"] in event["coordinators"]]
        # Expand participants
        event_copy["participants"] = [p for p in participants if p["id"] in event["participants"]]
        expanded_events.append(event_copy)
    return jsonify(expanded_events), 200


@app.post("/events")
def add_event():
    data = request.get_json(force=True) or {}
    title = (data.get("title") or "").strip()
    date = (data.get("date") or "").strip()

    if not title or not date:
        return jsonify({"status": "error", "message": "title and date are required"}), 400
    if not re.match(r"^\d{4}-\d{2}-\d{2}$", date):
        return jsonify({"status": "error", "message": "date must be YYYY-MM-DD"}), 400

    new_id = max((e["id"] for e in events), default=0) + 1
    new_event = {"id": new_id, "title": title, "date": date, "coordinators": [], "participants": []}
    events.append(new_event)
    return jsonify({"status": "success", "event": new_event}), 201


@app.put("/events/<int:event_id>")
def update_event(event_id):
    data = request.get_json(force=True) or {}
    event = next((e for e in events if e["id"] == event_id), None)
    if not event:
        return jsonify({"status": "error", "message": "Event not found"}), 404

    title = (data.get("title") or event["title"]).strip()
    date = (data.get("date") or event["date"]).strip()
    if date and not re.match(r"^\d{4}-\d{2}-\d{2}$", date):
        return jsonify({"status": "error", "message": "date must be YYYY-MM-DD"}), 400

    event.update({"title": title, "date": date})
    return jsonify({"status": "success", "event": event}), 200


@app.delete("/events/<int:event_id>")
def delete_event(event_id):
    global events
    before_count = len(events)
    events = [e for e in events if e["id"] != event_id]
    if len(events) == before_count:
        return jsonify({"status": "error", "message": "Event not found"}), 404
    return jsonify({"status": "success", "message": f"Event {event_id} deleted"}), 200


# ------------------- Coordinator Operations -------------------
@app.get("/coordinators")
def get_coordinators():
    return jsonify(coordinators), 200


@app.post("/coordinators")
def add_coordinator():
    data = request.get_json(force=True) or {}
    name = (data.get("name") or "").strip()
    phone = (data.get("phone") or "").strip()
    email = (data.get("email") or "").strip()

    if not name or not phone or not email:
        return jsonify({"status": "error", "message": "name, phone, email required"}), 400

    new_id = max((c["id"] for c in coordinators), default=0) + 1
    new_coord = {"id": new_id, "name": name, "phone": phone, "email": email}
    coordinators.append(new_coord)
    return jsonify({"status": "success", "coordinator": new_coord}), 201


@app.put("/coordinators/<int:coord_id>")
def update_coordinator(coord_id):
    data = request.get_json(force=True) or {}
    coord = next((c for c in coordinators if c["id"] == coord_id), None)
    if not coord:
        return jsonify({"status": "error", "message": "Coordinator not found"}), 404

    coord.update({
        "name": (data.get("name") or coord["name"]).strip(),
        "phone": (data.get("phone") or coord["phone"]).strip(),
        "email": (data.get("email") or coord["email"]).strip()
    })
    return jsonify({"status": "success", "coordinator": coord}), 200


@app.delete("/coordinators/<int:coord_id>")
def delete_coordinator(coord_id):
    global coordinators
    before_count = len(coordinators)
    coordinators = [c for c in coordinators if c["id"] != coord_id]
    if len(coordinators) == before_count:
        return jsonify({"status": "error", "message": "Coordinator not found"}), 404

    # remove coordinator from events
    for event in events:
        event["coordinators"] = [cid for cid in event["coordinators"] if cid != coord_id]

    return jsonify({"status": "success", "message": f"Coordinator {coord_id} deleted"}), 200


# ------------------- Participant Operations -------------------
@app.get("/participants")
def get_participants():
    return jsonify(participants), 200


@app.post("/participants")
def add_participant():
    data = request.get_json(force=True) or {}
    name = (data.get("name") or "").strip()
    roll = (data.get("roll") or "").strip()
    email = (data.get("email") or "").strip()

    if not name or not roll or not email:
        return jsonify({"status": "error", "message": "name, roll, email required"}), 400

    new_id = max((p["id"] for p in participants), default=0) + 1
    new_part = {"id": new_id, "name": name, "roll": roll, "email": email}
    participants.append(new_part)
    return jsonify({"status": "success", "participant": new_part}), 201


@app.put("/participants/<int:part_id>")
def update_participant(part_id):
    data = request.get_json(force=True) or {}
    part = next((p for p in participants if p["id"] == part_id), None)
    if not part:
        return jsonify({"status": "error", "message": "Participant not found"}), 404

    part.update({
        "name": (data.get("name") or part["name"]).strip(),
        "roll": (data.get("roll") or part["roll"]).strip(),
        "email": (data.get("email") or part["email"]).strip()
    })
    return jsonify({"status": "success", "participant": part}), 200


@app.delete("/participants/<int:part_id>")
def delete_participant(part_id):
    global participants
    before_count = len(participants)
    participants = [p for p in participants if p["id"] != part_id]
    if len(participants) == before_count:
        return jsonify({"status": "error", "message": "Participant not found"}), 404

    # remove participant from events
    for event in events:
        event["participants"] = [pid for pid in event["participants"] if pid != part_id]

    return jsonify({"status": "success", "message": f"Participant {part_id} deleted"}), 200


# ------------------- Register Participant to Event -------------------
@app.post("/events/<int:event_id>/register")
def register_participant(event_id):
    data = request.get_json(force=True) or {}
    part_id = data.get("participant_id")
    if not part_id:
        return jsonify({"status": "error", "message": "participant_id required"}), 400

    event = next((e for e in events if e["id"] == event_id), None)
    part = next((p for p in participants if p["id"] == part_id), None)
    if not event:
        return jsonify({"status": "error", "message": "Event not found"}), 404
    if not part:
        return jsonify({"status": "error", "message": "Participant not found"}), 404

    if part_id not in event["participants"]:
        event["participants"].append(part_id)

    return jsonify({"status": "success", "event": event}), 200


# ------------------- Assign Coordinator to Event -------------------
@app.post("/events/<int:event_id>/assign")
def assign_coordinator(event_id):
    data = request.get_json(force=True) or {}
    coord_id = data.get("coordinator_id")
    if not coord_id:
        return jsonify({"status": "error", "message": "coordinator_id required"}), 400

    event = next((e for e in events if e["id"] == event_id), None)
    coord = next((c for c in coordinators if c["id"] == coord_id), None)

    if not event:
        return jsonify({"status": "error", "message": "Event not found"}), 404
    if not coord:
        return jsonify({"status": "error", "message": "Coordinator not found"}), 404

    if coord_id not in event["coordinators"]:
        event["coordinators"].append(coord_id)

    return jsonify({"status": "success", "event": event}), 200


# ------------------- Get Events for a Specific Participant -------------------
@app.get("/participants/<int:part_id>/events")
def get_participant_events(part_id):
    part = next((p for p in participants if p["id"] == part_id), None)
    if not part:
        return jsonify({"status": "error", "message": "Participant not found"}), 404

    my_events = []
    for event in events:
        if part_id in event["participants"]:
            event_copy = event.copy()
            # expand coordinators
            event_copy["coordinators"] = [c for c in coordinators if c["id"] in event["coordinators"]]
            # expand participants
            event_copy["participants"] = [p for p in participants if p["id"] in event["participants"]]
            my_events.append(event_copy)

    return jsonify({"participant": part, "events": my_events}), 200


# ------------------- Run -------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
