
import React, { useEffect, useState } from "react";

function AdminDashboard() {

    // =====================================================
    // STATES
    // =====================================================

    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState("dashboard");

    const [showHotelForm, setShowHotelForm] = useState(false);
    const [showRoomForm, setShowRoomForm] = useState(false);

    const [editingHotel, setEditingHotel] = useState(null);

    // =====================================================
    // BOOKING SEARCH + FILTER
    // =====================================================

    const [bookingSearch, setBookingSearch] = useState("");
    const [bookingFilter, setBookingFilter] = useState("all");

    // =====================================================
    // BOOKING COUNTS
    // =====================================================

    const confirmedBookings = bookings.filter(
        (booking) =>
            String(booking.booking_status || "").toLowerCase() ===
            "confirmed"
    ).length;

    const cancelledBookings = bookings.filter(
        (booking) =>
            String(booking.booking_status || "").toLowerCase() ===
            "cancelled"
    ).length;

    const pendingBookings = bookings.filter(
        (booking) =>
            String(booking.booking_status || "").toLowerCase() ===
            "pending"
    ).length;

    const completedBookings = bookings.filter(
        (booking) =>
            String(booking.booking_status || "").toLowerCase() ===
            "completed"
    ).length;

    const paidBookings = bookings.filter(
    (booking) =>
        String(
            booking.payment_status || ""
        ).toLowerCase() === "paid"
).length;

const pendingPayments = bookings.filter(
    (booking) =>
        String(
            booking.payment_status || ""
        ).toLowerCase() === "pending"
).length;

const failedPayments = bookings.filter(
    (booking) =>
        String(
            booking.payment_status || ""
        ).toLowerCase() === "failed"
).length;

const totalRevenue = bookings
    .filter(
        (booking) =>
            String(
                booking.payment_status || ""
            ).toLowerCase() === "paid"
    )
    .reduce(
        (total, booking) =>
            total +
            Number(
                booking.total_amount || 0
            ),
        0
    );
    // =====================================================
    // FILTERED BOOKINGS
    // =====================================================

    const filteredBookings = bookings.filter((booking) => {

        const search =
            bookingSearch.toLowerCase().trim();

        const customerName =
            booking.customer_name ||
            booking.name ||
            booking.username ||
            booking.user_name ||
            "";

        const customerEmail =
            booking.customer_email ||
            booking.email ||
            "";

        const customerPhone =
            booking.customer_phone ||
            booking.phone ||
            booking.contact_number ||
            "";

        const hotelName =
            booking.hotel_name || "";

        const hotelLocation =
            booking.location ||
            booking.hotel_location ||
            "";

        const roomNumber =
            booking.room_number || "";

        const roomType =
            booking.room_type || "";

        const bookingId =
            booking.id || "";

        const userId =
            booking.user_id || "";

        const paymentMethod =
            booking.payment_method || "";

        const paymentStatus =
            booking.payment_status || "";

        const paymentId =
            booking.payment_id || "";

        const matchesSearch =
            search === "" ||
            String(bookingId)
                .toLowerCase()
                .includes(search) ||
            String(userId)
                .toLowerCase()
                .includes(search) ||
            String(customerName)
                .toLowerCase()
                .includes(search) ||
            String(customerEmail)
                .toLowerCase()
                .includes(search) ||
            String(customerPhone)
                .toLowerCase()
                .includes(search) ||
            String(hotelName)
                .toLowerCase()
                .includes(search) ||
            String(hotelLocation)
                .toLowerCase()
                .includes(search) ||
            String(roomNumber)
                .toLowerCase()
                .includes(search) ||
            String(roomType)
                .toLowerCase()
                .includes(search) ||
            String(paymentMethod)
                .toLowerCase()
                .includes(search) ||
            String(paymentStatus)
                .toLowerCase()
                .includes(search) ||
            String(paymentId)
                .toLowerCase()
                .includes(search);

        const status =
            String(
                booking.booking_status || ""
            ).toLowerCase();

        const matchesFilter =
            bookingFilter === "all" ||
            status === bookingFilter;

        return (
            matchesSearch &&
            matchesFilter
        );
    });

    // =====================================================
    // EMPTY HOTEL
    // =====================================================

    const emptyHotel = {
        hotel_name: "",
        location: "",
        description: "",
        address: "",
        contact_number: "",
        email: "",
        rating: "",
        image: ""
    };

    const [hotelData, setHotelData] =
        useState(emptyHotel);

    // =====================================================
    // EMPTY ROOM
    // =====================================================

    const emptyRoom = {
        hotel_id: "",
        room_number: "",
        room_type: "",
        price: "",
        capacity: "",
        description: "",
        image: "",
        status: "available"
    };

    const [roomData, setRoomData] =
        useState(emptyRoom);

    // =====================================================
    // GET ADMIN USER
    // =====================================================

    const getAdminUser = () => {

        try {

            const storedUser =
                localStorage.getItem("user");

            if (!storedUser) {
                return null;
            }

            return JSON.parse(storedUser);

        } catch (error) {

            console.error(
                "Invalid user data:",
                error
            );

            return null;
        }
    };

    // =====================================================
    // ADMIN LOGOUT
    // =====================================================

    const adminLogout = () => {

        const confirmLogout =
            window.confirm(
                "Are you sure you want to logout?"
            );

        if (!confirmLogout) {
            return;
        }

        localStorage.removeItem("user");

        window.location.href =
            "/login";
    };

    // =====================================================
    // ADMIN HEADERS
    // =====================================================

    const getAdminHeaders = () => {

        const adminUser =
            getAdminUser();

        if (
            !adminUser ||
            !adminUser.id
        ) {
            return {};
        }

        return {
            "user-id":
                String(adminUser.id)
        };
    };

    // =====================================================
    // LOAD DATA
    // =====================================================

    const loadData = async () => {

        try {

            setLoading(true);

            const loggedInUser =
                getAdminUser();

            if (
                !loggedInUser ||
                !loggedInUser.id
            ) {

                alert(
                    "Please login again."
                );

                window.location.href =
                    "/login";

                return;
            }

            if (
                loggedInUser.role !==
                "admin"
            ) {

                alert(
                    "Access denied. Admin only."
                );

                window.location.href =
                    "/";

                return;
            }

            const adminHeaders =
                getAdminHeaders();

            // =================================================
            // USERS
            // =================================================

            const usersResponse =
                await fetch(
                    "http://localhost:5000/api/admin/users",
                    {
                        headers:
                            adminHeaders
                    }
                );

            const usersData =
                await usersResponse.json();

            console.log(
                "Users API response:",
                usersData
            );

            if (!usersResponse.ok) {

                throw new Error(
                    usersData.message ||
                    "Failed to load users"
                );
            }

            if (
                Array.isArray(
                    usersData
                )
            ) {

                setUsers(
                    usersData
                );

            } else if (
                usersData &&
                Array.isArray(
                    usersData.users
                )
            ) {

                setUsers(
                    usersData.users
                );

            } else {

                setUsers([]);
            }

            // =================================================
            // BOOKINGS
            // =================================================

            const bookingsResponse =
                await fetch(
                    "http://localhost:5000/api/admin/bookings",
                    {
                        headers:
                            adminHeaders
                    }
                );

            const bookingsData =
                await bookingsResponse.json();

            console.log(
                "Bookings API response:",
                bookingsData
            );

            if (
                !bookingsResponse.ok
            ) {

                throw new Error(
                    bookingsData.message ||
                    "Failed to load bookings"
                );
            }

            if (
                Array.isArray(
                    bookingsData
                )
            ) {

                setBookings(
                    bookingsData
                );

            } else if (
                bookingsData &&
                Array.isArray(
                    bookingsData.bookings
                )
            ) {

                setBookings(
                    bookingsData.bookings
                );

            } else {

                setBookings([]);
            }

            // =================================================
            // HOTELS
            // =================================================

            const hotelsResponse =
                await fetch(
                    "http://localhost:5000/api/hotels"
                );

            const hotelsData =
                await hotelsResponse.json();

            console.log(
                "Hotels API response:",
                hotelsData
            );

            if (
                Array.isArray(
                    hotelsData
                )
            ) {

                setHotels(
                    hotelsData
                );

            } else if (
                hotelsData &&
                Array.isArray(
                    hotelsData.hotels
                )
            ) {

                setHotels(
                    hotelsData.hotels
                );

            } else {

                setHotels([]);
            }

            // =================================================
            // ROOMS
            // =================================================

            const roomsResponse =
                await fetch(
                    "http://localhost:5000/api/admin/rooms",
                    {
                        headers:
                            adminHeaders
                    }
                );

            const roomsData =
                await roomsResponse.json();

            console.log(
                "Rooms API response:",
                roomsData
            );

            if (!roomsResponse.ok) {

                throw new Error(
                    roomsData.message ||
                    "Failed to load rooms"
                );
            }

            if (
                Array.isArray(
                    roomsData
                )
            ) {

                setRooms(
                    roomsData
                );

            } else if (
                roomsData &&
                Array.isArray(
                    roomsData.rooms
                )
            ) {

                setRooms(
                    roomsData.rooms
                );

            } else {

                setRooms([]);
            }

        } catch (error) {

            console.error(
                "Admin dashboard error:",
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
    // LOAD DATA WHEN PAGE OPENS
    // =====================================================

    useEffect(() => {

        loadData();

    }, []);

    // =====================================================
    // ADD HOTEL
    // =====================================================

    const addHotel = async (e) => {

        e.preventDefault();

        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/admin/hotels",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            ...getAdminHeaders()
                        },

                        body:
                            JSON.stringify(
                                hotelData
                            )
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Hotel could not be added"
                );

                return;
            }

            alert(
                "Hotel added successfully!"
            );

            setHotelData(
                emptyHotel
            );

            setEditingHotel(
                null
            );

            setShowHotelForm(
                false
            );

            await loadData();

        } catch (error) {

            console.error(
                "Add hotel error:",
                error
            );

            alert(
                "Cannot connect to backend"
            );
        }
    };

    // =====================================================
    // EDIT HOTEL
    // =====================================================

    const editHotel = (hotel) => {

        setEditingHotel(
            hotel
        );

        setHotelData({

            hotel_name:
                hotel.hotel_name ||
                "",

            location:
                hotel.location ||
                "",

            description:
                hotel.description ||
                "",

            address:
                hotel.address ||
                "",

            contact_number:
                hotel.contact_number ||
                "",

            email:
                hotel.email ||
                "",

            rating:
                hotel.rating ||
                "",

            image:
                hotel.image ||
                ""

        });

        setShowHotelForm(
            true
        );

        setShowRoomForm(
            false
        );

        setActiveSection(
            "hotels"
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =====================================================
    // UPDATE HOTEL
    // =====================================================

    const updateHotel = async (e) => {

        e.preventDefault();

        if (!editingHotel) {

            alert(
                "No hotel selected."
            );

            return;
        }

        try {

            const response =
                await fetch(
                    `http://localhost:5000/api/admin/hotels/${editingHotel.id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            ...getAdminHeaders()
                        },

                        body:
                            JSON.stringify(
                                hotelData
                            )
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Hotel could not be updated"
                );

                return;
            }

            alert(
                "Hotel updated successfully!"
            );

            setHotelData(
                emptyHotel
            );

            setEditingHotel(
                null
            );

            setShowHotelForm(
                false
            );

            await loadData();

        } catch (error) {

            console.error(
                "Update hotel error:",
                error
            );

            alert(
                "Cannot connect to backend"
            );
        }
    };

    // =====================================================
    // DELETE HOTEL
    // =====================================================

    const deleteHotel = async (
        hotelId
    ) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this hotel?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            const response =
                await fetch(
                    `http://localhost:5000/api/admin/hotels/${hotelId}`,
                    {
                        method: "DELETE",

                        headers:
                            getAdminHeaders()
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Hotel could not be deleted"
                );

                return;
            }

            alert(
                "Hotel deleted successfully!"
            );

            setHotels(
                previousHotels =>
                    previousHotels.filter(
                        hotel =>
                            hotel.id !==
                            hotelId
                    )
            );

        } catch (error) {

            console.error(
                "Delete hotel error:",
                error
            );

            alert(
                "Cannot connect to backend"
            );
        }
    };

    // =====================================================
    // ADD ROOM
    // =====================================================

    const addRoom = async (e) => {

        e.preventDefault();

        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/admin/rooms",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            ...getAdminHeaders()
                        },

                        body:
                            JSON.stringify({

                                hotel_id:
                                    Number(
                                        roomData.hotel_id
                                    ),

                                room_number:
                                    roomData.room_number,

                                room_type:
                                    roomData.room_type,

                                price:
                                    Number(
                                        roomData.price
                                    ),

                                capacity:
                                    Number(
                                        roomData.capacity
                                    ),

                                description:
                                    roomData.description,

                                image:
                                    roomData.image,

                                status:
                                    roomData.status

                            })
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Room could not be added"
                );

                return;
            }

            alert(
                "Room added successfully!"
            );

            setRoomData(
                emptyRoom
            );

            setShowRoomForm(
                false
            );

            await loadData();

        } catch (error) {

            console.error(
                "Add room error:",
                error
            );

            alert(
                "Cannot connect to backend"
            );
        }
    };

    // =====================================================
    // EDIT ROOM
    // =====================================================

    const editRoom = async (
        room
    ) => {

        const roomNumber =
            window.prompt(
                "Enter room number:",
                room.room_number ||
                ""
            );

        if (
            roomNumber === null
        ) {
            return;
        }

        const roomType =
            window.prompt(
                "Enter room type:",
                room.room_type ||
                ""
            );

        if (
            roomType === null
        ) {
            return;
        }

        const price =
            window.prompt(
                "Enter room price:",
                room.price ||
                ""
            );

        if (
            price === null
        ) {
            return;
        }

        const capacity =
            window.prompt(
                "Enter room capacity:",
                room.capacity ||
                ""
            );

        if (
            capacity === null
        ) {
            return;
        }

        const description =
            window.prompt(
                "Enter room description:",
                room.description ||
                ""
            );

        if (
            description === null
        ) {
            return;
        }

        const status =
            window.prompt(
                "Enter status (available/booked):",
                room.status ||
                "available"
            );

        if (
            status === null
        ) {
            return;
        }

        try {

            const response =
                await fetch(
                    `http://localhost:5000/api/admin/rooms/${room.id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            ...getAdminHeaders()
                        },

                        body:
                            JSON.stringify({

                                hotel_id:
                                    Number(
                                        room.hotel_id
                                    ),

                                room_number:
                                    roomNumber,

                                room_type:
                                    roomType,

                                price:
                                    Number(
                                        price
                                    ),

                                capacity:
                                    Number(
                                        capacity
                                    ),

                                description:
                                    description,

                                image:
                                    room.image ||
                                    "",

                                status:
                                    status

                            })
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Room could not be updated"
                );

                return;
            }

            alert(
                "Room updated successfully!"
            );

            await loadData();

        } catch (error) {

            console.error(
                "Edit room error:",
                error
            );

            alert(
                "Cannot connect to backend"
            );
        }
    };

    // =====================================================
    // DELETE ROOM
    // =====================================================

    const deleteRoom = async (
        roomId
    ) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this room?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            const response =
                await fetch(
                    `http://localhost:5000/api/admin/rooms/${roomId}`,
                    {
                        method: "DELETE",

                        headers:
                            getAdminHeaders()
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Room could not be deleted"
                );

                return;
            }

            alert(
                "Room deleted successfully!"
            );

            setRooms(
                previousRooms =>
                    previousRooms.filter(
                        room =>
                            room.id !==
                            roomId
                    )
            );

        } catch (error) {

            console.error(
                "Delete room error:",
                error
            );

            alert(
                "Cannot connect to backend"
            );
        }
    };

    // =====================================================
    // UPDATE BOOKING STATUS
    // =====================================================

    const updateBookingStatus =
        async (
            bookingId,
            status
        ) => {

            try {

                const response =
                    await fetch(
                        `http://localhost:5000/api/admin/bookings/${bookingId}/status`,
                        {
                            method:
                                "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                ...getAdminHeaders()
                            },

                            body:
                                JSON.stringify({
                                    status:
                                        status
                                })
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    alert(
                        data.message ||
                        "Status could not be updated"
                    );

                    return;
                }

                alert(
                    `Booking ${status} successfully!`
                );

                setBookings(
                    previousBookings =>
                        previousBookings.map(
                            booking =>
                                booking.id ===
                                bookingId
                                    ? {
                                          ...booking,
                                          booking_status:
                                              status
                                      }
                                    : booking
                        )
                );

            } catch (error) {

                console.error(
                    "Status update error:",
                    error
                );

                alert(
                    "Cannot connect to backend"
                );
            }
        };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div
                style={
                    loadingStyle
                }
            >

                <div
                    style={
                        loadingSpinnerStyle
                    }
                >
                    ⏳
                </div>

                <h2>
                    Loading Admin Dashboard...
                </h2>

                <p>
                    Please wait...
                </p>

            </div>
        );
    }

    // =====================================================
    // DASHBOARD
    // =====================================================

    return (

        <div
            style={
                dashboardWrapper
            }
        >

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside
                style={
                    sidebarStyle
                }
            >

                <div
                    style={
                        logoContainerStyle
                    }
                >

                    <div
                        style={
                            logoIconStyle
                        }
                    >
                        🏨
                    </div>

                    <div>

                        <h2
                            style={{
                                margin:
                                    "0",
                                fontSize:
                                    "22px"
                            }}
                        >
                            BookEase
                        </h2>

                        <span
                            style={{
                                fontSize:
                                    "12px",
                                opacity:
                                    "0.7"
                            }}
                        >
                            ADMIN PANEL
                        </span>

                    </div>

                </div>

                <div
                    style={
                        sidebarMenuStyle
                    }
                >

                    <SidebarButton
                        icon="📊"
                        text="Dashboard"
                        active={
                            activeSection ===
                            "dashboard"
                        }
                        onClick={() =>
                            setActiveSection(
                                "dashboard"
                            )
                        }
                    />

                    <SidebarButton
                        icon="👥"
                        text="Users"
                        active={
                            activeSection ===
                            "users"
                        }
                        onClick={() =>
                            setActiveSection(
                                "users"
                            )
                        }
                    />

                    <SidebarButton
                        icon="🏨"
                        text="Hotels"
                        active={
                            activeSection ===
                            "hotels"
                        }
                        onClick={() =>
                            setActiveSection(
                                "hotels"
                            )
                        }
                    />

                    <SidebarButton
                        icon="🛏️"
                        text="Rooms"
                        active={
                            activeSection ===
                            "rooms"
                        }
                        onClick={() =>
                            setActiveSection(
                                "rooms"
                            )
                        }
                    />

                    <SidebarButton
                        icon="📋"
                        text="Bookings"
                        active={
                            activeSection ===
                            "bookings"
                        }
                        onClick={() =>
                            setActiveSection(
                                "bookings"
                            )
                        }
                    />

                </div>

                <div
                    style={
                        sidebarBottomStyle
                    }
                >

                    <div
                        style={{
                            fontSize:
                                "13px",
                            opacity:
                                "0.7",
                            marginBottom:
                                "12px"
                        }}
                    >
                        Logged in as
                    </div>

                    <div
                        style={{
                            fontWeight:
                                "bold",
                            marginBottom:
                                "15px"
                        }}
                    >
                        {getAdminUser()
                            ?.name ||
                            "Administrator"}
                    </div>

                    <button
                        onClick={
                            adminLogout
                        }
                        style={
                            logoutButtonStyle
                        }
                    >
                        🚪 Logout
                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main
                style={
                    mainContentStyle
                }
            >

                {/* TOP HEADER */}

                <div
                    style={
                        topHeaderStyle
                    }
                >

                    <div>

                        <h1
                            style={{
                                margin:
                                    "0 0 6px",
                                fontSize:
                                    "28px"
                            }}
                        >
                            {activeSection ===
                            "dashboard"
                                ? "Dashboard"
                                : activeSection
                                      .charAt(0)
                                      .toUpperCase() +
                                  activeSection.slice(
                                      1
                                  )}
                        </h1>

                        <p
                            style={{
                                margin:
                                    "0",
                                color:
                                    "#6b7280"
                            }}
                        >
                            Welcome back,{" "}
                            <strong>
                                {getAdminUser()
                                    ?.name ||
                                    "Admin"}
                            </strong>
                            !
                        </p>

                    </div>

                    <div
                        style={
                            adminProfileStyle
                        }
                    >

                        <div
                            style={
                                profileIconStyle
                            }
                        >
                            👤
                        </div>

                        <div>

                            <strong>
                                Admin
                            </strong>

                            <small
                                style={{
                                    display:
                                        "block",
                                    color:
                                        "#6b7280"
                                }}
                            >
                                Administrator
                            </small>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    DASHBOARD
                ================================================= */}

                {activeSection ===
                    "dashboard" && (

                    <>

                        <div
                            style={
                                statsGridStyle
                            }
                        >

                            <StatCard
                                icon="👥"
                                title="Total Users"
                                value={
                                    users.length
                                }
                            />

                            <StatCard
                                icon="🏨"
                                title="Total Hotels"
                                value={
                                    hotels.length
                                }
                            />

                            <StatCard
                                icon="🛏️"
                                title="Total Rooms"
                                value={
                                    rooms.length
                                }
                            />

                            <StatCard
                                icon="📋"
                                title="Total Bookings"
                                value={
                                    bookings.length
                                }
                            />

                            <StatCard
                                icon="✅"
                                title="Confirmed"
                                value={
                                    confirmedBookings
                                }
                                accent="#16a34a"
                            />

                            <StatCard
                                icon="⏳"
                                title="Pending"
                                value={
                                    pendingBookings
                                }
                                accent="#d97706"
                            />

                            <StatCard
                                icon="❌"
                                title="Cancelled"
                                value={
                                    cancelledBookings
                                }
                                accent="#dc2626"
                            />

                            <StatCard
                                icon="🎉"
                                title="Completed"
                                value={
                                    completedBookings
                                }
                                accent="#7c3aed"
                            />
                            <StatCard
    icon="💰"
    title="Total Revenue"
    value={`₹${totalRevenue.toFixed(2)}`}
    accent="#059669"
/>

<StatCard
    icon="💳"
    title="Paid Bookings"
    value={paidBookings}
    accent="#16a34a"
/>

<StatCard
    icon="⏳"
    title="Pending Payments"
    value={pendingPayments}
    accent="#d97706"
/>

<StatCard
    icon="❌"
    title="Failed Payments"
    value={failedPayments}
    accent="#dc2626"
/>

                        </div>

                        <div
                            style={
                                quickActionsStyle
                            }
                        >

                            <h2>
                                Quick Actions
                            </h2>

                            <div
                                style={{
                                    display:
                                        "flex",
                                    gap:
                                        "15px",
                                    flexWrap:
                                        "wrap"
                                }}
                            >

                                <button
                                    style={
                                        actionButtonStyle
                                    }
                                    onClick={() =>
                                        setActiveSection(
                                            "hotels"
                                        )
                                    }
                                >
                                    🏨 Manage Hotels
                                </button>

                                <button
                                    style={
                                        actionButtonStyle
                                    }
                                    onClick={() =>
                                        setActiveSection(
                                            "rooms"
                                        )
                                    }
                                >
                                    🛏️ Manage Rooms
                                </button>

                                <button
                                    style={
                                        actionButtonStyle
                                    }
                                    onClick={() =>
                                        setActiveSection(
                                            "bookings"
                                        )
                                    }
                                >
                                    📋 View Bookings
                                </button>

                                <button
                                    style={
                                        actionButtonStyle
                                    }
                                    onClick={() =>
                                        setActiveSection(
                                            "users"
                                        )
                                    }
                                >
                                    👥 View Users
                                </button>

                            </div>

                        </div>

                    </>
                )}


                {/* =================================================
                    USERS
                ================================================= */}
{/* =================================================
    USERS MANAGEMENT
================================================= */}

{activeSection === "users" && (

    <div
        style={{
            backgroundColor: "transparent"
        }}
    >

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div
            style={{
                background:
                    "linear-gradient(135deg, #1d4ed8, #4f46e5)",
                color: "white",
                padding: "30px",
                borderRadius: "18px",
                marginBottom: "25px",
                boxShadow:
                    "0 10px 28px rgba(37,99,235,0.20)"
            }}
        >

            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    gap: "20px",
                    flexWrap: "wrap"
                }}
            >

                <div>

                    <p
                        style={{
                            margin: "0 0 8px",
                            fontSize: "13px",
                            fontWeight: "bold",
                            letterSpacing: "1.5px",
                            opacity: 0.85
                        }}
                    >
                        USER MANAGEMENT
                    </p>

                    <h1
                        style={{
                            margin: "0 0 8px",
                            fontSize: "32px"
                        }}
                    >
                        👥 Users
                    </h1>

                    <p
                        style={{
                            margin: 0,
                            fontSize: "15px",
                            opacity: 0.9
                        }}
                    >
                        Manage registered users and
                        administrators from one place.
                    </p>

                </div>

                <div
                    style={{
                        backgroundColor:
                            "rgba(255,255,255,0.15)",
                        backdropFilter:
                            "blur(8px)",
                        padding: "20px 28px",
                        borderRadius: "15px",
                        textAlign: "center",
                        minWidth: "110px"
                    }}
                >

                    <div
                        style={{
                            fontSize: "30px",
                            fontWeight: "bold"
                        }}
                    >
                        {users.length}
                    </div>

                    <div
                        style={{
                            fontSize: "13px",
                            opacity: 0.9
                        }}
                    >
                        Total Users
                    </div>

                </div>

            </div>

        </div>


        {/* =================================================
            USER STATISTICS
        ================================================= */}

        <div
            style={{
                display: "grid",
                gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "18px",
                marginBottom: "25px"
            }}
        >

            <div
                style={{
                    backgroundColor: "white",
                    padding: "22px",
                    borderRadius: "15px",
                    border:
                        "1px solid #e2e8f0",
                    boxShadow:
                        "0 5px 18px rgba(15,23,42,0.06)"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center"
                    }}
                >

                    <div>

                        <p
                            style={{
                                margin:
                                    "0 0 7px",
                                color:
                                    "#64748b",
                                fontSize:
                                    "13px"
                            }}
                        >
                            TOTAL USERS
                        </p>

                        <h2
                            style={{
                                margin: 0,
                                fontSize: "30px",
                                color:
                                    "#0f172a"
                            }}
                        >
                            {users.length}
                        </h2>

                    </div>

                    <div
                        style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "14px",
                            backgroundColor:
                                "#dbeafe",
                            display:
                                "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            fontSize:
                                "23px"
                        }}
                    >
                        👥
                    </div>

                </div>

            </div>


            <div
                style={{
                    backgroundColor: "white",
                    padding: "22px",
                    borderRadius: "15px",
                    border:
                        "1px solid #e2e8f0",
                    boxShadow:
                        "0 5px 18px rgba(15,23,42,0.06)"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center"
                    }}
                >

                    <div>

                        <p
                            style={{
                                margin:
                                    "0 0 7px",
                                color:
                                    "#64748b",
                                fontSize:
                                    "13px"
                            }}
                        >
                            CUSTOMERS
                        </p>

                        <h2
                            style={{
                                margin: 0,
                                fontSize: "30px",
                                color:
                                    "#0f172a"
                            }}
                        >
                            {
                                users.filter(
                                    user =>
                                        String(
                                            user.role ||
                                            ""
                                        ).toLowerCase() !==
                                        "admin"
                                ).length
                            }
                        </h2>

                    </div>

                    <div
                        style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "14px",
                            backgroundColor:
                                "#dcfce7",
                            display:
                                "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            fontSize:
                                "23px"
                        }}
                    >
                        🧑
                    </div>

                </div>

            </div>


            <div
                style={{
                    backgroundColor: "white",
                    padding: "22px",
                    borderRadius: "15px",
                    border:
                        "1px solid #e2e8f0",
                    boxShadow:
                        "0 5px 18px rgba(15,23,42,0.06)"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center"
                    }}
                >

                    <div>

                        <p
                            style={{
                                margin:
                                    "0 0 7px",
                                color:
                                    "#64748b",
                                fontSize:
                                    "13px"
                            }}
                        >
                            ADMINISTRATORS
                        </p>

                        <h2
                            style={{
                                margin: 0,
                                fontSize: "30px",
                                color:
                                    "#0f172a"
                            }}
                        >
                            {
                                users.filter(
                                    user =>
                                        String(
                                            user.role ||
                                            ""
                                        ).toLowerCase() ===
                                        "admin"
                                ).length
                            }
                        </h2>

                    </div>

                    <div
                        style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "14px",
                            backgroundColor:
                                "#ede9fe",
                            display:
                                "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            fontSize:
                                "23px"
                        }}
                    >
                        🛡️
                    </div>

                </div>

            </div>

        </div>


        {/* =================================================
            USERS TABLE
        ================================================= */}

        <div
            style={{
                backgroundColor: "white",
                borderRadius: "18px",
                padding: "25px",
                border:
                    "1px solid #e2e8f0",
                boxShadow:
                    "0 7px 24px rgba(15,23,42,0.06)"
            }}
        >

            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    gap: "15px",
                    flexWrap: "wrap",
                    marginBottom: "22px"
                }}
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
                        Registered Users
                    </h2>

                    <p
                        style={{
                            margin: 0,
                            color:
                                "#64748b",
                            fontSize:
                                "14px"
                        }}
                    >
                        View all registered users
                        in the system.
                    </p>

                </div>

                <div
                    style={{
                        padding:
                            "8px 14px",
                        borderRadius:
                            "20px",
                        backgroundColor:
                            "#eff6ff",
                        color:
                            "#1d4ed8",
                        fontWeight:
                            "bold",
                        fontSize:
                            "13px"
                    }}
                >
                    {users.length} Users
                </div>

            </div>


            {users.length === 0 ? (

                <EmptyState
                    message="No users found."
                />

            ) : (

                <div
                    style={{
                        overflowX:
                            "auto"
                    }}
                >

                    <table
                        style={{
                            width:
                                "100%",
                            borderCollapse:
                                "separate",
                            borderSpacing:
                                "0",
                            minWidth:
                                "700px"
                        }}
                    >

                        <thead>

                            <tr>

                                <th
                                    style={{
                                        ...thStyle,
                                        borderRadius:
                                            "10px 0 0 0"
                                    }}
                                >
                                    User
                                </th>

                                <th
                                    style={
                                        thStyle
                                    }
                                >
                                    Contact
                                </th>

                                <th
                                    style={
                                        thStyle
                                    }
                                >
                                    Phone
                                </th>

                                <th
                                    style={
                                        thStyle
                                    }
                                >
                                    Role
                                </th>

                                <th
                                    style={{
                                        ...thStyle,
                                        textAlign:
                                            "center",
                                        borderRadius:
                                            "0 10px 0 0"
                                    }}
                                >
                                    User ID
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {users.map(
                                user => {

                                    const isAdmin =
                                        String(
                                            user.role ||
                                            ""
                                        ).toLowerCase() ===
                                        "admin";

                                    return (

                                        <tr
                                            key={
                                                user.id
                                            }
                                        >

                                            {/* USER */}

                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    padding:
                                                        "16px"
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        gap:
                                                            "12px"
                                                    }}
                                                >

                                                    <div
                                                        style={{
                                                            width:
                                                                "42px",
                                                            height:
                                                                "42px",
                                                            borderRadius:
                                                                "50%",
                                                            background:
                                                                isAdmin
                                                                    ? "linear-gradient(135deg, #ddd6fe, #c4b5fd)"
                                                                    : "linear-gradient(135deg, #dbeafe, #bfdbfe)",
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            fontSize:
                                                                "20px"
                                                        }}
                                                    >
                                                        {isAdmin
                                                            ? "🛡️"
                                                            : "👤"}
                                                    </div>

                                                    <div>

                                                        <strong
                                                            style={{
                                                                color:
                                                                    "#0f172a",
                                                                fontSize:
                                                                    "15px"
                                                            }}
                                                        >
                                                            {
                                                                user.name ||
                                                                "Unnamed User"
                                                            }
                                                        </strong>

                                                        <div
                                                            style={{
                                                                color:
                                                                    "#94a3b8",
                                                                fontSize:
                                                                    "12px",
                                                                marginTop:
                                                                    "2px"
                                                            }}
                                                        >
                                                            ID #{user.id}
                                                        </div>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* EMAIL */}

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >

                                                <span
                                                    style={{
                                                        color:
                                                            "#334155"
                                                    }}
                                                >
                                                    {
                                                        user.email ||
                                                        "Not available"
                                                    }
                                                </span>

                                            </td>


                                            {/* PHONE */}

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >

                                                {
                                                    user.phone ||
                                                    "Not available"
                                                }

                                            </td>


                                            {/* ROLE */}

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >

                                                <span
                                                    style={{
                                                        display:
                                                            "inline-flex",
                                                        alignItems:
                                                            "center",
                                                        gap:
                                                            "6px",
                                                        padding:
                                                            "7px 12px",
                                                        borderRadius:
                                                            "20px",
                                                        backgroundColor:
                                                            isAdmin
                                                                ? "#dbeafe"
                                                                : "#f1f5f9",
                                                        color:
                                                            isAdmin
                                                                ? "#1d4ed8"
                                                                : "#475569",
                                                        fontWeight:
                                                            "bold",
                                                        fontSize:
                                                            "12px",
                                                        textTransform:
                                                            "capitalize"
                                                    }}
                                                >

                                                    {isAdmin
                                                        ? "🛡️ Admin"
                                                        : "👤 Customer"}

                                                </span>

                                            </td>


                                            {/* USER ID */}

                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    textAlign:
                                                        "center"
                                                }}
                                            >

                                                <span
                                                    style={{
                                                        display:
                                                            "inline-flex",
                                                        minWidth:
                                                            "35px",
                                                        height:
                                                            "35px",
                                                        padding:
                                                            "0 10px",
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "center",
                                                        borderRadius:
                                                            "20px",
                                                        backgroundColor:
                                                            "#f8fafc",
                                                        color:
                                                            "#334155",
                                                        fontWeight:
                                                            "bold"
                                                    }}
                                                >
                                                    {
                                                        user.id
                                                    }
                                                </span>

                                            </td>

                                        </tr>
                                    );
                                }
                            )}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    </div>

)}




                {/* =================================================
                    HOTELS
                ================================================= */}

                {activeSection ===
                    "hotels" && (

                    <div
                        style={
                            sectionStyle
                        }
                    >

                        <SectionHeader
                            title="Hotel Management"
                            icon="🏨"
                            count={
                                hotels.length
                            }
                        />

                        <button
                            onClick={() => {

                                if (
                                    showHotelForm
                                ) {

                                    setShowHotelForm(
                                        false
                                    );

                                    setEditingHotel(
                                        null
                                    );

                                    setHotelData(
                                        emptyHotel
                                    );

                                } else {

                                    setEditingHotel(
                                        null
                                    );

                                    setHotelData(
                                        emptyHotel
                                    );

                                    setShowHotelForm(
                                        true
                                    );

                                    setShowRoomForm(
                                        false
                                    );
                                }
                            }}
                            style={
                                primaryButtonStyle
                            }
                        >
                            {showHotelForm
                                ? "✕ Close Form"
                                : "＋ Add Hotel"}
                        </button>

                        {showHotelForm && (

                            <form
                                onSubmit={
                                    editingHotel
                                        ? updateHotel
                                        : addHotel
                                }
                                style={
                                    formStyle
                                }
                            >

                                <h3>
                                    {editingHotel
                                        ? "Edit Hotel"
                                        : "Add New Hotel"}
                                </h3>

                                <FormInput
                                    placeholder="Hotel Name"
                                    value={
                                        hotelData.hotel_name
                                    }
                                    onChange={
                                        value =>
                                            setHotelData({
                                                ...hotelData,
                                                hotel_name:
                                                    value
                                            })
                                    }
                                />

                                <FormInput
                                    placeholder="Location"
                                    value={
                                        hotelData.location
                                    }
                                    onChange={
                                        value =>
                                            setHotelData({
                                                ...hotelData,
                                                location:
                                                    value
                                            })
                                    }
                                />

                                <textarea
                                    placeholder="Description"
                                    value={
                                        hotelData.description
                                    }
                                    onChange={e =>
                                        setHotelData({
                                            ...hotelData,
                                            description:
                                                e.target.value
                                        })
                                    }
                                    required
                                    style={{
                                        ...inputStyle,
                                        minHeight:
                                            "100px"
                                    }}
                                />

                                <FormInput
                                    placeholder="Address"
                                    value={
                                        hotelData.address
                                    }
                                    onChange={
                                        value =>
                                            setHotelData({
                                                ...hotelData,
                                                address:
                                                    value
                                            })
                                    }
                                />

                                <FormInput
                                    placeholder="Contact Number"
                                    value={
                                        hotelData.contact_number
                                    }
                                    onChange={
                                        value =>
                                            setHotelData({
                                                ...hotelData,
                                                contact_number:
                                                    value
                                            })
                                    }
                                />

                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={
                                        hotelData.email
                                    }
                                    onChange={e =>
                                        setHotelData({
                                            ...hotelData,
                                            email:
                                                e.target.value
                                        })
                                    }
                                    required
                                    style={
                                        inputStyle
                                    }
                                />

                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="5"
                                    placeholder="Rating (0-5)"
                                    value={
                                        hotelData.rating
                                    }
                                    onChange={e =>
                                        setHotelData({
                                            ...hotelData,
                                            rating:
                                                e.target.value
                                        })
                                    }
                                    style={
                                        inputStyle
                                    }
                                />

                                <FormInput
                                    placeholder="Image URL"
                                    value={
                                        hotelData.image
                                    }
                                    onChange={
                                        value =>
                                            setHotelData({
                                                ...hotelData,
                                                image:
                                                    value
                                            })
                                    }
                                />

                                <button
                                    type="submit"
                                    style={
                                        primaryButtonStyle
                                    }
                                >
                                    {editingHotel
                                        ? "Update Hotel"
                                        : "Add Hotel"}
                                </button>

                            </form>
                        )}

                        <div
                            style={{
                                marginTop:
                                    "25px"
                            }}
                        >

                            {hotels.length ===
                            0 ? (

                                <EmptyState
                                    message="No hotels found."
                                />

                            ) : (

                                hotels.map(
                                    hotel => (

                                        <div
                                            key={
                                                hotel.id
                                            }
                                            style={
                                                itemStyle
                                            }
                                        >

                                            <div
                                                style={
                                                    itemHeaderStyle
                                                }
                                            >

                                                <div>

                                                    <h3
                                                        style={{
                                                            margin:
                                                                "0 0 5px"
                                                        }}
                                                    >
                                                        🏨{" "}
                                                        {
                                                            hotel.hotel_name
                                                        }
                                                    </h3>

                                                    <span
                                                        style={{
                                                            color:
                                                                "#6b7280"
                                                        }}
                                                    >
                                                        📍{" "}
                                                        {
                                                            hotel.location
                                                        }
                                                    </span>

                                                </div>

                                                <span
                                                    style={
                                                        ratingStyle
                                                    }
                                                >
                                                    ⭐{" "}
                                                    {
                                                        hotel.rating ||
                                                        "N/A"
                                                    }
                                                </span>

                                            </div>

                                            <div
                                                style={
                                                    detailsGridStyle
                                                }
                                            >

                                                <p>
                                                    <strong>
                                                        Hotel ID:
                                                    </strong>{" "}
                                                    {
                                                        hotel.id
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Address:
                                                    </strong>{" "}
                                                    {
                                                        hotel.address
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Contact:
                                                    </strong>{" "}
                                                    {
                                                        hotel.contact_number
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Email:
                                                    </strong>{" "}
                                                    {
                                                        hotel.email
                                                    }
                                                </p>

                                            </div>

                                            <p>
                                                <strong>
                                                    Description:
                                                </strong>{" "}
                                                {
                                                    hotel.description
                                                }
                                            </p>
 <div
    style={{
        marginTop: "15px",
        maxWidth: "360px"
    }}
>
    {hotel.image ? (
        <img
            src={`/images/${hotel.image}`}
            alt={hotel.hotel_name}
            style={hotelImageStyle}
        />
    ) : (
        <div
            style={{
                width: "100%",
                height: "210px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
                borderRadius: "14px",
                color: "#64748b",
                fontSize: "42px"
            }}
        >
            🏨
        </div>
    )}
</div>

                                            <div
                                                style={{
                                                    marginTop:
                                                        "15px"
                                                }}
                                            >

                                                <button
                                                    onClick={() =>
                                                        editHotel(
                                                            hotel
                                                        )
                                                    }
                                                    style={
                                                        editButtonStyle
                                                    }
                                                >
                                                    ✏️ Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        deleteHotel(
                                                            hotel.id
                                                        )
                                                    }
                                                    style={
                                                        deleteButtonStyle
                                                    }
                                                >
                                                    🗑️ Delete
                                                </button>

                                            </div>

                                        </div>

                                    )
                                )
                            )}

                        </div>

                    </div>

                )}


                {/* =================================================
                    ROOMS
                ================================================= */}

                {activeSection ===
                    "rooms" && (

                    <div
                        style={
                            sectionStyle
                        }
                    >

                        <SectionHeader
                            title="Room Management"
                            icon="🛏️"
                            count={
                                rooms.length
                            }
                        />

                        <button
                            onClick={() => {

                                if (
                                    showRoomForm
                                ) {

                                    setShowRoomForm(
                                        false
                                    );

                                    setRoomData(
                                        emptyRoom
                                    );

                                } else {

                                    setShowRoomForm(
                                        true
                                    );

                                    setShowHotelForm(
                                        false
                                    );

                                    setEditingHotel(
                                        null
                                    );

                                    setRoomData(
                                        emptyRoom
                                    );

                                }
                            }}
                            style={
                                primaryButtonStyle
                            }
                        >
                            {showRoomForm
                                ? "✕ Close Form"
                                : "＋ Add Room"}
                        </button>

                        {showRoomForm && (

                            <form
                                onSubmit={
                                    addRoom
                                }
                                style={
                                    formStyle
                                }
                            >

                                <h3>
                                    Add New Room
                                </h3>

                                <select
                                    value={
                                        roomData.hotel_id
                                    }
                                    onChange={e =>
                                        setRoomData({
                                            ...roomData,
                                            hotel_id:
                                                e.target.value
                                        })
                                    }
                                    required
                                    style={
                                        inputStyle
                                    }
                                >

                                    <option value="">
                                        Select Hotel
                                    </option>

                                    {hotels.map(
                                        hotel => (

                                            <option
                                                key={
                                                    hotel.id
                                                }
                                                value={
                                                    hotel.id
                                                }
                                            >
                                                {
                                                    hotel.hotel_name
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                                <FormInput
                                    placeholder="Room Number"
                                    value={
                                        roomData.room_number
                                    }
                                    onChange={
                                        value =>
                                            setRoomData({
                                                ...roomData,
                                                room_number:
                                                    value
                                            })
                                    }
                                />

                                <select
                                    value={
                                        roomData.room_type
                                    }
                                    onChange={e =>
                                        setRoomData({
                                            ...roomData,
                                            room_type:
                                                e.target.value
                                        })
                                    }
                                    required
                                    style={
                                        inputStyle
                                    }
                                >

                                    <option value="">
                                        Select Room Type
                                    </option>

                                    <option value="single">
                                        Single
                                    </option>

                                    <option value="double">
                                        Double
                                    </option>

                                    <option value="suite">
                                        Suite
                                    </option>

                                    <option value="deluxe">
                                        Deluxe
                                    </option>

                                </select>

                                <input
                                    type="number"
                                    placeholder="Price per night"
                                    value={
                                        roomData.price
                                    }
                                    onChange={e =>
                                        setRoomData({
                                            ...roomData,
                                            price:
                                                e.target.value
                                        })
                                    }
                                    required
                                    min="0"
                                    style={
                                        inputStyle
                                    }
                                />

                                <input
                                    type="number"
                                    placeholder="Capacity"
                                    value={
                                        roomData.capacity
                                    }
                                    onChange={e =>
                                        setRoomData({
                                            ...roomData,
                                            capacity:
                                                e.target.value
                                        })
                                    }
                                    required
                                    min="1"
                                    style={
                                        inputStyle
                                    }
                                />

                                <textarea
                                    placeholder="Room Description"
                                    value={
                                        roomData.description
                                    }
                                    onChange={e =>
                                        setRoomData({
                                            ...roomData,
                                            description:
                                                e.target.value
                                        })
                                    }
                                    style={{
                                        ...inputStyle,
                                        minHeight:
                                            "100px"
                                    }}
                                />

                                <FormInput
                                    placeholder="Image URL"
                                    value={
                                        roomData.image
                                    }
                                    onChange={
                                        value =>
                                            setRoomData({
                                                ...roomData,
                                                image:
                                                    value
                                            })
                                    }
                                />

                                <select
                                    value={
                                        roomData.status
                                    }
                                    onChange={e =>
                                        setRoomData({
                                            ...roomData,
                                            status:
                                                e.target.value
                                        })
                                    }
                                    style={
                                        inputStyle
                                    }
                                >

                                    <option value="available">
                                        Available
                                    </option>

                                    <option value="booked">
                                        Booked
                                    </option>

                                </select>

                                <button
                                    type="submit"
                                    style={
                                        primaryButtonStyle
                                    }
                                >
                                    Add Room
                                </button>

                            </form>
                        )}

                        <div
                            style={{
                                marginTop:
                                    "25px"
                            }}
                        >

                            {rooms.length ===
                            0 ? (

                                <EmptyState
                                    message="No rooms found."
                                />

                            ) : (

                                rooms.map(
                                    room => (

                                        <div
                                            key={
                                                room.id
                                            }
                                            style={
                                                itemStyle
                                            }
                                        >

                                            <div
                                                style={
                                                    itemHeaderStyle
                                                }
                                            >

                                                <div>

                                                    <h3
                                                        style={{
                                                            margin:
                                                                "0 0 8px"
                                                        }}
                                                    >
                                                        🛏️ Room{" "}
                                                        {
                                                            room.room_number
                                                        }
                                                    </h3>

                                                    <span
                                                        style={{
                                                            color:
                                                                "#6b7280"
                                                        }}
                                                    >
                                                        {
                                                            room.room_type
                                                        }
                                                    </span>

                                                </div>

                                                <StatusBadge
                                                    status={
                                                        room.status
                                                    }
                                                />

                                            </div>

                                            <div
                                                style={
                                                    detailsGridStyle
                                                }
                                            >

                                                <p>
                                                    <strong>
                                                        Room ID:
                                                    </strong>{" "}
                                                    {
                                                        room.id
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Hotel ID:
                                                    </strong>{" "}
                                                    {
                                                        room.hotel_id
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Price:
                                                    </strong>{" "}
                                                    ₹
                                                    {
                                                        room.price
                                                    }{" "}
                                                    / night
                                                </p>

                                                <p>
                                                    <strong>
                                                        Capacity:
                                                    </strong>{" "}
                                                    {
                                                        room.capacity
                                                    }{" "}
                                                    guests
                                                </p>

                                            </div>

                                            <p>
                                                <strong>
                                                    Description:
                                                </strong>{" "}
                                                {
                                                    room.description
                                                }
                                            </p>
<div
    style={{
        marginTop: "15px",
        maxWidth: "360px"
    }}
>
    {room.image ? (
        <img
            src={`/images/${room.image}`}
            alt={`Room ${room.room_number}`}
            style={roomImageStyle}
        />
    ) : (
        <div
            style={{
                width: "100%",
                height: "210px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
                borderRadius: "14px",
                color: "#64748b",
                fontSize: "42px"
            }}
        >
            🛏️
        </div>
    )}
</div>

                                            <div
                                                style={{
                                                    marginTop:
                                                        "15px"
                                                }}
                                            >

                                                <button
                                                    onClick={() =>
                                                        editRoom(
                                                            room
                                                        )
                                                    }
                                                    style={
                                                        editButtonStyle
                                                    }
                                                >
                                                    ✏️ Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        deleteRoom(
                                                            room.id
                                                        )
                                                    }
                                                    style={
                                                        deleteButtonStyle
                                                    }
                                                >
                                                    🗑️ Delete
                                                </button>

                                            </div>

                                        </div>

                                    )
                                )
                            )}

                        </div>

                    </div>

                )}


                {/* =================================================
                    BOOKINGS
                ================================================= */}

                {activeSection ===
                    "bookings" && (

                    <div
                        style={
                            sectionStyle
                        }
                    >

                        <SectionHeader
                            title="Booking Management"
                            icon="📋"
                            count={
                                bookings.length
                            }
                        />

                        {/* =================================================
                            SEARCH + FILTER
                        ================================================= */}

                        <div
                            style={{
                                display:
                                    "flex",
                                gap:
                                    "12px",
                                marginBottom:
                                    "20px",
                                flexWrap:
                                    "wrap",
                                alignItems:
                                    "center"
                            }}
                        >

                            <input
                                type="text"
                                placeholder="🔍 Search customer, email, phone, hotel, room, booking ID or payment..."
                                value={
                                    bookingSearch
                                }
                                onChange={e =>
                                    setBookingSearch(
                                        e.target.value
                                    )
                                }
                                style={{
                                    ...inputStyle,
                                    marginBottom:
                                        "0",
                                    flex:
                                        "1",
                                    minWidth:
                                        "280px"
                                }}
                            />

                            <select
                                value={
                                    bookingFilter
                                }
                                onChange={e =>
                                    setBookingFilter(
                                        e.target.value
                                    )
                                }
                                style={{
                                    ...inputStyle,
                                    marginBottom:
                                        "0",
                                    width:
                                        "200px"
                                }}
                            >

                                <option value="all">
                                    All Bookings
                                </option>

                                <option value="pending">
                                    Pending
                                </option>

                                <option value="confirmed">
                                    Confirmed
                                </option>

                                <option value="cancelled">
                                    Cancelled
                                </option>

                                <option value="completed">
                                    Completed
                                </option>

                            </select>

                            <button
                                onClick={() => {

                                    setBookingSearch(
                                        ""
                                    );

                                    setBookingFilter(
                                        "all"
                                    );

                                }}
                                style={{
                                    ...primaryButtonStyle,
                                    backgroundColor:
                                        "#64748b"
                                }}
                            >
                                🔄 Reset
                            </button>

                        </div>


                        <p
                            style={{
                                color:
                                    "#6b7280",
                                marginBottom:
                                    "20px"
                            }}
                        >
                            Showing{" "}
                            <strong>
                                {
                                    filteredBookings.length
                                }
                            </strong>{" "}
                            of{" "}
                            <strong>
                                {
                                    bookings.length
                                }
                            </strong>{" "}
                            bookings
                        </p>


                        {/* =================================================
                            BOOKING LIST
                        ================================================= */}

                        {filteredBookings.length ===
                        0 ? (

                            <EmptyState
                                message={
                                    bookings.length ===
                                    0
                                        ? "No bookings found."
                                        : "No bookings match your search or filter."
                                }
                            />

                        ) : (

                            filteredBookings.map(
                                booking => {

                                    const customerName =
                                        booking.customer_name ||
                                        booking.name ||
                                        booking.username ||
                                        booking.user_name ||
                                        "Not available";

                                    const customerEmail =
                                        booking.customer_email ||
                                        booking.email ||
                                        "Not available";

                                    const customerPhone =
                                        booking.customer_phone ||
                                        booking.phone ||
                                        booking.contact_number ||
                                        "Not available";

                                    const hotelName =
                                        booking.hotel_name ||
                                        "Not available";

                                    const hotelLocation =
                                        booking.location ||
                                        booking.hotel_location ||
                                        "Not available";

                                    const roomNumber =
                                        booking.room_number ||
                                        "Not available";

                                    const roomType =
                                        booking.room_type ||
                                        "Not available";

                                    const paymentStatus =
                                        booking.payment_status ||
                                        "pending";

                                    const paymentMethod =
                                        booking.payment_method ||
                                        "Not paid";

                                    const paymentId =
                                        booking.payment_id ||
                                        "Not available";

                                    return (

                                        <div
                                            key={
                                                booking.id
                                            }
                                            style={
                                                itemStyle
                                            }
                                        >

                                            {/* BOOKING HEADER */}

                                            <div
                                                style={
                                                    itemHeaderStyle
                                                }
                                            >

                                                <div>

                                                    <h3
                                                        style={{
                                                            margin:
                                                                "0 0 5px"
                                                        }}
                                                    >
                                                        📋 Booking #{
                                                            booking.id
                                                        }
                                                    </h3>

                                                    <span
                                                        style={{
                                                            color:
                                                                "#6b7280"
                                                        }}
                                                    >
                                                        👤{" "}
                                                        {
                                                            customerName
                                                        }
                                                    </span>

                                                </div>

                                                <StatusBadge
                                                    status={
                                                        booking.booking_status
                                                    }
                                                />

                                            </div>


                                            {/* =================================================
                                                CUSTOMER DETAILS
                                            ================================================= */}

                                            <div
                                                style={{
                                                    backgroundColor:
                                                        "#eff6ff",
                                                    border:
                                                        "1px solid #bfdbfe",
                                                    borderRadius:
                                                        "10px",
                                                    padding:
                                                        "18px",
                                                    marginBottom:
                                                        "18px"
                                                }}
                                            >

                                                <h3
                                                    style={{
                                                        marginTop:
                                                            "0",
                                                        color:
                                                            "#1d4ed8"
                                                    }}
                                                >
                                                    👤 Customer Details
                                                </h3>

                                                <div
                                                    style={
                                                        detailsGridStyle
                                                    }
                                                >

                                                    <p>
                                                        <strong>
                                                            Name:
                                                        </strong>{" "}
                                                        {
                                                            customerName
                                                        }
                                                    </p>

                                                    <p>
                                                        <strong>
                                                            Email:
                                                        </strong>{" "}
                                                        {
                                                            customerEmail
                                                        }
                                                    </p>

                                                    <p>
                                                        <strong>
                                                            Phone:
                                                        </strong>{" "}
                                                        {
                                                            customerPhone
                                                        }
                                                    </p>

                                                    <p>
                                                        <strong>
                                                            User ID:
                                                        </strong>{" "}
                                                        {
                                                            booking.user_id ??
                                                            "Not available"
                                                        }
                                                    </p>

                                                </div>

                                            </div>


                                            {/* =================================================
                                                HOTEL + ROOM DETAILS
                                            ================================================= */}

                                            <div
                                                style={{
                                                    backgroundColor:
                                                        "#f0fdf4",
                                                    border:
                                                        "1px solid #bbf7d0",
                                                    borderRadius:
                                                        "10px",
                                                    padding:
                                                        "18px",
                                                    marginBottom:
                                                        "18px"
                                                }}
                                            >

                                                <h3
                                                    style={{
                                                        marginTop:
                                                            "0",
                                                        color:
                                                            "#15803d"
                                                    }}
                                                >
                                                    🏨 Hotel & Room Details
                                                </h3>

                                                <div
                                                    style={
                                                        detailsGridStyle
                                                    }
                                                >

                                                    <p>
                                                        <strong>
                                                            Hotel:
                                                        </strong>{" "}
                                                        {
                                                            hotelName
                                                        }
                                                    </p>

                                                    <p>
                                                        <strong>
                                                            Location:
                                                        </strong>{" "}
                                                        {
                                                            hotelLocation
                                                        }
                                                    </p>

                                                    <p>
                                                        <strong>
                                                            Hotel ID:
                                                        </strong>{" "}
                                                        {
                                                            booking.hotel_id ??
                                                            "Not available"
                                                        }
                                                    </p>

                                                    <p>
                                                        <strong>
                                                            Room ID:
                                                        </strong>{" "}
                                                        {
                                                            booking.room_id ??
                                                            "Not available"
                                                        }
                                                    </p>

                                                    <p>
                                                        <strong>
                                                            Room Number:
                                                        </strong>{" "}
                                                        {
                                                            roomNumber
                                                        }
                                                    </p>

                                                    <p>
                                                        <strong>
                                                            Room Type:
                                                        </strong>{" "}
                                                        {
                                                            roomType
                                                        }
                                                    </p>

                                                    <p>
                                                        <strong>
                                                            Room Price:
                                                        </strong>{" "}
                                                        ₹
                                                        {
                                                            booking.price ??
                                                            "0"
                                                        }
                                                        {" / night"}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* =================================================
                                                BOOKING DETAILS
                                            ================================================= */}

                                            <div
                                                style={{
                                                    backgroundColor:
                                                        "#fff7ed",
                                                    border:
                                                        "1px solid #fed7aa",
                                                    borderRadius:
                                                        "10px",
                                                    padding:
                                                        "18px",
                                                    marginBottom:
                                                        "18px"
                                                }}
                                            >

                                                <h3
                                                    style={{
                                                        marginTop:
                                                            "0",
                                                        color:
                                                            "#c2410c"
                                                    }}
                                                >
                                                    📅 Booking Details
                                                </h3>

                                                <div
                                                    style={
                                                        detailsGridStyle
                                                    }
                                                >

                                                    <p>
                                                        <strong>
                                                            Booking ID:
                                                        </strong>{" "}
                                                        #{
                                                            booking.id
                                                        }
                                                    </p>

                                                    <p>
                                                        <strong>
                                                            Check-in:
                                                        </strong>{" "}
                                                        {
                                                            booking.check_in ||
                                                            "Not available"
                                                        }
                                                    </p>

                                                    <p>
                                                        <strong>
                                                            Check-out:
                                                        </strong>{" "}
                                                        {
                                                            booking.check_out ||
                                                            "Not available"
                                                        }
                                                    </p>

                                                    <p>
                                                        <strong>
                                                            Guests:
                                                        </strong>{" "}
                                                        {
                                                            booking.guests ??
                                                            "Not available"
                                                        }
                                                    </p>

                                                    <p>
                                                        <strong>
                                                            Total Amount:
                                                        </strong>{" "}
                                                        <span
                                                            style={{
                                                                color:
                                                                    "#15803d",
                                                                fontWeight:
                                                                    "bold"
                                                            }}
                                                        >
                                                            ₹
                                                            {
                                                                booking.total_amount ??
                                                                "0"
                                                            }
                                                        </span>
                                                    </p>

                                                    <p>
                                                        <strong>
                                                            Booking Status:
                                                        </strong>{" "}

                                                        <StatusBadge
                                                            status={
                                                                booking.booking_status
                                                            }
                                                        />

                                                    </p>

                                                </div>

                                            </div>


                                            {/* =================================================
                                                PAYMENT DETAILS
                                            ================================================= */}

                                            <div
                                                style={{
                                                    backgroundColor:
                                                        "#f5f3ff",
                                                    border:
                                                        "1px solid #ddd6fe",
                                                    borderRadius:
                                                        "10px",
                                                    padding:
                                                        "18px",
                                                    marginBottom:
                                                        "18px"
                                                }}
                                            >

                                                <h3
                                                    style={{
                                                        marginTop:
                                                            "0",
                                                        color:
                                                            "#6d28d9"
                                                    }}
                                                >
                                                    💳 Payment Details
                                                </h3>

                                                <div
                                                    style={
                                                        detailsGridStyle
                                                    }
                                                >

                                                    <p>
                                                        <strong>
                                                            Payment Status:
                                                        </strong>{" "}

                                                        <PaymentStatusBadge
                                                            status={
                                                                paymentStatus
                                                            }
                                                        />

                                                    </p>

                                                    <p>
                                                        <strong>
                                                            Payment Method:
                                                        </strong>{" "}
                                                        {
                                                            paymentMethod
                                                        }
                                                    </p>

                                                    <p
                                                        style={{
                                                            wordBreak:
                                                                "break-all"
                                                        }}
                                                    >
                                                        <strong>
                                                            Payment ID:
                                                        </strong>{" "}
                                                        {
                                                            paymentId
                                                        }
                                                    </p>

                                                </div>

                                            </div>


                                            {/* =================================================
                                                STATUS BUTTONS
                                            ================================================= */}

                                            <div
                                                style={{
                                                    marginTop:
                                                        "18px",
                                                    display:
                                                        "flex",
                                                    gap:
                                                        "10px",
                                                    flexWrap:
                                                        "wrap"
                                                }}
                                            >

                                                <button
                                                    onClick={() =>
                                                        updateBookingStatus(
                                                            booking.id,
                                                            "confirmed"
                                                        )
                                                    }
                                                    style={
                                                        confirmButtonStyle
                                                    }
                                                    disabled={
                                                        booking.booking_status ===
                                                        "confirmed"
                                                    }
                                                >
                                                    ✓ Confirm
                                                </button>


                                                <button
                                                    onClick={() =>
                                                        updateBookingStatus(
                                                            booking.id,
                                                            "cancelled"
                                                        )
                                                    }
                                                    style={
                                                        deleteButtonStyle
                                                    }
                                                    disabled={
                                                        booking.booking_status ===
                                                        "cancelled"
                                                    }
                                                >
                                                    ✕ Cancel
                                                </button>


                                                <button
                                                    onClick={() =>
                                                        updateBookingStatus(
                                                            booking.id,
                                                            "completed"
                                                        )
                                                    }
                                                    style={
                                                        completedButtonStyle
                                                    }
                                                    disabled={
                                                        booking.booking_status ===
                                                        "completed"
                                                    }
                                                >
                                                    ✓ Completed
                                                </button>

                                            </div>

                                        </div>

                                    );
                                }
                            )

                        )}

                    </div>

                )}

            </main>

        </div>
    );
}


// =====================================================
// SIDEBAR BUTTON
// =====================================================

function SidebarButton({
    icon,
    text,
    active,
    onClick
}) {

    return (

        <button
            onClick={
                onClick
            }
            style={{
                ...sidebarButtonStyle,
                backgroundColor:
                    active
                        ? "#2563eb"
                        : "transparent",
                color:
                    active
                        ? "white"
                        : "#cbd5e1"
            }}
        >

            <span
                style={{
                    fontSize:
                        "19px"
                }}
            >
                {icon}
            </span>

            <span>
                {text}
            </span>

        </button>
    );
}


// =====================================================
// STAT CARD
// =====================================================

function StatCard({
    icon,
    title,
    value,
    accent
}) {

    return (

        <div
            style={{
                ...statCardStyle,
                borderTop:
                    `4px solid ${
                        accent ||
                        "#2563eb"
                    }`
            }}
        >

            <div
                style={
                    statIconStyle
                }
            >
                {icon}
            </div>

            <div>

                <p
                    style={{
                        margin:
                            "0 0 8px",
                        color:
                            "#6b7280",
                        fontSize:
                            "14px"
                    }}
                >
                    {title}
                </p>

                <h2
                    style={{
                        margin:
                            "0",
                        fontSize:
                            "30px"
                    }}
                >
                    {value}
                </h2>

            </div>

        </div>
    );
}


// =====================================================
// SECTION HEADER
// =====================================================

function SectionHeader({
    title,
    icon,
    count
}) {

    return (

        <div
            style={
                sectionHeaderStyle
            }
        >

            <div>

                <h2
                    style={{
                        margin:
                            "0 0 5px"
                    }}
                >
                    {icon} {title}
                </h2>

                <p
                    style={{
                        margin:
                            "0",
                        color:
                            "#6b7280"
                    }}
                >
                    Manage your{" "}
                    {title.toLowerCase()}
                </p>

            </div>

            <div
                style={
                    countBadgeStyle
                }
            >
                {count}
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

    let background =
        "#e5e7eb";

    let color =
        "#374151";

    const normalized =
        String(
            status || ""
        ).toLowerCase();

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
        "pending"
    ) {

        background =
            "#fef3c7";

        color =
            "#92400e";

    } else if (
        normalized ===
        "completed"
    ) {

        background =
            "#ede9fe";

        color =
            "#6d28d9";

    } else if (
        normalized ===
        "available"
    ) {

        background =
            "#dcfce7";

        color =
            "#166534";

    } else if (
        normalized ===
        "booked"
    ) {

        background =
            "#fee2e2";

        color =
            "#991b1b";

    } else if (
        normalized ===
        "admin"
    ) {

        background =
            "#dbeafe";

        color =
            "#1d4ed8";
    }

    return (

        <span
            style={{
                display:
                    "inline-block",
                padding:
                    "6px 12px",
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
            {status ||
                "Unknown"}
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
                    "inline-block",
                padding:
                    "6px 12px",
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
            {status ||
                "pending"}
        </span>
    );
}


// =====================================================
// FORM INPUT
// =====================================================

function FormInput({
    placeholder,
    value,
    onChange
}) {

    return (

        <input
            type="text"
            placeholder={
                placeholder
            }
            value={
                value
            }
            onChange={e =>
                onChange(
                    e.target.value
                )
            }
            required
            style={
                inputStyle
            }
        />
    );
}


// =====================================================
// EMPTY STATE
// =====================================================

function EmptyState({
    message
}) {

    return (

        <div
            style={
                emptyStateStyle
            }
        >

            <div
                style={{
                    fontSize:
                        "40px",
                    marginBottom:
                        "10px"
                }}
            >
                📭
            </div>

            <p>
                {message}
            </p>

        </div>
    );
}


// =====================================================
// STYLES
// =====================================================



// =====================================================
// MODERN ADMIN DASHBOARD STYLES
// =====================================================

const dashboardWrapper = {
    display: "flex",
    minHeight: "100vh",
    background:
        "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
    fontFamily:
        "Inter, Arial, Helvetica, sans-serif"
};

const sidebarStyle = {
    width: "260px",
    background:
        "linear-gradient(180deg, #0f172a 0%, #1e3a8a 100%)",
    color: "white",
    position: "fixed",
    left: "0",
    top: "0",
    bottom: "0",
    display: "flex",
    flexDirection: "column",
    zIndex: "1000",
    boxShadow:
        "5px 0 25px rgba(15,23,42,0.15)"
};

const logoContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "28px 22px",
    borderBottom:
        "1px solid rgba(255,255,255,0.12)"
};

const logoIconStyle = {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background:
        "linear-gradient(135deg, #3b82f6, #6366f1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    boxShadow:
        "0 6px 15px rgba(59,130,246,0.35)"
};

const sidebarMenuStyle = {
    padding: "22px 14px",
    flex: "1"
};

const sidebarButtonStyle = {
    width: "100%",
    border: "none",
    borderRadius: "12px",
    padding: "14px 16px",
    marginBottom: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    fontSize: "15px",
    textAlign: "left",
    transition:
        "all 0.2s ease"
};

const sidebarBottomStyle = {
    padding: "20px",
    borderTop:
        "1px solid rgba(255,255,255,0.12)"
};

const logoutButtonStyle = {
    width: "100%",
    padding: "12px",
    border:
        "1px solid rgba(248,113,113,0.7)",
    borderRadius: "10px",
    backgroundColor:
        "rgba(239,68,68,0.08)",
    color: "#fecaca",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold"
};

const mainContentStyle = {
    marginLeft: "260px",
    width:
        "calc(100% - 260px)",
    padding: "30px",
    boxSizing: "border-box"
};

const topHeaderStyle = {
    background:
        "rgba(255,255,255,0.95)",
    padding: "24px 28px",
    borderRadius: "18px",
    display: "flex",
    justifyContent:
        "space-between",
    alignItems: "center",
    marginBottom: "28px",
    boxShadow:
        "0 8px 30px rgba(15,23,42,0.07)",
    border:
        "1px solid #e2e8f0"
};

const adminProfileStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding:
        "8px 12px",
    borderRadius: "12px",
    backgroundColor:
        "#f8fafc"
};

const profileIconStyle = {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background:
        "linear-gradient(135deg, #dbeafe, #e0e7ff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px"
};

const statsGridStyle = {
    display: "grid",
    gridTemplateColumns:
        "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "28px"
};

const statCardStyle = {
    background:
        "rgba(255,255,255,0.98)",
    padding: "24px",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    gap: "17px",
    boxShadow:
        "0 8px 24px rgba(15,23,42,0.07)",
    border:
        "1px solid #e5e7eb",
    transition:
        "transform 0.2s ease"
};

const statIconStyle = {
    width: "56px",
    height: "56px",
    borderRadius: "15px",
    background:
        "linear-gradient(135deg, #eff6ff, #eef2ff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px"
};

const quickActionsStyle = {
    backgroundColor: "white",
    padding: "28px",
    borderRadius: "18px",
    boxShadow:
        "0 8px 24px rgba(15,23,42,0.06)",
    border:
        "1px solid #e5e7eb"
};

const actionButtonStyle = {
    padding: "13px 20px",
    border: "1px solid #dbeafe",
    borderRadius: "10px",
    background:
        "linear-gradient(135deg, #eff6ff, #eef2ff)",
    color: "#1d4ed8",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px"
};

const sectionStyle = {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "18px",
    boxShadow:
        "0 8px 24px rgba(15,23,42,0.06)",
    border:
        "1px solid #e5e7eb"
};

const sectionHeaderStyle = {
    display: "flex",
    justifyContent:
        "space-between",
    alignItems: "center",
    marginBottom: "28px"
};

const countBadgeStyle = {
    minWidth: "40px",
    height: "40px",
    padding: "0 12px",
    borderRadius: "20px",
    background:
        "linear-gradient(135deg, #dbeafe, #e0e7ff)",
    color: "#1d4ed8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold"
};

const primaryButtonStyle = {
    padding: "12px 20px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    background:
        "linear-gradient(135deg, #2563eb, #4f46e5)",
    color: "white",
    fontSize: "14px",
    fontWeight: "bold",
    boxShadow:
        "0 5px 12px rgba(37,99,235,0.22)"
};

const editButtonStyle = {
    padding: "9px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    background:
        "linear-gradient(135deg, #2563eb, #4f46e5)",
    color: "white",
    marginRight: "10px",
    fontWeight: "bold"
};

const deleteButtonStyle = {
    padding: "9px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    background:
        "linear-gradient(135deg, #dc2626, #ef4444)",
    color: "white",
    fontWeight: "bold"
};

const confirmButtonStyle = {
    padding: "10px 17px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    background:
        "linear-gradient(135deg, #16a34a, #22c55e)",
    color: "white",
    fontWeight: "bold"
};

const completedButtonStyle = {
    padding: "10px 17px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    background:
        "linear-gradient(135deg, #7c3aed, #8b5cf6)",
    color: "white",
    fontWeight: "bold"
};

const formStyle = {
    background:
        "linear-gradient(135deg, #f8fafc, #eef2ff)",
    padding: "28px",
    borderRadius: "14px",
    marginTop: "22px",
    marginBottom: "28px",
    maxWidth: "700px",
    border:
        "1px solid #dbeafe"
};

const inputStyle = {
    width: "100%",
    padding: "13px 14px",
    marginBottom: "15px",
    boxSizing: "border-box",
    border:
        "1px solid #cbd5e1",
    borderRadius: "9px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "white"
};

const itemStyle = {
    border:
        "1px solid #e2e8f0",
    borderRadius:
        "16px",
    padding:
        "24px",
    marginBottom:
        "20px",
    backgroundColor:
        "#ffffff",
    boxShadow:
        "0 6px 20px rgba(15,23,42,0.06)"
};

const itemHeaderStyle = {
    display: "flex",
    justifyContent:
        "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "18px"
};

const detailsGridStyle = {
    display: "grid",
    gridTemplateColumns:
        "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "8px 24px"
};

const ratingStyle = {
    background:
        "linear-gradient(135deg, #fef3c7, #fde68a)",
    color: "#92400e",
    padding: "8px 13px",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "13px"
};

const hotelImageStyle = {
    width: "100%",
    maxWidth: "360px",
    height: "210px",
    objectFit: "cover",
    borderRadius: "14px",
    marginTop: "15px",
    display: "block",
    boxShadow:
        "0 6px 18px rgba(15,23,42,0.12)"
};
const roomImageStyle = {
    width: "100%",
    maxWidth: "360px",
    height: "210px",
    objectFit: "cover",
    borderRadius: "14px",
    marginTop: "15px",
    display: "block",
    boxShadow:
        "0 6px 18px rgba(15,23,42,0.12)"
};

const tableStyle = {
    width: "100%",
    borderCollapse:
        "separate",
    borderSpacing: "0",
    overflow: "hidden",
    borderRadius: "12px"
};

const thStyle = {
    border:
        "1px solid #e2e8f0",
    padding: "14px",
    background:
        "linear-gradient(135deg, #f8fafc, #eef2ff)",
    textAlign: "left",
    color: "#334155",
    fontSize: "14px"
};

const tdStyle = {
    border:
        "1px solid #e2e8f0",
    padding: "14px",
    fontSize: "14px",
    backgroundColor: "white"
};

const emptyStateStyle = {
    textAlign: "center",
    padding: "60px 30px",
    color: "#64748b",
    background:
        "linear-gradient(135deg, #f8fafc, #eef2ff)",
    borderRadius: "14px",
    border:
        "1px dashed #cbd5e1"
};

const loadingStyle = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily:
        "Arial, sans-serif",
    background:
        "linear-gradient(135deg, #eff6ff, #eef2ff)"
};

const loadingSpinnerStyle = {
    fontSize: "46px",
    marginBottom: "12px"
};


export default AdminDashboard;

