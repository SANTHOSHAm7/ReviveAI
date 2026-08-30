import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
    Radio,
    User,
    CreditCard,
    BrainCircuit,
    AlertTriangle,
} from "lucide-react";

const socket = io("http://localhost:5000");

function LiveCustomer() {

    const [customer, setCustomer] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {

        socket.on("connection-status", () => {
            setConnected(true);
        });

        socket.on("connect", () => {
            setConnected(true);
        });

        socket.on("disconnect", () => {
            setConnected(false);
        });

        socket.on(
            "payment-failed",
            (event) => {

                const ai =
                    event.aiAnalysis;

                setCustomer({
                    name: "Live Customer",

                    paymentId:
                        event.id,

                    amount:
                        event.amount / 100,

                    method:
                        event.method,

                    status:
                        event.status,

                    failureReason:
                        event.failureReason,

                    recoveryProbability:
                        ai.recoveryProbability,

                    recommendation:
                        ai.recommendedAction,

                    expectedRevenue:
                        ai.expectedRevenue,

                    time:
                        new Date(
                            event.createdAt
                        ).toLocaleTimeString(),
                });

            }
        );

        return () => {

            socket.off(
                "payment-failed"
            );

            socket.off(
                "connection-status"
            );

        };

    }, []);


    return (

        <section className="live-customer-card">

            <div className="live-customer-header">

                <div>

                    <span className="eyebrow">
                        REAL-TIME MONITOR
                    </span>

                    <h2>
                        Live Customer Activity
                    </h2>

                </div>

                <div className="live-status">

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


            {!customer ? (

                <div className="waiting-state">

                    <Radio size={28} />

                    <strong>
                        Waiting for payment activity...
                    </strong>

                    <span>
                        New failed payments will
                        appear here automatically.
                    </span>

                </div>

            ) : (

                <div className="customer-event">

                    <div className="customer-main">

                        <div className="customer-avatar">
                            <User size={22} />
                        </div>

                        <div>

                            <strong>
                                {customer.name}
                            </strong>

                            <span>
                                Payment ID: {customer.paymentId}
                            </span>

                        </div>

                    </div>


                    <div className="customer-details">

                        <div>

                            <CreditCard size={16} />

                            <span>
                                {customer.method}
                            </span>

                        </div>


                        <strong>
                            ₹
                            {customer.amount.toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                    </div>


                    <div className="customer-failure">

                        <AlertTriangle size={16} />

                        <span>
                            {customer.failureReason}
                        </span>

                    </div>


                    <div className="customer-ai">

                        <BrainCircuit size={18} />

                        <div>

                            <span>
                                AI RECOVERY
                            </span>

                            <strong>
                                {customer.recoveryProbability}%
                            </strong>

                        </div>

                    </div>


                    <div className="customer-recommendation">

                        <span>
                            RECOMMENDED ACTION
                        </span>

                        <strong>
                            {customer.recommendation}
                        </strong>

                        <small>
                            Expected recovery: ₹
                            {customer.expectedRevenue.toLocaleString(
                                "en-IN"
                            )}
                        </small>

                    </div>


                    <div className="event-time">
                        {customer.time}
                    </div>

                </div>

            )}

        </section>

    );

}

export default LiveCustomer;