/**
 * Help & Support Page
 * FAQs, shipping info, returns policy, and contact information
 */

import Link from 'next/link';
import { WhatsAppButton } from '@/components/WhatsAppButton';

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Help & Support</h1>
        <p className="text-gray-600 mb-12">
          Everything you need to know about shopping at ZeroLimitApparel
        </p>

        {/* Contact Section */}
        <section className="mb-12 bg-gray-50 p-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-gray-700 mb-6">
            Our customer support team is here to help. Contact us on WhatsApp for immediate assistance.
          </p>
          <WhatsAppButton 
            message="Hi, I need help with an order"
            size="lg"
          />
        </section>

        {/* FAQs */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {/* Ordering */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-bold mb-4">Ordering</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">How do I place an order?</h4>
                  <p className="text-gray-700">
                    Browse our products, add items to your cart, and proceed to checkout. You can checkout as a guest or create an account for faster future purchases.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Do I need to create an account?</h4>
                  <p className="text-gray-700">
                    No, you can checkout as a guest. However, creating an account allows you to track orders, save items to your wishlist, and checkout faster.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Can I cancel or modify my order?</h4>
                  <p className="text-gray-700">
                    Contact us immediately via WhatsApp if you need to cancel or modify your order. We&apos;ll do our best to accommodate your request if the order hasn&apos;t been shipped yet.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-bold mb-4">Payment</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">What payment methods do you accept?</h4>
                  <p className="text-gray-700 mb-2">We offer two payment options:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li><strong>Cash on Delivery (COD):</strong> Pay when you receive your order</li>
                    <li><strong>Pre-booking:</strong> We&apos;ll contact you via WhatsApp for payment confirmation (Bank Transfer, JazzCash, EasyPaisa)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Is it safe to shop on your website?</h4>
                  <p className="text-gray-700">
                    Yes! We use secure payment processing and never store your payment information. For pre-booking, we&apos;ll guide you through safe payment methods via WhatsApp.
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-bold mb-4">Shipping & Delivery</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">How long does shipping take?</h4>
                  <p className="text-gray-700">
                    Standard shipping takes 3-7 business days within Pakistan. You&apos;ll receive tracking information once your order ships.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Do you ship internationally?</h4>
                  <p className="text-gray-700">
                    Currently, we only ship within Pakistan. Contact us via WhatsApp for international shipping inquiries.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">How much does shipping cost?</h4>
                  <p className="text-gray-700">
                    Shipping costs vary by location and are calculated at checkout. Free shipping on orders over Rs. 3,000.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">How can I track my order?</h4>
                  <p className="text-gray-700">
                    Once your order ships, we&apos;ll send you a tracking number. You can also check your order status in your <Link href="/account" className="underline">account page</Link>.
                  </p>
                </div>
              </div>
            </div>

            {/* Returns & Exchanges */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-bold mb-4">Returns & Exchanges</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">What is your return policy?</h4>
                  <p className="text-gray-700">
                    We accept returns within 7 days of delivery for unused items in original condition with tags attached. Contact us via WhatsApp to initiate a return.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Can I exchange an item?</h4>
                  <p className="text-gray-700">
                    Yes! We offer exchanges for different sizes or colors. Contact us within 7 days of delivery to arrange an exchange.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Who pays for return shipping?</h4>
                  <p className="text-gray-700">
                    For defective items or our mistakes, we cover return shipping. For other returns, customers are responsible for return shipping costs.
                  </p>
                </div>
              </div>
            </div>

            {/* Product Care */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-bold mb-4">Product Care</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">How should I care for my hoodie?</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Machine wash cold with similar colors</li>
                    <li>Use mild detergent</li>
                    <li>Do not bleach</li>
                    <li>Tumble dry low or hang to dry</li>
                    <li>Iron inside out if needed</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">How do I choose the right size?</h4>
                  <p className="text-gray-700">
                    Check the size guide on each product page. If you&apos;re between sizes or unsure, contact us via WhatsApp for personalized sizing advice.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="pb-6">
              <h3 className="text-xl font-bold mb-4">Still Have Questions?</h3>
              <p className="text-gray-700 mb-4">
                Can&apos;t find the answer you&apos;re looking for? Contact us on WhatsApp and we&apos;ll be happy to help!
              </p>
              <WhatsAppButton 
                message="Hi, I have a question"
              />
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-gray-50 border border-gray-200">
            <svg className="w-12 h-12 mx-auto mb-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-bold mb-2">Fast Response</h3>
            <p className="text-sm text-gray-600">Quick replies via WhatsApp</p>
          </div>

          <div className="text-center p-6 bg-gray-50 border border-gray-200">
            <svg className="w-12 h-12 mx-auto mb-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-bold mb-2">Quality Guaranteed</h3>
            <p className="text-sm text-gray-600">Premium materials & craftsmanship</p>
          </div>

          <div className="text-center p-6 bg-gray-50 border border-gray-200">
            <svg className="w-12 h-12 mx-auto mb-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="font-bold mb-2">Easy Returns</h3>
            <p className="text-sm text-gray-600">7-day return policy</p>
          </div>
        </section>
      </div>
    </div>
  );
}
