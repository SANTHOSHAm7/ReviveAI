const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// ============================================
// CORS
// ============================================

const allowedOrigins = [
    "http://localhost:5173",
    "https://revive-ai-beta.vercel.app"
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests without an origin
        // such as Postman, Razorpay webhooks, etc.
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
};

// ============================================
// SOCKET.IO
// ============================================

const io = new Server(server, {
    cors: corsOptions
});

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors(corsOptions));

app.use(express.json());


// ============================================
// REAL-TIME DATA
// ============================================

let liveEvents = [];


// ============================================
// AI RECOVERY ENGINE
// ============================================

function analyzeRecovery(payment) {

    const amount =
        Number(payment.amount || 0) / 100;

    const method =
        (payment.method || "unknown").toLowerCase();

    const reason =
        payment.error_description ||
        payment.error_reason ||
        payment.error_code ||
        "Payment failure";

    let retryScore = 55;

    let paymentLinkScore = 72;

    let reminderScore = 58;

    const lowerReason =
        String(reason).toLowerCase();


    // ========================================
    // NETWORK / TIMEOUT
    // ========================================

    if (
        lowerReason.includes("network") ||
        lowerReason.includes("timeout") ||
        lowerReason.includes("temporary") ||
        lowerReason.includes("timed out")
    ) {

        retryScore += 25;

        paymentLinkScore += 10;
    }


    // ========================================
    // BANK DECLINE
    // ========================================

    if (
        lowerReason.includes("declined") ||
        lowerReason.includes("bank") ||
        lowerReason.includes("insufficient")
    ) {

        retryScore -= 15;

        paymentLinkScore += 15;

        reminderScore += 5;
    }


    // ========================================
    // UPI
    // ========================================

    if (method === "upi") {

        retryScore += 8;

        paymentLinkScore += 10;
    }


    // ========================================
    // CARD
    // ========================================

    if (method === "card") {

        retryScore += 5;

        paymentLinkScore += 8;
    }


    // ========================================
    // NET BANKING
    // ========================================

    if (
        method === "netbanking" ||
        method === "net banking"
    ) {

        paymentLinkScore += 12;

        reminderScore += 5;
    }


    // ========================================
    // SMALL TRANSACTION
    // ========================================

    if (amount < 5000) {

        retryScore += 8;

        paymentLinkScore += 8;
    }


    // ========================================
    // LARGE TRANSACTION
    // ========================================

    if (amount >= 10000) {

        paymentLinkScore += 5;

        reminderScore += 5;
    }


    // ========================================
    // CLAMP SCORES
    // ========================================

    retryScore =
        Math.min(
            98,
            Math.max(1, retryScore)
        );

    paymentLinkScore =
        Math.min(
            98,
            Math.max(1, paymentLinkScore)
        );

    reminderScore =
        Math.min(
            98,
            Math.max(1, reminderScore)
        );


    // ========================================
    // STRATEGIES
    // ========================================

    const strategies = {

        retry: retryScore,

        paymentLink:
            paymentLinkScore,

        reminder:
            reminderScore
    };


    // ========================================
    // FIND BEST STRATEGY
    // ========================================

    const bestStrategy =
        Object.entries(strategies)
            .sort(
                (a, b) =>
                    b[1] - a[1]
            )[0];


    let recommendedAction =
        "Send Reminder";


    if (
        bestStrategy[0] === "retry"
    ) {

        recommendedAction =
            "Retry Payment";
    }


    if (
        bestStrategy[0] === "paymentLink"
    ) {

        recommendedAction =
            "Send Payment Link";
    }


    const recoveryProbability =
        bestStrategy[1];


    // ========================================
    // EXPECTED REVENUE
    // ========================================

    const expectedRevenue =
        Math.round(
            amount *
            (
                recoveryProbability / 100
            )
        );


    // ========================================
    // RETURN AI RESULT
    // ========================================

    return {

        strategies,

        selectedStrategy:
            bestStrategy[0],

        recommendedAction,

        recoveryProbability,

        expectedRevenue,

        reason,

        analyzedAt:
            new Date().toISOString()
    };
}


// ============================================
// ROOT TEST
// ============================================

app.get("/", (req, res) => {

    res.json({

        status: "online",

        service: "ReviveAI Backend",

        message:
            "ReviveAI API is running 🚀",

        endpoints: {

            health:
                "/api/health",

            events:
                "/api/events",

            latestRecovery:
                "/api/recovery/latest",

            razorpayWebhook:
                "/api/webhooks/razorpay"
        }

    });
});


// ============================================
// HEALTH CHECK
// ============================================

app.get(
    "/api/health",
    (req, res) => {

        res.json({

            status: "online",

            service: "ReviveAI",

            mode: "real-time",

            aiEngine: "active",

            socket: "active",

            timestamp:
                new Date().toISOString()

        });

    }
);


// ============================================
// RAZORPAY WEBHOOK
// ============================================

app.post(
    "/api/webhooks/razorpay",
    (req, res) => {

        try {

            const event =
                req.body;


            console.log("");

            console.log(
                "================================"
            );

            console.log(
                "⚡ PAYMENT EVENT RECEIVED"
            );

            console.log(
                "Event:",
                event?.event
            );


            const payment =
                event?.payload?.payment?.entity;


            // ====================================
            // PAYMENT DATA CHECK
            // ====================================

            if (!payment) {

                console.log(
                    "⚠️ Payment information missing"
                );

                return res.json({

                    received: true,

                    processed: false

                });

            }


            // ====================================
            // AI ANALYSIS
            // ====================================

            const aiAnalysis =
                analyzeRecovery(payment);


            // ====================================
            // RECOVERY EVENT
            // ====================================

            const recoveryEvent = {

                id:
                    payment.id,

                type:
                    event.event,

                amount:
                    payment.amount,

                currency:
                    payment.currency,

                status:
                    payment.status,

                method:
                    payment.method,

                failureReason:
                    aiAnalysis.reason,

                aiAnalysis,

                recoveryStatus:
                    "ACTION_REQUIRED",

                createdAt:
                    new Date().toISOString()
            };


            // ====================================
            // STORE EVENT
            // ====================================

            liveEvents.unshift(
                recoveryEvent
            );


            // Keep latest 50 events

            if (
                liveEvents.length > 50
            ) {

                liveEvents.pop();

            }


            // ====================================
            // SOCKET BROADCAST
            // ====================================

            io.emit(
                "payment-failed",
                recoveryEvent
            );


            // ====================================
            // LOG AI RESULT
            // ====================================

            console.log("");

            console.log(
                "🧠 AI ANALYSIS"
            );

            console.log(
                "Recovery Probability:",
                aiAnalysis.recoveryProbability + "%"
            );

            console.log(
                "Recommended Action:",
                aiAnalysis.recommendedAction
            );

            console.log(
                "Expected Revenue: ₹",
                aiAnalysis.expectedRevenue
            );

            console.log(
                "⚡ Event broadcast to React"
            );

            console.log(
                "================================"
            );

            console.log("");


            // ====================================
            // RESPONSE
            // ====================================

            return res.json({

                received: true,

                processed: true,

                recovery:
                    recoveryEvent

            });

        } catch (error) {

            console.error(
                "❌ Webhook processing error:",
                error
            );

            return res.status(500).json({

                received: false,

                processed: false,

                error:
                    "Webhook processing failed"

            });

        }

    }
);


// ============================================
// GET LIVE EVENTS
// ============================================

app.get(
    "/api/events",
    (req, res) => {

        res.json({

            events:
                liveEvents,

            count:
                liveEvents.length

        });

    }
);


// ============================================
// LATEST AI DECISION
// ============================================

app.get(
    "/api/recovery/latest",
    (req, res) => {

        if (
            liveEvents.length === 0
        ) {

            return res.json({

                success: false,

                message:
                    "No payment failures received yet."

            });

        }


        res.json({

            success: true,

            recovery:
                liveEvents[0]

        });

    }
);


// ============================================
// SOCKET CONNECTION
// ============================================

io.on(
    "connection",
    (socket) => {

        console.log(
            "🔌 React dashboard connected:",
            socket.id
        );


        socket.emit(
            "connection-status",
            {

                connected: true,

                message:
                    "ReviveAI real-time connection active"

            }
        );


        socket.on(
            "disconnect",
            () => {

                console.log(
                    "🔌 React dashboard disconnected:",
                    socket.id
                );

            }
        );

    }
);


// ============================================
// 404 HANDLER
// ============================================

app.use(
    (req, res) => {

        res.status(404).json({

            status: "error",

            message:
                "Route not found",

            path:
                req.originalUrl

        });

    }
);


// ============================================
// ERROR HANDLER
// ============================================

app.use(
    (err, req, res, next) => {

        console.error(
            "❌ Server error:",
            err
        );

        res.status(500).json({

            status: "error",

            message:
                "Internal server error"

        });

    }
);


// ============================================
// START SERVER
// ============================================

const PORT =
    process.env.PORT || 10000;

const HOST =
    "0.0.0.0";


server.listen(
    PORT,
    HOST,
    () => {

        console.log(
            "🚀 ReviveAI Backend Started"
        );

        console.log(
            `🌐 Server running on port ${PORT}`
        );

        console.log(
            "🧠 AI Recovery Engine: ACTIVE"
        );

        console.log(
            "⚡ Real-Time Events: ACTIVE"
        );

        console.log(
            "🔌 Socket.IO: ACTIVE"
        );

    }
);
