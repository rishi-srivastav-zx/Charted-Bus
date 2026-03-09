"use client";
import { useState, useRef, useEffect } from "react";
import { useNav } from "../navigation-provider";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({
    d,
    s = 16,
    stroke = "currentColor",
    fill = "none",
    sw = 2,
}) => (
    <svg
        width={s}
        height={s}
        viewBox="0 0 24 24"
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {Array.isArray(d) ? (
            d.map((p, i) => <path key={i} d={p} />)
        ) : (
            <path d={d} />
        )}
    </svg>
);

const ClockIcon = ({ s = 16 }) => (
    <Icon
        s={s}
        d={["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z", "M12 6v6l4 2"]}
    />
);
const ArrowRight = ({ s = 16 }) => <Icon s={s} d="M5 12h14M12 5l7 7-7 7" />;
const RefreshIcon = ({ s = 16 }) => (
    <Icon
        s={s}
        d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
    />
);
const CalIcon = ({ s = 16 }) => (
    <Icon
        s={s}
        d={[
            "M8 2v4M16 2v4",
            "M3 8h18",
            "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
        ]}
    />
);
const ChevronDown = ({ s = 16 }) => <Icon s={s} d="M6 9l6 6 6-6" />;
const ChevronLeft = ({ s = 16 }) => <Icon s={s} d="M15 18l-6-6 6-6" />;
const ChevronRight = ({ s = 16 }) => <Icon s={s} d="M9 18l6-6-6-6" />;
const PlusIcon = ({ s = 16 }) => <Icon s={s} d="M12 5v14M5 12h14" />;
const MinusIcon = ({ s = 16 }) => <Icon s={s} d="M5 12h14" />;
const XIcon = ({ s = 16 }) => <Icon s={s} d="M18 6L6 18M6 6l12 12" />;
const CheckIcon = ({ s = 16 }) => <Icon s={s} d="M20 6L9 17l-5-5" />;
const StarIcon = ({ s = 16 }) => (
    <Icon
        s={s}
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="currentColor"
        stroke="none"
    />
);
const ShieldIcon = ({ s = 16 }) => (
    <Icon s={s} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
);
const HeadphonesIcon = ({ s = 16 }) => (
    <Icon
        s={s}
        d={[
            "M3 18v-6a9 9 0 0 1 18 0v6",
            "M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z",
        ]}
    />
);
const GripIcon = ({ s = 16 }) => (
    <Icon
        s={s}
        d={["M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01"]}
        sw={2.5}
    />
);
const EditIcon = ({ s = 16 }) => (
    <Icon
        s={s}
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
    />
);
const BusIcon = ({ s = 16 }) => (
    <Icon
        s={s}
        d={[
            "M8 6v6M16 6v6M3 6h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6z",
            "M3 6V4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2",
            "M7 17v2M17 17v2",
        ]}
    />
);
const MapPinIcon = ({ s = 16 }) => (
    <Icon
        s={s}
        d={[
            "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z",
            "M12 10m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0",
        ]}
    />
);
const AlertIcon = ({ s = 16 }) => (
    <Icon
        s={s}
        d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"
    />
);

// ─── Duration Options: 1h to 24h in 0.5 increments ───────────────────────────
const DURATION_OPTIONS = [];
for (let h = 1; h <= 24; h += 0.5) {
    DURATION_OPTIONS.push({
        value: `${h}`,
        label: h === 1 ? "1 Hour" : h % 1 === 0 ? `${h} Hours` : `${h} Hours`,
    });
}

const ORDER_OPTIONS = [
    { value: "corporate", label: "Corporate Transfer" },
    { value: "wedding", label: "Wedding" },
    { value: "conference", label: "Conference / Convention" },
    { value: "school-trip", label: "School Trip" },
    { value: "airport-transfer", label: "Airport Transfer" },
    { value: "city-tour", label: "City Tour" },
    { value: "sporting-event", label: "Sporting Event" },
    { value: "concert", label: "Concert / Music Event" },
    { value: "prom", label: "Prom / Homecoming" },
    { value: "bachelor", label: "Bachelor / Bachelorette" },
    { value: "church", label: "Church / Religious Group" },
    { value: "military", label: "Military / Government" },
    { value: "medical", label: "Medical Transport" },
    { value: "casino", label: "Casino Trip" },
    { value: "winery", label: "Winery / Brewery Tour" },
    { value: "other", label: "Other" },
];

// ─── Custom DateTime Picker ───────────────────────────────────────────────────
const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
const DAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const DAY_NAMES = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

function formatDateTime(date) {
    if (!date) return "";
    const d = new Date(date);
    const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
        d.getDay()
    ];
    const month = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ][d.getMonth()];
    const day = d.getDate();
    const suffix =
        day === 1 || day === 21 || day === 31
            ? "st"
            : day === 2 || day === 22
              ? "nd"
              : day === 3 || day === 23
                ? "rd"
                : "th";
    const year = d.getFullYear();
    let hours = d.getHours();
    const mins = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${dayName}, ${month} ${day}${suffix}, ${year} ${hours}:${mins} ${ampm}`;
}

const DateTimePicker = ({
    value,
    onChange,
    placeholder = "Pick-up Date & Time *",
}) => {
    const [open, setOpen] = useState(false);
    const [view, setView] = useState("calendar"); // calendar | time
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
                className="w-full appearance-none  bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all hover:border-slate-300"
            >
                <span
                    className={
                        value ? "text-slate-800 font-medium" : "text-slate-400"
                    }
                >
                    {value ? formatDateTime(value) : placeholder}
                </span>
                <CalIcon s={15} />
            </button>

            {open && (
                <div
                    className="absolute top-full mt-2 left-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100]"
                    style={{ minWidth: 300 }}
                >
                    {view === "calendar" && (
                        <>
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 z-10 px-5 py-4">
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={prevMonth}
                                        className="text-white/70 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
                                    >
                                        <ChevronLeft s={16} />
                                    </button>
                                    <span className="text-white font-bold text-sm">
                                        {MONTHS[calMonth]} {calYear}
                                    </span>
                                    <button
                                        onClick={nextMonth}
                                        className="text-white/70 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
                                    >
                                        <ChevronRight s={16} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-7 mt-3 gap-0.5">
                                    {DAYS_SHORT.map((d) => (
                                        <div
                                            key={d}
                                            className="text-center text-[10px] font-bold text-blue-200 py-1"
                                        >
                                            {d}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-3">
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
                                                className={`w-full aspect-square rounded-lg text-[12px] font-semibold transition-all flex items-center justify-center
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
                        <div className="p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <button
                                    onClick={() => setView("calendar")}
                                    className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1"
                                >
                                    <ChevronLeft s={12} /> Back
                                </button>
                                <span className="text-sm font-bold text-slate-700 flex-1 text-center">
                                    {selectedDate
                                        ? formatDateTime(selectedDate)
                                              .split(",")
                                              .slice(0, 2)
                                              .join(",")
                                        : ""}
                                </span>
                            </div>

                            <div className="text-center mb-4">
                                <div className="text-4xl font-black text-slate-900 tracking-tight">
                                    {hour.toString().padStart(2, "0")}:
                                    {minute.toString().padStart(2, "0")}
                                    <span className="text-xl ml-2 font-bold text-blue-600">
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
                                                className={`py-1.5 rounded-lg text-xs font-bold transition-all ${hour === h ? "bg-blue-600 text-white shadow-md" : "bg-slate-50 hover:bg-blue-50 text-slate-700"}`}
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
                                                className={`py-1.5 rounded-lg text-xs font-bold transition-all ${minute === m ? "bg-blue-600 text-white shadow-md" : "bg-slate-50 hover:bg-blue-50 text-slate-700"}`}
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
                                                className={`flex-1 py-2 text-xs font-bold transition-all ${ampm === ap ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}
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
};

// ─── Form Primitives ─────────────────────────────────────────────────────────
const FieldLabel = ({ children }) => (
    <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.08em] mb-2">
        {children}
    </label>
);

const inputCls =
    "w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all hover:border-slate-300";

const SelectInput = ({ placeholder, options = [], value, onChange }) => (
    <div className="relative">
        <select
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value)}
            className={inputCls + " cursor-pointer pr-10"}
        >
            <option value="">{placeholder}</option>
            {options.map((o) => (
                <option key={o.value} value={o.value}>
                    {o.label}
                </option>
            ))}
        </select>
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <ChevronDown />
        </span>
    </div>
);

const TypeToggle = ({ value, onChange, options }) => (
    <div className="flex rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
        {options.map((opt) => (
            <button
                key={opt}
                onClick={() => onChange(opt.toLowerCase())}
                className={`px-3 py-1.5 text-[11px] font-bold transition-all border-none ${value === opt.toLowerCase() ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-white"}`}
            >
                {opt}
            </button>
        ))}
    </div>
);

const AddressRow = ({
    label,
    isDropoff = false,
    value,
    onChange,
    type,
    onTypeChange,
}) => {
    return (
        <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-700">
                    {label}
                </span>
                <div className="flex items-center gap-1.5">
                    <TypeToggle
                        value={type}
                        onChange={onTypeChange}
                        options={["Address", "Airport"]}
                    />
                    {isDropoff && (
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors border border-slate-200">
                            <EditIcon s={12} />
                        </button>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="text-slate-300 cursor-grab flex-shrink-0 mt-0.5">
                    <GripIcon s={16} />
                </div>
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={value || ""}
                        onChange={(e) => onChange?.(e.target.value)}
                        placeholder={
                            type === "airport"
                                ? "Search Airport or City *"
                                : "Enter address or city *"
                        }
                        className={inputCls}
                    />
                </div>
            </div>
        </div>
    );
};

const StopRow = ({ index, value, onChange, onRemove }) => (
    <div className="flex items-center gap-2">
        <div className="text-slate-300 cursor-grab flex-shrink-0">
            <GripIcon s={16} />
        </div>
        <div className="relative flex-1">
            <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={`Stop ${index + 1} Address *`}
                className={inputCls + " bg-slate-50/80"}
            />
        </div>
        <button
            onClick={onRemove}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors border border-red-100"
        >
            <XIcon s={12} />
        </button>
    </div>
);

const AddStopBtn = ({ onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-xs font-bold transition-colors group"
    >
        <span className="w-5 h-5 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
            <PlusIcon s={9} />
        </span>
        Add Stop
    </button>
);

const PassengerCounter = ({ count, setCount }) => (
    <div className="flex items-center justify-between">
        <div>
            <p className="text-sm font-semibold text-slate-700">
                Passenger Count <span className="text-red-400">*</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
                Total number of guests
            </p>
        </div>
        <div className="flex items-center gap-2.5">
            <button
                onClick={() => setCount(Math.max(1, count - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
            >
                <MinusIcon s={14} />
            </button>
            <input
                type="number"
                value={count}
                onChange={(e) =>
                    setCount(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-14 text-center border border-slate-200 rounded-xl py-1.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 shadow-sm"
            />
            <button
                onClick={() => setCount(count + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-200"
            >
                <PlusIcon s={14} />
            </button>
        </div>
    </div>
);

const Divider = () => <div className="border-t border-slate-100 my-1" />;

const FormCard = ({ children, className = "" }) => (
    <div
        className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm ${className}`}
    >
        <div className="divide-y divide-slate-100">{children}</div>
    </div>
);

const FormRow = ({ children }) => <div className="px-5 py-4">{children}</div>;

// ─── Charter Bus Services Info Banner ────────────────────────────────────────
const ServicesBanner = () => {
    const services = [
        { icon: "🏢", label: "Corporate" },
        { icon: "💍", label: "Wedding" },
        { icon: "✈️", label: "Airport" },
        { icon: "🏟️", label: "Sporting Event" },
        { icon: "🎓", label: "School Trip" },
        { icon: "🎵", label: "Concert" },
        { icon: "🍷", label: "Wine Tour" },
        { icon: "🎰", label: "Casino" },
    ];
    return (
        <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 mb-3">
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <BusIcon s={11} /> What We Serve
            </p>
            <div className="grid grid-cols-4 gap-2">
                {services.map((s) => (
                    <div
                        key={s.label}
                        className="bg-white rounded-xl p-2 text-center shadow-sm border border-blue-50 hover:border-blue-200 transition-colors cursor-default"
                    >
                        <div className="text-base mb-0.5">{s.icon}</div>
                        <div className="text-[9px] font-bold text-slate-600">
                            {s.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Hourly Form ─────────────────────────────────────────────────────────────
const HourlyForm = ({ data, onChange }) => {
    const updateField = (field, value) => {
        onChange?.({ ...data, [field]: value });
    };

    const updateStop = (index, value) => {
        const newStops = [...(data.stops || [])];
        newStops[index] = value;
        updateField("stops", newStops);
    };

    const removeStop = (index) => {
        const newStops = (data.stops || []).filter((_, i) => i !== index);
        updateField("stops", newStops);
    };

    const addStop = () => {
        updateField("stops", [...(data.stops || []), ""]);
    };

    return (
        <div className="space-y-3">
            <ServicesBanner />

            {/* Duration & Order Type */}
            <FormCard>
                <FormRow>
                    <FieldLabel>Charter Duration</FieldLabel>
                    <SelectInput
                        placeholder="Select duration (1 – 24 hours) *"
                        options={DURATION_OPTIONS}
                        value={data.duration || ""}
                        onChange={(v) => updateField("duration", v)}
                    />
                    {data.duration && (
                        <p className="mt-2 text-[11px] text-blue-600 font-semibold flex items-center gap-1">
                            <ClockIcon s={11} />
                            {parseFloat(data.duration) < 4
                                ? "⚠️ Minimum recommended: 4 hours for city tours"
                                : `${data.duration}h block reserved · Billed as flat rate`}
                        </p>
                    )}
                </FormRow>

                <FormRow>
                    <FieldLabel>Order / Event Type</FieldLabel>
                    <div className="relative">
                        <select
                            value={data.orderType || ""}
                            onChange={(e) =>
                                updateField("orderType", e.target.value)
                            }
                            className={inputCls + " cursor-pointer pr-10"}
                        >
                            <option value="">Select Event Type *</option>
                            <optgroup label="Business">
                                <option value="corporate">
                                    Corporate Transfer
                                </option>
                                <option value="conference">
                                    Conference / Convention
                                </option>
                                <option value="military">
                                    Military / Government
                                </option>
                            </optgroup>
                            <optgroup label="Celebrations">
                                <option value="wedding">Wedding</option>
                                <option value="prom">Prom / Homecoming</option>
                                <option value="bachelor">
                                    Bachelor / Bachelorette
                                </option>
                            </optgroup>
                            <optgroup label="Events">
                                <option value="sporting-event">
                                    Sporting Event
                                </option>
                                <option value="concert">
                                    Concert / Music Event
                                </option>
                                <option value="casino">Casino Trip</option>
                            </optgroup>
                            <optgroup label="Tours">
                                <option value="city-tour">City Tour</option>
                                <option value="winery">
                                    Winery / Brewery Tour
                                </option>
                                <option value="airport-transfer">
                                    Airport Transfer
                                </option>
                            </optgroup>
                            <optgroup label="Education & Community">
                                <option value="school-trip">School Trip</option>
                                <option value="church">
                                    Church / Religious Group
                                </option>
                                <option value="medical">
                                    Medical Transport
                                </option>
                            </optgroup>
                            <optgroup label="Other">
                                <option value="other">Other</option>
                            </optgroup>
                        </select>
                        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                            <ChevronDown s={14} />
                        </span>
                    </div>
                </FormRow>

                <FormRow>
                    <FieldLabel>Pick-up Date &amp; Time</FieldLabel>
                    <DateTimePicker
                        value={data.datetime || null}
                        onChange={(v) => updateField("datetime", v)}
                    />
                    {data.datetime && (
                        <div className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                            <CheckIcon s={11} /> {formatDateTime(data.datetime)}
                        </div>
                    )}
                </FormRow>
            </FormCard>

            {/* Route */}
            <FormCard>
                <div className="px-5 py-4 space-y-4">
                    <div className="flex items-center gap-2">
                        <MapPinIcon s={14} />
                        <span className="text-sm font-bold text-slate-700">
                            Route Details
                        </span>
                    </div>
                    <AddressRow
                        label="Pick-up Location"
                        value={data.pickupAddress || ""}
                        onChange={(v) => updateField("pickupAddress", v)}
                        type={data.pickupType || "address"}
                        onTypeChange={(v) => updateField("pickupType", v)}
                    />
                    {(data.stops || []).map((stop, i) => (
                        <StopRow
                            key={i}
                            index={i}
                            value={stop}
                            onChange={(v) => updateStop(i, v)}
                            onRemove={() => removeStop(i)}
                        />
                    ))}
                    <AddStopBtn onClick={addStop} />
                    <Divider />
                    <AddressRow
                        label="Drop-off Location"
                        isDropoff
                        value={data.dropoffAddress || ""}
                        onChange={(v) => updateField("dropoffAddress", v)}
                        type={data.dropoffType || "address"}
                        onTypeChange={(v) => updateField("dropoffType", v)}
                    />
                    <Divider />
                    <PassengerCounter
                        count={data.passengers || 1}
                        setCount={(v) => updateField("passengers", v)}
                    />
                </div>
            </FormCard>

            {/* Inclusions */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                    Every Hourly Charter Includes
                </p>
                {[
                    "Professional licensed & insured driver",
                    "Complimentary WiFi on board",
                    "Climate-controlled cabin",
                    "PA system & aux input",
                    "ADA accessible vehicles available",
                    "Real-time GPS tracking",
                    "Free cancellation up to 48h before",
                ].map((item) => (
                    <div
                        key={item}
                        className="flex items-center gap-2.5 text-[12px] text-slate-600 font-medium"
                    >
                        <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <CheckIcon s={9} />
                        </span>
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── One Way Form ─────────────────────────────────────────────────────────────
const OneWayForm = ({ data, onChange }) => {
    const updateField = (field, value) => {
        onChange?.({ ...data, [field]: value });
    };

    const updateStop = (index, value) => {
        const newStops = [...(data.stops || [])];
        newStops[index] = value;
        updateField("stops", newStops);
    };

    const removeStop = (index) => {
        const newStops = (data.stops || []).filter((_, i) => i !== index);
        updateField("stops", newStops);
    };

    const addStop = () => {
        updateField("stops", [...(data.stops || []), ""]);
    };

    return (
        <div className="space-y-3">
            <FormCard>
                <FormRow>
                    <FieldLabel>Order / Event Type</FieldLabel>
                    <SelectInput
                        placeholder="Select Event Type *"
                        options={ORDER_OPTIONS}
                        value={data.orderType || ""}
                        onChange={(v) => updateField("orderType", v)}
                    />
                </FormRow>
                <FormRow>
                    <FieldLabel>Pick-up Date &amp; Time</FieldLabel>
                    <DateTimePicker
                        value={data.datetime || null}
                        onChange={(v) => updateField("datetime", v)}
                    />
                    {data.datetime && (
                        <div className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                            <CheckIcon s={11} /> {formatDateTime(data.datetime)}
                        </div>
                    )}
                </FormRow>
            </FormCard>
            <FormCard>
                <div className="px-5 py-4 space-y-4">
                    <AddressRow
                        label="Pick-up"
                        value={data.pickupAddress || ""}
                        onChange={(v) => updateField("pickupAddress", v)}
                        type={data.pickupType || "address"}
                        onTypeChange={(v) => updateField("pickupType", v)}
                    />
                    {(data.stops || []).map((stop, i) => (
                        <StopRow
                            key={i}
                            index={i}
                            value={stop}
                            onChange={(v) => updateStop(i, v)}
                            onRemove={() => removeStop(i)}
                        />
                    ))}
                    <AddStopBtn onClick={addStop} />
                    <Divider />
                    <AddressRow
                        label="Drop-off"
                        isDropoff
                        value={data.dropoffAddress || ""}
                        onChange={(v) => updateField("dropoffAddress", v)}
                        type={data.dropoffType || "address"}
                        onTypeChange={(v) => updateField("dropoffType", v)}
                    />
                    <Divider />
                    <PassengerCounter
                        count={data.passengers || 1}
                        setCount={(v) => updateField("passengers", v)}
                    />
                </div>
            </FormCard>
        </div>
    );
};

// ─── Round Trip Form ──────────────────────────────────────────────────────────
const LegCard = ({ title, accent, data = {}, onChange }) => {
    const updateField = (field, value) => {
        onChange?.({ ...data, [field]: value });
    };

    const updateStop = (index, value) => {
        const newStops = [...(data.stops || [])];
        newStops[index] = value;
        updateField("stops", newStops);
    };

    const removeStop = (index) => {
        const newStops = (data.stops || []).filter((_, i) => i !== index);
        updateField("stops", newStops);
    };

    const addStop = () => {
        updateField("stops", [...(data.stops || []), ""]);
    };

    return (
        <div
            className={`rounded-2xl border overflow-visible shadow-sm ${accent ? "border-indigo-100" : "border-slate-200/80"}`}
        >
            <div
                className={`px-5 py-3 border-b font-bold text-slate-800 text-sm flex items-center gap-2 ${accent ? "bg-indigo-50 border-indigo-100" : "bg-slate-50 border-slate-100"}`}
            >
                <span
                    className={`w-2 h-2 rounded-full ${accent ? "bg-indigo-400" : "bg-blue-400"}`}
                />
                {title}
            </div>
            <div className="bg-white divide-y divide-slate-100">
                <div className="px-5 py-4 space-y-2">
                    <FieldLabel>Date &amp; Time</FieldLabel>
                    <DateTimePicker
                        value={data.datetime || null}
                        onChange={(v) => updateField("datetime", v)}
                    />
                    {data.datetime && (
                        <div className="mt-1 text-[11px] text-emerald-600 font-semibold flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-1.5">
                            <CheckIcon s={10} /> {formatDateTime(data.datetime)}
                        </div>
                    )}
                </div>
                <div className="px-5 py-4 space-y-4">
                    <AddressRow
                        label="Pick-up"
                        value={data.pickupAddress || ""}
                        onChange={(v) => updateField("pickupAddress", v)}
                        type={data.pickupType || "address"}
                        onTypeChange={(v) => updateField("pickupType", v)}
                    />
                    {(data.stops || []).map((stop, i) => (
                        <StopRow
                            key={i}
                            index={i}
                            value={stop}
                            onChange={(v) => updateStop(i, v)}
                            onRemove={() => removeStop(i)}
                        />
                    ))}
                    <AddStopBtn onClick={addStop} />
                    <Divider />
                    <AddressRow
                        label="Drop-off"
                        isDropoff
                        value={data.dropoffAddress || ""}
                        onChange={(v) => updateField("dropoffAddress", v)}
                        type={data.dropoffType || "address"}
                        onTypeChange={(v) => updateField("dropoffType", v)}
                    />
                    <Divider />
                    <PassengerCounter
                        count={data.passengers || 1}
                        setCount={(v) => updateField("passengers", v)}
                    />
                </div>
            </div>
        </div>
    );
};

const RoundTripForm = ({ data, onChange }) => {
    const updateField = (field, value) => {
        onChange?.({ ...data, [field]: value });
    };

    const updateLeg = (leg, fieldData) => {
        onChange?.({ ...data, [leg]: fieldData });
    };

    return (
        <div className="space-y-3">
            <FormCard>
                <FormRow>
                    <FieldLabel>Order / Event Type</FieldLabel>
                    <SelectInput
                        placeholder="Select Event Type *"
                        options={ORDER_OPTIONS}
                        value={data.orderType || ""}
                        onChange={(v) => updateField("orderType", v)}
                    />
                </FormRow>
            </FormCard>
            <LegCard
                title="Round Trip: Pick-Up"
                accent={false}
                data={data.outbound || {}}
                onChange={(v) => updateLeg("outbound", v)}
            />
            <LegCard
                title="Round Trip: Return"
                accent={true}
                data={data.return || {}}
                onChange={(v) => updateLeg("return", v)}
            />
        </div>
    );
};

// ─── Validation Helper ───────────────────────────────────────────────────────
const validateForm = (tripType, formData) => {
    const errors = [];

    if (tripType === "hourly") {
        if (!formData.duration) errors.push("Please select charter duration");
        if (!formData.orderType) errors.push("Please select event type");
        if (!formData.datetime)
            errors.push("Please select pick-up date and time");
        if (!formData.pickupAddress?.trim())
            errors.push("Please enter pick-up location");
        if (!formData.dropoffAddress?.trim())
            errors.push("Please enter drop-off location");
        if (!formData.passengers || formData.passengers < 1)
            errors.push("Please enter passenger count");

        // Validate stops if any
        if (formData.stops?.length > 0) {
            const emptyStops = formData.stops.some((stop) => !stop?.trim());
            if (emptyStops)
                errors.push(
                    "Please fill in all stop addresses or remove empty stops",
                );
        }
    } else if (tripType === "one-way") {
        if (!formData.orderType) errors.push("Please select event type");
        if (!formData.datetime)
            errors.push("Please select pick-up date and time");
        if (!formData.pickupAddress?.trim())
            errors.push("Please enter pick-up location");
        if (!formData.dropoffAddress?.trim())
            errors.push("Please enter drop-off location");
        if (!formData.passengers || formData.passengers < 1)
            errors.push("Please enter passenger count");

        if (formData.stops?.length > 0) {
            const emptyStops = formData.stops.some((stop) => !stop?.trim());
            if (emptyStops)
                errors.push(
                    "Please fill in all stop addresses or remove empty stops",
                );
        }
    } else if (tripType === "round-trip") {
        if (!formData.orderType) errors.push("Please select event type");

        // Validate outbound leg
        if (!formData.outbound?.datetime)
            errors.push("Please select outbound date and time");
        if (!formData.outbound?.pickupAddress?.trim())
            errors.push("Please enter outbound pick-up location");
        if (!formData.outbound?.dropoffAddress?.trim())
            errors.push("Please enter outbound drop-off location");
        if (!formData.outbound?.passengers || formData.outbound.passengers < 1)
            errors.push("Please enter outbound passenger count");

        // Validate return leg
        if (!formData.return?.datetime)
            errors.push("Please select return date and time");
        if (!formData.return?.pickupAddress?.trim())
            errors.push("Please enter return pick-up location");
        if (!formData.return?.dropoffAddress?.trim())
            errors.push("Please enter return drop-off location");
        if (!formData.return?.passengers || formData.return.passengers < 1)
            errors.push("Please enter return passenger count");

        // Validate stops for both legs
        if (formData.outbound?.stops?.length > 0) {
            const emptyStops = formData.outbound.stops.some(
                (stop) => !stop?.trim(),
            );
            if (emptyStops)
                errors.push(
                    "Please fill in all outbound stop addresses or remove empty stops",
                );
        }
        if (formData.return?.stops?.length > 0) {
            const emptyStops = formData.return.stops.some(
                (stop) => !stop?.trim(),
            );
            if (emptyStops)
                errors.push(
                    "Please fill in all return stop addresses or remove empty stops",
                );
        }
    }

    return errors;
};

// ─── Booking Form Shell ───────────────────────────────────────────────────────
const TRIP_TYPES = [
    { id: "hourly", label: "Hourly", Icon: ClockIcon },
    { id: "one-way", label: "One Way", Icon: ArrowRight },
    { id: "round-trip", label: "Round Trip", Icon: RefreshIcon },
];

const TRUST = [
    { Icon: CheckIcon, text: "Top Rated Fleet" },
    { Icon: ShieldIcon, text: "Fully Insured" },
    { Icon: HeadphonesIcon, text: "24/7 Support" },
];

const STATS = [
    { value: "500+", label: "Vehicles" },
    { value: "50k+", label: "Trips Done" },
    { value: "98%", label: "Satisfaction" },
    { value: "24/7", label: "Support" },
];

const BookingForm = () => {
    const [tripType, setTripType] = useState("hourly");
    const [errors, setErrors] = useState([]);
    const [touched, setTouched] = useState(false);
    const { navigate } = useNav();

    // Form data state for each trip type
    const [hourlyData, setHourlyData] = useState({});
    const [oneWayData, setOneWayData] = useState({});
    const [roundTripData, setRoundTripData] = useState({});

    useEffect(() => {
        const savedData = localStorage.getItem("bookingStep1");
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.tripType) setTripType(parsed.tripType);
                if (parsed.tripType === "hourly")
                    setHourlyData(parsed.formData || {});
                else if (parsed.tripType === "one-way")
                    setOneWayData(parsed.formData || {});
                else if (parsed.tripType === "round-trip")
                    setRoundTripData(parsed.formData || {});
            } catch (e) {
                console.error("Error parsing saved booking data:", e);
            }
        }
    }, []);

    const getCurrentFormData = () => {
        switch (tripType) {
            case "hourly":
                return hourlyData;
            case "one-way":
                return oneWayData;
            case "round-trip":
                return roundTripData;
            default:
                return {};
        }
    };

    const handleTripTypeChange = (newType) => {
        setTripType(newType);
        setErrors([]); // Clear errors when switching tabs
        setTouched(false);
    };

    const handleContinue = () => {
        setTouched(true);
        const currentData = getCurrentFormData();
        const validationErrors = validateForm(tripType, currentData);

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            // Scroll to top of form to show errors
            const formElement = document.getElementById("booking-form-content");
            if (formElement) {
                formElement.scrollTo({ top: 0, behavior: "smooth" });
            }
        } else {
            setErrors([]);
            // Store form data in session/local storage or context before navigating
            const bookingData = {
                tripType,
                formData: currentData,
                timestamp: new Date().toISOString(),
            };
            localStorage.setItem("bookingStep1", JSON.stringify(bookingData));
            navigate("/bookingform/vechileselect");
        }
    };

    const getActiveForm = () => {
        switch (tripType) {
            case "hourly":
                return (
                    <HourlyForm data={hourlyData} onChange={setHourlyData} />
                );
            case "one-way":
                return (
                    <OneWayForm data={oneWayData} onChange={setOneWayData} />
                );
            case "round-trip":
                return (
                    <RoundTripForm
                        data={roundTripData}
                        onChange={setRoundTripData}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-300/40 border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-600 px-6 pt-6 pb-5">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <p className="text-blue-200 text-[10px] font-bold uppercase tracking-[0.12em] mb-1.5">
                            Step 1 of 3
                        </p>
                        <h2 className="text-white text-[22px] font-black tracking-tight leading-none">
                            Trip Details
                        </h2>
                    </div>
                    <div className="flex gap-1.5 items-center">
                        <div className="h-1.5 w-10 bg-white rounded-full" />
                        <div className="h-1.5 w-10 bg-white/25 rounded-full" />
                        <div className="h-1.5 w-10 bg-white/25 rounded-full" />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-1 bg-black/20 rounded-2xl p-1">
                    {TRIP_TYPES.map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            onClick={() => handleTripTypeChange(id)}
                            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-bold transition-all ${
                                tripType === id
                                    ? "bg-white text-blue-700 shadow-lg shadow-black/10"
                                    : "text-blue-200 hover:text-white hover:bg-white/10"
                            }`}
                        >
                            <Icon s={12} />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div
                id="booking-form-content"
                className="p-4 max-h-[65vh] overflow-y-auto bg-slate-50/60 [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {touched && errors.length > 0 && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 animate-in slide-in-from-top-2">
                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <AlertIcon s={12} className="text-red-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-red-800 mb-1">
                                    Please complete all required fields
                                </p>
                                <ul className="space-y-1">
                                    {errors.map((error, index) => (
                                        <li
                                            key={index}
                                            className="text-xs text-red-600 flex items-center gap-1.5"
                                        >
                                            <span className="w-1 h-1 rounded-full bg-red-400" />
                                            {error}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
                {getActiveForm()}
            </div>

            <div className="px-5 py-4 bg-white border-t border-slate-100">
                <button
                    onClick={handleContinue}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-black py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 group tracking-wide"
                >
                    Continue to Fleet Selection
                    <span className="group-hover:translate-x-1 transition-transform inline-flex">
                        <ArrowRight s={14} />
                    </span>
                </button>
                <div className="flex items-center justify-center gap-1.5 mt-3">
                    <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} s={11} />
                        ))}
                    </div>
                    <p className="text-center text-[11px] text-slate-400 font-medium">
                        Trusted by 50,000+ customers · No card required
                    </p>
                </div>
            </div>
        </div>
    );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LuxCharterPage() {
    const [country, setCountry] = useState("");

    useEffect(() => {
        const fetchCountry = async () => {
            try {
                const response = await fetch("https://ipapi.co/json/");
                const data = await response.json();
                if (data && data.country_name) {
                    setCountry(data.country_name);
                }
            } catch (error) {
                console.error("Failed to fetch country:", error);
            }
        };
        fetchCountry();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br mt-10 from-slate-50 via-blue-50/20 to-white font-sans">
            <main className="max-w-7xl mx-auto px-6 py-14 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
                    <div className="space-y-7 lg:pt-6">
                        <div className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em]">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            Premium Charter Services
                        </div>
                        <div>
                            <h1 className="text-5xl lg:text-[58px] font-black text-slate-900 leading-[1.05] tracking-tight">
                                Book Your
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                                    Charter Bus {country ? `in ${country}` : ""}
                                </span>
                            </h1>
                            <p className="mt-5 text-[17px] text-slate-500 leading-relaxed max-w-md">
                                Experience premium group travel with our fleet
                                of luxury coaches. Seamless booking,
                                professional drivers, and unparalleled comfort.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {TRUST.map(({ Icon, text }) => (
                                <div
                                    key={text}
                                    className="flex items-center gap-2.5 bg-white border border-slate-100 rounded-xl px-3.5 py-2 shadow-sm"
                                >
                                    <div className="w-7 h-7 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                        <Icon s={14} />
                                    </div>
                                    <span className="text-[13px] font-semibold text-slate-700">
                                        {text}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="hidden lg:grid grid-cols-4 gap-3 pt-2">
                            {STATS.map(({ value, label }) => (
                                <div
                                    key={label}
                                    className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm text-center"
                                >
                                    <div className="text-2xl font-black text-slate-900 tracking-tight">
                                        {value}
                                    </div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-1">
                                        {label}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="hidden lg:flex items-center gap-4 pt-2">
                            <div className="flex -space-x-2">
                                {[
                                    "#3b82f6",
                                    "#6366f1",
                                    "#8b5cf6",
                                    "#ec4899",
                                ].map((c, i) => (
                                    <div
                                        key={i}
                                        className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm"
                                        style={{ background: c }}
                                    >
                                        {["AK", "MJ", "SR", "LP"][i]}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div className="flex text-amber-400 gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon key={i} s={12} />
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                                    Loved by 50,000+ customers worldwide
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:sticky lg:top-24">
                        <BookingForm />
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-slate-100 mt-8">
                <div className="max-w-7xl mx-auto px-6 py-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { value: "500+", label: "Vehicles Available" },
                            { value: "50k+", label: "Trips Completed" },
                            { value: "98%", label: "Satisfaction Rate" },
                            { value: "24/7", label: "Expert Support" },
                        ].map(({ value, label }) => (
                            <div key={label} className="text-center">
                                <div className="text-3xl font-black text-slate-900 tracking-tight">
                                    {value}
                                </div>
                                <div className="text-[11px] text-slate-400 uppercase tracking-widest font-bold mt-1.5">
                                    {label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}
