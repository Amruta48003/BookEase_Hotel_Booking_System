
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {

    const navigate = useNavigate();

    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [phone, setPhone] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const registerUser = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/register",
                    {
                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                name:
                                    name,

                                email:
                                    email,

                                phone:
                                    phone,

                                password:
                                    password
                            })
                    }
                );

            const data =
                await response.json();

            console.log(
                "REGISTER RESPONSE:",
                data
            );

            if (response.ok) {

                alert(
                    "Registration successful!"
                );

                navigate(
                    "/login"
                );

            } else {

                alert(
                    data.message ||
                    "Registration failed"
                );
            }

        } catch (error) {

            console.error(
                "Registration error:",
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
            style={
                styles.page
            }
        >

            <div
                style={
                    styles.registerContainer
                }
            >

                {/* =================================================
                    LEFT IMAGE SECTION
                ================================================= */}

                <div
                    style={
                        styles.imageSection
                    }
                >

                    <div
                        style={
                            styles.overlay
                        }
                    >

                        <div>

                            <div
                                style={
                                    styles.brandIcon
                                }
                            >
                                🏨
                            </div>

                            <p
                                style={
                                    styles.brandSmall
                                }
                            >
                                WELCOME TO
                            </p>

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
                                Create your account and
                                start discovering your
                                perfect stay.
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
                                        Discover beautiful
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
                                        Enjoy secure
                                        booking and payment
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    RIGHT REGISTER FORM
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
                            GET STARTED
                        </p>

                        <h2
                            style={
                                styles.title
                            }
                        >
                            Create Your Account
                        </h2>

                        <p
                            style={
                                styles.subtitle
                            }
                        >
                            Join BookEase and start
                            planning your next stay.
                        </p>


                        <form
                            onSubmit={
                                registerUser
                            }
                        >

                            {/* NAME */}

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
                                    Full Name
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
                                        👤
                                    </span>

                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={
                                            name
                                        }
                                        onChange={(e) =>
                                            setName(
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


                            {/* PHONE */}

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
                                    Phone Number
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
                                        📱
                                    </span>

                                    <input
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        value={
                                            phone
                                        }
                                        onChange={(e) =>
                                            setPhone(
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
                                        placeholder="Create a password"
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


                            {/* REGISTER BUTTON */}

                            <button
                                type="submit"
                                disabled={
                                    loading
                                }
                                style={{
                                    ...styles.registerButton,
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
                                    ? "Creating Account..."
                                    : "Create Account →"}
                            </button>

                        </form>


                        {/* LOGIN */}

                        <div
                            style={
                                styles.loginText
                            }
                        >

                            Already have an account?

                            <button
                                onClick={() =>
                                    navigate(
                                        "/login"
                                    )
                                }
                                style={
                                    styles.loginButton
                                }
                            >
                                Sign In
                            </button>

                        </div>


                        {/* HOME */}

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

    registerContainer: {
        width:
            "100%",

        maxWidth:
            "1080px",

        minHeight:
            "700px",

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
            "700px",

        backgroundImage:
            "linear-gradient(rgba(15,23,42,0.35), rgba(15,23,42,0.68)), url('/images/hotel-banner.jpg')",

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
            "18px"
    },

    brandSmall: {
        margin:
            "0 0 5px",

        fontSize:
            "12px",

        fontWeight:
            "bold",

        letterSpacing:
            "2px",

        opacity:
            0.9
    },

    brandTitle: {
        fontSize:
            "48px",

        margin:
            "0 0 12px",

        fontWeight:
            "800"
    },

    brandSubtitle: {
        fontSize:
            "18px",

        lineHeight:
            "1.6",

        maxWidth:
            "430px",

        margin:
            "0 0 32px",

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
            "440px",

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
            "31px",

        lineHeight:
            "1.2"
    },

    subtitle: {
        margin:
            "0 0 28px",

        color:
            "#64748b",

        lineHeight:
            "1.6",

        fontSize:
            "15px"
    },

    field: {
        marginBottom:
            "17px"
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
            "13px 14px 13px 45px",

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

    registerButton: {
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

    loginText: {
        marginTop:
            "22px",

        textAlign:
            "center",

        color:
            "#64748b",

        fontSize:
            "14px"
    },

    loginButton: {
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
            "18px auto 0",

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
    }
};

export default Register;

