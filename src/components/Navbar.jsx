import React from "react";
import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

function Navbar() {

    const location = useLocation();
    const navigate = useNavigate();

    const goToHotels = (e) => {
        e.preventDefault();

        if (location.pathname === "/") {
            const hotelSection =
                document.getElementById(
                    "hotels-section"
                );

            if (hotelSection) {
                hotelSection.scrollIntoView({
                    behavior: "smooth"
                });
            }
        } else {
            navigate("/");

            setTimeout(() => {
                const hotelSection =
                    document.getElementById(
                        "hotels-section"
                    );

                if (hotelSection) {
                    hotelSection.scrollIntoView({
                        behavior: "smooth"
                    });
                }
            }, 300);
        }
    };

    return (
        <nav
            style={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                width: "100%",
                backgroundColor: "white",
                borderBottom:
                    "1px solid #e2e8f0",
                boxShadow:
                    "0 3px 15px rgba(0,0,0,0.06)"
            }}
        >
            <div
                style={{
                    maxWidth: "1250px",
                    margin: "0 auto",
                    minHeight: "72px",
                    padding: "0 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "20px",
                    boxSizing: "border-box"
                }}
            >

                {/* LOGO */}

                <Link
                    to="/"
                    style={{
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexShrink: 0
                    }}
                >
                    <div
                        style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "11px",
                            background:
                                "linear-gradient(135deg, #2563eb, #4f46e5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "21px"
                        }}
                    >
                        🏨
                    </div>

                    <div>
                        <div
                            style={{
                                fontSize: "21px",
                                fontWeight: "800",
                                color: "#0f172a"
                            }}
                        >
                            BookEase
                        </div>

                        <div
                            style={{
                                fontSize: "9px",
                                color: "#64748b",
                                letterSpacing: "1.2px",
                                fontWeight: "bold"
                            }}
                        >
                            HOTEL BOOKING
                        </div>
                    </div>
                </Link>


                {/* NAVIGATION */}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        flexWrap: "wrap",
                        justifyContent: "flex-end"
                    }}
                >

                    <NavLink
                        to="/"
                        label="Home"
                        active={
                            location.pathname === "/"
                        }
                    />

                    <button
                        onClick={goToHotels}
                        style={{
                            ...navButtonStyle,
                            color: "#334155"
                        }}
                    >
                        Hotels
                    </button>

                    <NavLink
                        to="/my-bookings"
                        label="My Bookings"
                        active={
                            location.pathname ===
                            "/my-bookings"
                        }
                    />

                    <NavLink
                        to="/login"
                        label="Login"
                        active={
                            location.pathname ===
                            "/login"
                        }
                    />

                    <Link
                        to="/register"
                        style={{
                            textDecoration: "none",
                            padding: "11px 20px",
                            borderRadius: "9px",
                            background:
                                "linear-gradient(135deg, #2563eb, #1d4ed8)",
                            color: "white",
                            fontSize: "15px",
                            fontWeight: "bold",
                            marginLeft: "4px",
                            boxShadow:
                                "0 4px 10px rgba(37,99,235,0.22)"
                        }}
                    >
                        Register
                    </Link>

                </div>

            </div>
        </nav>
    );
}


// =====================================================
// NAV LINK
// =====================================================

function NavLink({
    to,
    label,
    active
}) {
    return (
        <Link
            to={to}
            style={{
                textDecoration: "none",
                padding: "10px 14px",
                borderRadius: "8px",
                color: active
                    ? "#2563eb"
                    : "#334155",
                backgroundColor: active
                    ? "#eff6ff"
                    : "transparent",
                fontSize: "15px",
                fontWeight: active
                    ? "700"
                    : "500"
            }}
        >
            {label}
        </Link>
    );
}


// =====================================================
// NAV BUTTON
// =====================================================

const navButtonStyle = {
    border: "none",
    background: "transparent",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer"
};

export default Navbar;