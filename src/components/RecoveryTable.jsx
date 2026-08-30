import { ArrowUpRight } from "lucide-react";

import { transactions } from "../data/mockData";

function getScore(transaction) {

    let score = 50;

    if (transaction.failureReason === "Network Error") {
        score += 25;
    }

    if (transaction.failureReason === "Timeout") {
        score += 20;
    }

    if (transaction.attempts <= 1) {
        score += 10;
    }

    if (transaction.successfulPayments >= 3) {
        score += 10;
    }

    if (transaction.amount < 5000) {
        score += 5;
    }

    return Math.min(score, 98);
}

function RecoveryTable() {

    const failedTransactions =
        transactions.filter(
            (transaction) =>
                transaction.status === "Failed"
        );

    return (
        <div className="table-card">

            <div className="section-heading">

                <div>
                    <h3>AI Recovery Opportunities</h3>

                    <p>
                        Transactions with the highest
                        recovery potential
                    </p>
                </div>

                <button className="view-button">
                    View All
                    <ArrowUpRight size={16} />
                </button>

            </div>

            <div className="table-wrapper">

                <table>

                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Failure Reason</th>
                            <th>Recovery Score</th>
                            <th>Recommended Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {failedTransactions.map((transaction) => {

                            const score =
                                getScore(transaction);

                            return (
                                <tr key={transaction.id}>

                                    <td>
                                        <div className="customer">

                                            <div className="customer-avatar">
                                                {transaction.customer
                                                    .charAt(0)}
                                            </div>

                                            <div>
                                                <strong>
                                                    {transaction.customer}
                                                </strong>

                                                <span>
                                                    {transaction.email}
                                                </span>
                                            </div>

                                        </div>
                                    </td>

                                    <td>
                                        <strong>
                                            ₹{transaction.amount.toLocaleString("en-IN")}
                                        </strong>
                                    </td>

                                    <td>
                                        {transaction.failureReason}
                                    </td>

                                    <td>

                                        <div className="score">

                                            <div className="score-bar">
                                                <span
                                                    style={{
                                                        width: `${score}%`,
                                                    }}
                                                ></span>
                                            </div>

                                            <strong>{score}%</strong>

                                        </div>

                                    </td>

                                    <td>

                                        <button className="recover-button">
                                            Recover
                                            <ArrowUpRight size={15} />
                                        </button>

                                    </td>

                                </tr>
                            );

                        })}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default RecoveryTable;