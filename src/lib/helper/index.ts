// Declare chrome property on Window interface
declare global {
  interface Window {
    chrome?: {
      runtime: Record<string, unknown>;
    };
  }
}

export function formatCurrency(amount: string) {
  // If amount is already a string, clean it up
  if (typeof amount === "string") {
    // Remove currency symbols and commas
    amount = amount.replace(/[₦,]/g, "");
  }

  // Convert to number
  const value = parseFloat(amount);

  // Check if it's a dollar amount (assuming dollar amounts start with $)
  if (amount.toString().includes("$")) {
    return amount.toString();
  }

  // Format the number with commas and 2 decimal places
  const formattedNumber = value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `₦${formattedNumber}`;
}
