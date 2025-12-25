import React from 'react';
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import Button from './ui/Button';

export const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const payment = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/order-success",
      },
    });

    if (payment.error) {
      console.log(payment.error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <div className={'flex justify-end mt-4'}>
        <Button htmlType="submit" type={"primary"} icon={"Receipt"}>Pay</Button>
      </div>
    </form>
  );
};

export default CheckoutForm;
