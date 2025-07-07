import { PricingResult } from "@/types";
import React from "react";

interface PricingResultSectionProps {
  pricingResult: PricingResult | null;
}

export const PricingResultSection = ({
  pricingResult,
}: PricingResultSectionProps) => {
  return (
    pricingResult && (
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-black">
          Pricing Results
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Best Deal</h3>
            <p className="text-blue-600 mb-2">{pricingResult.description}</p>
            <div className="space-y-1">
              <p>
                <span className="font-semibold text-gray-400">Original Price:</span>
                <span className="text-black"> ${pricingResult.originalPrice.toFixed(2)}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-400">Final Price:</span>
                <span className="text-black"> ${pricingResult.finalPrice.toFixed(2)}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-400">Savings:</span>
                <span className="text-black"> ${pricingResult.discount.toFixed(2)}</span>
                <span className="text-black"> ({pricingResult.savingsPercentage.toFixed(1)}%)</span>
              </p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">
              Promotion Applied
            </h3>
            <p className="text-green-600 capitalize">
              {pricingResult.promotionType.replaceAll("_", " ")}
            </p>
            {pricingResult.promotionType !== "none" && (
              <p className="text-sm text-green-600 mt-2">
                You saved ${pricingResult.discount.toFixed(2)} on this purchase!
              </p>
            )}
          </div>
        </div>
      </div>
    )
  );
};
