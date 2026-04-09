"use client";
import { ClockIcon, CheckIcon, MapPinIcon, ChevronDown } from "./icons";
import {
    FieldLabel,
    SelectInput,
    FormCard,
    FormRow,
    Divider,
    inputCls,
} from "./formprimitives";
import DateTimePicker from "./datetimepicker";
import AddressRow from "./addresrow";
import { StopRow, AddStopBtn } from "./stoprow";
import PassengerCounter from "./passengercount";
import ServicesBanner from "./servicebanner";
import { DURATION_OPTIONS, HOURLY_INCLUSIONS } from "./constant";
import { formatDateTime } from "./validator";

// ─── HourlyForm ───────────────────────────────────────────────────────────────
export default function HourlyForm({ data, onChange }) {
    const updateField = (field, value) =>
        onChange?.({ ...data, [field]: value });

    const updateStop = (index, value) => {
        const newStops = [...(data.stops || [])];
        newStops[index] = value;
        updateField("stops", newStops);
    };

    const removeStop = (index) => {
        updateField(
            "stops",
            (data.stops || []).filter((_, i) => i !== index),
        );
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
                        <p className="mt-2 text-[10px] sm:text-[11px] text-blue-600 font-semibold flex items-center gap-1 flex-wrap">
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
                        <div className="mt-2 text-[10px] sm:text-[11px] text-emerald-600 font-semibold flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 flex-wrap">
                            <CheckIcon s={11} />
                            <span className="break-words">
                                {formatDateTime(data.datetime)}
                            </span>
                        </div>
                    )}
                </FormRow>
            </FormCard>

            {/* Route */}
            <FormCard>
                <div className="px-4 sm:px-5 py-3 sm:py-4 space-y-4">
                    <div className="flex items-center gap-2">
                        <MapPinIcon s={14} />
                        <span className="text-xs sm:text-sm font-bold text-slate-700">
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
                    <div className="px-2 sm:px-0">
                        <PassengerCounter
                            count={data.passengers || 1}
                            setCount={(v) => updateField("passengers", v)}
                        />
                    </div>
                </div>
            </FormCard>

            {/* Inclusions */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-4 space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                    Every Hourly Charter Includes
                </p>
                {HOURLY_INCLUSIONS.map((item) => (
                    <div
                        key={item}
                        className="flex items-start sm:items-center gap-2.5 text-[11px] sm:text-[12px] text-slate-600 font-medium"
                    >
                        <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
                            <CheckIcon s={9} />
                        </span>
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
}
