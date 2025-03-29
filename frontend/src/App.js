import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [meetings, setMeetings] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [club, setClub] = useState("");
  const [room, setRoom] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchMeetings();
    fetchClubs();
    fetchRooms();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/meetings");
      console.log("Meetings Data from API:", response.data); // Debugging log
      setMeetings(response.data);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };
  
  const fetchClubs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/clubs");
      setClubs(response.data);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/rooms");
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
          club, 
          room, 
          startDate: formattedStartDate,
          endDate: formattedEndDate 
        }
      });
  
      console.log("📌 API Response:", response.data);
      setMeetings(response.data);
    } catch (error) {
      console.error("❌ Error filtering meetings:", error);
    }
  };
  


  const handleAddMeeting = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/meetings", {
        title, date, time, description
      });
      fetchMeetings(); // Refresh meeting list
    } catch (error) {
      console.error("Error adding meeting:", error);
    }
  };

  // ✅ `return()` is Here - Defines the HTML Render Output
  return (
    <div>
      <h1>Meetings</h1>

      {/* Dynamic Filters */}
      <div>
        <label>Club:</label>
        <select value={club} onChange={(e) => setClub(e.target.value)}>
          <option value="">Select Club</option>
          {clubs.map((club) => (
            <option key={club._id} value={club._id}>{club.name}</option>
          ))}
        </select>

        <label>Room:</label>
        <select value={room} onChange={(e) => setRoom(e.target.value)}>
          <option value="">Select Room</option>
          {rooms.map((room) => (
            <option key={room._id} value={room._id}>
              {room.building} - Room {room.number}
            </option>
          ))}
        </select>

        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

        <button onClick={filterMeetings}>Filter Meetings</button>
      </div>

      {/* Meeting List */}
      <ul>
      {meetings.map(meeting => (
        <li key={meeting._id}>
          {meeting.title} - {meeting.date ? new Date(meeting.date).toLocaleDateString() : "Invalid Date"} at {meeting.time}
        </li>
      ))}
    </ul>


      {/* Add New Meeting */}
      <h2>Add a New Meeting</h2>
      <form onSubmit={handleAddMeeting}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <button type="submit">Add Meeting</button>
      </form>
    </div>
  );
}

export default App;
