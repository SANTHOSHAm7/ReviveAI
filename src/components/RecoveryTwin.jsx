import { useState } from "react";

import {
    BrainCircuit,
    Clock3,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    LoaderCircle,
} from "lucide-react";


function RecoveryTwin({ transaction, analysis }) {

    const [status, setStatus] = useState("ready");


    const executeStrategy = () => {

        setStatus("processing");


        setTimeout(() => {

            setStatus("success");

        }, 2000);

    };


    if (!transaction || !analysis) {
        return null;
    }


    return (

        <div className="recovery-twin">


            {/* HEADER */}

            <div className="twin-header">

                <div className="twin-title">

                    <div className="twin-icon">
                        <BrainCircuit size={22} />
                    </div>

                    <div>

                        <span>
                            REVIVEAI INTELLIGENCE
                        </span>

                        <h2>
                            Recovery Twin
                        </h2>

                    </div>

                </div>


                <div className="live-ai">

                    <span></span>

                    {status === "success"
                        ? "RECOVERED"
                        : "AI ANALYZED"}

                </div>

            </div>



            {/* CUSTOMER */}

            <div className="twin-customer">

                <div className="twin-avatar">

                    {transaction.customer.charAt(0)}

                </div>


                <div>

                    <strong>
                        {transaction.customer}
                    </strong>

                    <span>

                        ₹
                        {transaction.amount.toLocaleString(
                            "en-IN"
                        )}

                        {" · "}

                        {transaction.method}

                    </span>

                </div>

            </div>



            {/* SUCCESS STATE */}

            {status === "success" ? (

                <div className="recovery-success">

                    <CheckCircle2 size={42} />

                    <div>

                        <span>
                            PAYMENT RECOVERED
                        </span>

                        <h2>
                            ₹
                            {transaction.amount.toLocaleString(
                                "en-IN"
                            )}
                        </h2>

                        <p>
                            ReviveAI successfully executed the
                            recommended recovery strategy.
                        </p>

                    </div>

                </div>

            ) : (

                <>


                    {/* COUNTERFACTUAL */}

                    <div className="counterfactual">

                        <div className="counterfactual-title">

                            <Sparkles size={16} />

                            <span>
                                COUNTERFACTUAL RECOVERY SIMULATION
                            </span>

                        </div>


                        <div className="strategy-grid">


                            <Strategy
                                name="Retry"
                                value={analysis.strategies.retry}
                                recommended={
                                    analysis.strategy === "retry"
                                }
                            />


                            <Strategy
                                name="Payment Link"
                                value={analysis.strategies.paymentLink}
                                recommended={
                                    analysis.strategy === "paymentLink"
                                }
                            />


                            <Strategy
                                name="Reminder"
                                value={analysis.strategies.reminder}
                                recommended={
                                    analysis.strategy === "reminder"
                                }
                            />


                        </div>

                    </div>



                    {/* AI RESULT */}

                    <div className="twin-result">

                        <div>

                            <span>
                                RECOMMENDED ACTION
                            </span>

                            <h3>
                                {analysis.recommendedAction}
                            </h3>

                            <p>
                                AI selected this strategy based on
                                payment behavior and failure signals.
                            </p>

                        </div>


                        <div className="recovery-probability">

                            <strong>
                                {analysis.recoveryProbability}%
                            </strong>

                            <span>
                                Recovery Probability
                            </span>

                        </div>

                    </div>



                    {/* FOOTER */}

                    <div className="twin-footer">


                        <div className="expected-value">

                            <span>
                                EXPECTED RECOVERABLE VALUE
                            </span>

                            <strong>
                                ₹
                                {analysis.expectedRevenue.toLocaleString(
                                    "en-IN"
                                )}
                            </strong>

                        </div>


                        <div className="timing">

                            <Clock3 size={16} />

                            <div>

                                <span>
                                    BEST WINDOW
                                </span>

                                <strong>
                                    Next 30–60 minutes
                                </strong>

                            </div>

                        </div>


                        <button
                            className="execute-button"
                            onClick={executeStrategy}
                            disabled={status === "processing"}
                        >

                            {status === "processing" ? (

                                <>
                                    <LoaderCircle
                                        size={16}
                                        className="spin"
                                    />

                                    Processing...
                                </>

                            ) : (

                                <>
                                    Execute Strategy

                                    <ArrowRight size={16} />

                                </>

                            )}

                        </button>


                    </div>

                </>

            )}

        </div>

    );

}



function Strategy({
    name,
    value,
    recommended,
}) {

    return (

        <div
            className={`strategy ${recommended
                    ? "recommended"
                    : ""
                }`}
        >

            {recommended && (

                <span className="best-label">
                    BEST
                </span>

            )}


            <span>
                {name}
            </span>


            <strong>
                {value}%
            </strong>


            <div className="strategy-bar">

                <i
                    style={{
                        width: `${value}%`,
                    }}
                ></i>

            </div>

        </div>

    );

}


export default RecoveryTwin;