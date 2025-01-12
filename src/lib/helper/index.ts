// Declare chrome property on Window interface
declare global {
  interface Window {
    chrome?: {
      runtime: Record<string, unknown>;
    };
  }
}

export function formatCurrencyToNumber(amount: string) {
  try {
    return parseFloat(amount.replace(/[₦$,]/g, ""));
  } catch (error) {
    console.error("Error formatting currency:", error);
    return amount;
  }
}
