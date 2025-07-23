import { useState } from "react";

export default function MiniCalendar({ currentDate, onSelectDate }) {
  const [miniDate, setMiniDate] = useState(currentDate);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date(2025, 6, 23); // Fixed to July 23, 2025, per context

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(miniDate.getMonth(), miniDate.getFullYear());
  const firstDayIndex = getFirstDayOfMonth(miniDate.getMonth(), miniDate.getFullYear());
  const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isToday = (date) =>
    date === today.getDate() &&
    miniDate.getMonth() === today.getMonth() &&
    miniDate.getFullYear() === today.getFullYear();

  const isSelected = (date) =>
    date === currentDate.getDate() &&
    miniDate.getMonth() === currentDate.getMonth() &&
    miniDate.getFullYear() === currentDate.getFullYear();

  const handlePrev = () => {
    setMiniDate(new Date(miniDate.getFullYear(), miniDate.getMonth() - 1, 1));
  };

  const handleNext = () => {
    setMiniDate(new Date(miniDate.getFullYear(), miniDate.getMonth() + 1, 1));
  };

  return (
    <div className="bg-white w-60 p-2 rounded-lg shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <button onClick={handlePrev} className="text-gray-500 hover:text-black text-sm">
          &lt;
        </button>
        <h3 className="text-sm font-medium">
          {miniDate.toLocaleString("default", { month: "long" })} {miniDate.getFullYear()}
        </h3>
        <button onClick={handleNext} className="text-gray-500 hover:text-black text-sm">
          &gt;
        </button>
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-1">
        {days.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 text-center text-sm gap-px">
        {Array.from({ length: firstDayIndex }, (_, i) => (
          <div key={`empty-${i}`} className="bg-white h-8"></div>
        ))}
        {dates.map((date) => (
          <div
            key={date}
            onClick={() =>
              onSelectDate &&
              onSelectDate(new Date(miniDate.getFullYear(), miniDate.getMonth(), date))
            }
            className={[
              " h-8 flex items-center justify-center cursor-pointer ",
              isSelected(date) ? "bg-blue-500 text-white rounded-full" : "",
              isToday(date) && !isSelected(date) ? "border-2 border-yellow-400" : "",
            ].join(" ")}
          >
            {date}
          </div>
        ))}
      </div>
    </div>
  );
}