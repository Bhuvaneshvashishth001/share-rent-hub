import { paymentAPI } from "@/lib/api";

interface CheckoutUser {
  name?: string;
  email?: string;
  phone?: string;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, callback: (response: { error?: { description?: string } }) => void) => void;
    };
  }
}

const loadCheckout = () => new Promise<void>((resolve, reject) => {
  if (window.Razorpay) return resolve();
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.onload = () => resolve();
  script.onerror = () => reject(new Error("Razorpay checkout could not be loaded"));
  document.body.appendChild(script);
});

export const payForBooking = async (
  bookingId: string,
  user: CheckoutUser,
  onSuccess: () => void,
) => {
  await loadCheckout();
  const response = await paymentAPI.createOrder(bookingId);
  const order = response.data;

  return new Promise<void>((resolve, reject) => {
    if (!window.Razorpay) return reject(new Error("Razorpay checkout is unavailable"));

    const checkout = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: "RentHub",
      description: order.rentalTitle || "Rental booking",
      order_id: order.orderId,
      prefill: {
        name: user.name || "",
        email: user.email || "",
        contact: user.phone || "",
      },
      theme: { color: "#7c3aed" },
      handler: async (payment: RazorpayResponse) => {
        try {
          await paymentAPI.verify(bookingId, payment);
          onSuccess();
          resolve();
        } catch (error) {
          reject(error);
        }
      },
      modal: {
        ondismiss: () => reject(new Error("Payment window closed. You can pay later from Dashboard.")),
      },
    });

    checkout.on("payment.failed", (failure) => {
      reject(new Error(failure.error?.description || "Payment failed"));
    });
    checkout.open();
  });
};
