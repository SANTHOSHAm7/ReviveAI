import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
    BrainCircuit,
    Radio,
    Zap,
    CheckCircle2,
    AlertTriangle,
    Clock3,
    IndianRupee,
} from "lucide-react";

const SOCKET_URL = "http://localhost:5000";

function Recovery() {
    const [connected, setConnected] = useState(false);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);

    useEffect(() => {
        const socket = io(SOCKET_URL, {
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
        });

        socket.on("connect", () => {
            console.log("🟢 Recovery Center connected");
            setConnected(true);
        });

        socket.on("disconnect", () => {
            console.log("🔴 Recovery Center disconnected");
            setConnected(false);
        });

        const handlePaymentEvent = (data) => {
            console.log("⚡ LIVE PAYMENT:", data);

            const event = {
                id:
                    data?.id ||
                    data?.paymentId ||
                    `LIVE-${Date.now()}`,

                customer:
                    data?.customer ||
                    data?.customerName ||
                    "Live Customer",

                amount:
                    Number(data?.amount) ||
                    Number(data?.transaction?.amount) ||
                    0,

                method:
                    data?.method ||
                    data?.paymentMethod ||
                    "UPI",

                reason:
                    data?.failureReason ||
                    data?.reason ||
                    data?.error ||
                    "Payment Failed",

                score:
                    Number(data?.score) ||
                    Number(data?.recoveryProbability) ||
                    Number(data?.analysis?.score) ||
                    85,

                recommendation:
                    data?.recommendation ||
                    data?.recommendedAction ||
                    data?.analysis?.recommendation ||
                    "Send Payment Link",

                expectedRecovery:
                    Number(data?.expectedRecovery) ||
                    Number(data?.expectedRevenue) ||
                    Number(data?.analysis?.expectedRecovery) ||
                    Math.round(
                        (Number(data?.amount) || 0) * 0.85
                    ),

                time: new Date(),
            };

            setEvents((previous) => [
                event,
                ...previous,
            ].slice(0, 20));

            setSelectedEvent(event);
            setLastUpdate(new Date());
        };

        // Listen to possible backend event names
        socket.on("payment.failed", handlePaymentEvent);
        socket.on("payment_failed", handlePaymentEvent);
        socket.on("payment-event", handlePaymentEvent);
        socket.on("payment", handlePaymentEvent);
        socket.on("recovery.analysis", handlePaymentEvent);

        return () => {
            socket.off("connect");
            socket.off("disconnect");

            socket.off("payment.failed", handlePaymentEvent);
            socket.off("payment_failed", handlePaymentEvent);
            socket.off("payment-event", handlePaymentEvent);
            socket.off("payment", handlePaymentEvent);
            socket.off("recovery.analysis", handlePaymentEvent);

            socket.disconnect();
        };
    }, []);

    const formatMoney = (amount) => {
        return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
    };

    const formatTime = (date) => {
        if (!date) return "Waiting...";

        return new Date(date).toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            }
        );
    };

    return (
        <main
            style={{
                padding: "36px",
                minHeight: "100vh",
                background: "#f5f7fb",
            }}
        >

            {/* HEADER */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "28px",
                }}
            >
                <div>
                    <div
                        style={{
                            fontSize: "11px",
                            letterSpacing: "2px",
                            color: "#7b8494",
                            marginBottom: "8px",
                        }}
                    >
                        ARTIFICIAL INTELLIGENCE
                    </div>

                    <h1
                        style={{
                            margin: 0,
                            fontSize: "32px",
                            color: "#111827",
                        }}
                    >
                        AI Recovery Command Center
                    </h1>

                    <p
                        style={{
                            color: "#667085",
                            marginTop: "8px",
                        }}
                    >
                        ReviveAI continuously analyzes failed
                        payments and selects the highest-probability
                        recovery strategy.
                    </p>
                </div>

                {/* LIVE STATUS */}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "9px",
                        padding: "10px 16px",
                        background: connected
                            ? "#ecfdf3"
                            : "#fef2f2",
                        borderRadius: "999px",
                        border: `1px solid ${connected
                                ? "#bbf7d0"
                                : "#fecaca"
                            }`,
                        color: connected
                            ? "#15803d"
                            : "#dc2626",
                        fontWeight: 600,
                    }}
                >
                    <span
                        style={{
                            width: "9px",
                            height: "9px",
                            borderRadius: "50%",
                            background: connected
                                ? "#22c55e"
                                : "#ef4444",
                            boxShadow: connected
                                ? "0 0 0 5px #dcfce7"
                                : "none",
                        }}
                    />

                    {connected
                        ? "LIVE • REAL-TIME ACTIVE"
                        : "OFFLINE • CONNECTING..."}
                </div>
            </div>


            {/* ENGINE STATUS */}

            <section
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(3, 1fr)",
                    gap: "18px",
                    marginBottom: "22px",
                }}
            >

                <StatusCard
                    icon={<Radio size={21} />}
                    title="REAL-TIME CONNECTION"
                    value={
                        connected
                            ? "Connected"
                            : "Disconnected"
                    }
                    active={connected}
                />

                <StatusCard
                    icon={<BrainCircuit size={21} />}
                    title="AI RECOVERY ENGINE"
                    value="ACTIVE"
                    active={true}
                />

                <StatusCard
                    icon={<Zap size={21} />}
                    title="LIVE EVENTS"
                    value={`${events.length} received`}
                    active={events.length > 0}
                />

            </section>


            {/* LIVE ANALYSIS */}

            <section
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "1.5fr 1fr",
                    gap: "22px",
                }}
            >

                {/* LIVE STREAM */}

                <div
                    style={{
                        background: "#ffffff",
                        borderRadius: "18px",
                        border: "1px solid #e5e7eb",
                        padding: "24px",
                        boxShadow:
                            "0 8px 30px rgba(15,23,42,0.05)",
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: "center",
                            marginBottom: "20px",
                        }}
                    >

                        <div>
                            <h2
                                style={{
                                    margin: 0,
                                    color: "#111827",
                                }}
                            >
                                Live AI Analysis
                            </h2>

                            <p
                                style={{
                                    margin: "6px 0 0",
                                    color: "#8a94a6",
                                }}
                            >
                                Incoming payment failures
                            </p>
                        </div>

                        <div
                            style={{
                                color: "#16a34a",
                                fontSize: "12px",
                                fontWeight: 700,
                            }}
                        >
                            ● LIVE STREAM
                        </div>

                    </div>


                    {events.length === 0 ? (

                        <div
                            style={{
                                padding: "55px 20px",
                                textAlign: "center",
                                color: "#667085",
                            }}
                        >
                            <Radio
                                size={42}
                                style={{
                                    marginBottom: "14px",
                                }}
                            />

                            <h3
                                style={{
                                    margin: "5px 0",
                                    color: "#1f2937",
                                }}
                            >
                                Waiting for payment failure
                            </h3>

                            <p>
                                Trigger a failed payment from
                                your Dashboard.
                            </p>
                        </div>

                    ) : (

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                                maxHeight: "520px",
                                overflowY: "auto",
                            }}
                        >

                            {events.map((event) => (

                                <button
                                    key={event.id}
                                    onClick={() =>
                                        setSelectedEvent(event)
                                    }
                                    style={{
                                        textAlign: "left",
                                        border: "1px solid #e5e7eb",
                                        background:
                                            selectedEvent?.id ===
                                                event.id
                                                ? "#f0f9ff"
                                                : "#ffffff",
                                        borderRadius: "12px",
                                        padding: "16px",
                                        cursor: "pointer",
                                    }}
                                >

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent:
                                                "space-between",
                                        }}
                                    >

                                        <strong>
                                            {event.customer}
                                        </strong>

                                        <strong>
                                            {formatMoney(
                                                event.amount
                                            )}
                                        </strong>

                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent:
                                                "space-between",
                                            marginTop: "8px",
                                            fontSize: "12px",
                                            color: "#667085",
                                        }}
                                    >

                                        <span>
                                            {event.method}
                                        </span>

                                        <span>
                                            {event.reason}
                                        </span>

                                        <span>
                                            {formatTime(
                                                event.time
                                            )}
                                        </span>

                                    </div>

                                </button>

                            ))}

                        </div>

                    )}

                </div>


                {/* AI DECISION */}

                <div
                    style={{
                        background:
                            "linear-gradient(145deg,#111827,#1e293b)",
                        color: "white",
                        borderRadius: "18px",
                        padding: "26px",
                        minHeight: "360px",
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                        }}
                    >

                        <div
                            style={{
                                width: "46px",
                                height: "46px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent:
                                    "center",
                                background:
                                    "rgba(255,255,255,0.1)",
                                borderRadius: "12px",
                            }}
                        >
                            <BrainCircuit />
                        </div>

                        <div>
                            <div
                                style={{
                                    fontSize: "12px",
                                    color: "#94a3b8",
                                }}
                            >
                                AI DECISION ENGINE
                            </div>

                            <h2
                                style={{
                                    margin: "3px 0",
                                }}
                            >
                                Live Recovery
                            </h2>
                        </div>

                    </div>


                    {!selectedEvent ? (

                        <div
                            style={{
                                marginTop: "70px",
                                textAlign: "center",
                                color: "#94a3b8",
                            }}
                        >
                            <Clock3 size={38} />

                            <p>
                                Waiting for live transaction...
                            </p>
                        </div>

                    ) : (

                        <div style={{ marginTop: "30px" }}>

                            <div
                                style={{
                                    color: "#94a3b8",
                                    fontSize: "12px",
                                }}
                            >
                                CUSTOMER
                            </div>

                            <h2>
                                {selectedEvent.customer}
                            </h2>


                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "1fr 1fr",
                                    gap: "12px",
                                    marginTop: "20px",
                                }}
                            >

                                <Info
                                    label="Amount"
                                    value={formatMoney(
                                        selectedEvent.amount
                                    )}
                                />

                                <Info
                                    label="Recovery Probability"
                                    value={`${selectedEvent.score}%`}
                                />

                                <Info
                                    label="Failure"
                                    value={selectedEvent.reason}
                                />

                                <Info
                                    label="Expected Recovery"
                                    value={formatMoney(
                                        selectedEvent.expectedRecovery
                                    )}
                                />

                            </div>


                            <div
                                style={{
                                    marginTop: "22px",
                                    padding: "18px",
                                    background:
                                        "rgba(255,255,255,0.08)",
                                    borderRadius: "14px",
                                }}
                            >

                                <div
                                    style={{
                                        color: "#94a3b8",
                                        fontSize: "11px",
                                        marginBottom: "6px",
                                    }}
                                >
                                    RECOMMENDED ACTION
                                </div>

                                <strong
                                    style={{
                                        fontSize: "18px",
                                    }}
                                >
                                    {selectedEvent.recommendation}
                                </strong>

                            </div>


                            <button
                                style={{
                                    width: "100%",
                                    marginTop: "18px",
                                    padding: "13px",
                                    border: "none",
                                    borderRadius: "10px",
                                    background: "#ffffff",
                                    color: "#111827",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    alert(
                                        `Recovery strategy executed for ${selectedEvent.customer}`
                                    );
                                }}
                            >
                                Execute Recovery Strategy →
                            </button>

                        </div>

                    )}

                </div>

            </section>


            {/* LAST UPDATE */}

            <div
                style={{
                    marginTop: "18px",
                    color: "#8a94a6",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                }}
            >
                <Clock3 size={14} />

                Last update:
                {" "}
                {lastUpdate
                    ? formatTime(lastUpdate)
                    : "Waiting for live event"}
            </div>

        </main>
    );
}


/* STATUS CARD */

function StatusCard({
    icon,
    title,
    value,
    active,
}) {
    return (
        <div
            style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                gap: "15px",
            }}
        >

            <div
                style={{
                    width: "44px",
                    height: "44px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "11px",
                    background: "#f3f4f6",
                }}
            >
                {icon}
            </div>

            <div>

                <div
                    style={{
                        fontSize: "10px",
                        letterSpacing: "1px",
                        color: "#98a2b3",
                    }}
                >
                    {title}
                </div>

                <strong
                    style={{
                        display: "block",
                        marginTop: "5px",
                        color: active
                            ? "#16a34a"
                            : "#dc2626",
                    }}
                >
                    {value}
                </strong>

            </div>

        </div>
    );
}


/* INFO */

function Info({ label, value }) {
    return (
        <div
            style={{
                padding: "12px",
                background:
                    "rgba(255,255,255,0.06)",
                borderRadius: "10px",
            }}
        >
            <div
                style={{
                    fontSize: "10px",
                    color: "#94a3b8",
                    marginBottom: "5px",
                }}
            >
                {label}
            </div>

            <strong>{value}</strong>
        </div>
    );
}

export default Recovery;