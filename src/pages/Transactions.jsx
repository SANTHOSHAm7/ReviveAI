import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
    Radio,
    CheckCircle2,
    XCircle,
    BrainCircuit,
    Clock3,
    RefreshCw,
} from "lucide-react";

const socket = io("http://localhost:5000");

function Transactions() {

    const [transactions, setTransactions] = useState([]);

    const [connected, setConnected] =
        useState(false);

    const [lastUpdate, setLastUpdate] =
        useState(null);


    // ==========================================
    // LOAD EXISTING EVENTS
    // ==========================================

    useEffect(() => {

        fetch("http://localhost:5000/api/events")
            .then((response) =>
                response.json()
            )
            .then((data) => {

                const events =
                    data.events || [];

                setTransactions(
                    events.map(formatTransaction)
                );

            })
            .catch((error) => {

                console.error(
                    "Failed to load events:",
                    error
                );

            });

    }, []);


    // ==========================================
    // REAL-TIME SOCKET
    // ==========================================

    useEffect(() => {

        socket.on("connect", () => {

            setConnected(true);

        });


        socket.on("disconnect", () => {

            setConnected(false);

        });


        socket.on(
            "payment-failed",
            (event) => {

                console.log(
                    "⚡ LIVE TRANSACTION:",
                    event
                );


                const transaction =
                    formatTransaction(event);


                setTransactions(
                    (previous) => [

                        transaction,

                        ...previous.filter(
                            (item) =>
                                item.id !==
                                transaction.id
                        ),

                    ].slice(0, 50)
                );


                setLastUpdate(
                    new Date()
                );

            }
        );


        return () => {

            socket.off("connect");

            socket.off("disconnect");

            socket.off("payment-failed");

        };

    }, []);


    // ==========================================
    // FORMAT TRANSACTION
    // ==========================================

    function formatTransaction(event) {

        const ai =
            event.aiAnalysis || {};


        return {

            id:
                event.id ||
                `TXN-${Date.now()}`,

            customer:
                event.customer ||
                "Live Customer",

            amount:
                event.amount
                    ? event.amount / 100
                    : 0,

            method:
                event.method ||
                "Unknown",

            status:
                event.recoveryStatus ===
                    "RECOVERED"
                    ? "Recovered"
                    : "Failed",

            failureReason:
                event.failureReason ||
                "Payment failure",

            recoveryProbability:
                ai.recoveryProbability ||
                0,

            recommendedAction:
                ai.recommendedAction ||
                "Analyze",

            expectedRevenue:
                ai.expectedRevenue ||
                0,

            createdAt:
                event.createdAt ||
                new Date().toISOString(),

        };

    }


    // ==========================================
    // FORMAT MONEY
    // ==========================================

    const money = (value) => {

        return `₹${Number(value).toLocaleString(
            "en-IN"
        )}`;

    };


    // ==========================================
    // FORMAT TIME
    // ==========================================

    const timeAgo = (date) => {

        const seconds =
            Math.floor(
                (
                    Date.now() -
                    new Date(date).getTime()
                ) / 1000
            );


        if (seconds < 10) {
            return "Just now";
        }


        if (seconds < 60) {
            return `${seconds}s ago`;
        }


        const minutes =
            Math.floor(
                seconds / 60
            );


        if (minutes < 60) {
            return `${minutes}m ago`;
        }


        return new Date(
            date
        ).toLocaleTimeString();

    };


    return (

        <main className="transactions-page">


            {/* ==================================
                HEADER
            ================================== */}

            <div className="transactions-header">

                <div>

                    <span className="eyebrow">
                        PAYMENTS
                    </span>

                    <h1>
                        Live Transactions
                    </h1>

                    <p>
                        Monitor payment activity and
                        AI-powered recovery decisions in real time.
                    </p>

                </div>


                <div className="transaction-live-status">

                    <span
                        className={
                            connected
                                ? "live-dot"
                                : "offline-dot"
                        }
                    />

                    {connected
                        ? "LIVE"
                        : "OFFLINE"}

                </div>

            </div>


            {/* ==================================
                LIVE SUMMARY
            ================================== */}

            <section className="transaction-summary">

                <div className="transaction-summary-card">

                    <Radio size={20} />

                    <div>

                        <span>
                            CONNECTION
                        </span>

                        <strong>
                            {connected
                                ? "Real-Time Active"
                                : "Disconnected"}
                        </strong>

                    </div>

                </div>


                <div className="transaction-summary-card">

                    <RefreshCw size={20} />

                    <div>

                        <span>
                            LIVE EVENTS
                        </span>

                        <strong>
                            {transactions.length}
                        </strong>

                    </div>

                </div>


                <div className="transaction-summary-card">

                    <BrainCircuit size={20} />

                    <div>

                        <span>
                            AI ENGINE
                        </span>

                        <strong>
                            ACTIVE
                        </strong>

                    </div>

                </div>


                <div className="transaction-summary-card">

                    <Clock3 size={20} />

                    <div>

                        <span>
                            LAST UPDATE
                        </span>

                        <strong>

                            {lastUpdate
                                ? lastUpdate.toLocaleTimeString()
                                : "Waiting..."}

                        </strong>

                    </div>

                </div>

            </section>


            {/* ==================================
                TRANSACTION TABLE
            ================================== */}

            <section className="transactions-card">

                <div className="transactions-card-header">

                    <div>

                        <h2>
                            Live Payment Stream
                        </h2>

                        <span>
                            Incoming payment events
                        </span>

                    </div>

                    <div className="stream-active">

                        <span className="live-dot" />

                        STREAM ACTIVE

                    </div>

                </div>


                {transactions.length === 0 ? (

                    <div className="empty-transactions">

                        <Radio size={32} />

                        <h3>
                            Waiting for payment events
                        </h3>

                        <p>
                            New Razorpay payment events
                            will appear here automatically.
                        </p>

                    </div>

                ) : (

                    <div className="transaction-list">

                        {transactions.map(
                            (transaction) => (

                                <div
                                    className="transaction-row"
                                    key={
                                        transaction.id
                                    }
                                >


                                    {/* CUSTOMER */}

                                    <div className="transaction-customer">

                                        <div className="customer-avatar-small">

                                            {transaction.customer
                                                .charAt(0)
                                                .toUpperCase()}

                                        </div>

                                        <div>

                                            <strong>
                                                {
                                                    transaction.customer
                                                }
                                            </strong>

                                            <span>
                                                {
                                                    transaction.id
                                                }
                                            </span>

                                        </div>

                                    </div>


                                    {/* AMOUNT */}

                                    <div className="transaction-amount">

                                        <strong>
                                            {money(
                                                transaction.amount
                                            )}
                                        </strong>

                                        <span>
                                            {
                                                transaction.method
                                            }
                                        </span>

                                    </div>


                                    {/* FAILURE */}

                                    <div className="transaction-reason">

                                        {transaction.status ===
                                            "Recovered" ? (

                                            <span className="status-recovered">

                                                <CheckCircle2
                                                    size={14}
                                                />

                                                Recovered

                                            </span>

                                        ) : (

                                            <span className="status-failed">

                                                <XCircle
                                                    size={14}
                                                />

                                                Failed

                                            </span>

                                        )}

                                        <small>
                                            {
                                                transaction.failureReason
                                            }
                                        </small>

                                    </div>


                                    {/* AI SCORE */}

                                    <div className="transaction-ai">

                                        <div>

                                            <BrainCircuit
                                                size={15}
                                            />

                                            <span>
                                                AI Recovery
                                            </span>

                                        </div>

                                        <strong>

                                            {
                                                transaction.recoveryProbability
                                            }%

                                        </strong>

                                    </div>


                                    {/* ACTION */}

                                    <div className="transaction-action">

                                        <span>
                                            Recommended
                                        </span>

                                        <strong>
                                            {
                                                transaction.recommendedAction
                                            }
                                        </strong>

                                        <small>
                                            Recover{" "}
                                            {money(
                                                transaction.expectedRevenue
                                            )}
                                        </small>

                                    </div>


                                    {/* TIME */}

                                    <div className="transaction-time">

                                        <Clock3
                                            size={13}
                                        />

                                        {timeAgo(
                                            transaction.createdAt
                                        )}

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>

        </main>

    );

}

export default Transactions;