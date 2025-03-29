import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [meetings, setMeetings] = useState([]);
  const [club, setClub] = useState("");
  const [room, setRoom] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/meetings");
      setMeetings(response.data);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  const filterMeetings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/meetings/filter", {
        params: { club, room, startDate, endDate }
      });
      setMeetings(response.data);
    } catch (error) {
      console.error("Error filtering meetings:", error);
    }
  };

  return (
    <div>
      <h1>Meetings</h1>

      <div>
        <label>Club:</label>
        <input type="text" value={club} onChange={(e) => setClub(e.target.value)} />

        <label>Room:</label>
        <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} />

        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

        <label>End Date:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

        <button onClick={filterMeetings}>Filter Meetings</button>
      </div>

      <ul>
        {meetings.map(meeting => (
          <li key={meeting._id}>
            {meeting.title} - {meeting.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
