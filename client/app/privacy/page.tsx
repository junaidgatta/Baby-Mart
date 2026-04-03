'use client';
export default function PrivacyPage() {
  return (
    <div className="container section-padding">
      <h1 className="title">Privacy Policy</h1>
      <p style={{ color: '#666', lineHeight: '1.8' }}>
        At BabyMart, we respect your privacy. We only collect information that is necessary to process your orders and provide a better experience.
      </p>
      <div style={{ marginTop: '24px' }}>
        <h3>Information Collection</h3>
        <p>We collect your name, email, and address for delivery purposes.</p>
        <h3>Data Protection</h3>
        <p>Your data is securely stored and never shared with 3rd parties.</p>
      </div>
    </div>
  );
}
