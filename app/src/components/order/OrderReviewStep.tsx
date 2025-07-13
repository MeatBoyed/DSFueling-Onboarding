'use client';

import React from 'react';
import { useOrder } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PRODUCT_CATALOG, BUSINESS_RULES } from '@/types/order';

export function OrderReviewStep() {
    const { state, actions } = useOrder();
    const { order } = state;

    if (!order.customer || !order.product || !order.delivery || !order.pricing) {
        return (
            <div className="w-full max-w-2xl mx-auto">
                <Card className="bg-white border border-gray-200 shadow-lg rounded-xl">
                    <CardContent className="p-8 text-center">
                        <p className="text-red-600">Missing order information. Please go back and complete all steps.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const productInfo = PRODUCT_CATALOG[order.product.type];
    const formatInfo = order.product.format === 'bottle'
        ? productInfo.bottle
        : productInfo.barrel;

    const handleConfirm = () => {
        actions.confirmOrder();
        actions.nextStep();
    };

    const handleBack = () => {
        actions.previousStep();
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <Card className="bg-white border border-gray-200 shadow-lg rounded-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        Review Your Order
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        Please review all details before confirming. You cannot make changes after confirmation.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Customer Details */}
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {order.customer.name} {order.customer.surname}
                                    </p>
                                    <p className="text-gray-600">{order.customer.email}</p>
                                    <p className="text-gray-600">{order.customer.phone}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-700 mb-1">Delivery Address:</p>
                                    <p className="text-gray-600">{order.customer.address}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Details */}
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Product Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {productInfo.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {formatInfo.description}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">
                                            {order.product.quantity}x {formatInfo.size}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            R{formatInfo.price} each
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Delivery Details */}
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Delivery Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {order.delivery.type === 'same-day' ? 'Same Day Delivery' : 'Standard Delivery'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {order.delivery.type === 'same-day'
                                            ? 'Delivered today (if ordered before 2 PM)'
                                            : BUSINESS_RULES.deliveryOptions.standard
                                        }
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                        Free
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing Breakdown */}
                    <Card className="border border-gray-200 bg-gray-50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Order Total</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Subtotal ({order.product.quantity}x {formatInfo.size})</span>
                                    <span>R{order.pricing.totalBeforeDiscount.toFixed(2)}</span>
                                </div>

                                {order.pricing.discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount ({order.pricing.discountPercentage}%)</span>
                                        <span>-R{order.pricing.discount.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span>Delivery</span>
                                    <span>Free</span>
                                </div>

                                <hr className="my-3" />

                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total Amount</span>
                                    <span>R{order.pricing.totalAfterDiscount.toFixed(2)}</span>
                                </div>
                            </div>

                            {order.pricing.discount > 0 && (
                                <div className="mt-4 p-3 bg-green-100 rounded-lg">
                                    <p className="text-sm text-green-800 font-medium">
                                        🎉 You saved R{order.pricing.discount.toFixed(2)} with your bulk order discount!
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Important Notice */}
                    <Card className="border border-amber-200 bg-amber-50">
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-amber-900 mb-2">⚠️ Important Notice</h3>
                            <ul className="text-sm text-amber-800 space-y-1">
                                <li>• Once confirmed, this order cannot be modified or cancelled</li>
                                <li>• Processing begins immediately after payment confirmation</li>
                                <li>• Please ensure all details are correct before proceeding</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Navigation */}
                    <div className="flex justify-between pt-6">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            className="px-8 py-2"
                        >
                            Back to Delivery
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            className="px-8 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
                        >
                            Confirm Order
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}