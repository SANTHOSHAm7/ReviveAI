const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();

const server = http.createServer(app);


// ============================================
// SOCKET.IO
// ============================================

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});


// ============================================
// MIDDLEWARE
// ============================================

app.use(cors());

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
        payment.amount / 100;

    const method =
        payment.method || "unknown";

    const reason =
        payment.error_description ||
        payment.error_reason ||
        "Payment failure";


    let retryScore = 55;

    let paymentLinkScore = 72;

    let reminderScore = 58;


    const lowerReason =
        reason.toLowerCase();


    // Network / timeout
    if (
        lowerReason.includes("network") ||
        lowerReason.includes("timeout") ||
        lowerReason.includes("temporary")
    ) {

        retryScore += 25;

        paymentLinkScore += 10;

    }


    // Bank decline
    if (
        lowerReason.includes("declined") ||
        lowerReason.includes("bank")
    ) {

        retryScore -= 15;

        paymentLinkScore += 15;

        reminderScore += 5;

    }


    // UPI
    if (method === "upi") {

        retryScore += 8;

        paymentLinkScore += 10;

    }


    // Card
    if (method === "card") {

        retryScore += 5;

        paymentLinkScore += 8;

    }


    // Net Banking
    if (
        method === "netbanking" ||
        method === "net banking"
    ) {

        paymentLinkScore += 12;

        reminderScore += 5;

    }


    // Small transaction
    if (amount < 5000) {

        retryScore += 8;

        paymentLinkScore += 8;

    }


    // Large transaction
    if (amount >= 10000) {

        paymentLinkScore += 5;

        reminderScore += 5;

    }


    // Clamp scores
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


    const strategies = {

        retry: retryScore,

        paymentLink:
            paymentLinkScore,

        reminder:
            reminderScore,

    };


    // Find best strategy
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
        bestStrategy[0] ===
        "paymentLink"
    ) {

        recommendedAction =
            "Send Payment Link";

    }


    const recoveryProbability =
        bestStrategy[1];


    const expectedRevenue =
        Math.round(
            amount *
            (
                recoveryProbability /
                100
            )
        );


    return {

        strategies,

        selectedStrategy:
            bestStrategy[0],

        recommendedAction,

        recoveryProbability,

        expectedRevenue,

        reason,

        analyzedAt:
            new Date().toISOString(),

    };

}


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
                new Date().toISOString(),

        });

    }
);


// ============================================
// RAZORPAY WEBHOOK
// ============================================

app.post(
    "/api/webhooks/razorpay",
    (req, res) => {

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
            event.event
        );


        const payment =
            event?.payload?.payment?.entity;


        if (!payment) {

            console.log(
                "⚠️ Payment information missing"
            );


            return res.json({

                received: true,

                processed: false,

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
                new Date().toISOString(),

        };


        // Store event

        liveEvents.unshift(
            recoveryEvent
        );


        // Keep latest 50

        if (
            liveEvents.length > 50
        ) {

            liveEvents.pop();

        }


        // ====================================
        // REAL-TIME SOCKET BROADCAST
        // ====================================

        io.emit(
            "payment-failed",
            recoveryEvent
        );


        console.log("");

        console.log(
            "🧠 AI ANALYSIS"
        );

        console.log(
            "Recovery Probability:",
            aiAnalysis
                .recoveryProbability +
            "%"
        );

        console.log(
            "Recommended Action:",
            aiAnalysis
                .recommendedAction
        );

        console.log(
            "Expected Revenue: ₹",
            aiAnalysis
                .expectedRevenue
        );

        console.log(
            "⚡ Event broadcast to React"
        );

        console.log(
            "================================"
        );

        console.log("");


        res.json({

            received: true,

            processed: true,

            recovery:
                recoveryEvent,

        });

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
                liveEvents.length,

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
                    "No payment failures received yet.",

            });

        }


        res.json({

            success: true,

            recovery:
                liveEvents[0],

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
                    "ReviveAI real-time connection active",
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
// START SERVER
// ============================================

const PORT = process.env.PORT || 10000;
const HOST = "0.0.0.0";

server.listen(PORT, HOST, () => {
  console.log("🚀 ReviveAI Backend Started");
  console.log(`🌐 Server running on port ${PORT}`);
  console.log("🧠 AI Recovery Engine: ACTIVE");
  console.log("⚡ Real-Time Events: ACTIVE");
  console.log("🔌 Socket.IO: ACTIVE");
});
