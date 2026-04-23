import { Users } from "lucide-react";
import SectionCard from "./SectionCard";
import InfoRow from "./InfoRow";

export default function PassengerCard({ contact, onEdit }) {
    return (
        <SectionCard title="Primary Passenger" icon={Users} onAction={onEdit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoRow
                    label="Full Name"
                    value={`${contact.firstName || "N/A"} ${contact.lastName || ""}`}
                />
                <InfoRow label="Email Address" value={contact.email || "N/A"} />
                <InfoRow
                    label="Phone Number"
                    value={`${contact.countryCode || ""} ${contact.phone || "N/A"}`}
                />
                <InfoRow
                    label="Contact Type"
                    value="Primary Point of Contact"
                    subValue="Will receive all updates"
                />
            </div>
        </SectionCard>
    );
}
