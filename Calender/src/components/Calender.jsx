import { useState, useEffect, useMemo } from 'react';
import Sidebar from './Sidebar';
import MiniCalendar from "../components/MiniCalender";


/* --------------------------------------------------
 * Calendar Component w/ Weekly Time Slots + Notion-style Monthly Badges
 * --------------------------------------------------
 * Enhancements:
 * - Monthly cells show event badges + notice strip + "+X more" overflow (Notion vibe).
 * - Color classes auto-picked from calendar name in parentheses.
 * - Weekly hour grid (already added) preserved.
 * - View sync w/ Sidebar, Today button, safe navigation.
 * - Still using *day-of-month* keys for demo simplicity. Ask to upgrade to YYYY-MM-DD if needed.
 * -------------------------------------------------- */

// --------------------------------------------------
// Display config
// --------------------------------------------------
const WEEK_START_HOUR = 8;    // 8 AM
const WEEK_END_HOUR = 20;     // 8 PM
const WEEK_INCLUDE_END = true; // include the END row (so 20:00 shows)
const MAX_MONTH_BADGES = 3;   // show max N badges before "+X more"

// Build hour strings
function buildTimeSlots(start = 8, end = 20, includeEnd = false) {
  const slots = [];
  const stop = includeEnd ? end : end - 1;
  for (let h = start; h <= stop; h++) {
    const hh = h.toString().padStart(2, '0');
    slots.push(`${hh}:00`);
  }
  return slots;
}

// Map calendar substring -> Tailwind color set
function getCalendarColor(calName = '') {
  const name = calName.toLowerCase();
  if (name.includes('holiday') || name.includes('break')) return 'bg-red-100 text-red-700 border-red-300';
  if (name.includes('exam')) return 'bg-purple-100 text-purple-700 border-purple-300';
  if (name.includes('class 10a')) return 'bg-blue-100 text-blue-700 border-blue-300';
  if (name.includes('school main')) return 'bg-green-100 text-green-700 border-green-300';
  return 'bg-white text-gray-700 border-gray-300';
}

// Strip trailing " (Calendar Name)"
function getEventTitleOnly(full = '') {
  return full.replace(/\s\([^)]+\)$/, '');
}

// Get Calendar name in parentheses
function getEventCalendarName(full = '') {
  const match = full.match(/\(([^)]+)\)$/);
  return match ? match[1] : '';
}

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 23)); // July 23, 2025 (month idx 6)
  const [view, setView] = useState('monthly'); // 'monthly' | 'weekly' | 'yearly'
  const [events, setEvents] = useState({}); // { [dayNumber]: { 'HH:MM': 'Title (Calendar)', notice?: '...' } }
  const [selectedDate, setSelectedDate] = useState(null); // numeric day-of-month
  const [selectedTime, setSelectedTime] = useState('14:00'); // HH:MM
  const [eventTitle, setEventTitle] = useState('');
  const [selectedOption, setSelectedOption] = useState('event'); // 'event' | 'notice' | 'schedule'
  const [selectedCalendar, setSelectedCalendar] = useState('School Main Calendar');
  const [schedules, setSchedules] = useState({
    23: [
      { time: '13:00', title: 'Math Class' },
      { time: '15:00', title: 'Science Lab' },
      { time: '17:00', title: 'Break' },
    ],
  });


  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle for mobile
  const [isEventPanelOpen, setIsEventPanelOpen] = useState(false); // Event panel toggle for mobile
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Hour list for weekly grid
  const timeSlots = useMemo(() => buildTimeSlots(WEEK_START_HOUR, WEEK_END_HOUR, WEEK_INCLUDE_END), []);

  // Initial demo data
  useEffect(() => {
    setEvents({
      1: { '14:00': 'Summer Break Ends (Holidays & Breaks)' },
      15: { '14:00': 'Mid-Term Exams (Exams Schedule)' },
      23: { '14:00': 'Parent-Teacher Meeting (School Main Calendar)' },
      26: { '14:00': 'Raksha Bandhan (Holidays & Breaks)' },
      30: { '14:00': 'Class 10A Project Due (Class 10A Schedule)' },
    });
  }, []);

  // Helpers --------------------------------------------------
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate.getMonth(), currentDate.getFullYear());
  const firstDayIndex = getFirstDayOfMonth(currentDate.getMonth(), currentDate.getFullYear());
  const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const today = new Date();
  const isToday = (dateNumber) =>
    dateNumber === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();

  const gotoToday = () => {
    const t = new Date();
    setCurrentDate(t);
    setView('monthly'); // auto jump; remove if you don't want that
  };

  // Navigation --------------------------------------------------
  const handlePrev = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (view === 'monthly') d.setMonth(d.getMonth() - 1);
      else if (view === 'weekly') d.setDate(d.getDate() - 7);
      else if (view === 'day') d.setDate(d.getDate() - 1);
      else if (view === 'yearly') d.setFullYear(d.getFullYear() - 1);
      return d;
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (view === 'monthly') d.setMonth(d.getMonth() + 1);
      else if (view === 'weekly') d.setDate(d.getDate() + 7);
      else if (view === 'day') d.setDate(d.getDate() + 1);
      else if (view === 'yearly') d.setFullYear(d.getFullYear() + 1);
      return d;
    });
  };


  // Selection handlers --------------------------------------------------
  const handleDateClick = (dayNum) => {
    setSelectedDate(dayNum);
    setSelectedTime('14:00'); // default fallback time
    setSelectedOption('event');

    const dateEvents = events[dayNum] || {};
    const firstKey = dateEvents['14:00'] ? '14:00' : Object.keys(dateEvents)[0];
    const raw = firstKey ? dateEvents[firstKey] : '';
    setEventTitle(raw?.replace(/\s\([^)]+\)$/, '') || '');
  };

  const handleDateClickWithTime = (dayNum, time) => {
    setSelectedDate(dayNum);
    setSelectedTime(time);
    setSelectedOption('event');

    const raw = events[dayNum]?.[time] || '';
    setEventTitle(raw?.replace(/\s\([^)]+\)$/, '') || '');
  };

  // Save handlers --------------------------------------------------
  const handleEventSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate || !eventTitle) return;

    if (selectedOption === 'event') {
      setEvents((prev) => ({
        ...prev,
        [selectedDate]: {
          ...prev[selectedDate],
          [selectedTime]: `${eventTitle} (${selectedCalendar})`,
        },
      }));
    } else if (selectedOption === 'notice') {
      setEvents((prev) => ({
        ...prev,
        [selectedDate]: {
          ...prev[selectedDate],
          notice: eventTitle,
        },
      }));
    } else if (selectedOption === 'schedule') {
      // Expect input like "14:00 - Math Class"
      const [time, ...rest] = eventTitle.split(' - ');
      const title = rest.join(' - ').trim();
      if (time && title) {
        setSchedules((prev) => ({
          ...prev,
          [selectedDate]: [...(prev[selectedDate] || []), { time: time.trim(), title }],
        }));
      }
    }

    setEventTitle(''); // keep date selected for rapid adding
  };

  // Render: Monthly --------------------------------------------------
  const renderMonthlyView = () => {
    // Leading nulls before 1st
    const cells = [];
    for (let i = 0; i < firstDayIndex; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header labels */}
        <div className="grid grid-cols-7 bg-white-100 border-b">
          {days.map((day) => (
            <div
              key={day}
              className="text-center font-medium text-gray-500 p-2 text-xs sm:text-sm"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid cells */}
        <div className="grid grid-cols-7 auto-rows-[minmax(120px,1fr)] gap-px bg-gray-200">
          {cells.map((dayNum, idx) => {
            if (dayNum === null) {
              return <div key={`empty-${idx}`} className="bg-white" />;
            }

            const dayEventsObj = events[dayNum] || {};
            const notice = dayEventsObj.notice;
            const timeKeys = Object.keys(dayEventsObj).filter((k) => k !== 'notice');
            const dayEvents = timeKeys.map((t) => ({ time: t, full: dayEventsObj[t] }));
            dayEvents.sort((a, b) => a.time.localeCompare(b.time));

            const badgesToShow = dayEvents.slice(0, MAX_MONTH_BADGES);
            const extraCount = dayEvents.length - badgesToShow.length;

            return (
              <div
                key={dayNum}
                onClick={() => handleDateClick(dayNum)}
                className={[
                  'relative bg-white p-1 sm:p-2 border border-transparent hover:border-gray-300 cursor-pointer flex flex-col text-left',
                  selectedDate === dayNum ? 'ring-2 ring-green-500' : '',
                  isToday(dayNum) ? 'border-yellow-400' : '',
                ].join(' ')}
              >
                {/* Date label (top-right) */}
                <div className="text-[10px] sm:text-xs font-medium text-gray-600 mb-1 self-end">
                  {dayNum}
                </div>

                {/* Notice strip */}
                {notice && (
                  <div
                    className="mb-1 px-1 py-[1px] text-[10px] sm:text-[11px] rounded border bg-yellow-100 text-yellow-700 truncate"
                    title={notice}
                  >
                    {notice}
                  </div>
                )}

                {/* Event badges */}
                {badgesToShow.map(({ time, full }) => {
                  const calName = getEventCalendarName(full);
                  const titleOnly = getEventTitleOnly(full);
                  const colorCls = getCalendarColor(calName);
                  return (
                    <div
                      key={time}
                      className={`mb-1 px-1 py-[1px] text-[10px] sm:text-[11px] rounded border truncate ${colorCls}`}
                      title={`${time} ${titleOnly} (${calName})`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDateClickWithTime(dayNum, time);
                      }}
                    >
                      {titleOnly}
                    </div>
                  );
                })}

                {/* +X more */}
                {extraCount > 0 && (
                  <div
                    className="mt-auto text-[10px] sm:text-[11px] text-blue-500 underline cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDateClick(dayNum);
                    }}
                  >
                    +{extraCount} more
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render: Weekly --------------------------------------------------
  const renderWeeklyView = () => {
    // Start of week (Sunday)
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - currentDate.getDay());

    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      return d;
    });

    return (
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {/* Header Row */}
        <div className="grid grid-cols-[100px_repeat(7,1fr)] sm:grid-cols-[120px_repeat(7,1fr)] border-b sticky top-0 bg-white z-10">
          <div className="p-2 text-center font-medium text-gray-500">Time</div>
          {weekDates.map((date) => (
            <div
              key={date.toDateString()}
              className="p-2 text-center font-medium text-gray-500 cursor-pointer hover:bg-gray-50"
              onClick={() => handleDateClick(date.getDate())}
            >
              {days[date.getDay()]} {date.getDate()}
            </div>
          ))}
        </div>

        {/* Time Rows */}
        {timeSlots.map((time) => (
          <div key={time} className="grid grid-cols-[100px_repeat(7,1fr)] sm:grid-cols-[120px_repeat(7,1fr)] border-t h-10 sm:h-12">
            <div className="p-1 text-right pr-2 text-[10px] sm:text-xs text-gray-400 leading-none flex items-center justify-end">
              {time}
            </div>
            {weekDates.map((date) => {
              const dayNum = date.getDate();
              const hasEvent = !!events[dayNum]?.[time];
              return (
                <div
                  key={`${dayNum}-${time}`}
                  onClick={() => handleDateClickWithTime(dayNum, time)}
                  className={[
                    'relative p-1 text-center cursor-pointer hover:bg-gray-100 flex items-center justify-center truncate',
                    hasEvent ? 'bg-green-100' : '',
                    selectedDate === dayNum && selectedTime === time ? 'ring-2 ring-green-500' : '',
                    isToday(dayNum) ? 'border border-yellow-300' : '',
                  ].join(' ')}
                  title={hasEvent ? events[dayNum][time] : ''}
                >
                  {hasEvent && (
                    <span className="text-[9px] sm:text-[10px] leading-tight text-green-700 px-1">
                      {getEventTitleOnly(events[dayNum][time])}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // Render: Day --------------------------------------------------
  const renderDayView = () => {
    const dayNum = currentDate.getDate();
    return (
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {/* Header Row */}
        <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] border-b sticky top-0 bg-white z-10">
          <div className="p-2 text-center font-medium text-gray-500">Time</div>
          <div
            className="p-2 text-center font-medium text-gray-500 cursor-pointer hover:bg-gray-50 text-xs sm:text-sm"
            onClick={() => handleDateClick(dayNum)}
          >
            {days[currentDate.getDay()]} {dayNum}
          </div>
        </div>

        {/* Time Rows */}
        {timeSlots.map((time) => (
          <div key={time} className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] border-t h-10 sm:h-12">
            <div className="p-1 text-right pr-2 text-[10px] sm:text-xs text-gray-400 leading-none flex items-center justify-end">
              {time}
            </div>
            <div
              onClick={() => handleDateClickWithTime(dayNum, time)}
              className={[
                'relative p-1 text-center cursor-pointer hover:bg-gray-100 flex items-center justify-center truncate',
                events[dayNum]?.[time] ? 'bg-green-100' : '',
                selectedDate === dayNum && selectedTime === time ? 'ring-2 ring-green-500' : '',
                isToday(dayNum) ? 'border border-yellow-300' : '',
              ].join(' ')}
              title={events[dayNum]?.[time] || ''}
            >
              {events[dayNum]?.[time] && (
                <span className="text-[9px] sm:text-[10px] leading-tight text-green-700 px-1">
                  {getEventTitleOnly(events[dayNum][time])}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };




  // Render: Yearly --------------------------------------------------
  const renderYearlyView = () => {
    const months = Array.from({ length: 12 }, (_, i) => new Date(currentDate.getFullYear(), i, 1));
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 p-2 sm:p-4 bg-white rounded-lg shadow">
        {months.map((month) => (
          <div
            key={month.toLocaleString('default', { month: 'long' })}
            className="p-2 text-center border rounded cursor-pointer hover:bg-gray-50 h-20 sm:h-24 flex items-center justify-center text-xs sm:text-sm"
            onClick={() => {
              const d = new Date(currentDate);
              d.setMonth(month.getMonth());
              setCurrentDate(d);
              setView('monthly');
            }}
          >
            {month.toLocaleString('default', { month: 'long' })}
          </div>
        ))}
      </div>
    );
  };


  // Event Panel --------------------------------------------------
  const renderEventPanelContent = () => {
    if (!selectedDate) {
      return (
        <div className="space-y-2 text-xs sm:text-sm text-gray-600">
          <h3 className="text-sm sm:text-md font-medium">Event Notice</h3>
          <p>📢 Mid-Term Exams (Jul 15): Bring pens and calculators. No electronic devices allowed.</p>
          <p>📢 Parent-Teacher Meeting (Jul 23): Scheduled at 2:00 PM in the auditorium.</p>
          <p>📢 Summer Break Ends (Jul 1): School resumes at 8:00 AM.</p>
          <label className="flex items-center mt-2">
            <input type="checkbox" className="mr-2" /> All-day
          </label>
          <div>Repeat</div>
          <div>Participants</div>
          <div>Conferencing</div>
          <div>AI Meeting Notes</div>
          <div>Location</div>
          <div>Description</div>
        </div>
      );
    }

    const dateEvents = events[selectedDate] || {};
    const existingNotice = dateEvents.notice;
    const eventTimes = Object.keys(dateEvents).filter((k) => k !== 'notice');

    return (
      <div>
        {/* Mode selector */}
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="border rounded p-2 w-full mb-2 text-xs sm:text-sm"
        >
          <option value="event">Event</option>
          <option value="notice">Event Notice</option>
          <option value="schedule">Schedule</option>
        </select>

        {/* EVENT MODE */}
        {selectedOption === 'event' && (
          <div className="mb-4">
            <label className="block text-[10px] sm:text-xs text-gray-500 mb-1">Time</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="border rounded p-2 w-full mb-2 text-xs sm:text-sm"
            >
              {timeSlots.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {dateEvents[selectedTime] && (
              <div className="mb-2 text-xs sm:text-sm text-gray-600 break-words">{dateEvents[selectedTime]}</div>
            )}

            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Event title (e.g., Exam, Holiday)"
              className="border rounded p-2 w-full mb-2 text-xs sm:text-sm focus:outline-none"
            />
            
            <button
              onClick={handleEventSubmit}
              className="mt-2 px-4 py-1 bg-blue-500 text-white rounded text-xs sm:text-sm"
            >
              Save
            </button>

            {eventTimes.length > 0 && (
              <div className="mt-4 text-[10px] sm:text-xs text-gray-500">
                <h4 className="font-medium mb-1">All events on {selectedDate}</h4>
                <ul className="space-y-1">
                  {eventTimes.sort().map((t) => (
                    <li
                      key={t}
                      className="cursor-pointer hover:underline"
                      onClick={() => handleDateClickWithTime(selectedDate, t)}
                    >
                      {t} – {dateEvents[t]}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* NOTICE MODE */}
        {selectedOption === 'notice' && (
          <div>
            {existingNotice && (
              <div className="mb-2 text-xs sm:text-sm text-gray-600">Notice: {existingNotice}</div>
            )}
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Notice text (e.g., Exam rules)"
              className="border rounded p-2 w-full mb-2 text-xs sm:text-sm focus:outline-none"
            />
            <button
              onClick={handleEventSubmit}
              className="mt-2 px-4 py-1 bg-blue-500 text-white rounded text-xs sm:text-sm"
            >
              Save Notice
            </button>
          </div>
        )}



        {/* SCHEDULE MODE */}
        {selectedOption === 'schedule' && (
          <div>
            {schedules[selectedDate] && (
              <div className="mb-2">
                <h3 className="text-sm sm:text-md font-medium mb-1">Schedule</h3>
                <ul className="space-y-1 text-xs sm:text-sm text-gray-600">
                  {schedules[selectedDate].map((sch, idx) => (
                    <li key={idx}>
                      {sch.time} - {sch.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {!schedules[selectedDate] && (
              <div className="mb-2 text-xs sm:text-sm text-gray-500">No schedule items yet.</div>
            )}
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Schedule (e.g., 14:00 - Math Class)"
              className="border rounded p-2 w-full mb-2 text-xs sm:text-sm focus:outline-none"
            />
            <button
              onClick={handleEventSubmit}
              className="mt-2 px-4 py-1 bg-blue-500 text-white rounded text-xs sm:text-sm"
            >
              Add Schedule
            </button>
          </div>
        )}
      </div>
    );
  };



  // Component render --------------------------------------------------
  return (
    <div className="flex h-screen w-full">

      <div className="w-64 p-2 bg-gray-50 border-r">
        <MiniCalendar currentDate={currentDate} onSelectDate={setCurrentDate} />
      </div>
      {/* Main Calendar Area */}
    <div className="flex-1 p-2 sm:p-4 overflow-y-auto">
        <div className="flex  sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-4">
           {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-4"> */}

          <h1 className="text-lg sm:text-xl font-semibold">
            {view === 'yearly'
              ? currentDate.getFullYear()
              : view === 'day'
              ? `${days[currentDate.getDay()]} ${currentDate.getDate()} ${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`
              : `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`}
          </h1>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <select
              value={view}
              onChange={(e) => setView(e.target.value)}
              className="border rounded p-1 text-xs sm:text-sm"
            >
              <option value="monthly">Month</option>
              <option value="weekly">Week</option>
              <option value="day">Day</option>
              <option value="yearly">Year</option>
            </select>
            <button className="text-red-500 text-xs sm:text-sm" onClick={gotoToday}>
              Today
            </button>
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={handlePrev}
              aria-label="Previous"
            >
              <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={handleNext}
              aria-label="Next"
            >
              <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        {view === 'monthly' && renderMonthlyView()}
        {view === 'weekly' && renderWeeklyView()}
        {view === 'day' && renderDayView()}
        {view === 'yearly' && renderYearlyView()}
      </div>


      {/* Event Details Panel */}
      <div className="w-80 p-4 bg-white shadow-lg overflow-y-auto" style={{ minHeight: '100vh' }}>
        <h2 className="text-lg font-semibold mb-2">Event</h2>
        {renderEventPanelContent()}
        {/* <div className="mt-4 text-blue-500 text-sm break-words">{selectedCalendar}</div>
        <div className="mt-1 text-gray-500 text-sm">Free</div>
        <div className="mt-1 text-gray-500 text-sm">Default visibility</div>
        <div className="mt-2">
          <button className="bg-gray-200 text-gray-700 px-4 py-1 rounded text-sm">
            Reminders
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default Calendar;
