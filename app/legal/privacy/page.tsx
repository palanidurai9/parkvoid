import Link from "next/link";

export default function PrivacyPage() {
    return (
        <article className="prose prose-invert lg:prose-xl max-w-none">
            <h1>Privacy Policy</h1>
            <p className="lead">Your data privacy is protected under the IT Act, 2000 & DPDP Act.</p>

            <h3>1. Data We Collect</h3>
            <ul>
                <li><strong>Identity:</strong> Name, Phone Number (for OTP), Email.</li>
                <li><strong>Location:</strong> Real-time GPS data for finding slots (Drivers) or verifying property (Hosts).</li>
                <li><strong>Vehicle:</strong> License Plate Number (for secure access).</li>
                <li><strong>Payment:</strong> We do NOT store card details. Tokenization is handled by Razorpay.</li>
            </ul>

            <h3>2. How We Use Data</h3>
            <p>We use your data strictly to:</p>
            <ul>
                <li>Connect Drivers with Hosts.</li>
                <li>Process payments and payouts.</li>
                <li>Prevent fraud and ensure safety via Audit Trails.</li>
            </ul>

            <h3>3. Data Sharing</h3>
            <p>We do not sell your personal data. We only share data with:</p>
            <ul>
                <li><strong>Hosts:</strong> Booking vehicle number and Driver name (for entry).</li>
                <li><strong>Authorities:</strong> Upon lawful request by Chennai Police or Cyber Crime Cell.</li>
            </ul>

            <h3>4. Security Measures</h3>
            <p>All data is encrypted in transit (TLS 1.2+) and at rest (AES-256). We use enterprise-grade firewalls and access controls.</p>

            <h3>5. Contact Us</h3>
            <p>For data deletion requests or grievances, contact our Grievance Officer at <a href="mailto:privacy@parkvoid.in" className="text-brand-teal">privacy@parkvoid.in</a>.</p>
        </article>
    );
}
