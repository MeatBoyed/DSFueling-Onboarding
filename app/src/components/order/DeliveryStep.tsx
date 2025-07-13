'use client';

import React, { useState } from 'react';
import { useOrder } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { BUSINESS_RULES } from '@/types/order';

export function DeliveryStep() {
    const { state, actions } = useOrder();

    const [deliveryType, setDeliveryType] = useState<'same-day' | 'standard'>(
        state.order.delivery?.type || 'standard'
    );

    const handleContinue = () => {
        actions.setDeliveryDetails({
            type: deliveryType,
        });
        actions.nextStep();
    };

    const handleBack = () => {
        actions.previousStep();
    };

    return (
        <div className="w-full max-w-md mx-auto px-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
                <div className="text-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Delivery Options</h2>
                    <p className="text-sm text-gray-600 mt-1">Choose your delivery method</p>
                </div>

                <div className="space-y-3">
                    <Label className="text-xs font-medium text-gray-700">Delivery Method</Label>
                    
                    {/* Standard Delivery */}
                    <div
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            deliveryType === 'standard'
                                ? 'border-black bg-gray-50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setDeliveryType('standard')}
                    >
                        <div className="flex items-start space-x-3">
                            <div className={`w-4 h-4 rounded-full border-2 mt-0.5 ${
                                deliveryType === 'standard'
                                    ? 'border-black bg-black'
                                    : 'border-gray-300'
                            }`}>
                                {deliveryType === 'standard' && (
                                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-sm text-gray-900">Standard Delivery</h3>
                                <p className="text-xs text-gray-600 mt-1">
                                    {BUSINESS_RULES.deliveryOptions.standard}
                                </p>
                                <span className="inline-block mt-2 px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                    Free
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Same Day Delivery */}
                    <div
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            deliveryType === 'same-day'
                                ? 'border-black bg-gray-50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setDeliveryType('same-day')}
                    >
                        <div className="flex items-start space-x-3">
                            <div className={`w-4 h-4 rounded-full border-2 mt-0.5 ${
                                deliveryType === 'same-day'
                                    ? 'border-black bg-black'
                                    : 'border-gray-300'
                            }`}>
                                {deliveryType === 'same-day' && (
                                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-sm text-gray-900">Same Day Delivery</h3>
                                <p className="text-xs text-gray-600 mt-1">Get your order delivered today</p>
                                <span className="inline-block mt-2 px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                    Priority Service
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delivery Address Confirmation */}
                {state.order.customer?.address && (
                    <div className="bg-gray-50 rounded-lg p-3">
                        <h3 className="font-medium text-sm mb-2">Delivery Address</h3>
                        <p className="text-xs text-gray-700">{state.order.customer.address}</p>
                    </div>
                )}

                {/* Same Day Notice */}
                {deliveryType === 'same-day' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <h3 className="font-medium text-blue-900 text-sm mb-2">📋 Same Day Notice</h3>
                        <ul className="text-xs text-blue-800 space-y-1">
                            <li>• Orders by 2:00 PM</li>
                            <li>• Monday to Friday only</li>
                            <li>• Subject to availability</li>
                        </ul>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex gap-3 pt-2">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        className="flex-1 h-10 text-sm"
                    >
                        Back
                    </Button>
                    <Button
                        onClick={handleContinue}
                        className="flex-1 h-10 bg-black text-white hover:bg-gray-800 text-sm"
                    >
                        Review Order
                    </Button>
                </div>
            </div>
        </div>
    );
}