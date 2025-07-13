'use client';

import React from 'react';
import { useOrder } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BANKING_DETAILS } from '@/types/order';

export function OrderConfirmationStep() {
    const { state, actions, utils } = useOrder();
    const { order } = state;

    if (!order.id || !order.pricing) {
        return (
            <div className="w-full max-w-2xl mx-auto">
                <Card className="bg-white border border-gray-200 shadow-lg rounded-xl">
                    <CardContent className="p-8 text-center">
                        <p className="text-red-600">Order confirmation information is missing.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handlePayOnline = () => {
        // TODO: Integrate with PayFast or similar payment gateway
        window.open('https://www.payfast.co.za', '_blank');
    };

    const handleNewOrder = () => {
        actions.resetOrder();
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // You could add a toast notification here
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <Card className="bg-white border border-gray-200 shadow-lg rounded-xl">
                <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        Order Confirmed!
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        Thank you for your order. Please proceed with payment to complete your purchase.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Order ID */}
                    <Card className="bg-gray-50 border-gray-200">
                        <CardContent className="p-4">
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-700">Your Order Number</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{order.id}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Please save this number for your records
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Amount */}
                    <Card className="border border-gray-200">
                        <CardContent className="p-4">
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-700">Total Amount Due</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    R{order.pricing.totalAfterDiscount.toFixed(2)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* EFT Banking Details */}
                    <Card className="border border-blue-200 bg-blue-50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg text-blue-900">💳 EFT Banking Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="font-medium text-blue-900">Bank Name:</p>
                                        <p className="text-blue-800">{BANKING_DETAILS.bankName}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-blue-900">Account Name:</p>
                                        <p className="text-blue-800">{BANKING_DETAILS.accountName}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-blue-900">Account Number:</p>
                                        <div className="flex items-center space-x-2">
                                            <p className="text-blue-800 font-mono">{BANKING_DETAILS.accountNumber}</p>
                                            <button
                                                onClick={() => copyToClipboard(BANKING_DETAILS.accountNumber)}
                                                className="text-blue-600 hover:text-blue-800 text-xs"
                                                title="Copy to clipboard"
                                            >
                                                📋
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-medium text-blue-900">Branch Code:</p>
                                        <p className="text-blue-800 font-mono">{BANKING_DETAILS.branchCode}</p>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-blue-200">
                                    <p className="font-medium text-blue-900">Reference:</p>
                                    <div className="flex items-center space-x-2">
                                        <p className="text-blue-800 font-mono">{order.id}</p>
                                        <button
                                            onClick={() => copyToClipboard(order.id!)}
                                            className="text-blue-600 hover:text-blue-800 text-xs"
                                            title="Copy to clipboard"
                                        >
                                            📋
                                        </button>
                                    </div>
                                    <p className="text-xs text-blue-700 mt-1">
                                        {BANKING_DETAILS.reference}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Options */}
                    <div className="space-y-4">
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-700 mb-4">Choose Your Payment Method</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button
                                onClick={handlePayOnline}
                                className="h-auto p-4 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <div className="text-center">
                                    <p className="font-semibold">Pay Online Now</p>
                                    <p className="text-sm opacity-90">Secure online payment</p>
                                </div>
                            </Button>

                            <Button
                                variant="outline"
                                className="h-auto p-4 border-gray-300"
                            >
                                <div className="text-center">
                                    <p className="font-semibold">Manual EFT</p>
                                    <p className="text-sm text-gray-600">Use banking details above</p>
                                </div>
                            </Button>
                        </div>
                    </div>

                    {/* Important Notice */}
                    <Card className="border border-red-200 bg-red-50">
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-red-900 mb-2">⚠️ Important Payment Notice</h3>
                            <ul className="text-sm text-red-800 space-y-1">
                                <li>• <strong>Order processing will only begin after payment confirmation</strong></li>
                                <li>• Please send proof of payment to our accounts team</li>
                                <li>• For EFT payments, please use your order number as reference</li>
                                <li>• Processing time: 1-2 business days after payment confirmation</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Order Summary */}
                    <Card className="border border-gray-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Order Number:</span>
                                    <span className="font-mono">{order.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Order Date:</span>
                                    <span>{order.createdAt?.toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Customer:</span>
                                    <span>{order.customer?.name} {order.customer?.surname}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Product:</span>
                                    <span>{utils.getOrderSummary()}</span>
                                </div>
                                <div className="flex justify-between font-semibold">
                                    <span>Total Amount:</span>
                                    <span>R{order.pricing.totalAfterDiscount.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-center space-x-4 pt-6">
                        <Button
                            variant="outline"
                            onClick={handleNewOrder}
                            className="px-8 py-2"
                        >
                            Place New Order
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}