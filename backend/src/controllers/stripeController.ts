import Stripe from "stripe";
import stripe from "../config/stripe.ts";
import { OrderItem, CartItem, Order } from "../models/models.ts";
import { Op } from "sequelize";

export const stripeWebhook = async (req: any, res: any) => {
  const sig = req.headers["stripe-signature"]!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error: any) {
    console.log(error);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    if (!paymentIntent) return;

    const userId = Number(paymentIntent.metadata.userId);
    const order = await Order.create({ userId });

    const orderedProducts = JSON.parse(paymentIntent.metadata.orderedProducts);

    const products = orderedProducts.map((orderedProduct: any) => {
      return { orderId: order.id, ...orderedProduct }
    });
    const orders = await OrderItem.bulkCreate(products);

    if (orders) {
      const productsIds = orderedProducts.map((product: Record<string, number>) => {
        return product.productId;
      });

      await CartItem.destroy({
        where: {
          [Op.and]: [
            { userId },
            { productId: { [Op.in]: productsIds } }
          ]
        }
      });
    }

    return res.status(201).json({ message: "Ordered successfully!" });
  }

  return res.json({ received: true });
};