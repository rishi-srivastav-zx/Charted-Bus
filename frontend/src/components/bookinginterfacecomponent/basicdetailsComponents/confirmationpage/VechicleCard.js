import { Bus, Users, Wifi, Briefcase, Star } from "lucide-react";
import SectionCard from "./SectionCard";

export default function VehicleCard({ vehicle, onChange }) {
    return (
        <SectionCard
            title="Selected Vehicle"
            icon={Bus}
            actionLabel="Change"
            onAction={onChange}
        >
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-64 h-40 bg-slate-100 rounded-3xl overflow-hidden shrink-0 border border-slate-200 shadow-inner">
                    {vehicle?.images?.[0] || vehicle?.image ? (
                        <img
                            src={vehicle.images?.[0] || vehicle.image}
                            alt={vehicle.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                            <Bus className="w-12 h-12 text-slate-300" />
                        </div>
                    )}
                </div>
                <div className="flex-grow py-1">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">
                                {vehicle.name || "No vehicle selected"}
                            </h4>
                            <div className="flex items-center gap-2">
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-3.5 h-3.5 fill-current"
                                        />
                                    ))}
                                </div>
                                <span className="text-[11px] font-bold text-slate-400">
                                    4.9/5 (240+ Reviews)
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 mt-6">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                                <Users className="w-4 h-4 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">
                                    Capacity
                                </p>
                                <p className="text-xs font-bold text-slate-700">
                                    {vehicle.passengers ||
                                        vehicle.seatCapacity ||
                                        0}{" "}
                                    Seats
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                                <Wifi className="w-4 h-4 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">
                                    Onboard
                                </p>
                                <p className="text-xs font-bold text-slate-700">
                                    Free WiFi
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                                <Briefcase className="w-4 h-4 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">
                                    Luggage
                                </p>
                                <p className="text-xs font-bold text-slate-700">
                                    24 Bags
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}
