
import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

function HotelList() {

    const navigate =
        useNavigate();

    const [hotels, setHotels] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    // =====================================================
    // LOAD HOTELS
    // =====================================================

    useEffect(() => {

        fetch(
            "http://localhost:5000/api/hotels"
        )
            .then((response) => {

                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch hotels"
                    );
                }

                return response.json();
            })

            .then((data) => {

                console.log(
                    "Hotels received:",
                    data
                );

                if (Array.isArray(data)) {

                    setHotels(data);

                } else if (
                    data &&
                    Array.isArray(data.hotels)
                ) {

                    setHotels(
                        data.hotels
                    );

                } else {

                    setHotels([]);
                }

                setLoading(false);
            })

            .catch((err) => {

                console.error(
                    "Hotel fetch error:",
                    err
                );

                setError(
                    "Unable to load hotels"
                );

                setLoading(false);
            });

    }, []);

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div
                style={
                    styles.messageBox
                }
            >
                <h2>
                    Loading hotels...
                </h2>
            </div>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (
            <div
                style={
                    styles.messageBox
                }
            >

                <h2>
                    {error}
                </h2>

                <button
                    onClick={() =>
                        window.location.reload()
                    }
                    style={
                        styles.retryButton
                    }
                >
                    Try Again
                </button>

            </div>
        );
    }

    // =====================================================
    // NO HOTELS
    // =====================================================

    if (hotels.length === 0) {

        return (
            <div
                style={
                    styles.messageBox
                }
            >

                <h2>
                    No Hotels Available
                </h2>

                <p>
                    There are currently no hotels
                    available for booking.
                </p>

            </div>
        );
    }

    // =====================================================
    // HOTEL LIST
    // =====================================================

    return (

        <div
            style={
                styles.section
            }
        >

            <div
                style={
                    styles.hotelGrid
                }
            >

                {hotels.map(
                    (hotel) => (

                        <div
                            key={
                                hotel.id
                            }
                            style={
                                styles.hotelCard
                            }
                        >

                            {/* =================================================
                                HOTEL IMAGE
                            ================================================= */}

                            <div
                                style={
                                    styles.imageWrapper
                                }
                            >

                                {hotel.image ? (

                                    <img
                                        src={
                                            `/images/${hotel.image}`
                                        }
                                        alt={
                                            hotel.hotel_name
                                        }
                                        style={
                                            styles.hotelImage
                                        }

                                        onError={(
                                            event
                                        ) => {

                                            event.currentTarget.style.display =
                                                "none";

                                            if (
                                                event.currentTarget.parentElement
                                            ) {

                                                event.currentTarget.parentElement.classList.add(
                                                    "image-error"
                                                );
                                            }

                                        }}
                                    />

                                ) : (

                                    <div
                                        style={
                                            styles.noImage
                                        }
                                    >
                                        🏨
                                        <span>
                                            No Image
                                        </span>
                                    </div>

                                )}

                                {/* RATING BADGE */}

                                <div
                                    style={
                                        styles.ratingBadge
                                    }
                                >
                                    ⭐{" "}
                                    {
                                        hotel.rating ||
                                        "N/A"
                                    }
                                </div>

                            </div>


                            {/* =================================================
                                HOTEL CONTENT
                            ================================================= */}

                            <div
                                style={
                                    styles.hotelContent
                                }
                            >

                                <h2
                                    style={
                                        styles.hotelName
                                    }
                                >
                                    {
                                        hotel.hotel_name
                                    }
                                </h2>


                                {/* LOCATION */}

                                <div
                                    style={
                                        styles.location
                                    }
                                >
                                    📍{" "}
                                    {
                                        hotel.location ||
                                        "Location unavailable"
                                    }
                                </div>


                                {/* DESCRIPTION */}

                                <p
                                    style={
                                        styles.description
                                    }
                                >
                                    {
                                        hotel.description ||
                                        "A comfortable place to stay."
                                    }
                                </p>


                                {/* HOTEL INFO */}

                                <div
                                    style={
                                        styles.infoRow
                                    }
                                >

                                    <span>
                                        🏨 Comfortable Stay
                                    </span>

                                    <span>
                                        ⭐ Highly Rated
                                    </span>

                                </div>


                                {/* VIEW ROOMS BUTTON */}

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/rooms/${hotel.id}`
                                        )
                                    }
                                    style={
                                        styles.viewButton
                                    }
                                >
                                    View Rooms
                                    <span
                                        style={{
                                            marginLeft:
                                                "8px"
                                        }}
                                    >
                                        →
                                    </span>
                                </button>

                            </div>

                        </div>

                    )
                )}

            </div>

        </div>
    );
}


// =====================================================
// STYLES
// =====================================================

const styles = {

    section: {
        width: "100%"
    },

    hotelGrid: {
        display:
            "grid",

        gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",

        gap: "28px",

        width: "100%"
    },

    hotelCard: {
        backgroundColor:
            "white",

        borderRadius:
            "16px",

        overflow:
            "hidden",

        boxShadow:
            "0 6px 20px rgba(0,0,0,0.10)",

        transition:
            "transform 0.25s ease, box-shadow 0.25s ease",

        border:
            "1px solid #eef2f7"
    },

    imageWrapper: {
        position:
            "relative",

        width:
            "100%",

        height:
            "220px",

        backgroundColor:
            "#e5e7eb",

        overflow:
            "hidden"
    },

    hotelImage: {
        width:
            "100%",

        height:
            "100%",

        objectFit:
            "cover",

        display:
            "block"
    },

    noImage: {
        width:
            "100%",

        height:
            "100%",

        display:
            "flex",

        flexDirection:
            "column",

        alignItems:
            "center",

        justifyContent:
            "center",

        gap:
            "8px",

        color:
            "#64748b",

        fontSize:
            "40px"
    },

    ratingBadge: {
        position:
            "absolute",

        top:
            "15px",

        right:
            "15px",

        backgroundColor:
            "white",

        color:
            "#92400e",

        padding:
            "7px 12px",

        borderRadius:
            "20px",

        fontSize:
            "14px",

        fontWeight:
            "bold",

        boxShadow:
            "0 3px 10px rgba(0,0,0,0.15)"
    },

    hotelContent: {
        padding:
            "22px"
    },

    hotelName: {
        margin:
            "0 0 10px",

        color:
            "#0f172a",

        fontSize:
            "24px",

        lineHeight:
            "1.2"
    },

    location: {
        color:
            "#2563eb",

        fontSize:
            "15px",

        fontWeight:
            "600",

        marginBottom:
            "14px"
    },

    description: {
        color:
            "#64748b",

        fontSize:
            "15px",

        lineHeight:
            "1.6",

        minHeight:
            "72px",

        margin:
            "0 0 15px"
    },

    infoRow: {
        display:
            "flex",

        justifyContent:
            "space-between",

        flexWrap:
            "wrap",

        gap:
            "8px",

        padding:
            "12px 0",

        borderTop:
            "1px solid #e5e7eb",

        borderBottom:
            "1px solid #e5e7eb",

        color:
            "#475569",

        fontSize:
            "13px",

        marginBottom:
            "18px"
    },

    viewButton: {
        width:
            "100%",

        padding:
            "13px 18px",

        border:
            "none",

        borderRadius:
            "8px",

        background:
            "linear-gradient(135deg, #2563eb, #1d4ed8)",

        color:
            "white",

        fontSize:
            "16px",

        fontWeight:
            "bold",

        cursor:
            "pointer"
    },

    messageBox: {
        maxWidth:
            "600px",

        margin:
            "40px auto",

        padding:
            "40px",

        textAlign:
            "center",

        backgroundColor:
            "white",

        borderRadius:
            "12px",

        boxShadow:
            "0 3px 12px rgba(0,0,0,0.08)"
    },

    retryButton: {
        marginTop:
            "15px",

        padding:
            "11px 22px",

        border:
            "none",

        borderRadius:
            "7px",

        backgroundColor:
            "#2563eb",

        color:
            "white",

        cursor:
            "pointer",

        fontWeight:
            "bold"
    }
};

export default HotelList;

