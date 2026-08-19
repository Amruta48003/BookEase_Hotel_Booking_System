
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            console.log(
                "LOGIN RESPONSE:",
                data
            );

            console.log(
                "LOGIN USER:",
                data.user
            );

            console.log(
                "LOGIN ROLE:",
                data.user?.role
            );

            if (!response.ok) {
                alert(
                    data.message ||
                    "Login failed"
                );

                return;
            }

            // =================================================
            // CHECK USER
            // =================================================

            if (!data.user) {
                alert(
                    "User information was not returned by server."
                );

                return;
            }

            // =================================================
            // SAVE USER
            // =================================================

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            console.log(
                "SAVED USER:",
                JSON.parse(
                    localStorage.getItem("user")
                )
            );

            alert(
                "Login successful!"
            );

            // =================================================
            // ADMIN LOGIN
            // =================================================

            if (
                data.user.role === "admin"
            ) {

                console.log(
                    "REDIRECTING TO ADMIN"
                );

                window.location.href =
                    "/admin";

                return;
            }

            // =================================================
            // CUSTOMER LOGIN
            // =================================================

            console.log(
                "REDIRECTING TO CUSTOMER"
            );

            window.location.href =
                "/";

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            alert(
                "Cannot connect to backend"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div
            style={styles.page}
        >

            <div
                style={styles.loginContainer}
            >

                {/* =================================================
                    LEFT IMAGE SECTION
                ================================================= */}

                <div
                    style={styles.imageSection}
                >

                    <div
                        style={styles.overlay}
                    >

                        <div>

                            <div
                                style={
                                    styles.brandIcon
                                }
                            >
                                🏨
                            </div>

                            <h1
                                style={
                                    styles.brandTitle
                                }
                            >
                                BookEase
                            </h1>

                            <p
                                style={
                                    styles.brandSubtitle
                                }
                            >
                                Your perfect stay
                                starts here.
                            </p>

                            <div
                                style={
                                    styles.featureList
                                }
                            >

                                <div
                                    style={
                                        styles.feature
                                    }
                                >
                                    <span>
                                        ✓
                                    </span>

                                    <span>
                                        Find beautiful
                                        hotels
                                    </span>
                                </div>

                                <div
                                    style={
                                        styles.feature
                                    }
                                >
                                    <span>
                                        ✓
                                    </span>

                                    <span>
                                        Check room
                                        availability
                                    </span>
                                </div>

                                <div
                                    style={
                                        styles.feature
                                    }
                                >
                                    <span>
                                        ✓
                                    </span>

                                    <span>
                                        Secure online
                                        payments
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    RIGHT LOGIN SECTION
                ================================================= */}

                <div
                    style={
                        styles.formSection
                    }
                >

                    <div
                        style={
                            styles.formContainer
                        }
                    >

                        <div
                            style={
                                styles.mobileLogo
                            }
                        >
                            🏨
                        </div>

                        <p
                            style={
                                styles.eyebrow
                            }
                        >
                            WELCOME BACK
                        </p>

                        <h2
                            style={
                                styles.title
                            }
                        >
                            Sign in to BookEase
                        </h2>

                        <p
                            style={
                                styles.subtitle
                            }
                        >
                            Enter your details to
                            continue your journey.
                        </p>


                        <form
                            onSubmit={
                                handleLogin
                            }
                        >

                            {/* EMAIL */}

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
                                    Email Address
                                </label>

                                <div
                                    style={
                                        styles.inputWrapper
                                    }
                                >

                                    <span
                                        style={
                                            styles.inputIcon
                                        }
                                    >
                                        ✉️
                                    </span>

                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={
                                            email
                                        }
                                        onChange={(e) =>
                                            setEmail(
                                                e.target.value
                                            )
                                        }
                                        required
                                        style={
                                            styles.input
                                        }
                                    />

                                </div>

                            </div>


                            {/* PASSWORD */}

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
                                    Password
                                </label>

                                <div
                                    style={
                                        styles.inputWrapper
                                    }
                                >

                                    <span
                                        style={
                                            styles.inputIcon
                                        }
                                    >
                                        🔒
                                    </span>

                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        value={
                                            password
                                        }
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        required
                                        style={
                                            styles.input
                                        }
                                    />

                                </div>

                            </div>


                            {/* LOGIN BUTTON */}

                            <button
                                type="submit"
                                disabled={
                                    loading
                                }
                                style={{
                                    ...styles.loginButton,
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
                                    ? "Signing in..."
                                    : "Login →"}
                            </button>

                        </form>


                        {/* REGISTER */}

                        <div
                            style={
                                styles.registerText
                            }
                        >

                            Don't have an account?

                            <button
                                onClick={() =>
                                    navigate(
                                        "/register"
                                    )
                                }
                                style={
                                    styles.registerButton
                                }
                            >
                                Create Account
                            </button>

                        </div>


                        {/* BACK HOME */}

                        <button
                            onClick={() =>
                                navigate("/")
                            }
                            style={
                                styles.homeButton
                            }
                        >
                            ← Back to Home
                        </button>

                    </div>

                </div>

            </div>

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
            "30px",

        boxSizing:
            "border-box",

        background:
            "linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%)",

        display:
            "flex",

        alignItems:
            "center",

        justifyContent:
            "center",

        fontFamily:
            "Arial, Helvetica, sans-serif"
    },

    loginContainer: {
        width:
            "100%",

        maxWidth:
            "1050px",

        minHeight:
            "650px",

        backgroundColor:
            "white",

        borderRadius:
            "22px",

        overflow:
            "hidden",

        display:
            "grid",

        gridTemplateColumns:
            "1fr 1fr",

        boxShadow:
            "0 20px 60px rgba(15,23,42,0.15)",

        border:
            "1px solid #e2e8f0"
    },

    imageSection: {
        minHeight:
            "650px",

        backgroundImage:
            "linear-gradient(rgba(15,23,42,0.35), rgba(15,23,42,0.65)), url('/images/hotel-banner.jpg')",

        backgroundSize:
            "cover",

        backgroundPosition:
            "center",

        position:
            "relative"
    },

    overlay: {
        position:
            "absolute",

        inset:
            0,

        padding:
            "55px",

        display:
            "flex",

        alignItems:
            "flex-end",

        color:
            "white"
    },

    brandIcon: {
        width:
            "58px",

        height:
            "58px",

        borderRadius:
            "16px",

        background:
            "rgba(255,255,255,0.18)",

        backdropFilter:
            "blur(8px)",

        display:
            "flex",

        alignItems:
            "center",

        justifyContent:
            "center",

        fontSize:
            "28px",

        marginBottom:
            "15px"
    },

    brandTitle: {
        fontSize:
            "48px",

        margin:
            "0 0 8px",

        fontWeight:
            "800"
    },

    brandSubtitle: {
        fontSize:
            "19px",

        margin:
            "0 0 30px",

        opacity:
            0.95
    },

    featureList: {
        display:
            "flex",

        flexDirection:
            "column",

        gap:
            "14px"
    },

    feature: {
        display:
            "flex",

        alignItems:
            "center",

        gap:
            "10px",

        fontSize:
            "15px"
    },

    formSection: {
        padding:
            "50px",

        display:
            "flex",

        alignItems:
            "center",

        backgroundColor:
            "white"
    },

    formContainer: {
        width:
            "100%",

        maxWidth:
            "430px",

        margin:
            "0 auto"
    },

    mobileLogo: {
        width:
            "48px",

        height:
            "48px",

        borderRadius:
            "13px",

        background:
            "linear-gradient(135deg, #2563eb, #4f46e5)",

        display:
            "flex",

        alignItems:
            "center",

        justifyContent:
            "center",

        fontSize:
            "23px",

        marginBottom:
            "22px"
    },

    eyebrow: {
        margin:
            "0 0 8px",

        color:
            "#2563eb",

        fontSize:
            "12px",

        fontWeight:
            "bold",

        letterSpacing:
            "2px"
    },

    title: {
        margin:
            "0 0 10px",

        color:
            "#0f172a",

        fontSize:
            "32px"
    },

    subtitle: {
        margin:
            "0 0 30px",

        color:
            "#64748b",

        lineHeight:
            "1.6",

        fontSize:
            "15px"
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
            "bold",

        fontSize:
            "14px"
    },

    inputWrapper: {
        position:
            "relative"
    },

    inputIcon: {
        position:
            "absolute",

        left:
            "14px",

        top:
            "50%",

        transform:
            "translateY(-50%)",

        fontSize:
            "16px"
    },

    input: {
        width:
            "100%",

        padding:
            "14px 14px 14px 45px",

        boxSizing:
            "border-box",

        border:
            "1px solid #cbd5e1",

        borderRadius:
            "10px",

        fontSize:
            "15px",

        outline:
            "none",

        backgroundColor:
            "#f8fafc"
    },

    loginButton: {
        width:
            "100%",

        marginTop:
            "8px",

        padding:
            "14px",

        border:
            "none",

        borderRadius:
            "10px",

        background:
            "linear-gradient(135deg, #2563eb, #4f46e5)",

        color:
            "white",

        fontSize:
            "16px",

        fontWeight:
            "bold",

        boxShadow:
            "0 7px 16px rgba(37,99,235,0.25)"
    },

    registerText: {
        marginTop:
            "25px",

        textAlign:
            "center",

        color:
            "#64748b",

        fontSize:
            "14px"
    },

    registerButton: {
        border:
            "none",

        background:
            "transparent",

        color:
            "#2563eb",

        fontWeight:
            "bold",

        cursor:
            "pointer",

        marginLeft:
            "5px",

        fontSize:
            "14px"
    },

    homeButton: {
        display:
            "block",

        margin:
            "20px auto 0",

        border:
            "none",

        background:
            "transparent",

        color:
            "#64748b",

        cursor:
            "pointer",

        fontSize:
            "14px"
    },

    errorCard: {
        padding:
            "40px"
    }
};

export default Login;

