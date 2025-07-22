import React from 'react';
import Lottie from 'lottie-react';
import animationData from '@/assets/animations/privacy.json';

const privacyText = `
At GroceryPlus, we value your privacy and are committed to protecting your personal information.

1. **Information Collection**: We collect information you provide when you register, place an order, or contact us.
2. **Use of Information**: Your information is used to process orders, improve our services, and communicate with you.
3. **Data Security**: We implement security measures to protect your data.
4. **Cookies**: We use cookies to enhance your experience on our site.
5. **Third-Party Disclosure**: We do not sell or share your personal information with third parties except as required by law.
6. **Policy Updates**: We may update this policy from time to time. Changes will be posted on this page.

For questions, contact privacy@groceryplus.com.
`;

export default function PrivacyPolicy() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-[#8AD93B] to-[#62BF06] p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
        <Lottie animationData={animationData} style={{ width: 180, height: 180 }} />
        <h2 className="text-3xl font-bold mb-4 text-green-700">Privacy Policy</h2>
        <div className="text-gray-700 whitespace-pre-line text-lg leading-relaxed">
          {privacyText}
        </div>
      </div>
    </section>
  );
}
