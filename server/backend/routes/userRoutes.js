import express from "express";

const router = express.Router();

router.post("/sync", async (req, res) => {
    try {
        const { clerkUserId, email, fullName, role } = req.body;

        if (!clerkUserId || !email) {
            return res.status(400).json({
                success: false,
                message: "clerkUserId and email are required"
            });
        }

        // For now, no database.
        // We are only testing if frontend → backend user sync works.
        return res.status(200).json({
            success: true,
            message: "User synced successfully",
            user: {
                clerkUserId,
                email,
                fullName: fullName || "Student",
                role: role || "student"
            }
        });

    } catch (error) {
        console.error("User sync error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

router.get("/profile/:clerkUserId", async (req, res) => {
    try {
        const { clerkUserId } = req.params;

        return res.status(200).json({
            success: true,
            message: "Profile route working",
            user: {
                clerkUserId
            }
        });

    } catch (error) {
        console.error("Profile fetch error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

export default router;