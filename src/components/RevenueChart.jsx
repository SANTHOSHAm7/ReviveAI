import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

import { revenueData } from "../data/mockData";

function RevenueChart() {
    return (
        <div className="chart-card">

            <div className="section-heading">
                <div>
                    <h3>Revenue Recovery</h3>
                    <p>Revenue performance over the last 7 days</p>
                </div>

                <select>
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                </select>
            </div>

            <div className="chart-container">

                <ResponsiveContainer width="100%" height="100%">

                    <LineChart data={revenueData}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="day" />

                        <YAxis />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="revenue"
                            strokeWidth={3}
                            dot={false}
                        />

                        <Line
                            type="monotone"
                            dataKey="recovered"
                            strokeWidth={3}
                            dot={false}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

            <div className="chart-legend">

                <span>
                    <i></i>
                    Total Revenue
                </span>

                <span>
                    <i></i>
                    Recovered Revenue
                </span>

            </div>

        </div>
    );
}

export default RevenueChart;