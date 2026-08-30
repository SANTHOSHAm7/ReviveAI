import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});


export const checkBackend = async () => {

    const response =
        await API.get("/health");

    return response.data;

};


export const getLiveEvents = async () => {

    const response =
        await API.get("/events");

    return response.data;

};


export const sendTestPaymentFailure = async () => {

    const response = await API.post(
        "/webhooks/razorpay",
        {
            event: "payment.failed",

            payload: {
                payment: {
                    entity: {
                        id: `pay_test_${Date.now()}`,

                        amount: 159900,

                        currency: "INR",

                        status: "failed",

                        method: "upi",

                        error_description:
                            "Temporary network failure",
                    },
                },
            },
        }
    );

    return response.data;
};

export default API;