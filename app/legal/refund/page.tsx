export default function RefundPage() {
    return (
        <article className="prose prose-invert lg:prose-xl max-w-none">
            <h1>Refund & Cancellation Policy</h1>
            <p className="lead">Transparency is our priority.</p>

            <h3>1. Cancellation Windows</h3>
            <div className="bg-white/10 p-4 rounded-xl not-prose mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="font-bold">&gt; 2 Hours Before</div>
                    <div className="text-green-400">100% Refund (excl. platform fee)</div>

                    <div className="font-bold">1-2 Hours Before</div>
                    <div className="text-yellow-400">50% Refund</div>

                    <div className="font-bold">Less than 1 Hour</div>
                    <div className="text-red-400">No Refund</div>
                </div>
            </div>

            <h3>2. Host Cancellations</h3>
            <p>If a Host cancels a confirmed booking, the Driver will receive a 100% refund immediately, plus a credit voucher for future use.</p>

            <h3>3. Dispute Refunds</h3>
            <p>If the parking spot was unavailable, blocked, or misrepresented, Drivers must raise a dispute within 30 minutes of arrival. Verified disputes are fully refunded.</p>

            <h3>4. Processing Timeline</h3>
            <p>Refunds are processed back to the original source (UPI/Card) within 5-7 business days as per banking norms.</p>

            <h3>5. Subscription Refunds</h3>
            <p>Host subscriptions (Pro/Apartment) are non-refundable once the billing cycle starts. Downgrades take effect at the end of the current cycle.</p>
        </article>
    );
}
