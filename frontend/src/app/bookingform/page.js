import Header from "@/components/header";
import LuxCharterPage from "@/components/bookinginterfacecomponent/basicdetails";

export default function BookingUniversalPage() {
    return (
        <>
            <Header />

            <main className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <LuxCharterPage />
                </div>
            </main>
        </>
    );
}
