'use client';
export default function ShippingPage() {
  return (
    <div className="container section-padding">
      <h1 className="title">Delivery & Orders</h1>
      <div style={{ marginTop: '24px' }}>
        <h3>Shipping Times</h3>
        <p>Standard delivery takes 3-5 business days across Pakistan.</p>
        <h3>Charges</h3>
        <p>Flat shipping fee of Rs. 200 on all orders. Free shipping on orders over Rs. 5000!</p>
        <h3>Tracking</h3>
        <p>Once your order is shipped, you will receive a tracking ID via SMS.</p>
      </div>
    </div>
  );
}
