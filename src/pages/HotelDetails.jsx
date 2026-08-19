 import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function HotelDetails() {
    const location = useLocation();
    const navigate = useNavigate();

    const hotel = location.state?.hotel;

    // If no hotel data was passed
    if (!hotel) {
        return (
            <div style={pageStyle}>
                <h2>Hotel details not found</h2>

                <button
                    onClick={() => navigate("/")}
                    style={buttonStyle}
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div style={pageStyle}>

            {/* HEADER */}
            <div style={headerStyle}>
                <h1>Hotel Details</h1>

                <button
                    onClick={() => navigate(-1)}
                    style={backButtonStyle}
                >
                    ← Back
                </button>
            </div>

            {/* HOTEL CARD */}
            <div style={hotelCardStyle}>

                {/* HOTEL IMAGE */}
                {hotel.image ? (
                    <img
                        src={`/images/${hotel.image}`}
                        alt={hotel.hotel_name}
                        style={imageStyle}
                    />
                ) : (
                    <div style={noImageStyle}>
                        No Image Available
                    </div>
                )}

                {/* HOTEL INFORMATION */}
                <div style={contentStyle}>

                    <h2>{hotel.hotel_name}</h2>

                    <p>
                        <strong>📍 Location:</strong>{" "}
                        {hotel.location}
                    </p>

                    <p>
                        <strong>🏠 Address:</strong>{" "}
                        {hotel.address}
                    </p>

                    <p>
                        <strong>📞 Contact:</strong>{" "}
                        {hotel.contact_number}
                    </p>

                    <p>
                        <strong>📧 Email:</strong>{" "}
                        {hotel.email}
                    </p>

                    <p>
                        <strong>⭐ Rating:</strong>{" "}
                        {hotel.rating || "Not rated"}
                    </p>

                    <div style={descriptionStyle}>
                        <h3>About This Hotel</h3>

                        <p>
                            {hotel.description ||
                                "No description available."}
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            navigate("/booking", {
                                state: {
                                    hotel: hotel
                                }
                            })
                        }
                        style={bookButtonStyle}
                    >
                        Book a Room
                    </button>

                </div>
            </div>
        </div>
    );
}

// ==============================
// STYLES
// ==============================

const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    padding: "30px",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box"
};

const headerStyle = {
    maxWidth: "1000px",
    margin: "0 auto 25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
};

const hotelCardStyle = {
    maxWidth: "1000px",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
};

const imageStyle = {
    width: "100%",
    height: "400px",
    objectFit: "cover",
    display: "block"
};

const noImageStyle = {
    width: "100%",
    height: "400px",
    backgroundColor: "#ddd",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
    color: "#666"
};

const contentStyle = {
    padding: "30px"
};

const descriptionStyle = {
    marginTop: "25px",
    padding: "20px",
    backgroundColor: "#f5f7fa",
    borderRadius: "10px"
};

const buttonStyle = {
    padding: "12px 25px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
    fontSize: "16px"
};

const backButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#6c757d"
};

const bookButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#28a745",
    marginTop: "20px",
    padding: "14px 30px"
};

export default HotelDetails;