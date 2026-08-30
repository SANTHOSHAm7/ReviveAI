const FAILURE_PROFILES = {
    "Network Error": {
        retry: 0.82,
        paymentLink: 0.91,
        reminder: 0.58,
        explanation: "Temporary connectivity issue",
    },

    "Timeout": {
        retry: 0.79,
        paymentLink: 0.86,
        reminder: 0.61,
        explanation: "Payment request timed out",
    },

    "Bank Declined": {
        retry: 0.42,
        paymentLink: 0.74,
        reminder: 0.69,
        explanation: "Bank declined the payment attempt",
    },

    "Insufficient Funds": {
        retry: 0.21,
        paymentLink: 0.57,
        reminder: 0.78,
        explanation: "Customer may need time before retrying",
    },
};

export function analyzePayment(transaction) {
    const profile =
        FAILURE_PROFILES[transaction.failureReason] ||
        FAILURE_PROFILES["Timeout"];

    let customerScore = 0;

    // Previous successful payments
    if (transaction.successfulPayments >= 5) {
        customerScore += 0.10;
    } else if (transaction.successfulPayments >= 3) {
        customerScore += 0.05;
    }

    // Low-value transactions are generally easier to recover
    if (transaction.amount <= 5000) {
        customerScore += 0.05;
    }

    // Previous attempts
    if (transaction.attempts === 1) {
        customerScore += 0.04;
    }

    const strategies = {
        retry: Math.min(
            profile.retry + customerScore,
            0.98
        ),

        paymentLink: Math.min(
            profile.paymentLink + customerScore,
            0.98
        ),

        reminder: Math.min(
            profile.reminder + customerScore,
            0.98
        ),
    };

    const strategyNames = {
        retry: "Retry Payment",
        paymentLink: "Send Payment Link",
        reminder: "Send Smart Reminder",
    };

    const bestStrategy = Object.entries(strategies)
        .sort((a, b) => b[1] - a[1])[0];

    const [strategy, probability] = bestStrategy;

    const expectedRevenue =
        transaction.amount * probability;

    return {
        recoveryProbability: Math.round(
            probability * 100
        ),

        recommendedAction:
            strategyNames[strategy],

        strategy,

        expectedRevenue: Math.round(
            expectedRevenue
        ),

        explanation: profile.explanation,

        strategies: {
            retry: Math.round(strategies.retry * 100),
            paymentLink: Math.round(
                strategies.paymentLink * 100
            ),
            reminder: Math.round(
                strategies.reminder * 100
            ),
        },

        confidence: Math.round(
            (probability * 0.9 + 0.1) * 100
        ),
    };
}