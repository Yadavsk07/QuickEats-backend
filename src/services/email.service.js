const nodemailer = require("nodemailer");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    return null;
  }
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  return transporter;
}

async function sendEmail(to, subject, htmlContent) {
  const trans = getTransporter();
  if (!trans || !to) {
    console.log("[Email] Skipped (no config or recipient):", subject);
    return;
  }
  try {
    await trans.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent
    });
    console.log("[Email] Sent to", to, ":", subject);
  } catch (err) {
    console.error("[Email] Failed:", err.message);
  }
}

async function sendOrderConfirmation(email, order) {
  const itemsList = (order.items || [])
    .map((i) => `${i.name} × ${i.quantity} – ₹${(i.price * i.quantity)}`)
    .join("<br/>");
  const html = `
    <h2>Order Confirmed</h2>
    <p>Hi, your order has been confirmed.</p>
    <p><strong>Order #${order.orderNumber || order._id}</strong></p>
    <p><strong>Total: ₹${order.totalAmount}</strong></p>
    <p><strong>Items:</strong></p>
    <p>${itemsList}</p>
    <p>We'll notify you when it's ready for pickup.</p>
  `;
  await sendEmail(email, `Order Confirmed #${order.orderNumber || order._id}`, html);
}

async function sendPaymentConfirmation(email, order) {
  const itemsList = (order.items || [])
    .map((i) => `${i.name} × ${i.quantity} – ₹${(i.price * i.quantity)}`)
    .join("<br/>");
  const html = `
    <h2>Payment Received – Order Confirmed</h2>
    <p>Your payment was successful. Order is confirmed.</p>
    <p><strong>Order #${order.orderNumber || order._id}</strong></p>
    <p><strong>Amount paid: ₹${order.totalAmount}</strong></p>
    <p><strong>Items:</strong></p>
    <p>${itemsList}</p>
    <p>We'll notify you when it's ready for pickup.</p>
  `;
  await sendEmail(email, `Payment Received – Order #${order.orderNumber || order._id}`, html);
}

async function sendOrderReadyForPickup(email, order) {
  const html = `
    <h2>Your order is ready for pickup!</h2>
    <p><strong>Order #${order.orderNumber || order._id}</strong></p>
    <p>Please collect your order at the counter. Show this order number.</p>
    <p>Thank you!</p>
  `;
  await sendEmail(email, `Ready for pickup – Order #${order.orderNumber || order._id}`, html);
}

module.exports = {
  sendEmail,
  sendOrderConfirmation,
  sendPaymentConfirmation,
  sendOrderReadyForPickup,
  sendOTPEmail: async (email, otp) => {
    await sendEmail(email, "Your OTP", `<h2>Your OTP: ${otp}</h2>`);
  }
};
