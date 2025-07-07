import { Customer } from "@/domain/entities/Customer";
import React from "react";

interface CustomerSelectionSectionProps {
  customers: Customer[];
  selectedCustomer: string;
  onSelectCustomer: (customer: string) => void;
}

export const CustomerSelectionSection = ({
  customers,
  selectedCustomer,
  onSelectCustomer,
}: CustomerSelectionSectionProps) => {
  const selectedCustomerData = customers.find((c) => c.id === selectedCustomer);
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-black">
        Customer Selection
      </h2>
      <select
        value={selectedCustomer}
        onChange={(e) => onSelectCustomer(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
      >
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name} ({customer.type})
          </option>
        ))}
      </select>

      {selectedCustomerData && (
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <p className="text-blue-800">
            <strong>Selected:</strong> {selectedCustomerData.name}
            {selectedCustomerData.type === "vip" &&
              " (VIP - 15% discount available)"}
          </p>
        </div>
      )}
    </div>
  );
};
