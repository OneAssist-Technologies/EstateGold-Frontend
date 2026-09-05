export interface EmiCalculationResult {
  emi: number;
  principal: number;
  totalInterest: number;
  totalPayment: number;
  tenureMonths: number;
  annualInterestRate: number;
  tenureYears: number;
}

/**
 * Calculates reducing balance Home Loan EMI and loan breakdown.
 * Standard Formula: EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]
 * Special Case: If R = 0 (0% interest), EMI = P / N.
 */
export function calculateHomeLoanEMI(
  principal: number,
  annualInterestRate: number,
  tenureYears: number
): EmiCalculationResult {
  const safePrincipal = Math.max(0, isNaN(principal) ? 0 : principal);
  const safeRate = Math.max(0, isNaN(annualInterestRate) ? 0 : annualInterestRate);
  const safeTenureYears = Math.max(0, isNaN(tenureYears) ? 0 : tenureYears);

  const tenureMonths = Math.round(safeTenureYears * 12);

  if (safePrincipal <= 0 || tenureMonths <= 0) {
    return {
      emi: 0,
      principal: safePrincipal,
      totalInterest: 0,
      totalPayment: safePrincipal,
      tenureMonths: Math.max(0, tenureMonths),
      annualInterestRate: safeRate,
      tenureYears: safeTenureYears,
    };
  }

  // Monthly Interest Rate = Annual Rate / (12 * 100)
  const monthlyRate = safeRate / 1200;

  let emi = 0;

  if (monthlyRate === 0) {
    // Zero-interest rate case
    emi = safePrincipal / tenureMonths;
  } else {
    const compound = Math.pow(1 + monthlyRate, tenureMonths);
    emi = (safePrincipal * monthlyRate * compound) / (compound - 1);
  }

  if (isNaN(emi) || !isFinite(emi)) {
    emi = 0;
  } else {
    emi = Math.round(emi);
  }

  const totalPayment = Math.round(emi * tenureMonths);
  const totalInterest = Math.max(0, totalPayment - safePrincipal);

  return {
    emi,
    principal: safePrincipal,
    totalInterest,
    totalPayment,
    tenureMonths,
    annualInterestRate: safeRate,
    tenureYears: safeTenureYears,
  };
}

/**
 * Formats a number into Indian Rupee currency format (e.g. ₹50,00,000 or ₹3,471)
 */
export function formatIndianCurrency(amount: number): string {
  if (isNaN(amount) || !isFinite(amount)) return "₹0";
  const rounded = Math.round(amount);
  return `₹${rounded.toLocaleString("en-IN")}`;
}

/**
 * Formats large amounts into Lakhs / Crores for display (e.g. ₹50 L, ₹1.2 Cr)
 */
export function formatAbbreviatedCurrency(amount: number): string {
  if (isNaN(amount) || !isFinite(amount) || amount <= 0) return "₹0";
  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2).replace(/\.00$/, "");
    return `₹${cr} Cr`;
  }
  if (amount >= 100000) {
    const l = (amount / 100000).toFixed(2).replace(/\.00$/, "");
    return `₹${l} L`;
  }
  return formatIndianCurrency(amount);
}
