'use client';

import React, { useState } from 'react';
import { useOrder } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PRODUCT_CATALOG, BUSINESS_RULES } from '@/types/order';

export function ProductSelectionStep() {
  const { state, actions } = useOrder();
  
  const [productType, setProductType] = useState<'ethanol' | 'methanol'>(
    state.order.product?.type || 'ethanol'
  );
  const [format, setFormat] = useState<'bottle' | 'barrel'>(
    state.order.product?.format || 'bottle'
  );
  const [quantity, setQuantity] = useState<number>(
    state.order.product?.quantity || 1
  );

  const productInfo = PRODUCT_CATALOG[productType];
  const currentFormatInfo = format === 'bottle' ? productInfo.bottle : productInfo.barrel;
  const unitPrice = currentFormatInfo.price;
  const totalBeforeDiscount = unitPrice * quantity;
  
  // Check if eligible for discount (5+ bottles)
  const qualifiesForDiscount = format === 'bottle' && quantity >= BUSINESS_RULES.minQuantityForDiscount;
  const discountAmount = qualifiesForDiscount ? totalBeforeDiscount * (BUSINESS_RULES.discountPercentage / 100) : 0;
  const totalAfterDiscount = totalBeforeDiscount - discountAmount;

  const handleContinue = () => {
    if (productType && format && quantity > 0) {
      actions.setProductDetails({
        type: productType,
        format,
        quantity,
      });
      actions.nextStep();
    }
  };

  const handleBack = () => {
    actions.previousStep();
  };

  const maxQuantity = format === 'bottle' ? BUSINESS_RULES.maxBottleQuantity : 10; // Arbitrary max for barrels

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Select Products</h2>
          <p className="text-sm text-gray-600 mt-1">Choose your fuel type and quantity</p>
        </div>

        {/* Product Type Cards */}
        <div className="space-y-3">
          <Label className="text-xs font-medium text-gray-700">Choose Fuel Type</Label>
          
          <div 
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
              productType === 'ethanol' 
                ? 'border-black bg-gray-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setProductType('ethanol')}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-sm">Ethanol (E95)</h3>
                <p className="text-xs text-gray-600">Premium Grade</p>
              </div>
              <div className="text-right text-xs">
                <p>20L: R{PRODUCT_CATALOG.ethanol.bottle.price.toLocaleString()}</p>
                <p>200L: R{PRODUCT_CATALOG.ethanol.barrel.price.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div 
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
              productType === 'methanol' 
                ? 'border-black bg-gray-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setProductType('methanol')}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-sm">100% Methanol</h3>
                <p className="text-xs text-gray-600">Industrial Grade</p>
              </div>
              <div className="text-right text-xs">
                <p>20L: R{PRODUCT_CATALOG.methanol.bottle.price.toLocaleString()}</p>
                <p>200L: R{PRODUCT_CATALOG.methanol.barrel.price.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Format & Quantity */}
        <div className="space-y-3">
          <Label className="text-xs font-medium text-gray-700">Package Size</Label>
          <Select value={format} onValueChange={(value: 'bottle' | 'barrel') => setFormat(value)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bottle">
                20L Bottle - R{PRODUCT_CATALOG[productType].bottle.price.toLocaleString()}
              </SelectItem>
              <SelectItem value="barrel">
                200L Barrel - R{PRODUCT_CATALOG[productType].barrel.price.toLocaleString()}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-xs font-medium text-gray-700">
            Quantity {format === 'bottle' && '(Max 20)'}
          </Label>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <Input
              type="number"
              min="1"
              max={maxQuantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1)))}
              className="h-8 w-16 text-center text-sm"
            />
            <Button 
              variant="outline" 
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              disabled={quantity >= maxQuantity}
            >
              +
            </Button>
          </div>
          {format === 'bottle' && quantity >= BUSINESS_RULES.minQuantityForDiscount && (
            <p className="text-xs text-green-600 font-medium">
              ✓ {BUSINESS_RULES.discountPercentage}% discount applied!
            </p>
          )}
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <h3 className="font-medium text-sm">Order Summary</h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>{quantity}x {currentFormatInfo.description}</span>
              <span>R{totalBeforeDiscount.toLocaleString()}</span>
            </div>
            {qualifiesForDiscount && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({BUSINESS_RULES.discountPercentage}%)</span>
                <span>-R{discountAmount.toLocaleString()}</span>
              </div>
            )}
            <hr className="my-1" />
            <div className="flex justify-between font-semibold text-sm">
              <span>Total</span>
              <span>R{totalAfterDiscount.toLocaleString()}</span>
            </div>
          </div>
        </div>

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
            disabled={!productType || !format || quantity < 1}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}