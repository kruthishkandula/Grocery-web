import animationData from '@/assets/animations/terms.json';
import Lottie from 'lottie-react';

const termsText = `
Welcome to GroceryPlus! By accessing or using our services, you agree to be bound by these Terms and Conditions. Please read them carefully.

1. **Acceptance of Terms**: By using GroceryPlus, you agree to comply with and be legally bound by these terms.
2. **User Accounts**: You are responsible for maintaining the confidentiality of your account and password.
3. **Use of Service**: You agree not to misuse the services provided by GroceryPlus.
4. **Intellectual Property**: All content, trademarks, and data on this site are the property of GroceryPlus.
5. **Limitation of Liability**: GroceryPlus is not liable for any damages arising from the use of our services.
6. **Changes to Terms**: We reserve the right to modify these terms at any time.

For more details, contact us at support@groceryplus.com.
`;

export default function TermsAndConditions() {
    return (
        <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-[#8AD93B] to-[#62BF06] p-4">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
                <Lottie animationData={animationData} style={{ width: 180, height: 180 }} />
                <h2 className="text-3xl font-bold mb-4 text-green-700">Terms & Conditions</h2>
                <div className="text-gray-700 whitespace-pre-line text-lg leading-relaxed">
                    {termsText}
                </div>
            </div>
        </section>
    );
}
