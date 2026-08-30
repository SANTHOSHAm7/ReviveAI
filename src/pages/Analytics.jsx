import RevenueChart from "../components/RevenueChart";

function Analytics() {
    return (
        <main className="dashboard">

            <div className="page-header">

                <div>

                    <span className="eyebrow">
                        INSIGHTS
                    </span>

                    <h1>Analytics</h1>

                    <p>
                        Understand your payment and recovery performance.
                    </p>

                </div>

            </div>

            <RevenueChart />

        </main>
    );
}

export default Analytics;