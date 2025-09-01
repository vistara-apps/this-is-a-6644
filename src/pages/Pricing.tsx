import React from 'react';
import { Check, Camera, FileText, Zap, Crown } from 'lucide-react';

export function Pricing() {
  const plans = [
    {
      name: 'Trial',
      price: 'Free',
      period: '50 photos',
      description: 'Perfect for trying out ClaimSnap',
      features: [
        'Up to 50 photos',
        'AI-powered tagging',
        'Basic reporting',
        'Email support'
      ],
      icon: Camera,
      popular: false,
      cta: 'Start Free Trial'
    },
    {
      name: 'Professional',
      price: '$29',
      period: 'per month',
      description: 'Great for independent adjusters',
      features: [
        'Up to 500 photos/month',
        'Advanced AI analysis',
        'Quality scoring',
        'Duplicate detection',
        'Custom reports',
        'Priority support'
      ],
      icon: FileText,
      popular: true,
      cta: 'Choose Professional'
    },
    {
      name: 'Enterprise',
      price: '$79',
      period: 'per month',
      description: 'For high-volume operations',
      features: [
        'Up to 2,000 photos/month',
        'All Professional features',
        'Batch processing',
        'API access',
        'Custom integrations',
        'Dedicated support'
      ],
      icon: Zap,
      popular: false,
      cta: 'Choose Enterprise'
    },
    {
      name: 'Custom',
      price: 'Contact us',
      period: 'for pricing',
      description: 'For enterprise organizations',
      features: [
        'Unlimited photos',
        'Custom AI models',
        'White-label options',
        'On-premise deployment',
        'SLA guarantees',
        '24/7 support'
      ],
      icon: Crown,
      popular: false,
      cta: 'Contact Sales'
    }
  ];

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold text-text-primary mb-4">Choose Your Plan</h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Select the perfect plan for your claims processing needs. All plans include our core AI-powered features.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.name}
              className={`relative card ${plan.popular ? 'ring-2 ring-primary' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-text-primary">{plan.price}</span>
                  {plan.period && (
                    <span className="text-text-secondary ml-1">/{plan.period}</span>
                  )}
                </div>
                <p className="text-text-secondary text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-text-primary text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                  plan.popular
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'border border-gray-300 text-text-primary hover:bg-gray-50'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-text-primary text-center mb-8">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-medium text-text-primary mb-2">What counts as a photo?</h3>
            <p className="text-text-secondary text-sm">
              Each individual image file uploaded to ClaimSnap counts as one photo. This includes JPG, PNG, and WebP formats.
            </p>
          </div>
          
          <div className="card">
            <h3 className="font-medium text-text-primary mb-2">Can I upgrade or downgrade my plan?</h3>
            <p className="text-text-secondary text-sm">
              Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at your next billing cycle.
            </p>
          </div>
          
          <div className="card">
            <h3 className="font-medium text-text-primary mb-2">Is my data secure?</h3>
            <p className="text-text-secondary text-sm">
              Absolutely. We use enterprise-grade encryption and security measures to protect your sensitive claim data and photos.
            </p>
          </div>
          
          <div className="card">
            <h3 className="font-medium text-text-primary mb-2">Do you offer custom integrations?</h3>
            <p className="text-text-secondary text-sm">
              Yes, our Enterprise and Custom plans include API access and custom integration options with your existing claims management systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}