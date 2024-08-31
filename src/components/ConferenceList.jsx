import axios from 'axios';
import { useEffect, useState } from 'react';

// Component for speakers
function SpeakerList({ data }) {
  // Log the data to ensure it's an array of strings
  console.log('Speaker List Data:', data);

  // Ensure data is an array of strings
  if (!Array.isArray(data) || data.some(item => typeof item !== 'string')) {
    return <p className="text-gray-500">Invalid data format</p>;
  }

  return (
    <ul role="list" className="pl-7 pr-7 divide-y divide-gray-100">
      {data.map((name, index) => (
        <li key={index} className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">{name}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

// Component for sessions
function SessionList({ data = [] }) {
  const sessionList =  Array.isArray(data) ? data : [];

  return (
    <ul role="list" className="pl-7 pr-7 divide-y divide-gray-100">
      {sessionList.map((session, key) => (
        <li key={key} className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">{session.name}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

// Component for time slots
function TimeSlotList({ data }) {
  // Default to empty object if data or data.time_slots is undefined
  const timeSlots = data?.time_slots || {};

  return (
    <div className="pl-7 pr-7">
      {Object.entries(timeSlots).length === 0 ? (
        <p className="text-gray-500">No time slots available</p>
      ) : (
        Object.entries(timeSlots).map(([day, slots]) => (
          <div key={day} className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{day}</h3>
            <ul role="list" className="divide-y divide-gray-100">
              {slots.map((slot, index) => (
                <li key={index} className="py-2">
                  <p className="text-sm leading-6 text-gray-500">{slot.start_time} - {slot.end_time}</p>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

// Component for rooms
function RoomList({ data = [] }) {
  console.log('Data:', data); // Log data to check its type and value

  // Ensure data is an array
  if (!Array.isArray(data)) {
    return <p className="text-gray-500">Invalid data format</p>;
  }

  return (
    <ul role="list" className="pl-7 pr-7 divide-y divide-gray-100">
      {data.length === 0 ? (
        <p className="text-gray-500">No rooms available</p>
      ) : (
        data.map((room, key) => (
          <li key={key} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">{room.name}</p>
                <p className="text-sm leading-6 text-gray-500">Capacity: {room.capacity}</p>
              </div>
            </div>
          </li>
        ))
      )}
    </ul>
  );
}

// Component for scheduled conferences
function ScheduledConferenceList({ data }) {
  // Ensure data is an array
  const scheduleData = Array.isArray(data) ? data : [];

  if (scheduleData.length === 0) {
    return <p>No scheduled conferences available.</p>;
  }

  return (
    <ul role="list" className="pl-7 pr-7 divide-y divide-gray-100">
      {scheduleData.map((schedule, key) => (
        <li key={key} className="flex justify-between py-5">
          {/* Display Speaker */}
          <div className="flex flex-col justify-center min-w-0">
            <p className="text-sm font-semibold leading-6 text-gray-900">
              {schedule.Speaker || 'No Speaker'}
            </p>
          </div>
          {/* Display other details */}
          <div className="flex flex-col min-w-0 text-right space-y-1">
            <p className="text-sm leading-6 text-gray-900 font-semibold">{schedule.Day || 'No Day'}</p>
            <p className="text-sm leading-6 text-gray-900">{schedule.Room || 'No Room'}</p>
            <p className="text-sm leading-6 text-gray-900">{schedule.Session || 'No Session'}</p>
            <p className="text-xs leading-5 text-gray-500">{schedule["Time Slot"] || 'No Time Slot'}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

// Main component to fetch and render data
export default function ConferenceList({ listType }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); // Start loading
    let endpoint = '';

    switch (listType) {
      case 'speakers':
        endpoint = 'http://127.0.0.1:5000/speakers';
        break;
      case 'sessions':
        endpoint = 'http://127.0.0.1:5000/sessions';
        break;
      case 'time slots':
        endpoint = 'http://127.0.0.1:5000/time-slots';
        break;
      case 'rooms':
        endpoint = 'http://127.0.0.1:5000/rooms';
        break;
      case 'schedule':
        endpoint = 'http://127.0.0.1:5000/schedule-conference';
        break;
      default:
        console.error('Unknown list type:', listType);
        setData([]);
        setLoading(false);
        return; // Exit early
    }

    axios.get(endpoint)
      .then(response => {
        setData(response.data);
        setLoading(false); // Stop loading after data is fetched
      })
      .catch(error => {
        console.error(`Error fetching ${listType}:`, error);
        setLoading(false); // Stop loading if an error occurs
      });
  }, [listType]);

  if (loading) return <p>Loading...</p>;

  switch (listType) {
    case 'sessions':
      return <SessionList data={data} />;
    case 'speakers':
      return <SpeakerList data={data} />;
    case 'time slots':
      return <TimeSlotList data={data} />;
    case 'rooms':
      return <RoomList data={data} />;
    case 'schedule':
      return <ScheduledConferenceList data={data.decodedData} />;
    default:
      return <></>;
  }
}