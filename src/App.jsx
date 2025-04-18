import React, { useState } from "react";
import { GrNext, GrPrevious } from "react-icons/gr";
import events from "./assets/events.json";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
  parse,
} from "date-fns";

const App = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  function hexToRGBA(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  const onDateClick = (day) => {
    setSelectedDate(day);
  };
  const renderCells = () => {

    const rows = [];

    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      rows.push(
        <div className="grid grid-cols-7 gap-8 mb-2" key={day}>
          {/* eslint-disable-next-line */}
          {Array.from({ length: 7 }).map((_, i) => {
            formattedDate = format(day, "d");
            const cloneDay = day;

            let bgColor = ""; // Default color
            let borderColor = "border-gray-400"; // Default color
            let textColor = "text-gray-400";

            if (isSameDay(day, selectedDate)) {
              bgColor = "bg-orange-50/50";
              borderColor = "border-orange-500";
            } else if (isToday(day)) {
              bgColor = "bg-orange-200";
              textColor = "text-orange-500";
              borderColor = "border-orange-500";
            } else if (isSameMonth(day, monthStart)) {
              borderColor = "border-black";
              textColor = "text-black";
            }
            const cell = (
              <div
                className={`h-[200px] border-t-2 py-4 px-1
                  ${bgColor}
                  ${borderColor}
                  ${textColor}
                `}
                onClick={() => onDateClick(cloneDay)}
                index={i}
              >
                <span className="text-5xl">{formattedDate}</span>
                <div className="text-sm">
                  <div className="text-sm space-y-1 mt-2">
                    {events
                      .filter(
                        (event) => event.date === format(cloneDay, "yyyy-MM-dd")
                      )
                      .slice(0, 2)
                      .map((event, idx) => (
                        <div
                          key={idx}
                          className="truncate px-1 rounded text-white"
                          style={{
                            backgroundColor: isSameMonth(day, monthStart)
                              ? event.color
                              : hexToRGBA(event.color, 0.4),
                          }}
                        >
                          <p>
                            {format(
                              parse(event.startTime, "HH:mm", new Date()),
                              "hh:mm a"
                            )}{" "}
                            -{" "}
                            {format(
                              parse(event.endTime, "HH:mm", new Date()),
                              "hh:mm a"
                            )}
                          </p>
                          {event.title}
                        </div>
                      ))}
                  </div>
                  {events.filter(
                    (event) => event.date === format(cloneDay, "yyyy-MM-dd")
                  ).length > 2 && (
                    <p className="text-sm text-gray-500 pt-2 underline">
                      and{" "}
                      {events.filter(
                        (event) => event.date === format(cloneDay, "yyyy-MM-dd")
                      ).length - 2}{" "}
                      more
                    </p>
                  )}
                </div>
              </div>
            );

            day = addDays(day, 1);
            return cell;
          })}
        </div>
      );
    }
    return <div className="p-2">{rows}</div>;
  };
  return (
    <div className="lg:px-24 p-8 lg:py-20">
      <div className="flex justify-between">

          <div className="flex gap-4 items-center flex-wrap justify-center">
            <h1 className="font-bold text-4xl">
              {format(currentMonth, "MMM yyyy")}
            </h1>
            <div className="flex gap-4 items-center">
              <button
                className="p-2 rounded-full hover:bg-gray-200 transition-all duration-300"
                onClick={prevMonth}
              >
                <GrPrevious />
              </button>
              <input
            type="date"
            onChange={(e) => {
              setSelectedDate(new Date(e.target.value));
              setCurrentMonth(new Date(e.target.value));
            }}
          />
              <button
                className="p-2 rounded-full hover:bg-gray-200 transition-all duration-300"
                onClick={nextMonth}
              >
                <GrNext />
              </button>
            </div>
          </div>
        </div>
      <p className="flex gap-2 flex-wrap justify-center items-center lg:justify-start">
        {events
          .filter((event) => event.date === format(selectedDate, "yyyy-MM-dd"))
          .map((event, idx) => (
            <div
              key={idx}
              className="truncate px-1 rounded text-white mt-2"
              style={{ backgroundColor: event.color }}
            >
              <p>
                {format(parse(event.startTime, "HH:mm", new Date()), "hh:mm a")}{" "}
                - {format(parse(event.endTime, "HH:mm", new Date()), "hh:mm a")}
              </p>
              {event.title}
            </div>
          ))}
      </p>
      <div className="mt-10 overflow-x-auto">
        <div className="min-w-[1200px]">
          {/* Weekdays */}
          <div className="grid grid-cols-7 text-start font-medium  mb-2 gap-8 px-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className={`mb-12 font-semibold uppercase ${
                  format(new Date(), "EEE") === day && isSameMonth(new Date(), monthStart)
                    ? "text-orange-500"
                    : "text-gray-500"
                }`}
              >
                {day}
              </div>
            ))}
          </div>
          {renderCells()}
        </div>
      </div>
    </div>
  );
};

export default App;
