// components/AviationPricing.tsx
// Aviation API Pricing Plans - Enterprise Monetization
// Professional, Enterprise, Custom plans with features

'use client'

import { motion } from 'framer-motion'
import { Check, Crown, Globe, Rocket, Shield, Users, X, Zap } from 'lucide-react'
import { useState } from 'react'

interface PricingPlan {
    id: string
    name: string
    price: number
    period: string
    description: string
    features: Array<{ name: string; included: boolean; note?: string }>
    limits: {
        requests: string
        airports: string
        concurrent: string
        support: string
    }
    badge?: string
    color: string
    icon: any
    popular?: boolean
}

const pricingPlans: PricingPlan[] = [
    {
        id: 'starter',
        name: 'Starter',
        price: 0,
        period: 'month',
        description: 'Perfect for testing and small projects',
        color: 'blue',
        icon: Zap,
        features: [
            { name: 'Basic METAR/TAF data', included: true },
            { name: 'Up to 5 airports', included: true },
            { name: 'Standard API response times', included: true },
            { name: 'Community support', included: true },
            { name: 'Real-time data', included: false },
            { name: 'Historical data', included: false },
            { name: 'Custom alerts', included: false },
            { name: 'Analytics dashboard', included: false }
        ],
        limits: {
            requests: '1,000/month',
            airports: '5 airports',
            concurrent: '2 requests/sec',
            support: 'Community'
        }
    },
    {
        id: 'professional',
        name: 'Professional',
        price: 29,
        period: 'month',
        description: 'Ideal for growing businesses and professional use',
        color: 'purple',
        icon: Shield,
        popular: true,
        features: [
            { name: 'Advanced METAR/TAF data', included: true },
            { name: 'Unlimited airports', included: true },
            { name: 'Real-time data updates', included: true },
            { name: '30-day historical data', included: true },
            { name: 'Priority API response', included: true },
            { name: 'Email support', included: true },
            { name: 'Basic analytics', included: true },
            { name: 'Custom alerts', included: false, note: 'Coming soon' }
        ],
        limits: {
            requests: '50,000/month',
            airports: 'Unlimited',
            concurrent: '10 requests/sec',
            support: 'Email'
        }
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: 99,
        period: 'month',
        description: 'Full-featured solution for large organizations',
        color: 'gold',
        icon: Crown,
        badge: 'Most Popular',
        features: [
            { name: 'Premium weather data', included: true },
            { name: 'Global airport coverage', included: true },
            { name: 'Real-time + historical data', included: true },
            { name: 'Advanced analytics dashboard', included: true },
            { name: 'Custom alerts & notifications', included: true },
            { name: 'Priority support (24/7)', included: true },
            { name: 'API rate limit: 100 req/sec', included: true },
            { name: 'Custom integrations', included: true }
        ],
        limits: {
            requests: '500,000/month',
            airports: 'Global coverage',
            concurrent: '100 requests/sec',
            support: '24/7 Priority'
        }
    },
    {
        id: 'custom',
        name: 'Custom',
        price: 0,
        period: 'contact',
        description: 'Tailored solutions for enterprise needs',
        color: 'green',
        icon: Rocket,
        features: [
            { name: 'Custom data sources', included: true },
            { name: 'Dedicated infrastructure', included: true },
            { name: 'Custom SLA agreements', included: true },
            { name: 'White-label solutions', included: true },
            { name: 'On-premise deployment', included: true },
            { name: 'Dedicated account manager', included: true },
            { name: 'Custom development', included: true },
            { name: 'Enterprise security', included: true }
        ],
        limits: {
            requests: 'Unlimited',
            airports: 'Custom',
            concurrent: 'Custom',
            support: 'Dedicated'
        }
    }
]

export default function AviationPricing() {
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

    const getColorClasses = (color: string, variant: 'border' | 'bg' | 'text' | 'button') => {
        const colors = {
            blue: {
                border: 'border-blue-500',
                bg: 'bg-blue-500/10',
                text: 'text-blue-400',
                button: 'bg-blue-600 hover:bg-blue-700'
            },
            purple: {
                border: 'border-purple-500',
                bg: 'bg-purple-500/10',
                text: 'text-purple-400',
                button: 'bg-purple-600 hover:bg-purple-700'
            },
            gold: {
                border: 'border-yellow-500',
                bg: 'bg-yellow-500/10',
                text: 'text-yellow-400',
                button: 'bg-yellow-600 hover:bg-yellow-700'
            },
            green: {
                border: 'border-green-500',
                bg: 'bg-green-500/10',
                text: 'text-green-400',
                button: 'bg-green-600 hover:bg-green-700'
            }
        }
        return colors[color as keyof typeof colors]?.[variant] || colors.blue[variant]
    }

    const formatPrice = (price: number, period: string) => {
        if (period === 'contact') return 'Contact Us'
        if (price === 0) return 'Free'

        const yearlyPrice = billingPeriod === 'yearly' ? price * 10 : price // 2 months free
        return `$${billingPeriod === 'yearly' ? yearlyPrice : price}/${billingPeriod === 'yearly' ? 'year' : 'month'}`
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    Aviation API Pricing
                </h1>
                <p className="text-xl text-blue-200 mb-8">
                    Choose the perfect plan for your aviation weather data needs
                </p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <span className={`font-medium ${billingPeriod === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
                        Monthly
                    </span>
                    <button
                        onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                        className={`relative w-14 h-7 rounded-full transition-colors ${billingPeriod === 'yearly' ? 'bg-blue-600' : 'bg-slate-600'
                            }`}
                    >
                        <div className={`absolute w-5 h-5 bg-white rounded-full top-1 transition-transform ${billingPeriod === 'yearly' ? 'translate-x-8' : 'translate-x-1'
                            }`} />
                    </button>
                    <span className={`font-medium ${billingPeriod === 'yearly' ? 'text-white' : 'text-slate-400'}`}>
                        Yearly
                    </span>
                    {billingPeriod === 'yearly' && (
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Save 17%
                        </span>
                    )}
                </div>
            </motion.div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {pricingPlans.map((plan, index) => {
                    const Icon = plan.icon
                    const isSelected = selectedPlan === plan.id

                    return (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative bg-slate-800/50 backdrop-blur-xl rounded-2xl border-2 p-6 transition-all duration-300 hover:scale-105 ${plan.popular ? 'border-purple-500 ring-2 ring-purple-500/20' :
                                    isSelected ? getColorClasses(plan.color, 'border') : 'border-slate-700'
                                } ${isSelected ? 'transform scale-105' : ''
                                }`}
                            onClick={() => setSelectedPlan(plan.id)}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            {/* Custom Badge */}
                            {plan.badge && !plan.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className={`${getColorClasses(plan.color, 'button')} text-white px-4 py-1 rounded-full text-sm font-medium`}>
                                        {plan.badge}
                                    </span>
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className="text-center mb-6">
                                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${getColorClasses(plan.color, 'bg')} flex items-center justify-center`}>
                                    <Icon className={`w-8 h-8 ${getColorClasses(plan.color, 'text')}`} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                                <div className="text-3xl font-bold">
                                    {formatPrice(plan.price, plan.period)}
                                </div>
                            </div>

                            {/* Limits */}
                            <div className="space-y-2 mb-6 p-4 bg-slate-700/30 rounded-lg">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">API Requests:</span>
                                    <span className="font-medium">{plan.limits.requests}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Airports:</span>
                                    <span className="font-medium">{plan.limits.airports}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Rate Limit:</span>
                                    <span className="font-medium">{plan.limits.concurrent}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Support:</span>
                                    <span className="font-medium">{plan.limits.support}</span>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="space-y-3 mb-6">
                                {plan.features.map((feature, featureIndex) => (
                                    <div key={featureIndex} className="flex items-start gap-3">
                                        {feature.included ? (
                                            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <X className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                                        )}
                                        <div className="flex-1">
                                            <span className={`text-sm ${feature.included ? 'text-white' : 'text-slate-500'}`}>
                                                {feature.name}
                                            </span>
                                            {feature.note && (
                                                <span className="text-xs text-blue-400 ml-2">({feature.note})</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Button */}
                            <button
                                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${plan.period === 'contact'
                                        ? 'bg-slate-600 hover:bg-slate-700 text-white'
                                        : `${getColorClasses(plan.color, 'button')} text-white`
                                    }`}
                            >
                                {plan.period === 'contact' ? 'Contact Sales' : 'Get Started'}
                            </button>
                        </motion.div>
                    )
                })}
            </div>

            {/* Enterprise Features */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-8 mb-8"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Enterprise Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-blue-600/20 rounded-2xl flex items-center justify-center">
                            <Globe className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Global Coverage</h3>
                        <p className="text-slate-400 text-sm">
                            Access weather data from over 10,000 airports worldwide with real-time updates
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-purple-600/20 rounded-2xl flex items-center justify-center">
                            <Shield className="w-8 h-8 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Enterprise Security</h3>
                        <p className="text-slate-400 text-sm">
                            SOC 2 compliant, encrypted data transmission, and dedicated security monitoring
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-green-600/20 rounded-2xl flex items-center justify-center">
                            <Users className="w-8 h-8 text-green-400" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Dedicated Support</h3>
                        <p className="text-slate-400 text-sm">
                            24/7 priority support with dedicated account manager and custom SLA
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-8"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-bold mb-2">What's included in the free plan?</h4>
                        <p className="text-slate-400 text-sm mb-4">
                            Basic METAR/TAF data for up to 5 airports with 1,000 API requests per month.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2">Can I upgrade or downgrade anytime?</h4>
                        <p className="text-slate-400 text-sm mb-4">
                            Yes, you can change your plan at any time. Changes take effect immediately.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2">What happens if I exceed my limits?</h4>
                        <p className="text-slate-400 text-sm mb-4">
                            API requests will be rate-limited. We'll contact you about upgrading your plan.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2">Do you offer custom solutions?</h4>
                        <p className="text-slate-400 text-sm mb-4">
                            Yes, our Custom plan includes tailored solutions, on-premise deployment, and dedicated support.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
