import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "../../Default/components/Footer";

function DoctorLayout() {
    return (
        <div>
            <Navigation />
            <Outlet />
            <Footer />
        </div>
    );
}

export default DoctorLayout;