export default function TermsPage() {
    return (
        <article className="prose prose-invert lg:prose-xl max-w-none">
            <h1>Terms of Service</h1>
            <p className="lead">Last Updated: October 25, 2025</p>

            <h3>1. Introduction</h3>
            <p>Welcome to Parkvoid ("we," "our," or "us"). By accessing or using our website, mobile application, and services (collectively, the "Platform"), you agree to be bound by these Terms of Service.</p>

            <h3>2. Services Provided</h3>
            <p>Parkvoid acts as an intermediary facilitating the booking of parking spaces between vehicle owners ("Drivers") and parking space owners ("Hosts"). We do not own or operate the parking facilities unless explicitly stated.</p>

            <h3>3. User Accounts</h3>
            <ul>
                <li>You must provide accurate verification details (Aadhar/Phone) as per Indian KYC norms.</li>
                <li>You are responsible for maintaining the confidentiality of your OTP and account access.</li>
            </ul>

            <h3>4. Booking & Payments</h3>
            <p>All payments are processed via RBI-compliant gateways (Razorpay/UPI). Fees include:</p>
            <ul>
                <li>Parking Fee (set by Host)</li>
                <li>Platform Convenience Fee</li>
                <li>GST (18%) where applicable</li>
            </ul>

            <h3>5. Cancellation & Refunds</h3>
            <p>Cancellations made 1 hour prior to booking start time are eligible for a full refund (minus platform fees). See our Refund Policy for details.</p>

            <h3>6. Liability Disclaimer</h3>
            <p>Parkvoid is not responsible for theft, damage, or accidents occurring within the parking premises. The Host retains liability for premise safety, and the Driver retains liability for vehicle safety.</p>

            <h3>7. Governing Law</h3>
            <p>These terms are governed by the laws of India. Any disputes are subject to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu.</p>
        </article>
    );
}
