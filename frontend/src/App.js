import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [meetings, setMeetings] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [rooms, setRooms] = useState([]);

  // For filtering
  const [filterClub, setFilterClub] = useState("");
  const [filterRoom, setFilterRoom] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fields for adding or editing a meeting
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [club, setClub] = useState("");  // For the form
  const [room, setRoom] = useState("");  // For the form
  const [duration, setDuration] = useState("");
  const [invitedCount, setInvitedCount] = useState("");
  const [acceptedCount, setAcceptedCount] = useState("");

    // New club/room modal state
    const [showClubModal, setShowClubModal] = useState(false);
    const [newClubName, setNewClubName] = useState("");
    const [newClubAddress, setNewClubAddress] = useState("");
    const [newClubDescription, setNewClubDescription] = useState("");
    
    const [showRoomModal, setShowRoomModal] = useState(false);
    const [newRoomBuilding, setNewRoomBuilding] = useState("");
    const [newRoomNumber, setNewRoomNumber] = useState("");
    const [newRoomCapacity, setNewRoomCapacity] = useState("");


    // For toggling the inline "Add New Club" input
  const [showNewClubInput, setShowNewClubInput] = useState(false);

  // For toggling the inline "Add New Room" input
  const [showNewRoomInput, setShowNewRoomInput] = useState(false);
  

  // State to track if we're editing an existing meeting
  const [editingMeeting, setEditingMeeting] = useState(null);

  const [stats, setStats] = useState({
    avgDuration: 0,
    avgInvited: 0,
    avgAccepted: 0,
    attendanceRate: 0,
  });

  useEffect(() => {
    fetchMeetings();
    fetchClubs();
    fetchRooms();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/meetings");
      console.log("Meetings Data from API:", response.data);
      setMeetings(response.data);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  const fetchClubs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/clubs");
      console.log("Clubs Data from API:", response.data);
      setClubs(response.data);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/rooms");
      console.log("Rooms Data from API:", response.data);
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const filterMeetings = async () => {
    try {
      let formattedStartDate = startDate ? new Date(startDate).toISOString() : "";
      let formattedEndDate = endDate ? new Date(endDate).toISOString() : "";

      const response = await axios.get("http://localhost:5000/api/meetings/filter", {
        params: {
          club_id: filterClub,
          room_id: filterRoom,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        },
      });
      console.log("start:", formattedStartDate);
      console.log("end:", formattedEndDate);

      console.log("📌 Filtered API Response:", response.data);
      setMeetings(response.data.meetings);
      setStats(response.data.stats);
    } catch (error) {
      console.error("❌ Error filtering meetings:", error);
    }
  };

  const handleAddMeeting = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      date,
      time,
      description,
      club_id: club,  // using 'club' from the form
      room_id: room,  // using 'room' from the form
      duration: Number(duration),
      invitedCount: Number(invitedCount),
      acceptedCount: Number(acceptedCount),
    };
    console.log("Adding meeting with payload:", payload);
    try {
      const response = await axios.post("http://localhost:5000/api/meetings", payload);
      console.log("Meeting added successfully, server response:", response.data);
      fetchMeetings(); // Refresh meeting list
      // Reset form fields after adding
      setTitle("");
      setDate("");
      setTime("");
      setDescription("");
      setClub("");
      setRoom("");
      setDuration("");
      setInvitedCount("");
      setAcceptedCount("");
      setEditingMeeting(null);
    } catch (error) {
      console.error("Error adding meeting:", error.response ? error.response.data : error);
    }
  };

 // Handler for adding a new club from the filter
const handleAddNewClubForFilter = async () => {
  if (!newClubName) return;
  try {
    const payload = { name: newClubName };
    // Optionally include address/description if desired
    const response = await axios.post("http://localhost:5000/api/clubs", payload);
    // Update clubs state with the newly added club:
    setClubs((prevClubs) => [...prevClubs, response.data]);
    // Automatically select the new club in the filter:
    setFilterClub(response.data._id);
    // Reset and hide the new club input
    setNewClubName("");
    setShowNewClubInput(false);
  } catch (error) {
    console.error("Error adding new club:", error);
  }
};

// Handler for adding a new room from the filter (similar logic)
const handleAddNewRoomForFilter = async () => {
  if (!newRoomBuilding || !newRoomNumber || !newRoomCapacity) return;
  try {
    const payload = { 
      building: newRoomBuilding, 
      number: newRoomNumber, 
      maxCapacity: Number(newRoomCapacity) 
    };
    const response = await axios.post("http://localhost:5000/api/rooms", payload);
    setRooms((prevRooms) => [...prevRooms, response.data]);
    setFilterRoom(response.data._id);
    setNewRoomBuilding("");
    setNewRoomNumber("");
    setNewRoomCapacity("");
    setShowNewRoomInput(false);
  } catch (error) {
    console.error("Error adding new room:", error);
  }
};

  const handleDeleteMeeting = async (meetingId) => {
    try {
      await axios.delete(`http://localhost:5000/api/meetings/${meetingId}`);
      fetchMeetings();
    } catch (error) {
      console.error("Error deleting meeting:", error);
    }
  };

  // Populate form for editing, including club and room fields
  const startEditing = (meeting) => {
    setEditingMeeting(meeting);
    setTitle(meeting.title);
    setDate(new Date(meeting.date).toISOString().split("T")[0]);
    setTime(meeting.time);
    setDescription(meeting.description);
    setClub(meeting.club_id || "");
    setRoom(meeting.room_id || "");
  };

  const handleUpdateMeeting = async (e) => {
    e.preventDefault();
    if (!editingMeeting) return;
    const payload = {
      title,
      date,
      time,
      description,
      club_id: club,
      room_id: room,
      duration: Number(duration),
      invitedCount: Number(invitedCount),
      acceptedCount: Number(acceptedCount),
    };
    console.log("Updating meeting with payload:", payload);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/meetings/${editingMeeting._id}`,
        payload
      );
      console.log("Meeting updated successfully, server response:", response.data);
      fetchMeetings();
      // Clear editing state and reset form fields
      setEditingMeeting(null);
      setTitle("");
      setDate("");
      setTime("");
      setDescription("");
      setClub("");
      setRoom("");
      setDuration("");
      setInvitedCount("");
      setAcceptedCount("");
    } catch (error) {
      console.error("Error updating meeting:", error.response ? error.response.data : error);
    }
  };

  return (
    <div>
      <h1>Meetings</h1>
  
      {/* Filtering Section */}
      <div>
        <h2>Filter Meetings</h2>
        <div>
          <label>Club (Filter):</label>
          <select
            value={filterClub}
            onChange={(e) => {
              if (e.target.value === "addNew") {
                setShowNewClubInput(true);
                setFilterClub("");
              } else {
                setFilterClub(e.target.value);
              }
            }}
          >
            <option value="">Select Club</option>
            {clubs.map((clubItem) => (
              <option key={clubItem._id} value={clubItem._id}>
                {clubItem.name}
              </option>
            ))}
            <option value="addNew">Add New Club</option>
          </select>
          {showNewClubInput && (
            <div>
              <input
                type="text"
                placeholder="New Club Name"
                value={newClubName}
                onChange={(e) => setNewClubName(e.target.value)}
              />
              <button type="button" onClick={handleAddNewClubForFilter}>
                Add Club
              </button>
              <button type="button" onClick={() => setShowNewClubInput(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>
  
        <div>
          <label>Room (Filter):</label>
          <select
            value={filterRoom}
            onChange={(e) => {
              if (e.target.value === "addNew") {
                setShowNewRoomInput(true);
                setFilterRoom("");
              } else {
                setFilterRoom(e.target.value);
              }
            }}
          >
            <option value="">Select Room</option>
            {rooms.map((roomItem) => (
              <option key={roomItem._id} value={roomItem._id}>
                {roomItem.building} - Room {roomItem.number}
              </option>
            ))}
            <option value="addNew">Add New Room</option>
          </select>
          {showNewRoomInput && (
            <div>
              <input
                type="text"
                placeholder="Building"
                value={newRoomBuilding}
                onChange={(e) => setNewRoomBuilding(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Room Number"
                value={newRoomNumber}
                onChange={(e) => setNewRoomNumber(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Max Capacity"
                value={newRoomCapacity}
                onChange={(e) => setNewRoomCapacity(e.target.value)}
                required
              />
              <button type="button" onClick={handleAddNewRoomForFilter}>
                Add Room
              </button>
              <button type="button" onClick={() => setShowNewRoomInput(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>
  
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
  
        <button onClick={filterMeetings}>Filter Meetings</button>
      </div>
  
      {/* Statistics Section */}
      <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
        <h3>Statistics</h3>
        {stats ? (
          <>
            <p>Average Duration: {stats.avgDuration?.toFixed(2)}</p>
            <p>Average Invited: {stats.avgInvited?.toFixed(2)}</p>
            <p>Average Accepted: {stats.avgAccepted?.toFixed(2)}</p>
            <p>
              Attendance Rate: {(stats.attendanceRate * 100)?.toFixed(2)}%
            </p>
          </>
        ) : (
          <p>No stats available</p>
        )}
      </div>
  
      {/* Meeting List */}
      <div>
        <h2>Meeting List</h2>
        <ul>
          {meetings.map((meeting) => (
            <li key={meeting._id}>
              {meeting.title} -{" "}
              {meeting.date
                ? new Date(meeting.date).toLocaleDateString("en-US", { timeZone: "UTC" })
                : "Invalid Date"}{" "}
              at {meeting.time} (Duration: {meeting.duration} min, Invited:{" "}
              {meeting.invitedCount}, Accepted: {meeting.acceptedCount})
              <button onClick={() => startEditing(meeting)}>Edit</button>
              <button onClick={() => handleDeleteMeeting(meeting._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
  
      {/* Add / Edit Meeting Form */}
      <div>
        <h2>{editingMeeting ? "Edit Meeting" : "Add a New Meeting"}</h2>
        <form onSubmit={editingMeeting ? handleUpdateMeeting : handleAddMeeting}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Time:</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
  
          {/* Meeting Form Club Selector */}
          <div>
            <label>Select Club:</label>
            <select value={club} onChange={(e) => setClub(e.target.value)} required>
              <option value="">--Select a Club--</option>
              {clubs.map((clubItem) => (
                <option key={clubItem._id} value={clubItem._id}>
                  {clubItem.name}
                </option>
              ))}
            </select>
          </div>
  
          {/* Meeting Form Room Selector */}
          <div>
            <label>Select Room:</label>
            <select value={room} onChange={(e) => setRoom(e.target.value)} required>
              <option value="">--Select a Room--</option>
              {rooms.map((roomItem) => (
                <option key={roomItem._id} value={roomItem._id}>
                  {roomItem.building} - Room {roomItem.number}
                </option>
              ))}
            </select>
          </div>
  
          {/* New Fields for Meeting Details */}
          <div>
            <label>Duration (min):</label>
            <input
              type="number"
              placeholder="Duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Invited Count:</label>
            <input
              type="number"
              placeholder="Invited Count"
              value={invitedCount}
              onChange={(e) => setInvitedCount(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Accepted Count:</label>
            <input
              type="number"
              placeholder="Accepted Count"
              value={acceptedCount}
              onChange={(e) => setAcceptedCount(e.target.value)}
              required
            />
          </div>
  
          <button type="submit">
            {editingMeeting ? "Update Meeting" : "Add Meeting"}
          </button>
  
          {editingMeeting && (
            <button
              type="button"
              onClick={() => {
                setEditingMeeting(null);
                setTitle("");
                setDate("");
                setTime("");
                setDescription("");
                setClub("");
                setRoom("");
                setDuration("");
                setInvitedCount("");
                setAcceptedCount("");
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>
    </div>
  );
  
}

export default App;
