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
    return amount;
  }
}

export const formatToNaira = (amount: number | string): string => {
  try {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(numAmount);
  } catch (error) {
    return amount.toString();
  }
};
