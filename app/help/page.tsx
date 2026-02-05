"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MessageCircle, Phone, LifeBuoy } from "lucide-react";

const FAQS = [
    {
        category: "Drivers",
        items: [
            { q: "How do I find a parking spot?", a: "Enter your destination in the search bar on the homepage. You can view available spots on the map, check prices, and book instantly." },
            { q: "Can I cancel my booking?", a: "Yes. Cancellations made 2 hours before the start time are fully refundable. See our Refund Policy for details." },
            { q: "What if the spot is occupied?", a: "If your booked spot is taken, please raise a dispute immediately via the app. We will redirect you to a nearby spot or issue a full refund." }
        ]
    },
    {
        category: "Owners",
        items: [
            { q: "How much can I earn?", a: "Earnings depend on your location and pricing. Hosts in busy areas like T. Nagar earn up to ₹15,000/month per slot." },
            { q: "When do I get paid?", a: "Payouts are processed weekly on Tuesdays directly to your verified bank account." },
            { q: "Do I need to be present?", a: "No. You can choose 'Self Check-in' if your property is accessible. Otherwise, you or a guard can manage entry." }
        ]
    }
];

export default function HelpPage() {
    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">How can we help?</h1>
                <p className="text-brand-gray text-lg">Search our knowledge base or contact support.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-brand-teal/50 transition-colors cursor-pointer">
                    <MessageCircle className="w-8 h-8 text-brand-teal mb-4" />
                    <h3 className="font-bold text-xl mb-2">Chat Support</h3>
                    <p className="text-brand-gray text-sm">Talk to our automated assistant or a live agent.</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-brand-teal/50 transition-colors cursor-pointer">
                    <Phone className="w-8 h-8 text-blue-400 mb-4" />
                    <h3 className="font-bold text-xl mb-2">Emergency Line</h3>
                    <p className="text-brand-gray text-sm">Urgent issues with ongoing bookings across Chennai.</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-brand-teal/50 transition-colors cursor-pointer">
                    <LifeBuoy className="w-8 h-8 text-purple-400 mb-4" />
                    <h3 className="font-bold text-xl mb-2">Raise Ticket</h3>
                    <p className="text-brand-gray text-sm">File a dispute or report a technical bug.</p>
                </div>
            </div>

            <div className="space-y-8">
                <h2 className="text-2xl font-bold border-b border-white/10 pb-4">Frequently Asked Questions</h2>
                {FAQS.map((cat, idx) => (
                    <div key={idx}>
                        <h3 className="text-xl text-brand-teal font-bold mb-4">{cat.category}</h3>
                        <div className="space-y-4">
                            {cat.items.map((item, i) => (
                                <FaqItem key={i} question={item.q} answer={item.a} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 bg-brand-teal/10 rounded-3xl p-8 text-center border border-brand-teal/20">
                <h2 className="text-2xl font-bold mb-2">Still stuck?</h2>
                <p className="text-brand-gray mb-6">Our team is available 9 AM - 9 PM IST for Chennai operations.</p>
                <button className="bg-brand-teal text-brand-navy font-bold px-8 py-3 rounded-xl hover:opacity-90">
                    Contact Us
                </button>
            </div>
        </div>
    );
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-white/5 rounded-xl overflow-hidden border border-white/5">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left hover:bg-white/5 transition-colors"
            >
                <span className="font-bold">{question}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-brand-gray" /> : <ChevronDown className="w-5 h-5 text-brand-gray" />}
            </button>
            {isOpen && (
                <div className="p-4 pt-0 text-brand-gray text-sm leading-relaxed border-t border-white/5 mt-2">
                    {answer}
                </div>
            )}
        </div>
    );
}
