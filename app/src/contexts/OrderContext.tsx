'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { OrderState, CustomerDetails, ProductDetails, DeliveryDetails, PricingDetails, PRODUCT_CATALOG, BUSINESS_RULES } from '@/types/order';

// Action types for the reducer
type OrderAction =
    | { type: 'SET_CUSTOMER_DETAILS'; payload: CustomerDetails }
    | { type: 'SET_PRODUCT_DETAILS'; payload: ProductDetails }
    | { type: 'SET_DELIVERY_DETAILS'; payload: DeliveryDetails }
    | { type: 'CALCULATE_PRICING' }
    | { type: 'NEXT_STEP' }
    | { type: 'PREVIOUS_STEP' }
    | { type: 'SET_STEP'; payload: number }
    | { type: 'CONFIRM_ORDER' }
    | { type: 'RESET_ORDER' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };

// Initial state
const initialState: OrderState = {
    currentStep: 0,
    order: {},
    isLoading: false,
    error: null,
};

// Reducer function
function orderReducer(state: OrderState, action: OrderAction): OrderState {
    switch (action.type) {
        case 'SET_CUSTOMER_DETAILS':
            return {
                ...state,
                order: {
                    ...state.order,
                    customer: action.payload,
                },
                error: null,
            };

        case 'SET_PRODUCT_DETAILS':
            return {
                ...state,
                order: {
                    ...state.order,
                    product: action.payload,
                },
                error: null,
            };

        case 'SET_DELIVERY_DETAILS':
            return {
                ...state,
                order: {
                    ...state.order,
                    delivery: action.payload,
                },
                error: null,
            };

        case 'CALCULATE_PRICING': {
            const { product } = state.order;
            if (!product) return state;

            const productInfo = PRODUCT_CATALOG[product.type];
            const unitPrice = product.format === 'bottle'
                ? productInfo.bottle.price
                : productInfo.barrel.price;

            const totalBeforeDiscount = unitPrice * product.quantity;

            // Apply 20% discount if 5+ bottles
            const qualifiesForDiscount = product.format === 'bottle' &&
                product.quantity >= BUSINESS_RULES.minQuantityForDiscount;

            const discountPercentage = qualifiesForDiscount ? BUSINESS_RULES.discountPercentage : 0;
            const discount = totalBeforeDiscount * (discountPercentage / 100);
            const totalAfterDiscount = totalBeforeDiscount - discount;

            const pricing: PricingDetails = {
                unitPrice,
                totalBeforeDiscount,
                discount,
                discountPercentage,
                totalAfterDiscount,
            };

            return {
                ...state,
                order: {
                    ...state.order,
                    pricing,
                },
            };
        }

        case 'NEXT_STEP':
            return {
                ...state,
                currentStep: Math.min(state.currentStep + 1, 5),
                error: null,
            };

        case 'PREVIOUS_STEP':
            return {
                ...state,
                currentStep: Math.max(state.currentStep - 1, 0),
                error: null,
            };

        case 'SET_STEP':
            return {
                ...state,
                currentStep: action.payload,
                error: null,
            };

        case 'CONFIRM_ORDER':
            return {
                ...state,
                order: {
                    ...state.order,
                    confirmed: true,
                    createdAt: new Date(),
                    id: generateOrderId(),
                },
            };

        case 'RESET_ORDER':
            return initialState;

        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };

        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            };

        default:
            return state;
    }
}

// Helper function to generate order ID
function generateOrderId(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `DS-${timestamp}-${randomStr}`.toUpperCase();
}

// Context type
interface OrderContextType {
    state: OrderState;
    actions: {
        setCustomerDetails: (details: CustomerDetails) => void;
        setProductDetails: (details: ProductDetails) => void;
        setDeliveryDetails: (details: DeliveryDetails) => void;
        calculatePricing: () => void;
        nextStep: () => void;
        previousStep: () => void;
        goToStep: (step: number) => void;
        confirmOrder: () => void;
        resetOrder: () => void;
        submitOrder: () => Promise<void>;
    };
    utils: {
        canProceedToNextStep: () => boolean;
        getCurrentStepName: () => string;
        getTotalSteps: () => number;
        getOrderSummary: () => string;
    };
}

// Create context
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Provider component
export function OrderProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(orderReducer, initialState);

    // Actions
    const setCustomerDetails = useCallback((details: CustomerDetails) => {
        console.log('Setting customer details:', details);
        dispatch({ type: 'SET_CUSTOMER_DETAILS', payload: details });
    }, []);

    const setProductDetails = useCallback((details: ProductDetails) => {
        dispatch({ type: 'SET_PRODUCT_DETAILS', payload: details });
        // Calculate pricing immediately
        dispatch({ type: 'CALCULATE_PRICING' });
    }, []);

    const setDeliveryDetails = useCallback((details: DeliveryDetails) => {
        dispatch({ type: 'SET_DELIVERY_DETAILS', payload: details });
    }, []);

    const calculatePricing = useCallback(() => {
        dispatch({ type: 'CALCULATE_PRICING' });
    }, []);

    const nextStep = useCallback(() => {
        console.log('Moving to next step from:', state.currentStep);
        dispatch({ type: 'NEXT_STEP' });
    }, [state.currentStep]);

    const previousStep = useCallback(() => {
        dispatch({ type: 'PREVIOUS_STEP' });
    }, []);

    const goToStep = useCallback((step: number) => {
        dispatch({ type: 'SET_STEP', payload: step });
    }, []);

    const confirmOrder = useCallback(() => {
        dispatch({ type: 'CONFIRM_ORDER' });
    }, []);

    const resetOrder = useCallback(() => {
        dispatch({ type: 'RESET_ORDER' });
    }, []);

    // Submit order to N8N endpoint (placeholder for future implementation)
    const submitOrder = useCallback(async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            // TODO: Implement N8N endpoint call
            console.log('Submitting order:', state.order);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            dispatch({ type: 'SET_LOADING', payload: false });
        } catch (error) {
            console.error('Order submission error:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to submit order. Please try again.' });
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [state.order]);

    // Utility functions
    const canProceedToNextStep = useCallback(() => {
        const { currentStep, order } = state;

        switch (currentStep) {
            case 0: // Customer details
                return !!(order.customer?.name && order.customer?.surname &&
                    order.customer?.phone && order.customer?.email &&
                    order.customer?.address);
            case 1: // Product selection
                return !!(order.product?.type && order.product?.quantity && order.product?.format);
            case 2: // Delivery
                return !!order.delivery?.type;
            case 3: // Review
                return !!(order.customer && order.product && order.delivery && order.pricing);
            case 4: // Confirmation
                return !!order.confirmed;
            default:
                return false;
        }
    }, [state]);

    const getCurrentStepName = useCallback(() => {
        const stepNames = [
            'Customer Details',
            'Product Selection',
            'Delivery Options',
            'Order Review',
            'Confirmation',
            'Payment Information'
        ];
        return stepNames[state.currentStep] || 'Unknown';
    }, [state]);

    const getTotalSteps = useCallback(() => 6, []);

    const getOrderSummary = useCallback(() => {
        const { order } = state;
        if (!order.product || !order.pricing) return '';

        const productInfo = PRODUCT_CATALOG[order.product.type];
        const formatInfo = order.product.format === 'bottle'
            ? productInfo.bottle
            : productInfo.barrel;

        return `${order.product.quantity}x ${formatInfo.description} - R${order.pricing.totalAfterDiscount.toFixed(2)}`;
    }, [state]);

    const contextValue: OrderContextType = {
        state,
        actions: {
            setCustomerDetails,
            setProductDetails,
            setDeliveryDetails,
            calculatePricing,
            nextStep,
            previousStep,
            goToStep,
            confirmOrder,
            resetOrder,
            submitOrder,
        },
        utils: {
            canProceedToNextStep,
            getCurrentStepName,
            getTotalSteps,
            getOrderSummary,
        },
    };

    return (
        <OrderContext.Provider value={contextValue}>
            {children}
        </OrderContext.Provider>
    );
}

// Hook to use the order context
export function useOrder() {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
}