export default function LegalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-brand-navy-dark text-white pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 shadow-xl">
                    {children}
                </div>
                <div className="mt-8 text-center text-sm text-brand-gray">
                    <p>&copy; {new Date().getFullYear()} Parkvoid India Pvt Ltd. Chennai, TN.</p>
                </div>
            </div>
        </div>
    );
}
