
import React from "react";
import HotelList from "../components/HotelList";

function Home() {
    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f5f7fa",
                fontFamily:
                    "Arial, Helvetica, sans-serif"
            }}
        >

            {/* =================================================
                HERO SECTION
            ================================================= */}

            <section
                style={{
                    minHeight: "100vh",
                    backgroundImage:
                        "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url('/images/hotel-banner.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    color: "white",
                    padding: "40px 20px"
                }}
            >

                <div
                    style={{
                        maxWidth: "850px"
                    }}
                >

                    <p
                        style={{
                            fontSize: "18px",
                            letterSpacing: "2px",
                            marginBottom: "15px",
                            textTransform:
                                "uppercase"
                        }}
                    >
                        Welcome to BookEase
                    </p>

                    <h1
                        style={{
                            fontSize:
                                "clamp(38px, 6vw, 68px)",
                            margin:
                                "0 0 20px",
                            lineHeight: "1.1",
                            fontWeight: "800"
                        }}
                    >
                        Find Your Perfect Stay
                    </h1>

                    <p
                        style={{
                            fontSize: "20px",
                            lineHeight: "1.6",
                            margin:
                                "0 auto 30px",
                            maxWidth: "700px"
                        }}
                    >
                        Discover comfortable rooms,
                        beautiful hotels and memorable
                        stays with BookEase.
                    </p>

                    <button
                        onClick={() =>
                            document
                                .getElementById(
                                    "hotels-section"
                                )
                                ?.scrollIntoView({
                                    behavior: "smooth"
                                })
                        }
                        style={{
                            padding:
                                "14px 30px",
                            border: "none",
                            borderRadius:
                                "8px",
                            backgroundColor:
                                "#2563eb",
                            color: "white",
                            fontSize:
                                "17px",
                            fontWeight:
                                "bold",
                            cursor:
                                "pointer"
                        }}
                    >
                        Explore Hotels →
                    </button>

                </div>

            </section>


            {/* =================================================
                FEATURE CARDS
            ================================================= */}

            <section
                style={{
                    maxWidth: "1100px",
                    margin:
                        "-55px auto 50px",
                    padding:
                        "0 20px",
                    position:
                        "relative"
                }}
            >

                <div
                    style={{
                        display:
                            "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "20px"
                    }}
                >

                    <FeatureCard
                        icon="🏨"
                        title="Beautiful Hotels"
                        text="Choose from comfortable and attractive hotels."
                    />

                    <FeatureCard
                        icon="🛏️"
                        title="Comfortable Rooms"
                        text="Find rooms that match your needs and budget."
                    />

                    <FeatureCard
                        icon="💳"
                        title="Secure Payment"
                        text="Pay securely using Razorpay."
                    />

                    <FeatureCard
                        icon="📋"
                        title="Easy Booking"
                        text="Book your room in just a few simple steps."
                    />

                </div>

            </section>


            {/* =================================================
                HOTELS SECTION
            ================================================= */}

            <section
                id="hotels-section"
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding:
                        "20px 20px 60px"
                }}
            >

                <div
                    style={{
                        textAlign:
                            "center",
                        marginBottom:
                            "35px"
                    }}
                >

                    <p
                        style={{
                            color:
                                "#2563eb",
                            fontWeight:
                                "bold",
                            marginBottom:
                                "8px"
                        }}
                    >
                        OUR HOTELS
                    </p>

                    <h2
                        style={{
                            fontSize:
                                "36px",
                            margin:
                                "0 0 10px",
                            color:
                                "#1e293b"
                        }}
                    >
                        Explore Our Hotels
                    </h2>

                    <p
                        style={{
                            color:
                                "#64748b",
                            fontSize:
                                "17px"
                        }}
                    >
                        Find the perfect place for
                        your next stay.
                    </p>

                </div>

                <HotelList />

            </section>


            {/* =================================================
                WHY CHOOSE BOOKEASE
            ================================================= */}

            <section
                style={{
                    backgroundColor:
                        "white",
                    padding:
                        "70px 20px"
                }}
            >

                <div
                    style={{
                        maxWidth:
                            "1100px",
                        margin:
                            "0 auto"
                    }}
                >

                    <div
                        style={{
                            textAlign:
                                "center",
                            marginBottom:
                                "45px"
                        }}
                    >

                        <p
                            style={{
                                color:
                                    "#2563eb",
                                fontWeight:
                                    "bold"
                            }}
                        >
                            WHY BOOKEASE
                        </p>

                        <h2
                            style={{
                                fontSize:
                                    "36px",
                                margin:
                                    "10px 0",
                                color:
                                    "#1e293b"
                            }}
                        >
                            Everything You Need
                        </h2>

                        <p
                            style={{
                                color:
                                    "#64748b",
                                maxWidth:
                                    "650px",
                                margin:
                                    "0 auto",
                                lineHeight:
                                    "1.7"
                            }}
                        >
                            We make hotel booking simple,
                            convenient and reliable from
                            room selection to payment.
                        </p>

                    </div>


                    <div
                        style={{
                            display:
                                "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(250px, 1fr))",
                            gap:
                                "25px"
                        }}
                    >

                        <WhyCard
                            icon="🔎"
                            title="Easy Room Search"
                            text="Search available rooms using your preferred check-in and check-out dates."
                        />

                        <WhyCard
                            icon="📅"
                            title="Date-Based Availability"
                            text="See only the rooms available for your selected dates."
                        />

                        <WhyCard
                            icon="💳"
                            title="Razorpay Payments"
                            text="Complete your booking with secure online payment."
                        />

                        <WhyCard
                            icon="🧾"
                            title="Booking Receipt"
                            text="View and print your payment receipt after booking."
                        />

                    </div>

                </div>

            </section>


            {/* =================================================
                CALL TO ACTION
            ================================================= */}

            <section
                style={{
                    background:
                        "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    color: "white",
                    padding:
                        "70px 20px",
                    textAlign:
                        "center"
                }}
            >

                <h2
                    style={{
                        fontSize:
                            "38px",
                        margin:
                            "0 0 15px"
                    }}
                >
                    Ready to Book Your Stay?
                </h2>

                <p
                    style={{
                        fontSize:
                            "18px",
                        margin:
                            "0 auto 25px",
                        maxWidth:
                            "650px",
                        lineHeight:
                            "1.6"
                    }}
                >
                    Explore our hotels and find a room
                    that feels like home.
                </p>

                <button
                    onClick={() =>
                        document
                            .getElementById(
                                "hotels-section"
                            )
                            ?.scrollIntoView({
                                behavior:
                                    "smooth"
                            })
                    }
                    style={{
                        padding:
                            "14px 30px",
                        border: "none",
                        borderRadius:
                            "8px",
                        backgroundColor:
                            "white",
                        color:
                            "#2563eb",
                        fontSize:
                            "16px",
                        fontWeight:
                            "bold",
                        cursor:
                            "pointer"
                    }}
                >
                    Browse Hotels
                </button>

            </section>


            {/* =================================================
                FOOTER
            ================================================= */}

            <footer
                style={{
                    backgroundColor:
                        "#0f172a",
                    color:
                        "#cbd5e1",
                    padding:
                        "30px 20px",
                    textAlign:
                        "center"
                }}
            >

                <h3
                    style={{
                        margin:
                            "0 0 8px",
                        color:
                            "white"
                    }}
                >
                    🏨 BookEase
                </h3>

                <p
                    style={{
                        margin:
                            "0 0 10px"
                    }}
                >
                    Your trusted hotel booking system.
                </p>

                <p
                    style={{
                        margin:
                            "0",
                        fontSize:
                            "13px"
                    }}
                >
                    © {new Date().getFullYear()}
                    {" "}BookEase. All rights reserved.
                </p>

            </footer>

        </div>
    );
}


// =====================================================
// FEATURE CARD
// =====================================================

function FeatureCard({
    icon,
    title,
    text
}) {
    return (
        <div
            style={{
                backgroundColor:
                    "white",
                padding:
                    "25px",
                borderRadius:
                    "12px",
                textAlign:
                    "center",
                boxShadow:
                    "0 5px 18px rgba(0,0,0,0.1)"
            }}
        >

            <div
                style={{
                    fontSize:
                        "35px",
                    marginBottom:
                        "12px"
                }}
            >
                {icon}
            </div>

            <h3
                style={{
                    margin:
                        "0 0 10px",
                    color:
                        "#1e293b"
                }}
            >
                {title}
            </h3>

            <p
                style={{
                    margin:
                        0,
                    color:
                        "#64748b",
                    lineHeight:
                        "1.6"
                }}
            >
                {text}
            </p>

        </div>
    );
}


// =====================================================
// WHY CARD
// =====================================================

function WhyCard({
    icon,
    title,
    text
}) {
    return (
        <div
            style={{
                padding:
                    "25px",
                borderRadius:
                    "12px",
                backgroundColor:
                    "#f8fafc",
                border:
                    "1px solid #e2e8f0"
            }}
        >

            <div
                style={{
                    fontSize:
                        "30px",
                    marginBottom:
                        "12px"
                }}
            >
                {icon}
            </div>

            <h3
                style={{
                    margin:
                        "0 0 10px",
                    color:
                        "#1e293b"
                }}
            >
                {title}
            </h3>

            <p
                style={{
                    margin:
                        0,
                    color:
                        "#64748b",
                    lineHeight:
                        "1.6"
                }}
            >
                {text}
            </p>

        </div>
    );
}

export default Home;
