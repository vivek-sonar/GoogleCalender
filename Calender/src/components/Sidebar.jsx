import { useState, useEffect } from 'react';

function Sidebar({ onCalendarSelect, onViewChange, currentView }) {
  const [selectedCalendar, setSelectedCalendar] = useState('School Main Calendar');
  const [calendars, setCalendars] = useState([
    { id: '1', name: 'School Main Calendar', type: 'primary' },
    { id: '2', name: 'Class 10A Schedule', type: 'secondary' },
    { id: '3', name: 'Exams Schedule', type: 'secondary' },
    { id: '4', name: 'Holidays & Breaks', type: 'holiday' },
  ]);

  useEffect(() => {
    // Simulate loading initial state
  }, []);

  const handleAddCalendar = () => {
    const newCalendar = prompt('Enter new calendar name (e.g., Class Schedule):');
    if (newCalendar) {
      setCalendars([...calendars, { id: Date.now().toString(), name: newCalendar, type: 'secondary' }]);
    }
  };

  const handleCalendarSelect = (calendar) => {
    setSelectedCalendar(calendar);
    if (onCalendarSelect) onCalendarSelect(calendar);
  };

  return (
    <div className="w-64 p-4 bg-white shadow-lg" style={{ minHeight: '100vh' }}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">School Calendar</span>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      <div className="space-y-2">
        {calendars.map((calendar) => (
          <div
            key={calendar.id}
            onClick={() => handleCalendarSelect(calendar.name)}
            className={`flex items-center cursor-pointer p-1 rounded hover:bg-gray-100 ${
              selectedCalendar === calendar.name ? 'bg-gray-200' : ''
            } ${calendar.type === 'primary' ? 'text-green-600' : calendar.type === 'holiday' ? 'text-green-600' : 'text-gray-600'}`}
          >
            <span className="text-sm">{calendar.name}</span>
          </div>
        ))}
        <button onClick={handleAddCalendar} className="text-blue-500 text-sm mt-2">
          + Add Calendar
        </button>
      </div>
      <div className="mt-4 space-y-2">
        <select
          value={currentView}
          onChange={(e) => onViewChange(e.target.value)}
          className="w-full border rounded p-1 text-sm text-gray-600"
        >
          <option value="monthly">Monthly View</option>
          <option value="weekly">Weekly View</option>
          <option value="yearly">Yearly View</option>
        </select>
      </div>
      <div className="mt-8 flex space-x-2">
        <button className="flex-1 bg-gray-200 text-gray-700 py-1 rounded text-sm">📅</button>
        <button className="flex-1 bg-gray-200 text-gray-700 py-1 rounded text-sm">🔔</button>
      </div>
    </div>
  );
}

export default Sidebar;