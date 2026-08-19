
import React, {
    useEffect,
    useState
} from "react";

import {
    useParams,
    useLocation,
    useNavigate
} from "react-router-dom";

function Booking() {

    const { roomId } = useParams();

    const location =
        useLocation();

    const navigate =
        useNavigate();

    const room =
        location.state?.room;

    // =====================================================
    // DATES RECEIVED FROM ROOMS PAGE
    // =====================================================

    const selectedCheckIn =
        location.state?.checkIn || "";

    const selectedCheckOut =
        location.state?.checkOut || "";

    // =====================================================
    // STATES
    // =====================================================

    const [checkIn, setCheckIn] =
        useState(selectedCheckIn);

    const [checkOut, setCheckOut] =
        useState(selectedCheckOut);

    const [guests, setGuests] =
        useState(1);

    const [loading, setLoading] =
        useState(false);

    // =====================================================
    // KEEP DATES SYNCHRONIZED
    // =====================================================

    useEffect(() => {

        setCheckIn(
            selectedCheckIn
        );

        setCheckOut(
            selectedCheckOut
        );

    }, [
        selectedCheckIn,
        selectedCheckOut
    ]);

    // =====================================================
    // ROOM NOT FOUND
    // =====================================================

    if (!room) {

        return (
            <div
                style={styles.page}
            >
                <div
                    style={styles.errorCard}
                >

                    <div
                        style={
                            styles.errorIcon
                        }
                    >
                        🛏️
                    </div>

                    <h2>
                        Room details not found
                    </h2>

                    <p>
                        Please select a room from
                        the Rooms page.
                    </p>

                    <button
                        onClick={() =>
                            navigate(-1)
                        }
                        style={
                            styles.backButton
                        }
                    >
                        ← Go Back
                    </button>

                </div>
            </div>
        );
    }

    // =====================================================
    // PRICE
    // =====================================================

    const price =
        Number(room.price) || 0;

    // =====================================================
    // CALCULATE NIGHTS
    // =====================================================

    let nights = 0;

    if (
        checkIn &&
        checkOut
    ) {

        const start =
            new Date(checkIn);

        const end =
            new Date(checkOut);

        const difference =
            end - start;

        nights = Math.ceil(
            difference /
                (1000 * 60 * 60 * 24)
        );
    }

    const totalAmount =
        price * nights;

    // =====================================================
    // LOAD RAZORPAY
    // =====================================================

    const loadRazorpay = () => {

        return new Promise(
            (resolve) => {

                const existingScript =
                    document.querySelector(
                        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
                    );

                if (
                    existingScript
                ) {

                    resolve(true);

                    return;
                }

                const script =
                    document.createElement(
                        "script"
                    );

                script.src =
                    "https://checkout.razorpay.com/v1/checkout.js";

                script.onload = () => {
                    resolve(true);
                };

                script.onerror = () => {
                    resolve(false);
                };

                document.body.appendChild(
                    script
                );
            }
        );
    };

    // =====================================================
    // HANDLE BOOKING
    // =====================================================

    const handleBooking =
        async () => {

            let user = null;

            try {

                user = JSON.parse(
                    localStorage.getItem(
                        "user"
                    )
                );

            } catch (error) {

                console.error(
                    "USER DATA ERROR:",
                    error
                );
            }

            if (!user) {

                alert(
                    "Please login first."
                );

                navigate(
                    "/login"
                );

                return;
            }

            if (!roomId) {

                alert(
                    "Room ID is missing."
                );

                return;
            }

            if (
                !checkIn ||
                !checkOut
            ) {

                alert(
                    "Please select check-in and check-out dates."
                );

                return;
            }

            if (
                nights <= 0
            ) {

                alert(
                    "Check-out date must be after check-in date."
                );

                return;
            }

            if (
                !guests ||
                Number(guests) < 1
            ) {

                alert(
                    "Please enter a valid number of guests."
                );

                return;
            }

            if (
                room.capacity &&
                Number(guests) >
                    Number(room.capacity)
            ) {

                alert(
                    `This room can accommodate maximum ${room.capacity} guests.`
                );

                return;
            }

            setLoading(true);

            try {

                // =============================================
                // STEP 1 - CREATE BOOKING
                // =============================================

                const bookingResponse =
                    await fetch(
                        "http://localhost:5000/api/bookings",
                        {
                            method:
                                "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    user_id:
                                        user.id,

                                    room_id:
                                        Number(
                                            roomId
                                        ),

                                    check_in:
                                        checkIn,

                                    check_out:
                                        checkOut,

                                    guests:
                                        Number(
                                            guests
                                        )
                                })
                        }
                    );

                const bookingData =
                    await bookingResponse.json();

                console.log(
                    "BOOKING RESPONSE:",
                    bookingData
                );

                if (
                    !bookingResponse.ok
                ) {

                    alert(
                        bookingData.message ||
                        "Booking failed."
                    );

                    return;
                }

                const bookingId =
                    bookingData.booking_id;

                const amount =
                    Number(
                        bookingData.total_amount
                    );

                // =============================================
                // STEP 2 - LOAD RAZORPAY
                // =============================================

                const razorpayLoaded =
                    await loadRazorpay();

                if (
                    !razorpayLoaded
                ) {

                    alert(
                        "Razorpay could not be loaded. Please check your internet connection."
                    );

                    return;
                }

                // =============================================
                // STEP 3 - CREATE RAZORPAY ORDER
                // =============================================

                const orderResponse =
                    await fetch(
                        "http://localhost:5000/api/payment/create-order",
                        {
                            method:
                                "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    booking_id:
                                        bookingId
                                })
                        }
                    );

                const orderData =
                    await orderResponse.json();

                console.log(
                    "RAZORPAY ORDER RESPONSE:",
                    orderData
                );

                if (
                    !orderResponse.ok
                ) {

                    alert(
                        orderData.message ||
                        "Could not create payment order."
                    );

                    return;
                }

                // =============================================
                // STEP 4 - RAZORPAY OPTIONS
                // =============================================

                const options = {

                    key:
                        orderData.key_id,

                    amount:
                        orderData.amount,

                    currency:
                        orderData.currency ||
                        "INR",

                    name:
                        "BookEase",

                    description:
                        `Hotel Booking #${bookingId}`,

                    order_id:
                        orderData.order_id,

                    prefill: {

                        name:
                            user.name || "",

                        email:
                            user.email || "",

                        contact:
                            user.phone || ""

                    },

                    notes: {

                        booking_id:
                            String(
                                bookingId
                            )

                    },

                    theme: {

                        color:
                            "#2563eb"

                    },

                    // =============================================
                    // PAYMENT SUCCESS
                    // =============================================

                    handler:
                        async (
                            razorpayResponse
                        ) => {

                            console.log(
                                "RAZORPAY PAYMENT SUCCESS:",
                                razorpayResponse
                            );

                            try {

                                // =================================
                                // STEP 5 - VERIFY PAYMENT
                                // =================================

                                const verifyResponse =
                                    await fetch(
                                        "http://localhost:5000/api/payment/verify",
                                        {
                                            method:
                                                "POST",

                                            headers: {
                                                "Content-Type":
                                                    "application/json"
                                            },

                                            body:
                                                JSON.stringify({
                                                    booking_id:
                                                        bookingId,

                                                    razorpay_order_id:
                                                        razorpayResponse.razorpay_order_id,

                                                    razorpay_payment_id:
                                                        razorpayResponse.razorpay_payment_id,

                                                    razorpay_signature:
                                                        razorpayResponse.razorpay_signature
                                                })
                                        }
                                    );

                                const verifyData =
                                    await verifyResponse.json();

                                console.log(
                                    "PAYMENT VERIFY RESPONSE:",
                                    verifyData
                                );

                                if (
                                    !verifyResponse.ok
                                ) {

                                    alert(
                                        verifyData.message ||
                                        "Payment verification failed."
                                    );

                                    return;
                                }

                                alert(
                                    `Payment successful!\n\nBooking ID: #${bookingId}\nAmount Paid: ₹${amount.toFixed(
                                        2
                                    )}`
                                );

                                navigate(
                                    "/my-bookings"
                                );

                            } catch (
                                verifyError
                            ) {

                                console.error(
                                    "PAYMENT VERIFICATION ERROR:",
                                    verifyError
                                );

                                alert(
                                    "Payment was completed, but verification failed."
                                );
                            }
                        },

                    // =============================================
                    // PAYMENT CLOSED
                    // =============================================

                    modal: {

                        ondismiss:
                            () => {

                                alert(
                                    "Payment window closed. Your booking remains pending."
                                );
                            }
                    }
                };

                // =============================================
                // RAZORPAY INSTANCE
                // =============================================

                if (
                    !window.Razorpay
                ) {

                    alert(
                        "Razorpay is not available."
                    );

                    return;
                }

                const razorpay =
                    new window.Razorpay(
                        options
                    );

                // =============================================
                // PAYMENT FAILED
                // =============================================

                razorpay.on(
                    "payment.failed",
                    (
                        response
                    ) => {

                        console.error(
                            "RAZORPAY PAYMENT FAILED:",
                            response
                        );

                        alert(
                            response?.error
                                ?.description ||
                            "Payment failed."
                        );
                    }
                );

                // =============================================
                // OPEN RAZORPAY
                // =============================================

                razorpay.open();

            } catch (
                error
            ) {

                console.error(
                    "BOOKING / PAYMENT ERROR:",
                    error
                );

                alert(
                    "Cannot connect to backend."
                );

            } finally {

                setLoading(false);
            }
        };

    // =====================================================
    // TODAY
    // =====================================================

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    // =====================================================
    // UI
    // =====================================================

    return (

        <div
            style={
                styles.page
            }
        >

            <div
                style={
                    styles.header
                }
            >

                <p
                    style={
                        styles.eyebrow
                    }
                >
                    BOOKEASE
                </p>

                <h1
                    style={
                        styles.heading
                    }
                >
                    Complete Your Booking
                </h1>

                <p
                    style={
                        styles.subtitle
                    }
                >
                    Confirm your stay details and
                    complete your secure payment.
                </p>

            </div>


            <div
                style={
                    styles.layout
                }
            >

                {/* =============================================
                    ROOM SUMMARY
                ============================================= */}

                <div
                    style={
                        styles.roomCard
                    }
                >

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
                                    styles.roomImage
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

                        <span
                            style={
                                styles.availableBadge
                            }
                        >
                            ✓ Available
                        </span>

                    </div>


                    <div
                        style={
                            styles.roomContent
                        }
                    >

                        <p
                            style={
                                styles.roomEyebrow
                            }
                        >
                            YOUR ROOM
                        </p>

                        <div
                            style={
                                styles.roomTitleRow
                            }
                        >

                            <h2
                                style={
                                    styles.roomTitle
                                }
                            >
                                Room{" "}
                                {
                                    room.room_number
                                }
                            </h2>

                            <span
                                style={
                                    styles.typeBadge
                                }
                            >
                                {
                                    room.room_type
                                }
                            </span>

                        </div>


                        <p
                            style={
                                styles.description
                            }
                        >
                            {
                                room.description ||
                                "Comfortable room for a relaxing stay."
                            }
                        </p>


                        <div
                            style={
                                styles.roomDetails
                            }
                        >

                            <div
                                style={
                                    styles.detailCard
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
                                    styles.detailCard
                                }
                            >
                                <span>
                                    💰
                                </span>

                                <div>
                                    <small>
                                        Price
                                    </small>

                                    <strong>
                                        ₹
                                        {
                                            price.toFixed(
                                                2
                                            )
                                        }
                                    </strong>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>


                {/* =============================================
                    BOOKING FORM
                ============================================= */}

                <div
                    style={
                        styles.bookingCard
                    }
                >

                    <div
                        style={
                            styles.cardHeader
                        }
                    >

                        <div>

                            <p
                                style={
                                    styles.cardEyebrow
                                }
                            >
                                BOOKING DETAILS
                            </p>

                            <h2
                                style={
                                    styles.cardTitle
                                }
                            >
                                Your Stay
                            </h2>

                        </div>

                        <div
                            style={
                                styles.stepBadge
                            }
                        >
                            1 of 2
                        </div>

                    </div>


                    {/* CHECK-IN */}

                    <div
                        style={
                            styles.field
                        }
                    >

                        <label
                            style={
                                styles.label
                            }
                        >
                            Check-in Date
                        </label>

                        <input
                            type="date"
                            value={
                                checkIn
                            }
                            min={
                                today
                            }
                            onChange={(e) =>
                                setCheckIn(
                                    e.target.value
                                )
                            }
                            style={
                                styles.input
                            }
                        />

                    </div>


                    {/* CHECK-OUT */}

                    <div
                        style={
                            styles.field
                        }
                    >

                        <label
                            style={
                                styles.label
                            }
                        >
                            Check-out Date
                        </label>

                        <input
                            type="date"
                            value={
                                checkOut
                            }
                            min={
                                checkIn ||
                                today
                            }
                            onChange={(e) =>
                                setCheckOut(
                                    e.target.value
                                )
                            }
                            style={
                                styles.input
                            }
                        />

                    </div>


                    {/* GUESTS */}

                    <div
                        style={
                            styles.field
                        }
                    >

                        <label
                            style={
                                styles.label
                            }
                        >
                            Number of Guests
                        </label>

                        <input
                            type="number"
                            min="1"
                            max={
                                room.capacity ||
                                undefined
                            }
                            value={
                                guests
                            }
                            onChange={(e) =>
                                setGuests(
                                    e.target.value
                                )
                            }
                            style={
                                styles.input
                            }
                        />

                    </div>


                    {/* DATE SUMMARY */}

                    <div
                        style={
                            styles.staySummary
                        }
                    >

                        <div>

                            <small>
                                Check-in
                            </small>

                            <strong>
                                {
                                    formatDisplayDate(
                                        checkIn
                                    )
                                }
                            </strong>

                        </div>

                        <div
                            style={
                                styles.arrow
                            }
                        >
                            →
                        </div>

                        <div>

                            <small>
                                Check-out
                            </small>

                            <strong>
                                {
                                    formatDisplayDate(
                                        checkOut
                                    )
                                }
                            </strong>

                        </div>

                    </div>


                    {/* PRICE SUMMARY */}

                    <div
                        style={
                            styles.priceSummary
                        }
                    >

                        <div
                            style={
                                styles.summaryRow
                            }
                        >

                            <span>
                                ₹
                                {
                                    price.toFixed(
                                        2
                                    )
                                } ×{" "}
                                {
                                    nights
                                }{" "}
                                night
                                {
                                    nights !== 1
                                        ? "s"
                                        : ""
                                }
                            </span>

                            <strong>
                                ₹
                                {
                                    totalAmount.toFixed(
                                        2
                                    )
                                }
                            </strong>

                        </div>


                        <div
                            style={
                                styles.totalRow
                            }
                        >

                            <span>
                                Total Amount
                            </span>

                            <strong>
                                ₹
                                {
                                    totalAmount.toFixed(
                                        2
                                    )
                                }
                            </strong>

                        </div>

                    </div>


                    {/* PAYMENT NOTICE */}

                    <div
                        style={
                            styles.paymentNotice
                        }
                    >

                        <span
                            style={
                                styles.paymentIcon
                            }
                        >
                            🔒
                        </span>

                        <div>

                            <strong>
                                Secure Payment
                            </strong>

                            <p>
                                You will be redirected to
                                Razorpay to complete your
                                payment securely.
                            </p>

                        </div>

                    </div>


                    {/* PAYMENT BUTTON */}

                    <button
                        onClick={
                            handleBooking
                        }
                        disabled={
                            loading ||
                            nights <= 0
                        }
                        style={{
                            ...styles.paymentButton,
                            background:
                                loading ||
                                nights <= 0
                                    ? "#94a3b8"
                                    : "linear-gradient(135deg, #16a34a, #15803d)",
                            cursor:
                                loading ||
                                nights <= 0
                                    ? "not-allowed"
                                    : "pointer"
                        }}
                    >

                        {loading
                            ? "Processing..."
                            : `Proceed to Secure Payment • ₹${totalAmount.toFixed(
                                  2
                              )}`}

                    </button>


                    <p
                        style={
                            styles.secureText
                        }
                    >
                        🔐 Secured by Razorpay
                    </p>

                </div>

            </div>


            {/* =============================================
                BACK BUTTON
            ============================================= */}

            <button
                onClick={() =>
                    navigate(-1)
                }
                style={
                    styles.backButton
                }
            >
                ← Back to Rooms
            </button>

        </div>
    );
}


// =====================================================
// FORMAT DISPLAY DATE
// =====================================================

function formatDisplayDate(
    dateValue
) {

    if (!dateValue) {
        return "--";
    }

    const date =
        new Date(dateValue);

    if (
        isNaN(
            date.getTime()
        )
    ) {
        return dateValue;
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric"
        }
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
        maxWidth:
            "800px",

        margin:
            "0 auto 35px",

        textAlign:
            "center"
    },

    eyebrow: {
        margin:
            "0 0 8px",

        color:
            "#2563eb",

        fontSize:
            "13px",

        fontWeight:
            "bold",

        letterSpacing:
            "2px"
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

    layout: {
        maxWidth:
            "1100px",

        margin:
            "0 auto",

        display:
            "grid",

        gridTemplateColumns:
            "repeat(auto-fit, minmax(320px, 1fr))",

        gap:
            "28px",

        alignItems:
            "start"
    },

    roomCard: {
        backgroundColor:
            "white",

        borderRadius:
            "16px",

        overflow:
            "hidden",

        boxShadow:
            "0 8px 25px rgba(15,23,42,0.10)",

        border:
            "1px solid #e2e8f0"
    },

    imageWrapper: {
        position:
            "relative",

        width:
            "100%",

        height:
            "280px",

        backgroundColor:
            "#e2e8f0"
    },

    roomImage: {
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

        color:
            "#64748b",

        fontSize:
            "40px",

        gap:
            "8px"
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
            "13px"
    },

    roomContent: {
        padding:
            "25px"
    },

    roomEyebrow: {
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

    roomTitleRow: {
        display:
            "flex",

        justifyContent:
            "space-between",

        alignItems:
            "center",

        gap:
            "10px"
    },

    roomTitle: {
        margin:
            "0",

        color:
            "#0f172a",

        fontSize:
            "30px"
    },

    typeBadge: {
        padding:
            "7px 11px",

        borderRadius:
            "16px",

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

    description: {
        color:
            "#64748b",

        lineHeight:
            "1.6",

        margin:
            "15px 0 20px"
    },

    roomDetails: {
        display:
            "grid",

        gridTemplateColumns:
            "1fr 1fr",

        gap:
            "12px"
    },

    detailCard: {
        display:
            "flex",

        alignItems:
            "center",

        gap:
            "10px",

        padding:
            "12px",

        backgroundColor:
            "#f8fafc",

        borderRadius:
            "10px"
    },

    detailCardSmall: {
        display:
            "block",

        color:
            "#64748b",

        fontSize:
            "11px"
    },

    bookingCard: {
        backgroundColor:
            "white",

        borderRadius:
            "16px",

        padding:
            "28px",

        boxShadow:
            "0 8px 25px rgba(15,23,42,0.10)",

        border:
            "1px solid #e2e8f0"
    },

    cardHeader: {
        display:
            "flex",

        justifyContent:
            "space-between",

        alignItems:
            "center",

        gap:
            "15px",

        marginBottom:
            "25px"
    },

    cardEyebrow: {
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

    cardTitle: {
        margin:
            "0",

        fontSize:
            "28px",

        color:
            "#0f172a"
    },

    stepBadge: {
        padding:
            "7px 12px",

        backgroundColor:
            "#dbeafe",

        color:
            "#1d4ed8",

        borderRadius:
            "20px",

        fontWeight:
            "bold",

        fontSize:
            "12px"
    },

    field: {
        marginBottom:
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

        backgroundColor:
            "#f8fafc",

        outline:
            "none"
    },

    staySummary: {
        display:
            "flex",

        alignItems:
            "center",

        justifyContent:
            "space-between",

        gap:
            "10px",

        padding:
            "15px",

        marginBottom:
            "20px",

        backgroundColor:
            "#eff6ff",

        border:
            "1px solid #bfdbfe",

        borderRadius:
            "10px"
    },

    arrow: {
        fontSize:
            "22px",

        color:
            "#2563eb",

        fontWeight:
            "bold"
    },

    priceSummary: {
        padding:
            "18px",

        backgroundColor:
            "#f8fafc",

        borderRadius:
            "10px",

        border:
            "1px solid #e2e8f0"
    },

    summaryRow: {
        display:
            "flex",

        justifyContent:
            "space-between",

        color:
            "#475569",

        marginBottom:
            "12px"
    },

    totalRow: {
        display:
            "flex",

        justifyContent:
            "space-between",

        paddingTop:
            "12px",

        borderTop:
            "1px solid #cbd5e1",

        color:
            "#0f172a",

        fontSize:
            "19px"
    },

    paymentNotice: {
        display:
            "flex",

        alignItems:
            "flex-start",

        gap:
            "12px",

        marginTop:
            "18px",

        padding:
            "15px",

        backgroundColor:
            "#f0fdf4",

        border:
            "1px solid #bbf7d0",

        borderRadius:
            "10px"
    },

    paymentIcon: {
        fontSize:
            "22px"
    },

    paymentNoticeP: {
        margin:
            "5px 0 0",

        color:
            "#64748b",

        fontSize:
            "13px",

        lineHeight:
            "1.5"
    },

    paymentButton: {
        width:
            "100%",

        marginTop:
            "20px",

        padding:
            "15px",

        border:
            "none",

        borderRadius:
            "9px",

        color:
            "white",

        fontSize:
            "16px",

        fontWeight:
            "bold"
    },

    secureText: {
        textAlign:
            "center",

        margin:
            "12px 0 0",

        color:
            "#64748b",

        fontSize:
            "12px"
    },

    backButton: {
        display:
            "block",

        margin:
            "35px auto 0",

        padding:
            "12px 24px",

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
    },

    errorCard: {
        maxWidth:
            "600px",

        margin:
            "80px auto",

        padding:
            "45px 30px",

        textAlign:
            "center",

        backgroundColor:
            "white",

        borderRadius:
            "16px",

        boxShadow:
            "0 8px 25px rgba(15,23,42,0.10)"
    },

    errorIcon: {
        fontSize:
            "48px",

        marginBottom:
            "12px"
    }
};

export default Booking;
