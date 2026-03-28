"use client";
import { CheckIcon } from "./icons";
import { FieldLabel,SelectInput,FormCard,FormRow,Divider } from "./formprimitives";
import DateTimePicker from "./datetimepicker";
import AddressRow from "./addresrow";
import { AddStopBtn,StopRow } from "./stoprow";
import PassengerCounter from "./passengercount";
import { ORDER_OPTIONS } from "./constant";
import { formatDateTime } from "./validator";

// ─── LegCard ──────────────────────────────────────────────────────────────────
function LegCard({ title, accent, data = {}, onChange }) {
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
        <div
            className={`rounded-2xl border overflow-visible shadow-sm ${
                accent ? "border-indigo-100" : "border-slate-200/80"
            }`}
        >
            <div
                className={`px-4 sm:px-5 py-2.5 sm:py-3 border-b font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-2 ${
                    accent
                        ? "bg-indigo-50 border-indigo-100"
                        : "bg-slate-50 border-slate-100"
                }`}
            >
                <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${accent ? "bg-indigo-400" : "bg-blue-400"}`}
                />
                {title}
            </div>
            <div className="bg-white divide-y divide-slate-100">
                <div className="px-4 sm:px-5 py-3 sm:py-4 space-y-2">
                    <FieldLabel>Date &amp; Time</FieldLabel>
                    <DateTimePicker
                        value={data.datetime || null}
                        onChange={(v) => updateField("datetime", v)}
                    />
                    {data.datetime && (
                        <div className="mt-1 text-[10px] sm:text-[11px] text-emerald-600 font-semibold flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-1.5 flex-wrap">
                            <CheckIcon s={10} />
                            <span className="break-words">
                                {formatDateTime(data.datetime)}
                            </span>
                        </div>
                    )}
                </div>
                <div className="px-4 sm:px-5 py-3 sm:py-4 space-y-4">
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
}

// ─── RoundTripForm ────────────────────────────────────────────────────────────
export default function RoundTripForm({ data, onChange }) {
    const updateField = (field, value) =>
        onChange?.({ ...data, [field]: value });
    const updateLeg = (leg, fieldData) =>
        onChange?.({ ...data, [leg]: fieldData });

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
}
