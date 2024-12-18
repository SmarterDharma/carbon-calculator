import { ELECTRICITY_RATES } from '../constants';

const getRateSlabs = (pincode) => {
  const pincodePrefix = pincode.toString().substring(0, 3);
  return ELECTRICITY_RATES[pincodePrefix] || ELECTRICITY_RATES.default;
};

const getEffectiveRate = (slab) => {
  return slab.rate + (slab.whelingChargePerUnit || 0);
};

const calculateUnitsForFixedCharge = (bill, rateSlabs) => {
  for (let i = 0; i < rateSlabs.length; i++) {
    const slab = rateSlabs[i];
    const remainingBillAfterFixedCharge = bill - slab.fixedCharge;
    const effectiveRate = getEffectiveRate(slab);
    const units = remainingBillAfterFixedCharge / effectiveRate;

    if (units > slab.maxUnits) {
      continue;
    } else {
      return units;
    }
  }
  return 0;
};

const calculateUnitsForSlabs = (bill, rateSlabs) => {
  let remainingBill = bill;
  let totalUnits = 0;

  for (let i = 0; i < rateSlabs.length; i++) {
    const currentSlab = rateSlabs[i];
    const previousSlab = i > 0 ? rateSlabs[i-1].maxUnits : 0;
    const slabUnits = currentSlab.maxUnits - previousSlab;
    const effectiveRate = getEffectiveRate(currentSlab);
    
    if (currentSlab.maxUnits === Infinity) {
      totalUnits += remainingBill / effectiveRate;
      break;
    } else {
      const slabCost = slabUnits * effectiveRate;
      
      if (remainingBill >= slabCost) {
        totalUnits += slabUnits;
        remainingBill -= slabCost;
      } else {
        totalUnits += remainingBill / effectiveRate;
        break;
      }
    }
  }

  return totalUnits;
};

export const calculateUnitsFromBill = (bill, pincode) => {
  if (!bill || !pincode) return 0;

  const rateSlabs = getRateSlabs(pincode);
  const hasFixedCharge = rateSlabs.some(slab => slab.fixedCharge);

  if (hasFixedCharge) {
    return calculateUnitsForFixedCharge(bill, rateSlabs);
  }

  return calculateUnitsForSlabs(bill, rateSlabs);
};
