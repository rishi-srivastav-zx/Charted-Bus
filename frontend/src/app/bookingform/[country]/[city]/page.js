import Header from "@/components/header";
import LuxCharterPage from "@/components/bookinginterfacecomponent/basicdetails";   
import Seodata from "@/components/seoComponent/seodata.js";

export default function() {
    return (
        <>
          <Header />
          <main className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
              <LuxCharterPage />
            </div>
          </main>
           <Seodata/>
        </>
    )
}