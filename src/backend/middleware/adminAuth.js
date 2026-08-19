
const db = require("../db");

const adminAuth = (req, res, next) => {
    const userId = req.headers["user-id"];

    if (!userId) {
        return res.status(401).json({
            message: "Admin login required"
        });
    }

    const sql = `
        SELECT id, role
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            console.error("ADMIN AUTH ERROR:", err);

            return res.status(500).json({
                message: "Database error"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        if (results[0].role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Admin only."
            });
        }

        req.user = results[0];

        next();
    });
};

module.exports = adminAuth;

