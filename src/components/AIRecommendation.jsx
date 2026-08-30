import {
    BrainCircuit,
    ArrowRight,
    Sparkles,
} from "lucide-react";

function AIRecommendation() {

    return (
        <div className="ai-card">

            <div className="ai-header">

                <div className="ai-icon">
                    <BrainCircuit size={22} />
                </div>

                <div>
                    <h3>AI Recovery Insight</h3>
                    <span>Powered by ReviveAI</span>
                </div>

                <Sparkles className="sparkle" size={18} />

            </div>

            <div className="ai-body">

                <h4>
                    ₹2.4L revenue can potentially
                    be recovered
                </h4>

                <p>
                    Our AI identified 186 failed
                    transactions with a high
                    probability of successful recovery.
                </p>

                <div className="ai-metrics">

                    <div>
                        <strong>186</strong>
                        <span>Opportunities</span>
                    </div>

                    <div>
                        <strong>87%</strong>
                        <span>Avg. Probability</span>
                    </div>

                    <div>
                        <strong>₹2.4L</strong>
                        <span>Potential</span>
                    </div>

                </div>

                <button className="ai-action">
                    View AI Recommendations
                    <ArrowRight size={17} />
                </button>

            </div>

        </div>
    );
}

export default AIRecommendation;