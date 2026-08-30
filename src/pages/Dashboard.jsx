import { useState } from "react";

import {
    IndianRupee,
    AlertTriangle,
    BrainCircuit,
    CheckCircle2,
    Zap,
} from "lucide-react";

import StatCard from "../components/StatCard";
import RevenueChart from "../components/RevenueChart";
import RecoveryTable from "../components/RecoveryTable";
import AIRecommendation from "../components/AIRecommendation";
import RecoveryTwin from "../components/RecoveryTwin";
import LiveCustomer from "../components/LiveCustomer";

import { analyzePayment } from "../services/aiEngine";
import { sendTestPaymentFailure } from "../services/api";


function Dashboard() {

    const [simulation, setSimulation] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [sendingEvent, setSendingEvent] = useState(false);


    // ============================================
    // LOCAL AI DEMO
    // ============================================

    const simulatePayment = () => {

        const customers = [
            {
                name: "Rahul Kumar",
                successfulPayments: 7,
            },
            {
                name: "Priya Sharma",
                successfulPayments: 4,
            },
            {
                name: "Arjun Reddy",
                successfulPayments: 2,
            },
            {
                name: "Sneha Patel",
                successfulPayments: 8,
            },
            {
                name: "Vikram Singh",
                successfulPayments: 5,
            },
        ];


        const reasons = [
            "Network Error",
            "Timeout",
            "Bank Declined",
            "Insufficient Funds",
        ];


        const methods = [
            "UPI",
            "Card",
            "Net Banking",
        ];


        const customer =
            customers[
            Math.floor(
                Math.random() * customers.length
            )
            ];


        const failureReason =
            reasons[
            Math.floor(
                Math.random() * reasons.length
            )
            ];


        const method =
            methods[
            Math.floor(
                Math.random() * methods.length
            )
            ];


        const transaction = {

            id: `LIVE-${Date.now()}`,

            customer: customer.name,

            amount:
                Math.floor(
                    Math.random() * 19000
                ) + 999,

            method,

            failureReason,

            attempts: 1,

            successfulPayments:
                customer.successfulPayments,

        };


        const result =
            analyzePayment(transaction);


        setSimulation(transaction);

        setAnalysis(result);

    };


    // ============================================
    // REAL-TIME BACKEND EVENT
    // ============================================

    const triggerLiveEvent = async () => {

        if (sendingEvent) {
            return;
        }


        try {

            setSendingEvent(true);


            const result =
                await sendTestPaymentFailure();


            console.log(
                "BACKEND AI RESULT:",
                result
            );


            const recovery =
                result?.recovery;


            if (!recovery) {

                console.error(
                    "Recovery result missing"
                );

                alert(
                    "Backend returned no AI analysis."
                );

                return;

            }


            const ai =
                recovery.aiAnalysis;


            // ========================================
            // BACKEND TRANSACTION
            // ========================================

            const transaction = {

                id:
                    recovery.id,

                customer:
                    "Live Customer",

                amount:
                    recovery.amount / 100,

                method:
                    recovery.method,

                failureReason:
                    recovery.failureReason,

                attempts:
                    1,

                successfulPayments:
                    0,

            };


            // ========================================
            // BACKEND AI ANALYSIS
            // ========================================

            const analysis = {

                strategies: {

                    retry:
                        ai.strategies.retry,

                    paymentLink:
                        ai.strategies.paymentLink,

                    reminder:
                        ai.strategies.reminder,

                },

                strategy:
                    ai.selectedStrategy,

                recommendedAction:
                    ai.recommendedAction,

                recoveryProbability:
                    ai.recoveryProbability,

                expectedRevenue:
                    ai.expectedRevenue,

            };


            setSimulation(transaction);

            setAnalysis(analysis);


            console.log(
                "🧠 ReviveAI Decision:",
                analysis
            );


        } catch (error) {

            console.error(
                "Live event error:",
                error
            );


            alert(
                "❌ Could not connect to ReviveAI backend."
            );


        } finally {

            setSendingEvent(false);

        }

    };


    return (

        <main className="dashboard">


            {/* =====================================
                PAGE HEADER
            ===================================== */}

            <div className="page-header">

                <div>

                    <span className="eyebrow">
                        OVERVIEW
                    </span>


                    <h1>
                        Revenue Recovery
                    </h1>


                    <p>
                        Monitor payment failures and recover
                        lost revenue with AI.
                    </p>

                </div>


                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                    }}
                >


                    {/* LOCAL AI SIMULATION */}

                    <button
                        className="simulate-button"
                        onClick={
                            simulatePayment
                        }
                    >

                        + Simulate Failed Payment

                    </button>


                    {/* LIVE BACKEND */}

                    <button
                        className="simulate-button"
                        onClick={
                            triggerLiveEvent
                        }
                        disabled={
                            sendingEvent
                        }
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "7px",
                        }}
                    >

                        <Zap size={15} />

                        {sendingEvent
                            ? "AI Analyzing..."
                            : "Send Live Payment Event"}

                    </button>

                </div>

            </div>



            {/* =====================================
                STATISTICS
            ===================================== */}

            <section className="stats-grid">


                <StatCard
                    title="Total Revenue"
                    value="₹18.4L"
                    change="+14.8%"
                    description="vs. previous period"
                    icon={IndianRupee}
                />


                <StatCard
                    title="Revenue At Risk"
                    value="₹3.2L"
                    change="+8.4%"
                    description="Across 248 failed payments"
                    icon={AlertTriangle}
                />


                <StatCard
                    title="AI Recoverable"
                    value="₹2.4L"
                    change="+21.6%"
                    description="High-probability opportunities"
                    icon={BrainCircuit}
                />


                <StatCard
                    title="Recovered Revenue"
                    value="₹1.8L"
                    change="+32.1%"
                    description="This month"
                    icon={CheckCircle2}
                />


            </section>



            {/* =====================================
                RECOVERY TWIN
            ===================================== */}

            {simulation &&
                analysis && (

                    <RecoveryTwin
                        transaction={simulation}
                        analysis={analysis}
                    />

                )}



            {/* =====================================
                LIVE CUSTOMER ACTIVITY
            ===================================== */}

            <LiveCustomer />



            {/* =====================================
                CHART + AI
            ===================================== */}

            <section className="dashboard-grid">

                <RevenueChart />

                <AIRecommendation />

            </section>



            {/* =====================================
                RECOVERY TABLE
            ===================================== */}

            <RecoveryTable />


        </main>

    );

}


export default Dashboard;