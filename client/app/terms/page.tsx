'use client';
export default function TermsPage() {
  return (
    <div className="container section-padding">
      <h1 className="title">Terms & Conditions</h1>
      <p style={{ color: '#666', lineHeight: '1.8' }}>
        Please read these terms and conditions carefully before using our service.
        By accessing or using BabyMart, you agree to be bound by these terms.
      </p>
      <div style={{ marginTop: '24px' }}>
        <h3>1. Use of the Site</h3>
        <p>This site belongs to BabyMart. Any unauthorized use is prohibited.</p>
        <h3>2. Orders</h3>
        <p>All orders are subject to availability and confirmation of the order price.</p>
        <h3>3. Intellectual Property</h3>
        <p>The content, logo, and images are properties of BabyMart.</p>
      </div>
    </div>
  );
}
