
import React, { useEffect, useState } from "react";
import {
    useParams,
    useNavigate
} from "react-router-dom";

function Rooms() {

    const { hotelId } = useParams();
    const navigate = useNavigate();

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");

    const [datesSelected, setDatesSelected] =
        useState(false);

    // =====================================================
    // TODAY'S DATE
    // =====================================================

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    // =====================================================
    // LOAD AVAILABLE ROOMS
    // =====================================================

    const loadAvailableRooms = async () => {

        if (!checkIn || !checkOut) {

            setError(
                "Please select check-in and check-out dates."
            );

            setRooms([]);
            setDatesSelected(false);

            return;
        }

        if (
            new Date(checkOut) <=
            new Date(checkIn)
        ) {

            setError(
                "Check-out date must be after check-in date."
            );

            setRooms([]);
            setDatesSelected(false);

            return;
        }

        try {

            setLoading(true);
            setError("");

            const response =
                await fetch(
                    `http://localhost:5000/api/hotels/${hotelId}/available-rooms?check_in=${encodeURIComponent(
                        checkIn
                    )}&check_out=${encodeURIComponent(
                        checkOut
                    )}`
                );

            const data =
                await response.json();

            console.log(
                "Available rooms:",
                data
            );

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to fetch available rooms"
                );
            }

            if (Array.isArray(data)) {
                setRooms(data);
            } else {
                setRooms([]);
            }

            setDatesSelected(true);

        } catch (error) {

            console.error(
                "Available room fetch error:",
                error
            );

            setError(
                error.message ||
                "Unable to load available rooms"
            );

            setRooms([]);
            setDatesSelected(false);

        } finally {

            setLoading(false);
        }
    };

    // =====================================================
    // RESET WHEN HOTEL CHANGES
    // =====================================================

    useEffect(() => {

        setRooms([]);
        setError("");
        setCheckIn("");
        setCheckOut("");
        setDatesSelected(false);

    }, [hotelId]);

    // =====================================================
    // BOOK ROOM
    // =====================================================

    const handleBookRoom = (room) => {

        navigate(
            `/booking/${room.id}`,
            {
                state: {
                    room: room,
                    checkIn: checkIn,
                    checkOut: checkOut
                }
            }
        );
    };

    // =====================================================
    // RESET DATES
    // =====================================================

    const resetDates = () => {

        setCheckIn("");
        setCheckOut("");

        setRooms([]);
        setError("");
        setDatesSelected(false);
    };

    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div
            style={styles.page}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                style={styles.header}
            >

                <p
                    style={styles.eyebrow}
                >
                    BOOKEASE
                </p>

                <h1
                    style={styles.heading}
                >
                    Find Your Perfect Room
                </h1>

                <p
                    style={styles.subtitle}
                >
                    Select your dates and choose
                    from our available rooms.
                </p>

            </div>


            {/* =================================================
                DATE SEARCH
            ================================================= */}

            <div
                style={styles.dateBox}
            >

                <h2
                    style={{
                        margin:
                            "0 0 20px"
                    }}
                >
                    📅 Select Your Stay
                </h2>

                <div
                    style={styles.dateGrid}
                >

                    <div>

                        <label
                            style={styles.label}
                        >
                            Check-in Date
                        </label>

                        <input
                            type="date"
                            value={checkIn}
                            min={today}
                            onChange={(e) => {

                                setCheckIn(
                                    e.target.value
                                );

                                setRooms([]);
                                setDatesSelected(false);
                                setError("");
                            }}
                            style={styles.input}
                        />

                    </div>


                    <div>

                        <label
                            style={styles.label}
                        >
                            Check-out Date
                        </label>

                        <input
                            type="date"
                            value={checkOut}
                            min={
                                checkIn ||
                                today
                            }
                            onChange={(e) => {

                                setCheckOut(
                                    e.target.value
                                );

                                setRooms([]);
                                setDatesSelected(false);
                                setError("");
                            }}
                            style={styles.input}
                        />

                    </div>

                </div>


                <div
                    style={styles.buttonRow}
                >

                    <button
                        onClick={
                            loadAvailableRooms
                        }
                        disabled={
                            loading
                        }
                        style={{
                            ...styles.searchButton,
                            opacity:
                                loading
                                    ? 0.7
                                    : 1,
                            cursor:
                                loading
                                    ? "not-allowed"
                                    : "pointer"
                        }}
                    >
                        {loading
                            ? "Checking..."
                            : "🔍 Check Available Rooms"}
                    </button>


                    <button
                        onClick={
                            resetDates
                        }
                        disabled={
                            loading
                        }
                        style={
                            styles.resetButton
                        }
                    >
                        Reset
                    </button>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div
                    style={styles.errorBox}
                >
                    ⚠️ {error}
                </div>

            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (

                <div
                    style={styles.messageBox}
                >

                    <div
                        style={
                            styles.loadingIcon
                        }
                    >
                        ⏳
                    </div>

                    <h2>
                        Checking room availability...
                    </h2>

                    <p>
                        Please wait.
                    </p>

                </div>

            )}


            {/* =================================================
                NO DATES SELECTED
            ================================================= */}

            {!loading &&
                !datesSelected &&
                !error && (

                <div
                    style={styles.messageBox}
                >

                    <div
                        style={
                            styles.largeIcon
                        }
                    >
                        🛏️
                    </div>

                    <h2>
                        Select Your Dates
                    </h2>

                    <p>
                        Choose your check-in and
                        check-out dates to see rooms
                        available for your stay.
                    </p>

                </div>

            )}


            {/* =================================================
                NO ROOMS
            ================================================= */}

            {!loading &&
                datesSelected &&
                rooms.length === 0 &&
                !error && (

                <div
                    style={styles.messageBox}
                >

                    <div
                        style={
                            styles.largeIcon
                        }
                    >
                        😔
                    </div>

                    <h2>
                        No Rooms Available
                    </h2>

                    <p>
                        There are no rooms available
                        for the selected dates.
                    </p>

                    <button
                        onClick={
                            resetDates
                        }
                        style={
                            styles.searchButton
                        }
                    >
                        Try Different Dates
                    </button>

                </div>

            )}


            {/* =================================================
                ROOM RESULTS
            ================================================= */}

            {!loading &&
                datesSelected &&
                rooms.length > 0 && (

                <section>

                    <div
                        style={
                            styles.resultHeader
                        }
                    >

                        <div>

                            <p
                                style={
                                    styles.resultEyebrow
                                }
                            >
                                AVAILABLE ROOMS
                            </p>

                            <h2
                                style={
                                    styles.resultTitle
                                }
                            >
                                Choose Your Room
                            </h2>

                            <p
                                style={
                                    styles.resultDates
                                }
                            >
                                {checkIn} → {checkOut}
                            </p>

                        </div>

                        <div
                            style={
                                styles.roomCount
                            }
                        >
                            {rooms.length}{" "}
                            room
                            {rooms.length !== 1
                                ? "s"
                                : ""}{" "}
                            available
                        </div>

                    </div>


                    <div
                        style={
                            styles.container
                        }
                    >

                        {rooms.map(
                            (room) => (

                                <div
                                    key={
                                        room.id
                                    }
                                    style={
                                        styles.card
                                    }
                                >

                                    {/* =================================================
                                        IMAGE
                                    ================================================= */}

                                    <div
                                        style={
                                            styles.imageWrapper
                                        }
                                    >

                                        {room.image ? (

                                            <img
                                                src={
                                                    `/images/${room.image}`
                                                }
                                                alt={
                                                    room.room_type ||
                                                    "Hotel room"
                                                }
                                                style={
                                                    styles.image
                                                }
                                            />

                                        ) : (

                                            <div
                                                style={
                                                    styles.noImage
                                                }
                                            >
                                                🛏️
                                                <span>
                                                    No Image
                                                </span>
                                            </div>

                                        )}

                                        <div
                                            style={
                                                styles.availableBadge
                                            }
                                        >
                                            ✓ Available
                                        </div>

                                    </div>


                                    {/* =================================================
                                        ROOM CONTENT
                                    ================================================= */}

                                    <div
                                        style={
                                            styles.cardContent
                                        }
                                    >

                                        <div
                                            style={
                                                styles.roomHeading
                                            }
                                        >

                                            <div>

                                                <p
                                                    style={
                                                        styles.roomLabel
                                                    }
                                                >
                                                    ROOM
                                                </p>

                                                <h2
                                                    style={
                                                        styles.roomNumber
                                                    }
                                                >
                                                    {
                                                        room.room_number
                                                    }
                                                </h2>

                                            </div>

                                            <span
                                                style={
                                                    styles.roomTypeBadge
                                                }
                                            >
                                                {
                                                    room.room_type
                                                }
                                            </span>

                                        </div>


                                        {/* PRICE */}

                                        <div
                                            style={
                                                styles.priceBox
                                            }
                                        >

                                            <span
                                                style={
                                                    styles.price
                                                }
                                            >
                                                ₹
                                                {Number(
                                                    room.price
                                                ).toFixed(
                                                    2
                                                )}
                                            </span>

                                            <span
                                                style={
                                                    styles.priceLabel
                                                }
                                            >
                                                / night
                                            </span>

                                        </div>


                                        {/* DETAILS */}

                                        <div
                                            style={
                                                styles.details
                                            }
                                        >

                                            <div
                                                style={
                                                    styles.detailItem
                                                }
                                            >
                                                <span>
                                                    👥
                                                </span>

                                                <div>
                                                    <small>
                                                        Capacity
                                                    </small>

                                                    <strong>
                                                        {
                                                            room.capacity
                                                        }{" "}
                                                        guests
                                                    </strong>
                                                </div>
                                            </div>


                                            <div
                                                style={
                                                    styles.detailItem
                                                }
                                            >
                                                <span>
                                                    📅
                                                </span>

                                                <div>
                                                    <small>
                                                        Stay
                                                    </small>

                                                    <strong>
                                                        Your selected dates
                                                    </strong>
                                                </div>
                                            </div>

                                        </div>


                                        {/* DESCRIPTION */}

                                        <p
                                            style={
                                                styles.description
                                            }
                                        >
                                            {
                                                room.description ||
                                                "A comfortable room designed for a relaxing stay."
                                            }
                                        </p>


                                        {/* BOOK BUTTON */}

                                        <button
                                            onClick={() =>
                                                handleBookRoom(
                                                    room
                                                )
                                            }
                                            style={
                                                styles.bookButton
                                            }
                                        >
                                            Book This Room
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

                </section>

            )}


            {/* =================================================
                BACK BUTTON
            ================================================= */}

            <button
                onClick={() =>
                    navigate("/")
                }
                style={
                    styles.backButton
                }
            >
                ← Back to Hotels
            </button>

        </div>
    );
}


// =====================================================
// STYLES
// =====================================================

const styles = {

    page: {
        minHeight:
            "100vh",

        padding:
            "50px 30px",

        background:
            "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",

        fontFamily:
            "Arial, Helvetica, sans-serif"
    },

    header: {
        textAlign:
            "center",

        maxWidth:
            "750px",

        margin:
            "0 auto 35px"
    },

    eyebrow: {
        margin:
            "0 0 8px",

        color:
            "#2563eb",

        fontWeight:
            "bold",

        letterSpacing:
            "2px",

        fontSize:
            "13px"
    },

    heading: {
        margin:
            "0 0 12px",

        fontSize:
            "clamp(32px, 5vw, 48px)",

        color:
            "#0f172a"
    },

    subtitle: {
        margin:
            "0",

        color:
            "#64748b",

        fontSize:
            "17px",

        lineHeight:
            "1.6"
    },

    dateBox: {
        maxWidth:
            "900px",

        margin:
            "0 auto 35px",

        padding:
            "28px",

        backgroundColor:
            "white",

        borderRadius:
            "16px",

        boxShadow:
            "0 8px 25px rgba(15,23,42,0.08)",

        border:
            "1px solid #e2e8f0"
    },

    dateGrid: {
        display:
            "grid",

        gridTemplateColumns:
            "repeat(auto-fit, minmax(250px, 1fr))",

        gap:
            "20px"
    },

    label: {
        display:
            "block",

        marginBottom:
            "8px",

        color:
            "#334155",

        fontWeight:
            "bold"
    },

    input: {
        width:
            "100%",

        padding:
            "13px",

        boxSizing:
            "border-box",

        border:
            "1px solid #cbd5e1",

        borderRadius:
            "8px",

        fontSize:
            "15px",

        outline:
            "none",

        backgroundColor:
            "#f8fafc"
    },

    buttonRow: {
        display:
            "flex",

        gap:
            "10px",

        flexWrap:
            "wrap",

        marginTop:
            "22px"
    },

    searchButton: {
        padding:
            "13px 22px",

        border:
            "none",

        borderRadius:
            "8px",

        background:
            "linear-gradient(135deg, #2563eb, #1d4ed8)",

        color:
            "white",

        fontSize:
            "15px",

        fontWeight:
            "bold",

        cursor:
            "pointer"
    },

    resetButton: {
        padding:
            "13px 22px",

        border:
            "1px solid #cbd5e1",

        borderRadius:
            "8px",

        backgroundColor:
            "white",

        color:
            "#334155",

        fontSize:
            "15px",

        fontWeight:
            "bold",

        cursor:
            "pointer"
    },

    errorBox: {
        maxWidth:
            "900px",

        margin:
            "0 auto 25px",

        padding:
            "15px 20px",

        backgroundColor:
            "#fee2e2",

        border:
            "1px solid #fecaca",

        color:
            "#991b1b",

        borderRadius:
            "10px",

        textAlign:
            "center",

        fontWeight:
            "bold"
    },

    messageBox: {
        maxWidth:
            "600px",

        margin:
            "35px auto",

        padding:
            "45px 30px",

        textAlign:
            "center",

        backgroundColor:
            "white",

        borderRadius:
            "16px",

        boxShadow:
            "0 5px 20px rgba(0,0,0,0.08)"
    },

    largeIcon: {
        fontSize:
            "48px",

        marginBottom:
            "12px"
    },

    loadingIcon: {
        fontSize:
            "40px",

        marginBottom:
            "10px"
    },

    resultHeader: {
        maxWidth:
            "1200px",

        margin:
            "0 auto 25px",

        display:
            "flex",

        justifyContent:
            "space-between",

        alignItems:
            "flex-end",

        gap:
            "20px",

        flexWrap:
            "wrap"
    },

    resultEyebrow: {
        margin:
            "0 0 5px",

        color:
            "#2563eb",

        fontWeight:
            "bold",

        letterSpacing:
            "1px",

        fontSize:
            "13px"
    },

    resultTitle: {
        margin:
            "0 0 5px",

        color:
            "#0f172a",

        fontSize:
            "30px"
    },

    resultDates: {
        margin:
            "0",

        color:
            "#64748b"
    },

    roomCount: {
        padding:
            "9px 14px",

        backgroundColor:
            "#dbeafe",

        color:
            "#1d4ed8",

        borderRadius:
            "20px",

        fontWeight:
            "bold",

        whiteSpace:
            "nowrap"
    },

    container: {
        display:
            "grid",

        gridTemplateColumns:
            "repeat(auto-fit, minmax(300px, 1fr))",

        gap:
            "28px",

        maxWidth:
            "1200px",

        margin:
            "0 auto"
    },

    card: {
        backgroundColor:
            "white",

        borderRadius:
            "16px",

        overflow:
            "hidden",

        boxShadow:
            "0 6px 22px rgba(15,23,42,0.10)",

        border:
            "1px solid #e2e8f0"
    },

    imageWrapper: {
        position:
            "relative",

        width:
            "100%",

        height:
            "230px",

        backgroundColor:
            "#e2e8f0",

        overflow:
            "hidden"
    },

    image: {
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
            "38px"
    },

    availableBadge: {
        position:
            "absolute",

        top:
            "15px",

        right:
            "15px",

        padding:
            "7px 12px",

        borderRadius:
            "20px",

        backgroundColor:
            "#dcfce7",

        color:
            "#166534",

        fontWeight:
            "bold",

        fontSize:
            "13px",

        boxShadow:
            "0 3px 10px rgba(0,0,0,0.15)"
    },

    cardContent: {
        padding:
            "22px"
    },

    roomHeading: {
        display:
            "flex",

        justifyContent:
            "space-between",

        alignItems:
            "flex-start",

        gap:
            "12px"
    },

    roomLabel: {
        margin:
            "0 0 5px",

        fontSize:
            "12px",

        color:
            "#2563eb",

        fontWeight:
            "bold",

        letterSpacing:
            "1px"
    },

    roomNumber: {
        margin:
            "0",

        fontSize:
            "27px",

        color:
            "#0f172a"
    },

    roomTypeBadge: {
        padding:
            "6px 10px",

        borderRadius:
            "15px",

        backgroundColor:
            "#f1f5f9",

        color:
            "#475569",

        fontSize:
            "12px",

        fontWeight:
            "bold",

        textTransform:
            "capitalize"
    },

    priceBox: {
        margin:
            "20px 0",

        padding:
            "15px",

        backgroundColor:
            "#f8fafc",

        borderRadius:
            "10px"
    },

    price: {
        fontSize:
            "28px",

        color:
            "#15803d",

        fontWeight:
            "800"
    },

    priceLabel: {
        color:
            "#64748b",

        marginLeft:
            "5px"
    },

    details: {
        display:
            "grid",

        gridTemplateColumns:
            "1fr 1fr",

        gap:
            "12px",

        marginBottom:
            "18px"
    },

    detailItem: {
        display:
            "flex",

        alignItems:
            "center",

        gap:
            "9px",

        padding:
            "10px",

        backgroundColor:
            "#f8fafc",

        borderRadius:
            "8px"
    },

    detailItemSpan: {
        fontSize:
            "20px"
    },

    detailItemSmall: {
        display:
            "block",

        color:
            "#64748b",

        fontSize:
            "11px",

        marginBottom:
            "2px"
    },

    detailItemStrong: {
        display:
            "block",

        color:
            "#334155",

        fontSize:
            "12px"
    },

    description: {
        color:
            "#64748b",

        lineHeight:
            "1.6",

        minHeight:
            "50px",

        margin:
            "0 0 18px"
    },

    bookButton: {
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

    backButton: {
        display:
            "block",

        margin:
            "35px auto 0",

        padding:
            "12px 25px",

        border:
            "none",

        borderRadius:
            "8px",

        backgroundColor:
            "#0f172a",

        color:
            "white",

        fontSize:
            "15px",

        cursor:
            "pointer"
    }
};

export default Rooms;

