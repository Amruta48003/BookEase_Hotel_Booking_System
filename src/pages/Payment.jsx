import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Payment() {
    const location = useLocation();
    const navigate = useNavigate();

    // Booking information received from Booking.jsx
    const booking = location.state?.booking;

    const [paymentMethod, setPaymentMethod] = useState("");
    const [loading, setLoading] = useState(false);

    // If booking information is missing
    if (!booking) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    backgroundColor: "#f5f7fa",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px",
                    fontFamily: "Arial, sans-serif"
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "600px",
                        backgroundColor: "white",
                        padding: "40px",
                        borderRadius: "15px",
                        boxShadow: "0 3px 15px rgba(0,0,0,0.1)",
                        textAlign: "center"
                    }}
                >
                    <h2>
                        Booking Information Not Found
                    </h2>

                    <p>
                        Please create a booking first.
                    </p>

                    <button
                        onClick={() => navigate("/hotels")}
                        style={buttonStyle}
                    >
                        ← Go to Hotels
                    </button>
                </div>
            </div>
        );
    }

    // --------------------------------------------------
    // PAYMENT
    // --------------------------------------------------

    const handlePayment = async () => {

        if (!paymentMethod) {
            alert("Please select a payment method.");
            return;
        }

        setLoading(true);

        try {

            /*
             * For now we are using a demo payment ID.
             *
             * Later we can replace this with a real
             * Razorpay payment ID.
             */

            const paymentId =
                "PAY_" +
                Date.now();

            const response = await fetch(
                "http://localhost:5000/api/payments",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        booking_id: booking.booking_id,
                        payment_status: "paid",
                        payment_method: paymentMethod,
                        payment_id: paymentId
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                    "Payment failed."
                );

                return;
            }

            alert(
                "Payment successful!"
            );

            // Go to My Bookings
            navigate("/my-bookings");

        } catch (error) {

            console.error(
                "Payment error:",
                error
            );

            alert(
                "Cannot connect to payment server."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f5f7fa",
                padding: "40px 20px",
                fontFamily: "Arial, sans-serif"
            }}
        >

            <div
                style={{
                    maxWidth: "700px",
                    margin: "0 auto",
                    backgroundColor: "white",
                    padding: "40px",
                    borderRadius: "15px",
                    boxShadow:
                        "0 3px 15px rgba(0,0,0,0.1)"
                }}
            >

                {/* PAGE TITLE */}

                <h1
                    style={{
                        marginBottom: "10px",
                        color: "#222"
                    }}
                >
                    💳 Payment
                </h1>

                <p
                    style={{
                        color: "#666",
                        fontSize: "16px"
                    }}
                >
                    Complete your payment to confirm
                    your hotel booking.
                </p>

                <hr
                    style={{
                        margin: "25px 0"
                    }}
                />


                {/* BOOKING DETAILS */}

                <div
                    style={{
                        backgroundColor: "#eff6ff",
                        border:
                            "1px solid #bfdbfe",
                        borderRadius: "10px",
                        padding: "20px",
                        marginBottom: "25px"
                    }}
                >

                    <h2
                        style={{
                            color: "#1d4ed8",
                            marginTop: 0
                        }}
                    >
                        📋 Booking Details
                    </h2>

                    <p>
                        <strong>
                            Booking ID:
                        </strong>{" "}
                        #{booking.booking_id}
                    </p>

                    <p>
                        <strong>
                            Hotel:
                        </strong>{" "}
                        {booking.hotel_name ||
                            "Hotel"}
                    </p>

                    <p>
                        <strong>
                            Room:
                        </strong>{" "}
                        {booking.room_number ||
                            "Room"}
                    </p>

                    <p>
                        <strong>
                            Check-in:
                        </strong>{" "}
                        {booking.check_in}
                    </p>

                    <p>
                        <strong>
                            Check-out:
                        </strong>{" "}
                        {booking.check_out}
                    </p>

                    <p>
                        <strong>
                            Guests:
                        </strong>{" "}
                        {booking.guests}
                    </p>

                </div>


                {/* AMOUNT */}

                <div
                    style={{
                        backgroundColor: "#f0fdf4",
                        border:
                            "1px solid #bbf7d0",
                        borderRadius: "10px",
                        padding: "20px",
                        marginBottom: "25px",
                        textAlign: "center"
                    }}
                >

                    <p
                        style={{
                            margin: "0 0 8px",
                            color: "#555"
                        }}
                    >
                        Total Amount
                    </p>

                    <h1
                        style={{
                            margin: 0,
                            color: "#15803d"
                        }}
                    >
                        ₹
                        {Number(
                            booking.total_amount || 0
                        ).toFixed(2)}
                    </h1>

                </div>


                {/* PAYMENT METHOD */}

                <div
                    style={{
                        marginBottom: "25px"
                    }}
                >

                    <h2>
                        Select Payment Method
                    </h2>

                    <label
                        style={paymentOptionStyle}
                    >
                        <input
                            type="radio"
                            name="payment"
                            value="UPI"
                            checked={
                                paymentMethod === "UPI"
                            }
                            onChange={(e) =>
                                setPaymentMethod(
                                    e.target.value
                                )
                            }
                        />

                        <span>
                            📱 UPI
                        </span>
                    </label>


                    <label
                        style={paymentOptionStyle}
                    >
                        <input
                            type="radio"
                            name="payment"
                            value="Credit Card"
                            checked={
                                paymentMethod ===
                                "Credit Card"
                            }
                            onChange={(e) =>
                                setPaymentMethod(
                                    e.target.value
                                )
                            }
                        />

                        <span>
                            💳 Credit Card
                        </span>
                    </label>


                    <label
                        style={paymentOptionStyle}
                    >
                        <input
                            type="radio"
                            name="payment"
                            value="Debit Card"
                            checked={
                                paymentMethod ===
                                "Debit Card"
                            }
                            onChange={(e) =>
                                setPaymentMethod(
                                    e.target.value
                                )
                            }
                        />

                        <span>
                            💳 Debit Card
                        </span>
                    </label>


                    <label
                        style={paymentOptionStyle}
                    >
                        <input
                            type="radio"
                            name="payment"
                            value="Cash"
                            checked={
                                paymentMethod ===
                                "Cash"
                            }
                            onChange={(e) =>
                                setPaymentMethod(
                                    e.target.value
                                )
                            }
                        />

                        <span>
                            💵 Cash
                        </span>
                    </label>

                </div>


                {/* PAY BUTTON */}

                <button
                    onClick={handlePayment}
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "15px",
                        border: "none",
                        borderRadius: "8px",
                        backgroundColor:
                            loading
                                ? "#999"
                                : "#28a745",
                        color: "white",
                        fontSize: "18px",
                        fontWeight: "bold",
                        cursor:
                            loading
                                ? "not-allowed"
                                : "pointer"
                    }}
                >

                    {loading
                        ? "Processing Payment..."
                        : `💳 Pay ₹${Number(
                              booking.total_amount || 0
                          ).toFixed(2)}`}

                </button>


                {/* BACK BUTTON */}

                <button
                    onClick={() => navigate(-1)}
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "13px",
                        marginTop: "12px",
                        border:
                            "1px solid #ccc",
                        borderRadius: "8px",
                        backgroundColor:
                            "white",
                        color: "#333",
                        fontSize: "16px",
                        cursor: "pointer"
                    }}
                >
                    ← Back
                </button>

            </div>

        </div>
    );
}


// ==================================================
// STYLES
// ==================================================

const buttonStyle = {
    padding: "12px 25px",
    border: "none",
    borderRadius: "7px",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
    fontSize: "16px"
};


const paymentOptionStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px",
    marginTop: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px"
};


export default Payment;