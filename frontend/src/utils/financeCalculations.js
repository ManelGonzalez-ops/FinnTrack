export const getUnitaryCostMean =(posesions, amount, unitaryCost)=>
    (posesions.unitaryCost * posesions.amount) /
    (posesions.amount + amount)
    +
    (unitaryCost * amount) /
    (posesions.amount + amount)