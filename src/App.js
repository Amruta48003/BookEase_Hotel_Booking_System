
import React from "react";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import HotelDetails from "./pages/HotelDetails";
import Rooms from "./pages/Rooms";
import Payment from "./pages/Payment";
function App() {

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* HOME */}
                <Route
                    path="/"
                    element={<Home />}
                />

                {/* REGISTER */}
                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* LOGIN */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* HOTEL ROOMS */}
                <Route
                    path="/rooms/:hotelId"
                    element={<Rooms />}
                />

                {/* BOOKING */}
                <Route
                    path="/booking/:roomId"
                    element={<Booking />}
                />

                {/* MY BOOKINGS */}
                <Route
                    path="/my-bookings"
                    element={<MyBookings />}
                />

                {/* ADMIN */}
                <Route
                    path="/admin"
                    element={
                        user && user.role === "admin"
                            ? <AdminDashboard />
                            : <Navigate to="/login" replace />
                    }
                />

                {/* HOTEL DETAILS */}
                <Route
                    path="/hotel-details"
                    element={<HotelDetails />}
                />

                {/* UNKNOWN PAGE */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
                <Route
    path="/payment"
    element={<Payment />}
/>

            </Routes>

        </BrowserRouter>
    );
}

export default App;

