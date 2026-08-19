
import React, { useEffect, useState } from "react";

function MyBookings() {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingFilter, setBookingFilter] = useState("all");

    // =====================================================
    // GET LOGGED-IN USER
    // =====================================================

    const getUser = () => {
        try {
            const user = JSON.parse(
                localStorage.getItem("user")
            );

            return user;
        } catch (error) {
            console.error(
                "Invalid user data:",
                error
            );

            return null;
        }
    };

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (dateValue) => {

        if (!dateValue) {
            return "N/A";
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
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    // =====================================================
    // LOAD BOOKINGS
    // =====================================================

    const loadBookings = async () => {

        try {

            const user = getUser();

            if (
                !user ||
                !user.id
            ) {

                alert(
                    "Please login first."
                );

                window.location.href =
                    "/login";

                return;
            }

            const response =
                await fetch(
                    `http://localhost:5000/api/bookings/user/${user.id}`
                );

            const data =
                await response.json();

            console.log(
                "My bookings:",
                data
            );

            if (
                !response.ok
            ) {

                throw new Error(
                    data.message ||
                    "Failed to load bookings"
                );
            }

            if (
                Array.isArray(data)
            ) {

                setBookings(data);

            } else if (
                data &&
                Array.isArray(
                    data.bookings
                )
            ) {

                setBookings(
                    data.bookings
                );

            } else {

                setBookings([]);
            }

        } catch (error) {

            console.error(
                "My bookings error:",
                error
            );

            alert(
                error.message ||
                "Cannot connect to backend"
            );

        } finally {

            setLoading(false);
        }
    };

    // =====================================================
    // LOAD WHEN PAGE OPENS
    // =====================================================

    useEffect(() => {

        loadBookings();

    }, []);

    // =====================================================
    // CANCEL BOOKING
    // =====================================================

    const cancelBooking =
        async (bookingId) => {

            const confirmCancel =
                window.confirm(
                    "Are you sure you want to cancel this booking?"
                );

            if (
                !confirmCancel
            ) {
                return;
            }

            try {

                const response =
                    await fetch(
                        `http://localhost:5000/api/bookings/${bookingId}/cancel`,
                        {
                            method:
                                "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            }
                        }
                    );

                const data =
                    await response.json();

                console.log(
                    "Cancel booking response:",
                    data
                );

                if (
                    !response.ok
                ) {

                    alert(
                        data.message ||
                        "Booking could not be cancelled"
                    );

                    return;
                }

                alert(
                    "Booking cancelled successfully!"
                );

                await loadBookings();

            } catch (error) {

                console.error(
                    "Cancel booking error:",
                    error
                );

                alert(
                    "Cannot connect to backend"
                );
            }
        };

    // =====================================================
    // PRINT PAYMENT RECEIPT
    // =====================================================

    const printReceipt =
        (booking) => {

            const receiptWindow =
                window.open(
                    "",
                    "_blank",
                    "width=800,height=900"
                );

            if (
                !receiptWindow
            ) {

                alert(
                    "Please allow pop-ups to print the receipt."
                );

                return;
            }

            const customer =
                getUser();

            const receiptHtml = `
<!DOCTYPE html>
<html>
<head>

    <title>
        BookEase Receipt #${booking.id}
    </title>

    <style>

        body {
            font-family: Arial, sans-serif;
            background: #f5f7fa;
            padding: 30px;
            color: #222;
        }

        .receipt {
            max-width: 700px;
            margin: 0 auto;
            background: white;
            padding: 35px;
            border-radius: 12px;
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 25px;
        }

        .header h1 {
            margin: 0;
            color: #2563eb;
        }

        .header p {
            margin: 6px 0;
            color: #666;
        }

        .section {
            margin-top: 25px;
        }

        .section h3 {
            color: #1d4ed8;
            border-bottom: 1px solid #ddd;
            padding-bottom: 8px;
        }

        .row {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            padding: 8px 0;
        }

        .label {
            font-weight: bold;
        }

        .paid {
            display: inline-block;
            background: #dcfce7;
            color: #166534;
            padding: 6px 12px;
            border-radius: 20px;
            font-weight: bold;
        }

        .total {
            margin-top: 25px;
            padding: 18px;
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            text-align: center;
        }

        .total h2 {
            margin: 5px 0;
            color: #15803d;
        }

        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #777;
            font-size: 13px;
        }

        @media print {

            body {
                background: white;
                padding: 0;
            }

        }

    </style>

</head>

<body>

<div class="receipt">

    <div class="header">

        <h1>
            🏨 BookEase
        </h1>

        <p>
            Hotel Booking Receipt
        </p>

        <p>
            Booking #${booking.id}
        </p>

    </div>


    <div class="section">

        <h3>
            Customer Details
        </h3>

        <div class="row">
            <span class="label">
                Name
            </span>

            <span>
                ${customer?.name || "N/A"}
            </span>
        </div>

        <div class="row">
            <span class="label">
                Email
            </span>

            <span>
                ${customer?.email || "N/A"}
            </span>
        </div>

        <div class="row">
            <span class="label">
                Phone
            </span>

            <span>
                ${customer?.phone || "N/A"}
            </span>
        </div>

    </div>


    <div class="section">

        <h3>
            Hotel & Room
        </h3>

        <div class="row">
            <span class="label">
                Hotel
            </span>

            <span>
                ${booking.hotel_name || "N/A"}
            </span>
        </div>

        <div class="row">
            <span class="label">
                Location
            </span>

            <span>
                ${booking.location || "N/A"}
            </span>
        </div>

        <div class="row">
            <span class="label">
                Room Number
            </span>

            <span>
                ${booking.room_number || "N/A"}
            </span>
        </div>

        <div class="row">
            <span class="label">
                Room Type
            </span>

            <span>
                ${booking.room_type || "N/A"}
            </span>
        </div>

    </div>


    <div class="section">

        <h3>
            Booking Details
        </h3>

        <div class="row">
            <span class="label">
                Check-in
            </span>

            <span>
                ${formatDate(booking.check_in)}
            </span>
        </div>

        <div class="row">
            <span class="label">
                Check-out
            </span>

            <span>
                ${formatDate(booking.check_out)}
            </span>
        </div>

        <div class="row">
            <span class="label">
                Guests
            </span>

            <span>
                ${booking.guests || "N/A"}
            </span>
        </div>

        <div class="row">
            <span class="label">
                Booking Status
            </span>

            <span>
                ${booking.booking_status || "N/A"}
            </span>
        </div>

    </div>


    <div class="section">

        <h3>
            Payment Details
        </h3>

        <div class="row">
            <span class="label">
                Payment Status
            </span>

            <span class="paid">
                ${booking.payment_status || "N/A"}
            </span>
        </div>

        <div class="row">
            <span class="label">
                Payment Method
            </span>

            <span>
                ${booking.payment_method || "N/A"}
            </span>
        </div>

        <div class="row">
            <span class="label">
                Payment ID
            </span>

            <span>
                ${booking.payment_id || "N/A"}
            </span>
        </div>

    </div>


    <div class="total">

        <p>
            Total Amount Paid
        </p>

        <h2>
            ₹${Number(
                booking.total_amount || 0
            ).toFixed(2)}
        </h2>

    </div>


    <div class="footer">

        <p>
            Thank you for choosing BookEase.
        </p>

        <p>
            This is a computer-generated receipt.
        </p>

    </div>

</div>

<script>

    window.onload = function () {
        window.print();
    };

</script>

</body>
</html>
`;

            receiptWindow.document.open();

            receiptWindow.document.write(
                receiptHtml
            );

            receiptWindow.document.close();
        };

    // =====================================================
    // FILTER BOOKINGS
    // =====================================================

    const filteredBookings =
        bookings.filter(
            (booking) => {

                const status =
                    String(
                        booking.booking_status ||
                        ""
                    ).toLowerCase();

                if (
                    bookingFilter ===
                    "upcoming"
                ) {

                    return (
                        status === "pending" ||
                        status === "confirmed"
                    );
                }

                if (
                    bookingFilter ===
                    "completed"
                ) {

                    return (
                        status ===
                        "completed"
                    );
                }

                if (
                    bookingFilter ===
                    "cancelled"
                ) {

                    return (
                        status ===
                        "cancelled"
                    );
                }

                return true;
            }
        );

    // =====================================================
    // COUNTS
    // =====================================================

    const upcomingCount =
        bookings.filter(
            (booking) => {

                const status =
                    String(
                        booking.booking_status ||
                        ""
                    ).toLowerCase();

                return (
                    status === "pending" ||
                    status === "confirmed"
                );
            }
        ).length;

    const completedCount =
        bookings.filter(
            booking =>
                String(
                    booking.booking_status ||
                    ""
                ).toLowerCase() ===
                "completed"
        ).length;

    const cancelledCount =
        bookings.filter(
            booking =>
                String(
                    booking.booking_status ||
                    ""
                ).toLowerCase() ===
                "cancelled"
        ).length;

    const paidCount =
        bookings.filter(
            booking =>
                String(
                    booking.payment_status ||
                    ""
                ).toLowerCase() ===
                "paid"
        ).length;

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div
                style={
                    styles.loadingPage
                }
            >

                <div
                    style={
                        styles.loadingIcon
                    }
                >
                    ⏳
                </div>

                <h2>
                    Loading Your Bookings...
                </h2>

                <p>
                    Please wait.
                </p>

            </div>
        );
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div
            style={
                styles.page
            }
        >

            <div
                style={
                    styles.container
                }
            >

                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <div
                    style={
                        styles.header
                    }
                >

                    <div>

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
                            My Bookings
                        </h1>

                        <p
                            style={
                                styles.subtitle
                            }
                        >
                            Track your stays, payments
                            and booking details.
                        </p>

                    </div>

                    <div
                        style={
                            styles.headerBadge
                        }
                    >
                        📋{" "}
                        {bookings.length}
                        {" "}
                        Booking
                        {
                            bookings.length !==
                            1
                                ? "s"
                                : ""
                        }
                    </div>

                </div>


                {/* =================================================
                    SUMMARY CARDS
                ================================================= */}

                <div
                    style={
                        styles.summaryGrid
                    }
                >

                    <SummaryCard
                        icon="📋"
                        title="Total Bookings"
                        value={
                            bookings.length
                        }
                        background="#eff6ff"
                    />

                    <SummaryCard
                        icon="📅"
                        title="Upcoming"
                        value={
                            upcomingCount
                        }
                        background="#ecfeff"
                    />

                    <SummaryCard
                        icon="🎉"
                        title="Completed"
                        value={
                            completedCount
                        }
                        background="#f5f3ff"
                    />

                    <SummaryCard
                        icon="💳"
                        title="Paid"
                        value={
                            paidCount
                        }
                        background="#f0fdf4"
                    />

                </div>


                {/* =================================================
                    FILTERS
                ================================================= */}

                <div
                    style={
                        styles.filterCard
                    }
                >

                    <div
                        style={
                            styles.filterHeader
                        }
                    >

                        <div>

                            <h2
                                style={{
                                    margin:
                                        "0 0 5px",
                                    color:
                                        "#0f172a"
                                }}
                            >
                                Your Booking History
                            </h2>

                            <p
                                style={{
                                    margin:
                                        "0",
                                    color:
                                        "#64748b",
                                    fontSize:
                                        "14px"
                                }}
                            >
                                Filter your reservations
                                by status.
                            </p>

                        </div>

                    </div>


                    <div
                        style={
                            styles.filterButtons
                        }
                    >

                        <FilterButton
                            label="All"
                            count={
                                bookings.length
                            }
                            active={
                                bookingFilter ===
                                "all"
                            }
                            onClick={() =>
                                setBookingFilter(
                                    "all"
                                )
                            }
                            color="#2563eb"
                        />

                        <FilterButton
                            label="Upcoming"
                            count={
                                upcomingCount
                            }
                            active={
                                bookingFilter ===
                                "upcoming"
                            }
                            onClick={() =>
                                setBookingFilter(
                                    "upcoming"
                                )
                            }
                            color="#0891b2"
                        />

                        <FilterButton
                            label="Completed"
                            count={
                                completedCount
                            }
                            active={
                                bookingFilter ===
                                "completed"
                            }
                            onClick={() =>
                                setBookingFilter(
                                    "completed"
                                )
                            }
                            color="#7c3aed"
                        />

                        <FilterButton
                            label="Cancelled"
                            count={
                                cancelledCount
                            }
                            active={
                                bookingFilter ===
                                "cancelled"
                            }
                            onClick={() =>
                                setBookingFilter(
                                    "cancelled"
                                )
                            }
                            color="#dc2626"
                        />

                    </div>

                </div>


                {/* =================================================
                    NO BOOKINGS
                ================================================= */}

                {bookings.length ===
                0 ? (

                    <div
                        style={
                            styles.emptyCard
                        }
                    >

                        <div
                            style={
                                styles.emptyIcon
                            }
                        >
                            🏨
                        </div>

                        <h2>
                            No Bookings Yet
                        </h2>

                        <p>
                            You haven't made any
                            hotel reservations yet.
                        </p>

                        <button
                            onClick={() =>
                                window.location.href =
                                    "/"
                            }
                            style={
                                styles.primaryButton
                            }
                        >
                            Explore Hotels →
                        </button>

                    </div>

                ) : filteredBookings.length ===
                  0 ? (

                    <div
                        style={
                            styles.emptyCard
                        }
                    >

                        <div
                            style={
                                styles.emptyIcon
                            }
                        >
                            🔎
                        </div>

                        <h2>
                            No Matching Bookings
                        </h2>

                        <p>
                            There are no bookings in
                            the selected category.
                        </p>

                    </div>

                ) : (

                    <div
                        style={
                            styles.bookingList
                        }
                    >

                        {filteredBookings.map(
                            (booking) => {

                                const bookingStatus =
                                    String(
                                        booking.booking_status ||
                                        "pending"
                                    ).toLowerCase();

                                const paymentStatus =
                                    String(
                                        booking.payment_status ||
                                        "pending"
                                    ).toLowerCase();

                                const canCancel =
                                    bookingStatus ===
                                        "pending" ||
                                    bookingStatus ===
                                        "confirmed";

                                return (

                                    <div
                                        key={
                                            booking.id
                                        }
                                        style={
                                            styles.bookingCard
                                        }
                                    >

                                        {/* TOP BAR */}

                                        <div
                                            style={
                                                styles.bookingTop
                                            }
                                        >

                                            <div>

                                                <p
                                                    style={
                                                        styles.bookingLabel
                                                    }
                                                >
                                                    BOOKING
                                                </p>

                                                <h2
                                                    style={
                                                        styles.bookingId
                                                    }
                                                >
                                                    #{
                                                        booking.id
                                                    }
                                                </h2>

                                            </div>

                                            <StatusBadge
                                                status={
                                                    booking.booking_status
                                                }
                                            />

                                        </div>


                                        {/* HOTEL HERO */}

                                        <div
                                            style={
                                                styles.hotelSection
                                            }
                                        >

                                            <div
                                                style={
                                                    styles.hotelIcon
                                                }
                                            >
                                                🏨
                                            </div>

                                            <div
                                                style={
                                                    styles.hotelInfo
                                                }
                                            >

                                                <h3>
                                                    {
                                                        booking.hotel_name ||
                                                        "Hotel"
                                                    }
                                                </h3>

                                                <p>
                                                    📍{" "}
                                                    {
                                                        booking.location ||
                                                        "Location unavailable"
                                                    }
                                                </p>

                                            </div>

                                        </div>


                                        {/* MAIN DETAILS */}

                                        <div
                                            style={
                                                styles.detailsGrid
                                            }
                                        >

                                            <InfoBlock
                                                icon="🛏️"
                                                label="Room"
                                                value={
                                                    booking.room_number ||
                                                    "N/A"
                                                }
                                                subValue={
                                                    booking.room_type ||
                                                    "Room"
                                                }
                                            />

                                            <InfoBlock
                                                icon="📅"
                                                label="Check-in"
                                                value={
                                                    formatDate(
                                                        booking.check_in
                                                    )
                                                }
                                                subValue="Arrival"
                                            />

                                            <InfoBlock
                                                icon="📅"
                                                label="Check-out"
                                                value={
                                                    formatDate(
                                                        booking.check_out
                                                    )
                                                }
                                                subValue="Departure"
                                            />

                                            <InfoBlock
                                                icon="👥"
                                                label="Guests"
                                                value={
                                                    booking.guests ||
                                                    "N/A"
                                                }
                                                subValue="Guests"
                                            />

                                        </div>


                                        {/* PAYMENT + TOTAL */}

                                        <div
                                            style={
                                                styles.paymentGrid
                                            }
                                        >

                                            <div
                                                style={
                                                    styles.paymentPanel
                                                }
                                            >

                                                <div
                                                    style={
                                                        styles.paymentPanelHeader
                                                    }
                                                >

                                                    <h3>
                                                        💳 Payment
                                                    </h3>

                                                    <PaymentStatusBadge
                                                        status={
                                                            booking.payment_status
                                                        }
                                                    />

                                                </div>

                                                <div
                                                    style={
                                                        styles.paymentRows
                                                    }
                                                >

                                                    <div>
                                                        <span>
                                                            Method
                                                        </span>

                                                        <strong>
                                                            {
                                                                booking.payment_method ||
                                                                "Not paid"
                                                            }
                                                        </strong>
                                                    </div>

                                                    <div>
                                                        <span>
                                                            Payment ID
                                                        </span>

                                                        <strong
                                                            style={{
                                                                wordBreak:
                                                                    "break-all"
                                                            }}
                                                        >
                                                            {
                                                                booking.payment_id ||
                                                                "Not available"
                                                            }
                                                        </strong>
                                                    </div>

                                                </div>

                                            </div>


                                            <div
                                                style={
                                                    styles.totalPanel
                                                }
                                            >

                                                <span>
                                                    Total Amount
                                                </span>

                                                <strong>
                                                    ₹
                                                    {Number(
                                                        booking.total_amount ||
                                                        0
                                                    ).toFixed(
                                                        2
                                                    )}
                                                </strong>

                                                <small>
                                                    {
                                                        booking.guests ||
                                                        1
                                                    }{" "}
                                                    guest(s)
                                                </small>

                                            </div>

                                        </div>


                                        {/* ACTIONS */}

                                        <div
                                            style={
                                                styles.actionRow
                                            }
                                        >

                                            {paymentStatus ===
                                                "paid" && (

                                                <button
                                                    onClick={() =>
                                                        printReceipt(
                                                            booking
                                                        )
                                                    }
                                                    style={
                                                        styles.receiptButton
                                                    }
                                                >
                                                    🧾 View Receipt
                                                </button>

                                            )}


                                            {canCancel && (

                                                <button
                                                    onClick={() =>
                                                        cancelBooking(
                                                            booking.id
                                                        )
                                                    }
                                                    style={
                                                        styles.cancelButton
                                                    }
                                                >
                                                    ✕ Cancel Booking
                                                </button>

                                            )}

                                            {!canCancel &&
                                                bookingStatus ===
                                                    "cancelled" && (

                                                <span
                                                    style={
                                                        styles.infoMessage
                                                    }
                                                >
                                                    This booking has
                                                    been cancelled.
                                                </span>

                                            )}

                                            {!canCancel &&
                                                bookingStatus ===
                                                    "completed" && (

                                                <span
                                                    style={
                                                        styles.infoMessage
                                                    }
                                                >
                                                    ✓ Stay completed
                                                </span>

                                            )}

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>

                )}

            </div>

        </div>
    );
}


// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
    icon,
    title,
    value,
    background
}) {

    return (

        <div
            style={
                styles.summaryCard
            }
        >

            <div
                style={{
                    ...styles.summaryIcon,
                    backgroundColor:
                        background
                }}
            >
                {icon}
            </div>

            <div>

                <p
                    style={
                        styles.summaryTitle
                    }
                >
                    {title}
                </p>

                <h2
                    style={
                        styles.summaryValue
                    }
                >
                    {value}
                </h2>

            </div>

        </div>
    );
}


// =====================================================
// FILTER BUTTON
// =====================================================

function FilterButton({
    label,
    count,
    active,
    onClick,
    color
}) {

    return (

        <button
            onClick={
                onClick
            }
            style={{
                ...styles.filterButton,

                backgroundColor:
                    active
                        ? color
                        : "#f8fafc",

                color:
                    active
                        ? "white"
                        : "#475569",

                border:
                    active
                        ? `1px solid ${color}`
                        : "1px solid #e2e8f0"
            }}
        >

            {label}

            <span
                style={{
                    ...styles.filterCount,

                    backgroundColor:
                        active
                            ? "rgba(255,255,255,0.2)"
                            : "#e2e8f0",

                    color:
                        active
                            ? "white"
                            : "#475569"
                }}
            >
                {count}
            </span>

        </button>
    );
}


// =====================================================
// INFO BLOCK
// =====================================================

function InfoBlock({
    icon,
    label,
    value,
    subValue
}) {

    return (

        <div
            style={
                styles.infoBlock
            }
        >

            <div
                style={
                    styles.infoIcon
                }
            >
                {icon}
            </div>

            <div>

                <small
                    style={
                        styles.infoLabel
                    }
                >
                    {label}
                </small>

                <strong
                    style={
                        styles.infoValue
                    }
                >
                    {value}
                </strong>

                <span
                    style={
                        styles.infoSubValue
                    }
                >
                    {subValue}
                </span>

            </div>

        </div>
    );
}


// =====================================================
// STATUS BADGE
// =====================================================

function StatusBadge({
    status
}) {

    const normalized =
        String(
            status || "pending"
        ).toLowerCase();

    let background =
        "#fef3c7";

    let color =
        "#92400e";

    if (
        normalized ===
        "confirmed"
    ) {

        background =
            "#dcfce7";

        color =
            "#166534";

    } else if (
        normalized ===
        "cancelled"
    ) {

        background =
            "#fee2e2";

        color =
            "#991b1b";

    } else if (
        normalized ===
        "completed"
    ) {

        background =
            "#ede9fe";

        color =
            "#6d28d9";
    }

    return (

        <span
            style={{
                display:
                    "inline-flex",

                alignItems:
                    "center",

                gap:
                    "6px",

                padding:
                    "7px 13px",

                borderRadius:
                    "20px",

                backgroundColor:
                    background,

                color:
                    color,

                fontWeight:
                    "bold",

                fontSize:
                    "12px",

                textTransform:
                    "capitalize"
            }}
        >
            <span>
                ●
            </span>

            {
                status ||
                "Pending"
            }

        </span>
    );
}


// =====================================================
// PAYMENT STATUS BADGE
// =====================================================

function PaymentStatusBadge({
    status
}) {

    const normalized =
        String(
            status || "pending"
        ).toLowerCase();

    let background =
        "#fef3c7";

    let color =
        "#92400e";

    if (
        normalized ===
        "paid"
    ) {

        background =
            "#dcfce7";

        color =
            "#166534";

    } else if (
        normalized ===
        "failed"
    ) {

        background =
            "#fee2e2";

        color =
            "#991b1b";

    } else if (
        normalized ===
        "refunded"
    ) {

        background =
            "#ede9fe";

        color =
            "#6d28d9";
    }

    return (

        <span
            style={{
                display:
                    "inline-flex",

                padding:
                    "6px 11px",

                borderRadius:
                    "20px",

                backgroundColor:
                    background,

                color:
                    color,

                fontWeight:
                    "bold",

                fontSize:
                    "11px",

                textTransform:
                    "capitalize"
            }}
        >
            {
                status ||
                "Pending"
            }
        </span>
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
            "45px 25px",

        background:
            "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",

        fontFamily:
            "Arial, Helvetica, sans-serif"
    },

    container: {
        maxWidth:
            "1100px",

        margin:
            "0 auto"
    },

    header: {
        display:
            "flex",

        justifyContent:
            "space-between",

        alignItems:
            "center",

        gap:
            "20px",

        flexWrap:
            "wrap",

        marginBottom:
            "28px"
    },

    eyebrow: {
        margin:
            "0 0 6px",

        color:
            "#2563eb",

        fontSize:
            "12px",

        fontWeight:
            "bold",

        letterSpacing:
            "2px"
    },

    heading: {
        margin:
            "0 0 8px",

        fontSize:
            "42px",

        color:
            "#0f172a"
    },

    subtitle: {
        margin:
            "0",

        color:
            "#64748b",

        fontSize:
            "16px",

        lineHeight:
            "1.6"
    },

    headerBadge: {
        backgroundColor:
            "white",

        padding:
            "12px 17px",

        borderRadius:
            "12px",

        color:
            "#1d4ed8",

        fontWeight:
            "bold",

        border:
            "1px solid #dbeafe",

        boxShadow:
            "0 4px 12px rgba(15,23,42,0.05)"
    },

    summaryGrid: {
        display:
            "grid",

        gridTemplateColumns:
            "repeat(auto-fit, minmax(210px, 1fr))",

        gap:
            "18px",

        marginBottom:
            "24px"
    },

    summaryCard: {
        backgroundColor:
            "white",

        padding:
            "20px",

        borderRadius:
            "15px",

        display:
            "flex",

        alignItems:
            "center",

        gap:
            "14px",

        border:
            "1px solid #e2e8f0",

        boxShadow:
            "0 5px 18px rgba(15,23,42,0.06)"
    },

    summaryIcon: {
        width:
            "50px",

        height:
            "50px",

        borderRadius:
            "13px",

        display:
            "flex",

        alignItems:
            "center",

        justifyContent:
            "center",

        fontSize:
            "23px"
    },

    summaryTitle: {
        margin:
            "0 0 5px",

        color:
            "#64748b",

        fontSize:
            "13px"
    },

    summaryValue: {
        margin:
            "0",

        fontSize:
            "27px",

        color:
            "#0f172a"
    },

    filterCard: {
        backgroundColor:
            "white",

        padding:
            "24px",

        borderRadius:
            "16px",

        border:
            "1px solid #e2e8f0",

        boxShadow:
            "0 5px 18px rgba(15,23,42,0.05)",

        marginBottom:
            "25px"
    },

    filterHeader: {
        marginBottom:
            "18px"
    },

    filterButtons: {
        display:
            "flex",

        gap:
            "10px",

        flexWrap:
            "wrap"
    },

    filterButton: {
        borderRadius:
            "22px",

        padding:
            "9px 13px",

        display:
            "inline-flex",

        alignItems:
            "center",

        gap:
            "8px",

        fontSize:
            "13px",

        fontWeight:
            "bold",

        cursor:
            "pointer"
    },

    filterCount: {
        minWidth:
            "22px",

        height:
            "22px",

        borderRadius:
            "50%",

        display:
            "inline-flex",

        alignItems:
            "center",

        justifyContent:
            "center",

        fontSize:
            "11px"
    },

    bookingList: {
        display:
            "flex",

        flexDirection:
            "column",

        gap:
            "20px"
    },

    bookingCard: {
        backgroundColor:
            "white",

        borderRadius:
            "18px",

        border:
            "1px solid #e2e8f0",

        padding:
            "24px",

        boxShadow:
            "0 8px 25px rgba(15,23,42,0.07)"
    },

    bookingTop: {
        display:
            "flex",

        justifyContent:
            "space-between",

        alignItems:
            "center",

        gap:
            "15px",

        marginBottom:
            "20px"
    },

    bookingLabel: {
        margin:
            "0 0 4px",

        color:
            "#2563eb",

        fontSize:
            "11px",

        fontWeight:
            "bold",

        letterSpacing:
            "1.5px"
    },

    bookingId: {
        margin:
            "0",

        fontSize:
            "28px",

        color:
            "#0f172a"
    },

    hotelSection: {
        display:
            "flex",

        alignItems:
            "center",

        gap:
            "15px",

        padding:
            "17px",

        borderRadius:
            "13px",

        background:
            "linear-gradient(135deg, #eff6ff, #eef2ff)",

        border:
            "1px solid #dbeafe",

        marginBottom:
            "20px"
    },

    hotelIcon: {
        width:
            "54px",

        height:
            "54px",

        borderRadius:
            "14px",

        backgroundColor:
            "white",

        display:
            "flex",

        alignItems:
            "center",

        justifyContent:
            "center",

        fontSize:
            "25px"
    },

    hotelInfo: {
        flex:
            1
    },

    hotelInfoH3: {
        margin:
            "0 0 5px",

        color:
            "#0f172a"
    },

    hotelInfoP: {
        margin:
            "0",

        color:
            "#64748b",

        fontSize:
            "13px"
    },

    detailsGrid: {
        display:
            "grid",

        gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",

        gap:
            "12px",

        marginBottom:
            "20px"
    },

    infoBlock: {
        display:
            "flex",

        alignItems:
            "center",

        gap:
            "11px",

        padding:
            "14px",

        borderRadius:
            "11px",

        backgroundColor:
            "#f8fafc",

        border:
            "1px solid #eef2f7"
    },

    infoIcon: {
        fontSize:
            "22px"
    },

    infoLabel: {
        display:
            "block",

        color:
            "#94a3b8",

        fontSize:
            "11px",

        marginBottom:
            "3px"
    },

    infoValue: {
        display:
            "block",

        color:
            "#334155",

        fontSize:
            "13px"
    },

    infoSubValue: {
        display:
            "block",

        color:
            "#94a3b8",

        fontSize:
            "11px",

        marginTop:
            "2px"
    },

    paymentGrid: {
        display:
            "grid",

        gridTemplateColumns:
            "minmax(0, 1fr) 240px",

        gap:
            "15px",

        marginBottom:
            "20px"
    },

    paymentPanel: {
        padding:
            "17px",

        backgroundColor:
            "#f8fafc",

        border:
            "1px solid #e2e8f0",

        borderRadius:
            "12px"
    },

    paymentPanelHeader: {
        display:
            "flex",

        justifyContent:
            "space-between",

        alignItems:
            "center",

        gap:
            "10px",

        marginBottom:
            "15px"
    },

    paymentRows: {
        display:
            "grid",

        gap:
            "10px"
    },

    paymentRowsDiv: {
        display:
            "flex",

        justifyContent:
            "space-between",

        gap:
            "15px"
    },

    totalPanel: {
        padding:
            "20px",

        borderRadius:
            "12px",

        background:
            "linear-gradient(135deg, #f0fdf4, #ecfdf5)",

        border:
            "1px solid #bbf7d0",

        display:
            "flex",

        flexDirection:
            "column",

        justifyContent:
            "center"
    },

    totalPanelSpan: {
        color:
            "#64748b",

        fontSize:
            "12px",

        marginBottom:
            "5px"
    },

    totalPanelStrong: {
        color:
            "#15803d",

        fontSize:
            "28px"
    },

    totalPanelSmall: {
        color:
            "#64748b",

        marginTop:
            "5px"
    },

    actionRow: {
        paddingTop:
            "18px",

        borderTop:
            "1px solid #e2e8f0",

        display:
            "flex",

        alignItems:
            "center",

        gap:
            "10px",

        flexWrap:
            "wrap"
    },

    receiptButton: {
        border:
            "none",

        borderRadius:
            "8px",

        padding:
            "11px 16px",

        backgroundColor:
            "#2563eb",

        color:
            "white",

        cursor:
            "pointer",

        fontWeight:
            "bold"
    },

    cancelButton: {
        border:
            "none",

        borderRadius:
            "8px",

        padding:
            "11px 16px",

        backgroundColor:
            "#dc2626",

        color:
            "white",

        cursor:
            "pointer",

        fontWeight:
            "bold"
    },

    infoMessage: {
        color:
            "#64748b",

        fontSize:
            "13px",

        fontWeight:
            "600"
    },

    emptyCard: {
        backgroundColor:
            "white",

        padding:
            "60px 30px",

        borderRadius:
            "18px",

        textAlign:
            "center",

        border:
            "1px solid #e2e8f0",

        boxShadow:
            "0 6px 22px rgba(15,23,42,0.06)"
    },

    emptyIcon: {
        fontSize:
            "55px",

        marginBottom:
            "12px"
    },

    primaryButton: {
        marginTop:
            "15px",

        border:
            "none",

        borderRadius:
            "9px",

        padding:
            "12px 20px",

        background:
            "linear-gradient(135deg, #2563eb, #4f46e5)",

        color:
            "white",

        cursor:
            "pointer",

        fontWeight:
            "bold"
    },

    loadingPage: {
        minHeight:
            "100vh",

        display:
            "flex",

        flexDirection:
            "column",

        alignItems:
            "center",

        justifyContent:
            "center",

        background:
            "linear-gradient(180deg, #f8fafc, #eef2ff)",

        fontFamily:
            "Arial, sans-serif"
    },

    loadingIcon: {
        fontSize:
            "45px",

        marginBottom:
            "10px"
    }
};

export default MyBookings;

