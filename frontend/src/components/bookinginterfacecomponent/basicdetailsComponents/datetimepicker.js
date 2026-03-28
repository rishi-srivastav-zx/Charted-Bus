"use client";
import { useState, useRef, useEffect } from "react";
import { CalIcon, ChevronLeft, ChevronRight, CheckIcon } from "./icons";
import { MONTHS, DAYS_SHORT } from "./constant";
import { formatDateTime } from "./validator";

// ─── DateTimePicker ───────────────────────────────────────────────────────────
export default function DateTimePicker({
    value,
    onChange,
    placeholder = "Pick-up Date & Time *",
}) {
    const [open, setOpen] = useState(false);
    const [view, setView] = useState("calendar");
    const today = new Date();
    const [calMonth, setCalMonth] = useState(
        value ? new Date(value).getMonth() : today.getMonth(),
    );
    const [calYear, setCalYear] = useState(
        value ? new Date(value).getFullYear() : today.getFullYear(),
    );
    const [selectedDate, setSelectedDate] = useState(
        value ? new Date(value) : null,
    );
    const [hour, setHour] = useState(
        value ? new Date(value).getHours() % 12 || 12 : 4,
    );
    const [minute, setMinute] = useState(
        value ? new Date(value).getMinutes() : 27,
    );
    const [ampm, setAmpm] = useState(
        value ? (new Date(value).getHours() >= 12 ? "PM" : "AM") : "PM",
    );
    const ref = useRef();

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

    const applyDateTime = (date, h, m, ap) => {
        const d = new Date(date);
        let hours24 = (h % 12) + (ap === "PM" ? 12 : 0);
        d.setHours(hours24, m, 0, 0);
        onChange(d);
    };

    const selectDay = (day) => {
        const d = new Date(calYear, calMonth, day);
        setSelectedDate(d);
        setView("time");
    };

    const confirmTime = () => {
        if (selectedDate) {
            applyDateTime(selectedDate, hour, minute, ampm);
            setOpen(false);
        }
    };

    const prevMonth = () => {
        if (calMonth === 0) {
            setCalMonth(11);
            setCalYear((y) => y - 1);
        } else setCalMonth((m) => m - 1);
    };
    const nextMonth = () => {
        if (calMonth === 11) {
            setCalMonth(0);
            setCalYear((y) => y + 1);
        } else setCalMonth((m) => m + 1);
    };

    const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
    const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

    return (
        <div className={`relative ${open ? "z-50" : ""}`} ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all hover:border-slate-300"
            >
                <span
                    className={
                        value
                            ? "text-slate-800 font-medium truncate mr-2"
                            : "text-slate-400 truncate mr-2"
                    }
                >
                    {value ? formatDateTime(value) : placeholder}
                </span>
                <CalIcon s={15} />
            </button>

            {open && (
                <div
                    className="absolute top-full mt-2 left-0 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100]"
                    style={{ minWidth: 270 }}
                >
                    {view === "calendar" && (
                        <>
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 z-10 px-4 sm:px-5 py-3 sm:py-4">
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={prevMonth}
                                        className="text-white/70 hover:text-white w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
                                    >
                                        <ChevronLeft s={16} />
                                    </button>
                                    <span className="text-white font-bold text-xs sm:text-sm">
                                        {MONTHS[calMonth]} {calYear}
                                    </span>
                                    <button
                                        onClick={nextMonth}
                                        className="text-white/70 hover:text-white w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
                                    >
                                        <ChevronRight s={16} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-7 mt-3 gap-0.5">
                                    {DAYS_SHORT.map((d) => (
                                        <div
                                            key={d}
                                            className="text-center text-[9px] sm:text-[10px] font-bold text-blue-200 py-1"
                                        >
                                            {d}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-2 sm:p-3">
                                <div className="grid grid-cols-7 gap-0.5">
                                    {Array.from({ length: firstDay }).map(
                                        (_, i) => (
                                            <div key={`e${i}`} />
                                        ),
                                    )}
                                    {Array.from(
                                        { length: daysInMonth },
                                        (_, i) => i + 1,
                                    ).map((day) => {
                                        const d = new Date(
                                            calYear,
                                            calMonth,
                                            day,
                                        );
                                        const isPast =
                                            d <
                                            new Date(
                                                today.getFullYear(),
                                                today.getMonth(),
                                                today.getDate(),
                                            );
                                        const isSel =
                                            selectedDate &&
                                            d.toDateString() ===
                                                selectedDate.toDateString();
                                        const isToday =
                                            d.toDateString() ===
                                            today.toDateString();
                                        return (
                                            <button
                                                key={day}
                                                disabled={isPast}
                                                onClick={() => selectDay(day)}
                                                className={`w-full aspect-square rounded-lg text-[11px] sm:text-[12px] font-semibold transition-all flex items-center justify-center
                          ${isPast ? "text-slate-200 cursor-not-allowed" : ""}
                          ${isSel ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : ""}
                          ${isToday && !isSel ? "border-2 border-blue-300 text-blue-600" : ""}
                          ${!isPast && !isSel ? "hover:bg-blue-50 text-slate-700" : ""}
                        `}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}

                    {view === "time" && (
                        <div className="p-4 sm:p-5">
                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                <button
                                    onClick={() => setView("calendar")}
                                    className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1"
                                >
                                    <ChevronLeft s={12} /> Back
                                </button>
                                <span className="text-xs sm:text-sm font-bold text-slate-700 flex-1 text-center truncate">
                                    {selectedDate
                                        ? formatDateTime(selectedDate)
                                              .split(",")
                                              .slice(0, 2)
                                              .join(",")
                                        : ""}
                                </span>
                            </div>

                            <div className="text-center mb-3 sm:mb-4">
                                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                                    {hour.toString().padStart(2, "0")}:
                                    {minute.toString().padStart(2, "0")}
                                    <span className="text-lg sm:text-xl ml-2 font-bold text-blue-600">
                                        {ampm}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        Hour
                                    </p>
                                    <div className="grid grid-cols-6 gap-1">
                                        {HOURS.map((h) => (
                                            <button
                                                key={h}
                                                onClick={() => setHour(h)}
                                                className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                    hour === h
                                                        ? "bg-blue-600 text-white shadow-md"
                                                        : "bg-slate-50 hover:bg-blue-50 text-slate-700"
                                                }`}
                                            >
                                                {h}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        Minute
                                    </p>
                                    <div className="grid grid-cols-6 gap-1">
                                        {MINUTES.map((m) => (
                                            <button
                                                key={m}
                                                onClick={() => setMinute(m)}
                                                className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                    minute === m
                                                        ? "bg-blue-600 text-white shadow-md"
                                                        : "bg-slate-50 hover:bg-blue-50 text-slate-700"
                                                }`}
                                            >
                                                {m.toString().padStart(2, "0")}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex rounded-lg overflow-hidden border border-slate-200">
                                        {["AM", "PM"].map((ap) => (
                                            <button
                                                key={ap}
                                                onClick={() => setAmpm(ap)}
                                                className={`flex-1 py-2 text-xs font-bold transition-all ${
                                                    ampm === ap
                                                        ? "bg-blue-600 text-white"
                                                        : "text-slate-500 hover:bg-slate-50"
                                                }`}
                                            >
                                                {ap}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={confirmTime}
                                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                            >
                                <CheckIcon s={14} /> Confirm
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
