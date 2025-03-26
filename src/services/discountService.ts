
// discountService.ts
export interface DiscountCode {
  id: string;
  code: string;
  percentage: number;
  active: boolean;
  createdAt: string;
  usedCount: number;
}

const DISCOUNT_CODES_KEY = 'discount_codes';

// Initialize discount codes in localStorage if they don't exist
if (!localStorage.getItem(DISCOUNT_CODES_KEY)) {
  localStorage.setItem(DISCOUNT_CODES_KEY, JSON.stringify([]));
}

// Function to get all discount codes
export const getDiscountCodes = (): DiscountCode[] => {
  const codesJson = localStorage.getItem(DISCOUNT_CODES_KEY);
  return codesJson ? JSON.parse(codesJson) : [];
};

// Function to save discount codes
const saveDiscountCodes = (codes: DiscountCode[]) => {
  localStorage.setItem(DISCOUNT_CODES_KEY, JSON.stringify(codes));
};

// Function to create a new discount code
export const createDiscountCode = (code: string, percentage: number): DiscountCode => {
  const codes = getDiscountCodes();
  
  // Check if code already exists
  const codeExists = codes.some(existingCode => existingCode.code === code);
  if (codeExists) {
    throw new Error('Discount code already exists');
  }
  
  const newCode: DiscountCode = {
    id: `dc_${Date.now()}`,
    code,
    percentage,
    active: true,
    createdAt: new Date().toISOString(),
    usedCount: 0
  };
  
  codes.push(newCode);
  saveDiscountCodes(codes);
  
  return newCode;
};

// Function to toggle a discount code's active status
export const toggleDiscountCodeStatus = (id: string): DiscountCode | null => {
  const codes = getDiscountCodes();
  const codeIndex = codes.findIndex(code => code.id === id);
  
  if (codeIndex === -1) {
    return null;
  }
  
  codes[codeIndex].active = !codes[codeIndex].active;
  saveDiscountCodes(codes);
  
  return codes[codeIndex];
};

// Function to delete a discount code
export const deleteDiscountCode = (id: string): boolean => {
  const codes = getDiscountCodes();
  const filteredCodes = codes.filter(code => code.id !== id);
  
  if (filteredCodes.length === codes.length) {
    return false; // No code was deleted
  }
  
  saveDiscountCodes(filteredCodes);
  return true;
};

// Function to validate a discount code
export const validateDiscountCode = (code: string): DiscountCode | null => {
  const codes = getDiscountCodes();
  const discountCode = codes.find(c => c.code === code && c.active);
  
  if (!discountCode) {
    return null;
  }
  
  // Mark code as used
  const updatedCodes = codes.map(c => {
    if (c.id === discountCode.id) {
      return { ...c, usedCount: c.usedCount + 1 };
    }
    return c;
  });
  
  saveDiscountCodes(updatedCodes);
  
  return discountCode;
};
