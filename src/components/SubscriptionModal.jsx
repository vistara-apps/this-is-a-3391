import React, { useState } from 'react'
import { X, Check, Crown, Zap, Star } from 'lucide-react'
import { useApp } from '../context/AppContext'

const SubscriptionModal = ({ isOpen, onClose }) => {
  const { state, actions } = useApp()
  const [selectedPlan, setSelectedPlan] = useState('creator')
  const [isProcessing, setIsProcessing] = useState(false)
  const [billingCycle, setBillingCycle] = useState('monthly')

  if (!isOpen) return null

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started',
      icon: Star,
      color: 'text-gray-400',
      bgColor: 'bg-gray-700',
      features: [
        '5 video exports per month',
        'Basic templates',
        'Watermarked exports',
        'Standard quality (720p)',
        'Community support',
      ],
      limitations: [
        'Limited AI processing',
        'No custom branding',
        'Basic analytics only',
      ],
    },
    {
      id: 'creator',
      name: 'Creator',
      price: { monthly: 19, yearly: 190 },
      description: 'For content creators and small businesses',
      icon: Crown,
      color: 'text-blue-400',
      bgColor: 'bg-blue-600',
      popular: true,
      features: [
        'Unlimited video exports',
        'All premium templates',
        'No watermark',
        'HD quality (1080p)',
        'Advanced AI tools',
        'Custom branding',
        'Priority support',
        'Analytics dashboard',
        'Platform optimization',
      ],
      limitations: [],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: { monthly: 49, yearly: 490 },
      description: 'For agencies and power users',
      icon: Zap,
      color: 'text-purple-400',
      bgColor: 'bg-purple-600',
      features: [
        'Everything in Creator',
        '4K export quality',
        'Advanced analytics',
        'API access',
        'White-label solution',
        'Dedicated support',
        'Team collaboration',
        'Custom integrations',
        'Priority processing',
      ],
      limitations: [],
    },
  ]

  const handleSubscribe = async (planId) => {
    if (planId === 'free') {
      // Handle free plan (downgrade)
      actions.updateUser({ subscriptionTier: 'free' })
      onClose()
      return
    }

    setIsProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In production, this would integrate with Stripe or another payment processor
      // const paymentResult = await apiService.createSubscription(
      //   state.user.userId,
      //   planId,
      //   paymentMethodId
      // )

      // Update user subscription
      actions.updateUser({ subscriptionTier: planId })
      
      // Show success message
      actions.setError(null)
      onClose()
      
    } catch (error) {
      console.error('Subscription failed:', error)
      actions.setError('Failed to process subscription. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const getPrice = (plan) => {
    const price = plan.price[billingCycle]
    if (price === 0) return 'Free'
    
    const monthlyPrice = billingCycle === 'yearly' ? price / 12 : price
    return `$${monthlyPrice.toFixed(0)}/mo`
  }

  const getSavings = (plan) => {
    if (billingCycle === 'monthly' || plan.price.yearly === 0) return null
    const monthlyCost = plan.price.monthly * 12
    const savings = monthlyCost - plan.price.yearly
    const percentage = Math.round((savings / monthlyCost) * 100)
    return `Save ${percentage}%`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Choose Your Plan</h2>
            <p className="text-gray-400 mt-1">Unlock the full power of VidSynth AI</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Billing Toggle */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-center">
            <div className="bg-gray-700 rounded-lg p-1 flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon
              const isCurrentPlan = state.user.subscriptionTier === plan.id
              const savings = getSavings(plan)
              
              return (
                <div
                  key={plan.id}
                  className={`relative bg-gray-700 rounded-xl p-6 border-2 transition-all ${
                    selectedPlan === plan.id
                      ? 'border-blue-500 transform scale-105'
                      : 'border-gray-600 hover:border-gray-500'
                  } ${plan.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Current Plan Badge */}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4">
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Current Plan
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`w-12 h-12 ${plan.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`w-6 h-6 ${plan.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                    
                    <div className="mb-2">
                      <span className="text-3xl font-bold text-white">{getPrice(plan)}</span>
                      {plan.price[billingCycle] > 0 && billingCycle === 'yearly' && (
                        <span className="text-gray-400 text-sm ml-2">billed yearly</span>
                      )}
                    </div>
                    
                    {savings && (
                      <span className="text-green-400 text-sm font-medium">{savings}</span>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      setSelectedPlan(plan.id)
                      handleSubscribe(plan.id)
                    }}
                    disabled={isCurrentPlan || isProcessing}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                      isCurrentPlan
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-600 hover:bg-gray-500 text-white'
                    } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isProcessing && selectedPlan === plan.id ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : isCurrentPlan ? (
                      'Current Plan'
                    ) : plan.id === 'free' ? (
                      'Downgrade to Free'
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 bg-gray-750 rounded-b-xl">
          <div className="text-center text-gray-400 text-sm">
            <p className="mb-2">All plans include a 14-day free trial. Cancel anytime.</p>
            <p>Need a custom solution? <a href="#" className="text-blue-400 hover:text-blue-300">Contact our sales team</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionModal
