const path = require("path");

require("dotenv").config({
    path: path.resolve(__dirname, ".env")
});

const express = require("express");
const cors = require("cors");
const db = require("./db");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const app = express();


// ============================================================
// RAZORPAY
// ============================================================

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


// ============================================================
// ENVIRONMENT CHECK
// ============================================================

console.log(
    "RAZORPAY KEY ID LOADED:",
    !!process.env.RAZORPAY_KEY_ID
);

console.log(
    "RAZORPAY SECRET LOADED:",
    !!process.env.RAZORPAY_KEY_SECRET
);


// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors());

app.use(express.json());


// ============================================================
// HOME
// ============================================================

app.get("/", (req, res) => {

    res.status(200).json({
        message: "BookEase Backend is running"
    });

});


// ============================================================
// USER REGISTRATION
// ============================================================

app.post("/api/register", (req, res) => {

    const {
        name,
        email,
        phone,
        password
    } = req.body;

    if (
        !name ||
        !email ||
        !phone ||
        !password
    ) {

        return res.status(400).json({
            message: "All fields are required"
        });

    }

    const checkSql = `
        SELECT id
        FROM users
        WHERE email = ?
    `;

    db.query(
        checkSql,
        [email],
        (err, results) => {

            if (err) {

                console.error(
                    "REGISTER CHECK ERROR:",
                    err
                );

                return res.status(500).json({
                    message: "Database error"
                });

            }

            if (results.length > 0) {

                return res.status(409).json({
                    message:
                        "Email already registered"
                });

            }

            const insertSql = `
                INSERT INTO users
                (
                    name,
                    email,
                    phone,
                    password,
                    role
                )
                VALUES (?, ?, ?, ?, 'customer')
            `;

            db.query(
                insertSql,
                [
                    name,
                    email,
                    phone,
                    password
                ],
                (err, result) => {

                    if (err) {

                        console.error(
                            "REGISTER ERROR:",
                            err
                        );

                        return res.status(500).json({
                            message:
                                "Registration failed"
                        });

                    }

                    return res.status(201).json({

                        message:
                            "Registration successful",

                        user_id:
                            result.insertId

                    });

                }
            );

        }
    );

});


// ============================================================
// USER LOGIN
// ============================================================

app.post("/api/login", (req, res) => {

    console.log(
        "Login request received"
    );

    console.log(
        req.body
    );

    const {
        email,
        password
    } = req.body;

    if (
        !email ||
        !password
    ) {

        return res.status(400).json({
            message:
                "Email and password are required"
        });

    }

    const sql = `
        SELECT
            id,
            name,
            email,
            phone,
            role
        FROM users
        WHERE email = ?
        AND password = ?
    `;

    db.query(
        sql,
        [
            email,
            password
        ],
        (err, results) => {

            if (err) {

                console.error(
                    "LOGIN DATABASE ERROR:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Database error"
                });

            }

            console.log(
                "Login result:",
                results
            );

            if (
                results.length === 0
            ) {

                return res.status(401).json({
                    message:
                        "Invalid email or password"
                });

            }

            return res.status(200).json({

                message:
                    "Login successful",

                user:
                    results[0]

            });

        }
    );

});


// ============================================================
// GET ALL HOTELS
// ============================================================

app.get(
    "/api/hotels",
    (req, res) => {

        const sql = `
            SELECT *
            FROM hotels
            ORDER BY id DESC
        `;

        db.query(
            sql,
            (err, results) => {

                if (err) {

                    console.error(
                        "GET HOTELS ERROR:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Error fetching hotels"
                    });

                }

                return res.status(200).json(
                    results
                );

            }
        );

    }
);


// ============================================================
// GET ROOMS FOR A HOTEL
// ============================================================

app.get(
    "/api/rooms/:hotelId",
    (req, res) => {

        const hotelId =
            req.params.hotelId;

        const sql = `
            SELECT *
            FROM rooms
            WHERE hotel_id = ?
            ORDER BY id DESC
        `;

        db.query(
            sql,
            [hotelId],
            (err, results) => {

                if (err) {

                    console.error(
                        "GET ROOMS ERROR:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Error fetching rooms"
                    });

                }

                return res.status(200).json(
                    results
                );

            }
        );

    }
);


// ============================================================
// GET ROOMS FOR HOTEL
// /api/hotels/:hotelId/rooms
// ============================================================

app.get(
    "/api/hotels/:hotelId/rooms",
    (req, res) => {

        const hotelId =
            req.params.hotelId;

        const sql = `
            SELECT *
            FROM rooms
            WHERE hotel_id = ?
            ORDER BY id DESC
        `;

        db.query(
            sql,
            [hotelId],
            (err, results) => {

                if (err) {

                    console.error(
                        "GET HOTEL ROOMS ERROR:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Failed to fetch rooms"
                    });

                }

                return res.status(200).json(
                    results
                );

            }
        );

    }
);


// ============================================================
// GET SINGLE ROOM
// ============================================================

app.get(
    "/api/room/:roomId",
    (req, res) => {

        const roomId =
            req.params.roomId;

        const sql = `
            SELECT *
            FROM rooms
            WHERE id = ?
        `;

        db.query(
            sql,
            [roomId],
            (err, results) => {

                if (err) {

                    console.error(
                        "ROOM ERROR:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Error fetching room"
                    });

                }

                if (
                    results.length === 0
                ) {

                    return res.status(404).json({
                        message:
                            "Room not found"
                    });

                }

                return res.status(200).json(
                    results[0]
                );

            }
        );

    }
);


// ============================================================
// CREATE BOOKING
// ============================================================

app.post(
    "/api/bookings",
    (req, res) => {

        const {
            user_id,
            room_id,
            check_in,
            check_out,
            guests
        } = req.body;

        if (
            !user_id ||
            !room_id ||
            !check_in ||
            !check_out ||
            !guests
        ) {

            return res.status(400).json({
                message:
                    "All fields are required"
            });

        }

        if (
            new Date(check_out) <=
            new Date(check_in)
        ) {

            return res.status(400).json({
                message:
                    "Check-out date must be after check-in date"
            });

        }

        const overlapSql = `
            SELECT id
            FROM bookings
            WHERE room_id = ?
            AND booking_status != 'cancelled'
            AND check_in < ?
            AND check_out > ?
        `;

        db.query(
            overlapSql,
            [
                room_id,
                check_out,
                check_in
            ],
            (err, existingBookings) => {

                if (err) {

                    console.error(
                        "BOOKING AVAILABILITY ERROR:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Database error"
                    });

                }

                if (
                    existingBookings.length > 0
                ) {

                    return res.status(409).json({
                        message:
                            "This room is already booked for the selected dates"
                    });

                }

                const roomSql = `
                    SELECT
                        price,
                        status
                    FROM rooms
                    WHERE id = ?
                `;

                db.query(
                    roomSql,
                    [room_id],
                    (err, rooms) => {

                        if (err) {

                            console.error(
                                "ROOM DATABASE ERROR:",
                                err
                            );

                            return res.status(500).json({
                                message:
                                    "Database error"
                            });

                        }

                        if (
                            rooms.length === 0
                        ) {

                            return res.status(404).json({
                                message:
                                    "Room not found"
                            });

                        }

                        if (
                            rooms[0].status !==
                            "available"
                        ) {

                            return res.status(409).json({
                                message:
                                    "This room is currently unavailable"
                            });

                        }

                        const price =
                            Number(
                                rooms[0].price
                            );

                        const checkInDate =
                            new Date(check_in);

                        const checkOutDate =
                            new Date(check_out);

                        const millisecondsPerDay =
                            1000 *
                            60 *
                            60 *
                            24;

                        const nights =
                            Math.ceil(
                                (
                                    checkOutDate -
                                    checkInDate
                                ) /
                                millisecondsPerDay
                            );

                        if (
                            nights <= 0
                        ) {

                            return res.status(400).json({
                                message:
                                    "Invalid booking dates"
                            });

                        }

                        const total_amount =
                            price * nights;

                        const insertSql = `
                            INSERT INTO bookings
                            (
                                user_id,
                                room_id,
                                check_in,
                                check_out,
                                guests,
                                total_amount,
                                booking_status,
                                payment_status
                            )
                            VALUES
                            (?, ?, ?, ?, ?, ?, 'pending', 'pending')
                        `;

                        db.query(
                            insertSql,
                            [
                                user_id,
                                room_id,
                                check_in,
                                check_out,
                                guests,
                                total_amount
                            ],
                            (err, result) => {

                                if (err) {

                                    console.error(
                                        "CREATE BOOKING ERROR:",
                                        err
                                    );

                                    return res.status(500).json({
                                        message:
                                            "Booking could not be created"
                                    });

                                }

                                return res.status(201).json({

                                    message:
                                        "Booking created successfully",

                                    booking_id:
                                        result.insertId,

                                    total_amount:
                                        total_amount,

                                    nights:
                                        nights

                                });

                            }
                        );

                    }
                );

            }
        );

    }
);


// ============================================================
// GET BOOKINGS FOR A USER
// ============================================================




// ============================================================
// GET BOOKINGS FOR A USER
// ============================================================

app.get(
    "/api/bookings/user/:userId",
    (req, res) => {

        const userId = req.params.userId;

        
              const sql = `
    SELECT
        b.id,
        b.user_id,
        b.room_id,
        b.check_in,
        b.check_out,
        b.guests,
        b.total_amount,
        b.booking_status,
        b.payment_status,
        b.payment_method,
        b.payment_id,
        b.booking_date,

        r.room_number,
        r.room_type,
        r.price,

        h.id AS hotel_id,
        h.hotel_name,
        h.location

    FROM bookings b

    INNER JOIN rooms r
        ON b.room_id = r.id

    INNER JOIN hotels h
        ON r.hotel_id = h.id

    WHERE b.user_id = ?

    ORDER BY b.booking_date DESC
`;

        db.query(
            sql,
            [userId],
            (err, results) => {

                if (err) {

                    console.error(
                        "MY BOOKINGS DATABASE ERROR:",
                        err
                    );

                    return res.status(500).json({
                        message: "Error fetching bookings",
                        error: err.message
                    });
                }

                console.log(
                    "MY BOOKINGS:",
                    results
                );

                return res.status(200).json(
                    results
                );
            }
        );
    }
);


// ============================================================
// CANCEL BOOKING
// ============================================================

app.put(
    "/api/bookings/:bookingId/cancel",
    (req, res) => {

        const bookingId =
            req.params.bookingId;

        const getBookingSql = `
            SELECT
                room_id,
                booking_status,
                payment_status
            FROM bookings
            WHERE id = ?
        `;

        db.query(
            getBookingSql,
            [bookingId],
            (err, bookings) => {

                if (err) {

                    console.error(
                        "GET BOOKING ERROR:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Could not find booking"
                    });

                }

                if (
                    bookings.length === 0
                ) {

                    return res.status(404).json({
                        message:
                            "Booking not found"
                    });

                }

                const roomId =
                    bookings[0].room_id;

                const currentStatus =
                    bookings[0].booking_status;

                if (
                    currentStatus ===
                    "cancelled"
                ) {

                    return res.status(400).json({
                        message:
                            "Booking is already cancelled"
                    });

                }

                const cancelBookingSql = `
                    UPDATE bookings
                    SET
                        booking_status = 'cancelled',
                        payment_status =
                            CASE
                                WHEN payment_status = 'paid'
                                THEN 'refunded'
                                ELSE payment_status
                            END
                    WHERE id = ?
                `;

                db.query(
                    cancelBookingSql,
                    [bookingId],
                    (err) => {

                        if (err) {

                            console.error(
                                "CANCEL BOOKING ERROR:",
                                err
                            );

                            return res.status(500).json({
                                message:
                                    "Could not cancel booking"
                            });

                        }

                        const updateRoomSql = `
                            UPDATE rooms
                            SET status = 'available'
                            WHERE id = ?
                        `;

                        db.query(
                            updateRoomSql,
                            [roomId],
                            (err) => {

                                if (err) {

                                    console.error(
                                        "ROOM STATUS ERROR:",
                                        err
                                    );

                                    return res.status(500).json({
                                        message:
                                            "Booking cancelled but room status could not be updated"
                                    });

                                }

                                return res.json({
                                    message:
                                        "Booking cancelled and room is available again"
                                });

                            }
                        );

                    }
                );

            }
        );

    }
);


// ============================================================
// ADMIN - GET ALL USERS
// ============================================================

app.get(
    "/api/admin/users",
    (req, res) => {

        const sql = `
            SELECT
                id,
                name,
                email,
                phone,
                role,
                created_at
            FROM users
            ORDER BY id DESC
        `;

        db.query(
            sql,
            (err, results) => {

                if (err) {

                    console.error(
                        "ADMIN USERS ERROR:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Error fetching users"
                    });

                }

                return res.status(200).json(
                    results
                );

            }
        );

    }
);


// ============================================================
// ADMIN - GET ALL BOOKINGS WITH CUSTOMER + PAYMENT DETAILS
// ============================================================

app.get(
    "/api/admin/bookings",
    (req, res) => {

        const sql = `
            SELECT

                b.id,
                b.user_id,
                b.room_id,

                b.check_in,
                b.check_out,
                b.guests,

                b.total_amount,

                b.booking_status,

                b.payment_status,
                b.payment_method,
                b.payment_id,

                b.booking_date,

                u.name AS customer_name,
                u.email AS customer_email,
                u.phone AS customer_phone,

                r.room_number,
                r.room_type,
                r.price,

                h.id AS hotel_id,
                h.hotel_name,
                h.location

            FROM bookings b

            INNER JOIN users u
                ON b.user_id = u.id

            INNER JOIN rooms r
                ON b.room_id = r.id

            INNER JOIN hotels h
                ON r.hotel_id = h.id

            ORDER BY
                b.booking_date DESC
        `;

        db.query(
            sql,
            (err, results) => {

                if (err) {

                    console.error(
                        "ADMIN BOOKINGS ERROR:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Error fetching bookings"
                    });

                }

                return res.status(200).json(
                    results
                );

            }
        );

    }
);


// ============================================================
// ADMIN - UPDATE BOOKING STATUS
// ============================================================

app.put(
    "/api/admin/bookings/:bookingId/status",
    (req, res) => {

        const bookingId =
            req.params.bookingId;

        const {
            status
        } = req.body;

        const validStatuses = [
            "pending",
            "confirmed",
            "cancelled",
            "completed"
        ];

        if (
            !validStatuses.includes(status)
        ) {

            return res.status(400).json({
                message:
                    "Invalid booking status"
            });

        }

        const sql = `
            UPDATE bookings
            SET
                booking_status = ?
            WHERE id = ?
        `;

        db.query(
            sql,
            [
                status,
                bookingId
            ],
            (err, result) => {

                if (err) {

                    console.error(
                        "UPDATE BOOKING ERROR:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Could not update booking status"
                    });

                }

                if (
                    result.affectedRows === 0
                ) {

                    return res.status(404).json({
                        message:
                            "Booking not found"
                    });

                }

                if (
                    status === "cancelled"
                ) {

                    const getRoomSql = `
                        SELECT room_id
                        FROM bookings
                        WHERE id = ?
                    `;

                    db.query(
                        getRoomSql,
                        [bookingId],
                        (err, bookingData) => {

                            if (
                                !err &&
                                bookingData.length > 0
                            ) {

                                const roomId =
                                    bookingData[0].room_id;

                                const updateRoomSql = `
                                    UPDATE rooms
                                    SET status = 'available'
                                    WHERE id = ?
                                `;

                                db.query(
                                    updateRoomSql,
                                    [roomId],
                                    (roomErr) => {

                                        if (roomErr) {

                                            console.error(
                                                "ROOM STATUS UPDATE ERROR:",
                                                roomErr
                                            );

                                        }

                                    }
                                );

                            }

                        }
                    );

                }

                return res.status(200).json({
                    message:
                        "Booking status updated successfully"
                });

            }
        );

    }
);


// ============================================================
// ADMIN - GET ALL ROOMS
// ============================================================

app.get(
    "/api/admin/rooms",
    (req, res) => {

        const sql = `
            SELECT
                r.*,
                h.hotel_name
            FROM rooms r
            LEFT JOIN hotels h
                ON r.hotel_id = h.id
            ORDER BY r.id DESC
        `;

        db.query(
            sql,
            (err, results) => {

                if (err) {

                    console.error(
                        "ADMIN ROOMS ERROR:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Error fetching rooms"
                    });

                }

                return res.status(200).json(
                    results
                );

            }
        );

    }
);


// ============================================================
// ADMIN - ADD HOTEL
// ============================================================

app.post(
    "/api/admin/hotels",
    (req, res) => {

        const {
            hotel_name,
            location,
            description,
            address,
            contact_number,
            email,
            rating,
            image
        } = req.body;

        if (
            !hotel_name ||
            !location ||
            !description ||
            !address ||
            !contact_number ||
            !email
        ) {

            return res.status(400).json({
                message:
                    "Please fill all required fields"
            });

        }

        const sql = `
            INSERT INTO hotels
            (
                hotel_name,
                location,
                description,
                address,
                contact_number,
                email,
                rating,
                image
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                hotel_name,
                location,
                description,
                address,
                contact_number,
                email,
                rating || 0,
                image || ""
            ],
            (err, result) => {

                if (err) {

                    console.error(
                        "ADD HOTEL ERROR:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Hotel could not be added"
                    });

                }

                return res.status(201).json({

                    message:
                        "Hotel added successfully",

                    hotel_id:
                        result.insertId

                });

            }
        );

    }
);


// ============================================================
// ADMIN - UPDATE HOTEL
// ============================================================

app.put(
    "/api/admin/hotels/:id",
    (req, res) => {

        const hotelId =
            req.params.id;

        const {
            hotel_name,
            location,
            description,
            address,
            contact_number,
            email,
            rating,
            image
        } = req.body;

        if (
            !hotel_name ||
            !location ||
            !description ||
            !address ||
            !contact_number ||
            !email
        ) {

            return res.status(400).json({
                message:
                    "Required hotel fields are missing"
            });

        }

        const sql = `
            UPDATE hotels
            SET
                hotel_name = ?,
                location = ?,
                description = ?,
                address = ?,
                contact_number = ?,
                email = ?,
                rating = ?,
                image = ?
            WHERE id = ?
        `;

        db.query(
            sql,
            [
                hotel_name,
                location,
                description,
                address,
                contact_number,
                email,
                rating || null,
                image || "",
                hotelId
            ],
            (err, result) => {

                if (err) {

                    console.error(
                        "UPDATE HOTEL ERROR:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Hotel could not be updated"
                    });

                }

                if (
                    result.affectedRows === 0
                ) {

                    return res.status(404).json({
                        message:
                            "Hotel not found"
                    });

                }

                return res.json({
                    message:
                        "Hotel updated successfully"
                });

            }
        );

    }
);


// ============================================================
// ADMIN - DELETE HOTEL
// ============================================================

app.delete(
    "/api/admin/hotels/:id",
    (req, res) => {

        const hotelId =
            req.params.id;

        const sql = `
            DELETE FROM hotels
            WHERE id = ?
        `;

        db.query(
            sql,
            [hotelId],
            (err, result) => {

                if (err) {

                    console.error(
                        "DELETE HOTEL ERROR:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Hotel could not be deleted"
                    });

                }

                if (
                    result.affectedRows === 0
                ) {

                    return res.status(404).json({
                        message:
                            "Hotel not found"
                    });

                }

                return res.json({
                    message:
                        "Hotel deleted successfully"
                });

            }
        );

    }
);


// ============================================================
// ADMIN - ADD ROOM
// ============================================================

app.post(
    "/api/admin/rooms",
    (req, res) => {

        const {
            hotel_id,
            room_number,
            room_type,
            price,
            capacity,
            description,
            image,
            status
        } = req.body;

        if (
            !hotel_id ||
            !room_number ||
            !room_type ||
            !price ||
            !capacity
        ) {

            return res.status(400).json({
                message:
                    "Required room fields are missing"
            });

        }

        const sql = `
            INSERT INTO rooms
            (
                hotel_id,
                room_number,
                room_type,
                price,
                capacity,
                description,
                image,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                hotel_id,
                room_number,
                room_type,
                price,
                capacity,
                description || "",
                image || "",
                status || "available"
            ],
            (err, result) => {

                if (err) {

                    console.error(
                        "ADD ROOM DATABASE ERROR:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Room could not be added",
                        error:
                            err.message
                    });

                }

                return res.status(201).json({

                    message:
                        "Room added successfully",

                    room_id:
                        result.insertId

                });

            }
        );

    }
);


// ============================================================
// ADMIN - UPDATE ROOM
// ============================================================

app.put(
    "/api/admin/rooms/:id",
    (req, res) => {

        const roomId =
            req.params.id;

        const {
            hotel_id,
            room_number,
            room_type,
            price,
            capacity,
            description,
            image,
            status
        } = req.body;

        const sql = `
            UPDATE rooms
            SET
                hotel_id = ?,
                room_number = ?,
                room_type = ?,
                price = ?,
                capacity = ?,
                description = ?,
                image = ?,
                status = ?
            WHERE id = ?
        `;

        db.query(
            sql,
            [
                hotel_id,
                room_number,
                room_type,
                price,
                capacity,
                description || "",
                image || "",
                status || "available",
                roomId
            ],
            (err, result) => {

                if (err) {

                    console.error(
                        "UPDATE ROOM ERROR:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Room could not be updated"
                    });

                }

                if (
                    result.affectedRows === 0
                ) {

                    return res.status(404).json({
                        message:
                            "Room not found"
                    });

                }

                return res.json({
                    message:
                        "Room updated successfully"
                });

            }
        );

    }
);


// ============================================================
// ADMIN - DELETE ROOM
// ============================================================

app.delete(
    "/api/admin/rooms/:id",
    (req, res) => {

        const roomId =
            req.params.id;

        const sql = `
            DELETE FROM rooms
            WHERE id = ?
        `;

        db.query(
            sql,
            [roomId],
            (err, result) => {

                if (err) {

                    console.error(
                        "DELETE ROOM ERROR:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Room could not be deleted"
                    });

                }

                if (
                    result.affectedRows === 0
                ) {

                    return res.status(404).json({
                        message:
                            "Room not found"
                    });

                }

                return res.json({
                    message:
                        "Room deleted successfully"
                });

            }
        );

    }
);


// ============================================================
// RAZORPAY - CREATE ORDER
// ============================================================

app.post(
    "/api/payment/create-order",
    async (req, res) => {

        try {

            const {
                booking_id
            } = req.body;

            if (!booking_id) {

                return res.status(400).json({
                    message:
                        "Booking ID is required"
                });

            }

            // ---------------------------------------------
            // GET ACTUAL BOOKING AMOUNT FROM DATABASE
            // ---------------------------------------------

            const bookingSql = `
                SELECT
                    id,
                    total_amount,
                    booking_status,
                    payment_status
                FROM bookings
                WHERE id = ?
            `;

            db.query(
                bookingSql,
                [booking_id],
                async (err, bookings) => {

                    if (err) {

                        console.error(
                            "PAYMENT BOOKING LOOKUP ERROR:",
                            err
                        );

                        return res.status(500).json({
                            message:
                                "Database error"
                        });

                    }

                    if (
                        bookings.length === 0
                    ) {

                        return res.status(404).json({
                            message:
                                "Booking not found"
                        });

                    }

                    const booking =
                        bookings[0];

                    if (
                        booking.booking_status ===
                        "confirmed"
                    ) {

                        return res.status(400).json({
                            message:
                                "This booking is already confirmed"
                        });

                    }

                    if (
                        booking.payment_status ===
                        "paid"
                    ) {

                        return res.status(400).json({
                            message:
                                "Payment has already been completed"
                        });

                    }

                    const amountInPaise =
                        Math.round(
                            Number(
                                booking.total_amount
                            ) * 100
                        );

                    if (
                        !Number.isFinite(
                            amountInPaise
                        ) ||
                        amountInPaise <= 0
                    ) {

                        return res.status(400).json({
                            message:
                                "Invalid booking amount"
                        });

                    }

                    // ---------------------------------------------
                    // CREATE RAZORPAY ORDER
                    // ---------------------------------------------

                    try {

                        const order =
                            await razorpay.orders.create({

                                amount:
                                    amountInPaise,

                                currency:
                                    "INR",

                                receipt:
                                    `booking_${booking_id}`,

                                notes: {
                                    booking_id:
                                        String(
                                            booking_id
                                        )
                                }

                            });

                        console.log(
                            "RAZORPAY ORDER CREATED:",
                            order.id
                        );

                        return res.status(200).json({

                            success:
                                true,

                            message:
                                "Payment order created",

                            order_id:
                                order.id,

                            amount:
                                order.amount,

                            currency:
                                order.currency,

                            key_id:
                                process.env
                                    .RAZORPAY_KEY_ID

                        });

                    } catch (
                        razorpayError
                    ) {

                        console.error(
                            "RAZORPAY ORDER ERROR:",
                            razorpayError
                        );

                        return res.status(500).json({

                            success:
                                false,

                            message:
                                "Could not create Razorpay order",

                            error:
                                razorpayError.message

                        });

                    }

                }
            );

        } catch (error) {

            console.error(
                "CREATE PAYMENT ORDER ERROR:",
                error
            );

            return res.status(500).json({
                success:
                    false,
                message:
                    "Payment order creation failed",
                error:
                    error.message
            });

        }

    }
);


// ============================================================
// RAZORPAY - VERIFY PAYMENT
// ============================================================

app.post(
    "/api/payment/verify",
    (req, res) => {

        try {

            const {
                booking_id,
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            } = req.body;

            console.log(
                "PAYMENT VERIFY REQUEST RECEIVED"
            );

            // ---------------------------------------------
            // VALIDATE
            // ---------------------------------------------

            if (
                !booking_id ||
                !razorpay_order_id ||
                !razorpay_payment_id ||
                !razorpay_signature
            ) {

                return res.status(400).json({

                    success:
                        false,

                    message:
                        "Payment verification data is missing"

                });

            }

            // ---------------------------------------------
            // CHECK SECRET
            // ---------------------------------------------

            if (
                !process.env.RAZORPAY_KEY_SECRET
            ) {

                console.error(
                    "RAZORPAY KEY SECRET IS MISSING"
                );

                return res.status(500).json({

                    success:
                        false,

                    message:
                        "Razorpay secret is not configured"

                });

            }

            // ---------------------------------------------
            // CREATE EXPECTED SIGNATURE
            // ---------------------------------------------

            const generatedSignature =
                crypto
                    .createHmac(
                        "sha256",
                        process.env
                            .RAZORPAY_KEY_SECRET
                    )
                    .update(
                        `${razorpay_order_id}|${razorpay_payment_id}`
                    )
                    .digest("hex");

            console.log(
                "SIGNATURE MATCH:",
                generatedSignature ===
                    razorpay_signature
            );

            // ---------------------------------------------
            // VERIFY SIGNATURE
            // ---------------------------------------------

            if (
                generatedSignature !==
                razorpay_signature
            ) {

                return res.status(400).json({

                    success:
                        false,

                    message:
                        "Payment verification failed"

                });

            }

            // ---------------------------------------------
            // GET BOOKING
            // ---------------------------------------------

            const getBookingSql = `
                SELECT
                    id,
                    total_amount,
                    booking_status,
                    payment_status
                FROM bookings
                WHERE id = ?
            `;

            db.query(
                getBookingSql,
                [booking_id],
                (err, bookings) => {

                    if (err) {

                        console.error(
                            "GET PAYMENT BOOKING ERROR:",
                            err
                        );

                        return res.status(500).json({

                            success:
                                false,

                            message:
                                "Database error"

                        });

                    }

                    if (
                        bookings.length === 0
                    ) {

                        return res.status(404).json({

                            success:
                                false,

                            message:
                                "Booking not found"

                        });

                    }

                    // ---------------------------------------------
                    // UPDATE PAYMENT + BOOKING
                    // ---------------------------------------------

                    const updateSql = `
                        UPDATE bookings
                        SET
                            payment_status = 'paid',
                            payment_method = 'Razorpay',
                            payment_id = ?,
                            booking_status = 'confirmed'
                        WHERE id = ?
                    `;

                    db.query(
                        updateSql,
                        [
                            razorpay_payment_id,
                            booking_id
                        ],
                        (err, result) => {

                            if (err) {

                                console.error(
                                    "PAYMENT DATABASE UPDATE ERROR:",
                                    err
                                );

                                return res.status(500).json({

                                    success:
                                        false,

                                    message:
                                        "Payment verified but booking could not be updated"

                                });

                            }

                            if (
                                result.affectedRows ===
                                0
                            ) {

                                return res.status(404).json({

                                    success:
                                        false,

                                    message:
                                        "Booking not found"

                                });

                            }

                            console.log(
                                `PAYMENT VERIFIED FOR BOOKING ${booking_id}`
                            );

                            return res.status(200).json({

                                success:
                                    true,

                                message:
                                    "Payment verified and booking confirmed",

                                booking_id:
                                    booking_id,

                                payment_status:
                                    "paid",

                                payment_method:
                                    "Razorpay",

                                payment_id:
                                    razorpay_payment_id,

                                booking_status:
                                    "confirmed"

                            });

                        }
                    );

                }
            );

        } catch (error) {

            console.error(
                "PAYMENT VERIFY SERVER ERROR:",
                error
            );

            // IMPORTANT:
            // Always return JSON.
            return res.status(500).json({

                success:
                    false,

                message:
                    "Payment verification server error",

                error:
                    error.message

            });

        }

    }
);

// ============================================================
// GET AVAILABLE ROOMS FOR SELECTED DATES
// ============================================================

app.get(
    "/api/hotels/:hotelId/available-rooms",
    (req, res) => {

        const hotelId = req.params.hotelId;

        const {
            check_in,
            check_out
        } = req.query;

        console.log(
            "AVAILABLE ROOMS REQUEST:",
            hotelId,
            check_in,
            check_out
        );

        // ----------------------------------------------------
        // VALIDATE DATES
        // ----------------------------------------------------

        if (!check_in || !check_out) {

            return res.status(400).json({
                message:
                    "Check-in and check-out dates are required"
            });

        }

        if (
            new Date(check_out) <=
            new Date(check_in)
        ) {

            return res.status(400).json({
                message:
                    "Check-out date must be after check-in date"
            });

        }

        // ----------------------------------------------------
        // FIND AVAILABLE ROOMS
        // ----------------------------------------------------

        const sql = `
            SELECT
                r.*
            FROM rooms r
            WHERE r.hotel_id = ?
            AND r.status = 'available'
            AND NOT EXISTS (
                SELECT 1
                FROM bookings b
                WHERE b.room_id = r.id
                AND b.booking_status != 'cancelled'
                AND b.check_in < ?
                AND b.check_out > ?
            )
            ORDER BY r.id DESC
        `;

        db.query(
            sql,
            [
                hotelId,
                check_out,
                check_in
            ],
            (err, results) => {

                if (err) {

                    console.error(
                        "AVAILABLE ROOMS DATABASE ERROR:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Error fetching available rooms",
                        error:
                            err.message
                    });

                }

                console.log(
                    "AVAILABLE ROOMS RESULT:",
                    results
                );

                return res.status(200).json(
                    results
                );

            }
        );
    }
);
// ============================================================
// 404 API HANDLER
// ============================================================

app.use(
    "/api",
    (req, res) => {

        return res.status(404).json({

            success:
                false,

            message:
                `API endpoint not found: ${req.method} ${req.originalUrl}`

        });

    }
);


// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================

app.use(
    (err, req, res, next) => {

        console.error(
            "GLOBAL SERVER ERROR:",
            err
        );

        return res.status(500).json({

            success:
                false,

            message:
                "Internal server error",

            error:
                err.message

        });

    }
);
// ============================================================
// GET AVAILABLE ROOMS FOR SELECTED DATES
// ============================================================

app.get(
    "/api/hotels/:hotelId/available-rooms",
    (req, res) => {

        const hotelId = req.params.hotelId;

        const {
            check_in,
            check_out
        } = req.query;

        console.log(
            "AVAILABLE ROOMS REQUEST:",
            {
                hotelId,
                check_in,
                check_out
            }
        );

        // ----------------------------------------------------
        // VALIDATE DATES
        // ----------------------------------------------------

        if (!check_in || !check_out) {

            return res.status(400).json({
                message:
                    "Check-in and check-out dates are required"
            });

        }

        if (
            new Date(check_out) <=
            new Date(check_in)
        ) {

            return res.status(400).json({
                message:
                    "Check-out date must be after check-in date"
            });

        }

        // ----------------------------------------------------
        // FIND AVAILABLE ROOMS
        // ----------------------------------------------------

        const sql = `
            SELECT
                r.*
            FROM rooms r

            WHERE r.hotel_id = ?

            AND r.status = 'available'

            AND NOT EXISTS (

                SELECT 1
                FROM bookings b

                WHERE b.room_id = r.id

                AND b.booking_status != 'cancelled'

                AND b.check_in < ?
                AND b.check_out > ?

            )

            ORDER BY r.id DESC
        `;

        db.query(
            sql,
            [
                hotelId,
                check_out,
                check_in
            ],
            (err, results) => {

                if (err) {

                    console.error(
                        "AVAILABLE ROOMS DATABASE ERROR:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Error fetching available rooms",
                        error:
                            err.message
                    });

                }

                console.log(
                    "AVAILABLE ROOMS RESULT:",
                    results
                );

                return res.status(200).json(
                    results
                );

            }
        );

    }
);


// ============================================================
// START SERVER
// ============================================================

const PORT = 5000;
// ============================================================
// GET AVAILABLE ROOMS FOR SELECTED DATES
// ============================================================



app.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

    }
);