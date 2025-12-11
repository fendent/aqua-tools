// Chemical database for DIY dosing supplements

export const DOSING_PARAMETERS = {
  CALCIUM: 'calcium',
  ALKALINITY: 'alkalinity',
  MAGNESIUM: 'magnesium',
  NITRATE: 'nitrate',
  PHOSPHATE: 'phosphate',
  AMMONIA: 'ammonia'
}

export const CHEMICALS = {
  // CALCIUM COMPOUNDS
  calcium: [
    {
      id: 'cacl2-anhydrous',
      name: 'Calcium Chloride (Anhydrous)',
      formula: 'CaCl₂',
      molecularWeight: 111.0,
      elementPercentage: 36.1,
      commonNames: ['Anhydrous Calcium Chloride'],
      grades: ['Reagent Grade', 'Food Grade'],
      safetyNotes: 'Extremely hygroscopic. Dissolves exothermically (releases significant heat). May cause skin/eye irritation with prolonged contact. Wear gloves and eye protection.',
      storageNotes: 'Store in airtight container. Will absorb moisture from air.',
      solubilityLimit: 745,
      phEffect: 'Neutral (~7)',
      notes: 'Rarely sold in pure anhydrous form. Usually becomes hexahydrate due to hygroscopic nature.',
      pubchemLink: 'https://pubchem.ncbi.nlm.nih.gov/compound/Calcium-chloride'
    },
    {
      id: 'cacl2-dihydrate',
      name: 'Calcium Chloride Dihydrate',
      formula: 'CaCl₂·2H₂O',
      molecularWeight: 147.0,
      elementPercentage: 27.2,
      commonNames: ['Dowflake', 'DampRid'],
      grades: ['Food Grade', 'Technical Grade'],
      safetyNotes: 'Hygroscopic. Dissolves exothermically (releases heat). May cause skin/eye irritation with prolonged contact. Wear gloves and eye protection.',
      storageNotes: 'Store in airtight container. Will convert to hexahydrate over time.',
      solubilityLimit: 745,
      phEffect: 'Neutral (~7)',
      notes: "Most commonly available form. Randy's recipe uses 66.5-68.9g per liter.",
      pubchemLink: 'https://pubchem.ncbi.nlm.nih.gov/compound/Calcium-chloride'
    },
    {
      id: 'cacl2-hexahydrate',
      name: 'Calcium Chloride Hexahydrate',
      formula: 'CaCl₂·6H₂O',
      molecularWeight: 219.0,
      elementPercentage: 18.3,
      commonNames: ['Hydrated Calcium Chloride'],
      grades: ['Food Grade', 'Technical Grade'],
      safetyNotes: 'Dissolves exothermically (releases heat). May cause skin/eye irritation with prolonged contact. Wear gloves and eye protection.',
      storageNotes: 'Stable form. Store in sealed container.',
      solubilityLimit: 970,
      phEffect: 'Neutral (~7)',
      notes: 'Stable hydrated form. Despite buying dihydrate, calcium chloride typically exists as hexahydrate in practice.',
      pubchemLink: 'https://pubchem.ncbi.nlm.nih.gov/compound/Calcium-chloride'
    },
    {
      id: 'ca-no3-2',
      name: 'Calcium Nitrate',
      formula: 'Ca(NO₃)₂',
      molecularWeight: 164.09,
      elementPercentage: 24.4,
      commonNames: ['Norgessalpeter', 'Calcium Nitrate Fertilizer'],
      grades: ['Agricultural Grade', 'Technical Grade'],
      safetyNotes: 'Oxidizer. Keep away from combustibles. May cause respiratory and eye irritation. Wear gloves and eye protection. Avoid dust formation.',
      storageNotes: 'Store in cool, dry place away from organics.',
      solubilityLimit: 1212,
      phEffect: 'Slightly Acidic',
      notes: 'Also adds nitrate. Good for balanced dosing in ULNS (Ultra Low Nutrient Systems).',
      pubchemLink: 'https://pubchem.ncbi.nlm.nih.gov/compound/Calcium-nitrate'
    }
  ],

  // ALKALINITY COMPOUNDS
  alkalinity: [
    {
      id: 'nahco3',
      name: 'Sodium Bicarbonate (Baking Soda)',
      formula: 'NaHCO₃',
      molecularWeight: 84.01,
      elementPercentage: 72.6,
      commonNames: ['Baking Soda', 'Bicarb'],
      grades: ['Food Grade', 'USP Grade'],
      safetyNotes: 'Generally safe. Avoid inhaling dust.',
      storageNotes: 'Store in dry place. Stable at room temperature.',
      solubilityLimit: 96,
      phEffect: 'Moderate (~8.3 in solution)',
      notes: 'Use unbaked if tank pH is already high (>8.3). Lower alkalinity boost per gram than baked version.',
      pubchemLink: 'https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-bicarbonate'
    },
    {
      id: 'na2co3',
      name: 'Sodium Carbonate (Anhydrous Soda Ash)',
      formula: 'Na₂CO₃',
      molecularWeight: 105.99,
      elementPercentage: 56.6,
      commonNames: ['Soda Ash', 'Baked Soda', 'Anhydrous Sodium Carbonate'],
      grades: ['Food Grade', 'Technical Grade', 'Pool Grade'],
      safetyNotes: 'Caustic. Causes serious eye irritation. Irritating to skin. Wear gloves and eye protection.',
      storageNotes: 'Store in airtight container in dry place.',
      solubilityLimit: 215,
      phEffect: 'High (~11.4 in solution)',
      notes: "Anhydrous form. Randy's Recipe #1: 78.5g per liter. Make by baking baking soda at 300°F. Raises pH - good for most reef tanks.",
      pubchemLink: 'https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-carbonate'
    },
    {
      id: 'na2co3-decahydrate',
      name: 'Sodium Carbonate Decahydrate (Washing Soda)',
      formula: 'Na₂CO₃·10H₂O',
      molecularWeight: 286.14,
      elementPercentage: 21.0,
      commonNames: ['Washing Soda', 'Sal Soda', 'Hydrated Sodium Carbonate'],
      grades: ['Household Grade', 'Technical Grade'],
      safetyNotes: 'Caustic. Causes serious eye irritation. Irritating to skin. Wear gloves and eye protection.',
      storageNotes: 'Store in sealed container. Efflorescent crystals that readily lose water, forming monohydrate.',
      solubilityLimit: 215,
      phEffect: 'High (~11.4 in solution)',
      notes: 'Decahydrate form (true washing soda). Requires 2.70x more powder than anhydrous for same effect. Readily effloresces. Loses water at 100°C.',
      pubchemLink: 'https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-carbonate'
    }
  ],

  // MAGNESIUM COMPOUNDS
  magnesium: [
    {
      id: 'mgcl2-6h2o',
      name: 'Magnesium Chloride Hexahydrate',
      formula: 'MgCl₂·6H₂O',
      molecularWeight: 203.30,
      elementPercentage: 11.96,
      commonNames: ['Mag Flake', 'Dead Sea Works', 'Deicer'],
      grades: ['Food Grade', 'Technical Grade', 'Deicer Grade'],
      safetyNotes: 'Wear gloves. Avoid contact with eyes.',
      storageNotes: 'Hygroscopic. Store in sealed container.',
      solubilityLimit: 546,
      phEffect: 'Slightly Acidic',
      notes: "Main component in Randy's balanced magnesium recipe. Ratio: 7.58g per gram of Mg to add.",
      pubchemLink: 'https://pubchem.ncbi.nlm.nih.gov/compound/Magnesium-chloride'
    },
    {
      id: 'mgso4-7h2o',
      name: 'Magnesium Sulfate Heptahydrate',
      formula: 'MgSO₄·7H₂O',
      molecularWeight: 246.47,
      elementPercentage: 9.86,
      commonNames: ['Epsom Salt'],
      grades: ['USP Grade', 'Agricultural Grade'],
      safetyNotes: 'Generally safe. Can cause digestive upset if ingested (laxative effect).',
      storageNotes: 'Store in dry place.',
      solubilityLimit: 710,
      phEffect: 'Slightly Acidic',
      notes: "Randy's balanced recipe: 0.95g per gram of Mg to add. Used to maintain natural sulfate/chloride ratio.",
      pubchemLink: 'https://pubchem.ncbi.nlm.nih.gov/compound/Magnesium-sulfate'
    },
    {
      id: 'mg-balanced',
      name: "Balanced Magnesium (Randy's Recipe)",
      formula: 'MgCl₂·6H₂O + MgSO₄·7H₂O',
      molecularWeight: null,
      elementPercentage: null,
      isRecipe: true,
      ratio: {
        mgcl2: 7.58,
        mgso4: 0.95
      },
      commonNames: ["Randy's Mag Recipe"],
      grades: ['Mix of Food Grade components'],
      safetyNotes: 'Follow safety precautions for both components.',
      storageNotes: 'Keep calcium and magnesium solutions separate.',
      solubilityLimit: null,
      phEffect: 'Slightly Acidic',
      notes: 'Maintains natural seawater chloride/sulfate ratio. Mix: 7.58g MgCl₂·6H₂O + 0.95g MgSO₄·7H₂O per gram Mg.',
      pubchemLink: null
    }
  ],

  // NITRATE COMPOUNDS
  nitrate: [
    {
      id: 'kno3',
      name: 'Potassium Nitrate',
      formula: 'KNO₃',
      molecularWeight: 101.10,
      elementPercentage: 61.4,
      commonNames: ['Saltpeter', 'Stump Remover'],
      grades: ['Food Grade', 'Agricultural Grade', 'Reagent Grade'],
      safetyNotes: 'Oxidizer. Keep away from combustibles. May cause respiratory and eye irritation. Wear gloves and eye protection. Avoid dust formation.',
      storageNotes: 'Store in cool, dry place away from organics.',
      solubilityLimit: 316,
      phEffect: 'Neutral',
      notes: "Randy's recipe: 10g per liter = 6,140 ppm nitrate. Can raise potassium levels with heavy dosing.",
      pubchemLink: 'https://pubchem.ncbi.nlm.nih.gov/compound/Potassium-nitrate'
    },
    {
      id: 'nano3',
      name: 'Sodium Nitrate',
      formula: 'NaNO₃',
      molecularWeight: 84.995,
      elementPercentage: 72.9,
      commonNames: ['Chile Saltpeter'],
      grades: ['Food Grade', 'Agricultural Grade'],
      safetyNotes: 'Oxidizer. Keep away from combustibles. May cause respiratory and eye irritation. Wear gloves and eye protection. Avoid dust formation.',
      storageNotes: 'Store in cool, dry place.',
      solubilityLimit: 921,
      phEffect: 'Neutral',
      notes: 'Preferred over potassium nitrate. Less impact on ionic ratios. Recommended ratio: 32 parts NaNO₃ : 1 part KNO₃.',
      pubchemLink: 'https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-nitrate'
    },
    {
      id: 'ca-no3-2-nitrate',
      name: 'Calcium Nitrate',
      formula: 'Ca(NO₃)₂',
      molecularWeight: 164.09,
      elementPercentage: 75.6,
      commonNames: ['Norgessalpeter'],
      grades: ['Agricultural Grade', 'Technical Grade'],
      safetyNotes: 'Oxidizer. Keep away from combustibles. May cause respiratory and eye irritation. Wear gloves and eye protection. Avoid dust formation.',
      storageNotes: 'Store in cool, dry place.',
      solubilityLimit: 1212,
      phEffect: 'Slightly Acidic',
      notes: 'Also adds calcium. Can be used for balanced dosing in ULNS systems.',
      pubchemLink: 'https://pubchem.ncbi.nlm.nih.gov/compound/Calcium-nitrate'
    }
  ],

  // PHOSPHATE COMPOUNDS
  phosphate: [
    {
      id: 'na3po4',
      name: 'Trisodium Phosphate (Anhydrous)',
      formula: 'Na₃PO₄',
      molecularWeight: 163.94,
      elementPercentage: 58.0,
      commonNames: ['TSP', 'Sodium Phosphate Tribasic', 'Anhydrous TSP'],
      grades: ['Food Grade', 'Technical Grade'],
      safetyNotes: 'CORROSIVE. Causes severe skin burns and eye damage (pH 11-14 in solution). Wear gloves, eye protection, and protective clothing. May react with metals to produce flammable hydrogen gas.',
      storageNotes: 'Store in sealed container in dry place.',
      solubilityLimit: 120,
      phEffect: 'Very High (~12)',
      notes: 'Anhydrous form. Food grade typically anhydrous. Recommended: 1.88g per liter. 1mL per 100L raises PO₄ by 0.01 ppm.',
      pubchemLink: 'https://pubchem.ncbi.nlm.nih.gov/compound/Trisodium-phosphate'
    },
    {
      id: 'na3po4-dodecahydrate',
      name: 'Trisodium Phosphate Dodecahydrate',
      formula: 'Na₃PO₄·12H₂O',
      molecularWeight: 380.12,
      elementPercentage: 25.0,
      commonNames: ['TSP·12H₂O', 'Hydrated TSP'],
      grades: ['Technical Grade', 'ACS Reagent Grade'],
      safetyNotes: 'CORROSIVE. Causes severe skin burns and eye damage (pH 11-14 in solution). Wear gloves, eye protection, and protective clothing. May react with metals to produce flammable hydrogen gas.',
      storageNotes: 'Store in sealed container. Efflorescent crystals that partially lose water at 100°C.',
      solubilityLimit: 150,
      phEffect: 'Very High (~12)',
      notes: 'Hydrated form. Common in technical/reagent grade. Requires 2.32x more powder than anhydrous for same effect. More soluble than anhydrous.',
      pubchemLink: 'https://pubchem.ncbi.nlm.nih.gov/compound/Trisodium-phosphate'
    },
    {
      id: 'na2hpo4',
      name: 'Disodium Phosphate (Anhydrous)',
      formula: 'Na₂HPO₄',
      molecularWeight: 141.96,
      elementPercentage: 66.9,
      commonNames: ['Sodium Phosphate Dibasic', 'DSP', 'Anhydrous DSP'],
      grades: ['Food Grade (FCC)', 'ACS Reagent Grade'],
      safetyNotes: 'Wear gloves. Avoid contact with eyes.',
      storageNotes: 'Store in dry place.',
      solubilityLimit: 119,
      phEffect: 'Moderate (~9)',
      notes: 'Anhydrous form. Available in both food and reagent grades. Adds 2x sodium per phosphate vs monobasic.',
      pubchemLink: 'https://pubchem.ncbi.nlm.nih.gov/compound/Disodium-phosphate'
    },
    {
      id: 'na2hpo4-dihydrate',
      name: 'Disodium Phosphate Dihydrate',
      formula: 'Na₂HPO₄·2H₂O',
      molecularWeight: 177.99,
      elementPercentage: 53.4,
      commonNames: ['DSP·2H₂O'],
      grades: ['Reagent Grade'],
      safetyNotes: 'Wear gloves. Avoid contact with eyes.',
      storageNotes: 'Store in dry place.',
      solubilityLimit: 119,
      phEffect: 'Moderate (~9)',
      notes: 'Dihydrate form. Less common than heptahydrate. Requires 1.25x more powder than anhydrous for same effect.',
      pubchemLink: 'https://pubchem.ncbi.nlm.nih.gov/compound/Disodium-phosphate'
    },
    {
      id: 'na2hpo4-heptahydrate',
      name: 'Disodium Phosphate Heptahydrate',
      formula: 'Na₂HPO₄·7H₂O',
      molecularWeight: 268.07,
      elementPercentage: 35.4,
      commonNames: ['DSP·7H₂O', 'Heptahydrate DSP'],
      grades: ['ACS Reagent Grade', 'USP Grade'],
      safetyNotes: 'Wear gloves. Avoid contact with eyes.',
      storageNotes: 'Store in dry place. Efflorescent crystals.',
      solubilityLimit: 119,
      phEffect: 'Moderate (~9)',
      notes: 'Very common reagent grade form. Requires 1.89x more powder than anhydrous for same effect. White, odorless, efflorescent crystals.',
      pubchemLink: 'https://pubchem.ncbi.nlm.nih.gov/compound/Disodium-phosphate'
    },
    {
      id: 'na2hpo4-dodecahydrate',
      name: 'Disodium Phosphate Dodecahydrate',
      formula: 'Na₂HPO₄·12H₂O',
      molecularWeight: 358.14,
      elementPercentage: 26.5,
      commonNames: ['DSP·12H₂O'],
      grades: ['Pharmaceutical Grade (USP, Ph Eur, BP, JP)'],
      safetyNotes: 'Wear gloves. Avoid contact with eyes.',
      storageNotes: 'Store in dry place. Efflorescent powder.',
      solubilityLimit: 119,
      phEffect: 'Moderate (~9)',
      notes: 'Pharmaceutical grade form. Requires 2.52x more powder than anhydrous for same effect. Common in pharmaceutical applications.',
      pubchemLink: 'https://pubchem.ncbi.nlm.nih.gov/compound/Disodium-phosphate'
    },
    {
      id: 'nah2po4',
      name: 'Monosodium Phosphate (Anhydrous)',
      formula: 'NaH₂PO₄',
      molecularWeight: 119.98,
      elementPercentage: 79.2,
      commonNames: ['Sodium Phosphate Monobasic', 'MSP', 'Anhydrous MSP'],
      grades: ['Food Grade (FCC)', 'USP Grade'],
      safetyNotes: 'Generally safe. Wear gloves.',
      storageNotes: 'Store in dry place.',
      solubilityLimit: 850,
      phEffect: 'Neutral (~4.5)',
      notes: 'Anhydrous form. Common in food grade. Least sodium addition. Nearly neutral pH. Good choice for pH-sensitive tanks.',
      pubchemLink: 'https://pubchem.ncbi.nlm.nih.gov/compound/Monosodium-phosphate'
    },
    {
      id: 'nah2po4-monohydrate',
      name: 'Monosodium Phosphate Monohydrate',
      formula: 'NaH₂PO₄·H₂O',
      molecularWeight: 137.99,
      elementPercentage: 68.8,
      commonNames: ['MSP·H₂O', 'Sodium Dihydrogen Phosphate Monohydrate'],
      grades: ['Reagent Grade', 'USP Grade'],
      safetyNotes: 'Generally safe. Wear gloves.',
      storageNotes: 'Store in dry place.',
      solubilityLimit: 850,
      phEffect: 'Neutral (~4.5)',
      notes: 'Monohydrate form. Common in laboratory grade. Requires 1.15x more powder than anhydrous for same effect.',
      pubchemLink: 'https://pubchem.ncbi.nlm.nih.gov/compound/Monosodium-phosphate'
    },
    {
      id: 'nah2po4-dihydrate',
      name: 'Monosodium Phosphate Dihydrate',
      formula: 'NaH₂PO₄·2H₂O',
      molecularWeight: 156.01,
      elementPercentage: 60.9,
      commonNames: ['MSP·2H₂O'],
      grades: ['Pharmaceutical Grade', 'USP Grade', 'Reagent Grade'],
      safetyNotes: 'Generally safe. Wear gloves.',
      storageNotes: 'Store in dry place.',
      solubilityLimit: 850,
      phEffect: 'Neutral (~4.5)',
      notes: 'Dihydrate form. Very common in pharmaceutical/buffer applications. Requires 1.30x more powder than anhydrous for same effect.',
      pubchemLink: 'https://pubchem.ncbi.nlm.nih.gov/compound/Monosodium-phosphate'
    },
    {
      id: 'k2hpo4',
      name: 'Dipotassium Phosphate (Anhydrous)',
      formula: 'K₂HPO₄',
      molecularWeight: 174.18,
      elementPercentage: 54.5,
      commonNames: ['Potassium Phosphate Dibasic', 'DKP', 'Anhydrous DKP'],
      grades: ['Food Grade', 'Technical Grade'],
      safetyNotes: 'Wear gloves. Avoid contact with eyes.',
      storageNotes: 'Store in dry place.',
      solubilityLimit: 1680,
      phEffect: 'Moderate (~9)',
      notes: 'Anhydrous form. Common in food and technical grades. Adds potassium instead of sodium. Good for potassium-depleted systems.',
      pubchemLink: 'https://pubchem.ncbi.nlm.nih.gov/compound/Dipotassium-phosphate'
    },
    {
      id: 'k2hpo4-trihydrate',
      name: 'Dipotassium Phosphate Trihydrate',
      formula: 'K₂HPO₄·3H₂O',
      molecularWeight: 228.22,
      elementPercentage: 41.6,
      commonNames: ['DKP·3H₂O', 'Potassium Phosphate Dibasic Trihydrate'],
      grades: ['ACS Reagent Grade', 'USP Grade'],
      safetyNotes: 'Wear gloves. Avoid contact with eyes.',
      storageNotes: 'Store in dry place. Crystalline solid.',
      solubilityLimit: 1680,
      phEffect: 'Moderate (~9)',
      notes: 'Trihydrate form. Common in reagent grade. Requires 1.31x more powder than anhydrous for same effect. Very soluble in water.',
      pubchemLink: 'https://pubchem.ncbi.nlm.nih.gov/compound/Dipotassium-phosphate'
    },
    {
      id: 'h3po4',
      name: 'Phosphoric Acid',
      formula: 'H₃PO₄',
      molecularWeight: 97.99,
      elementPercentage: 97.0,
      commonNames: ['Orthophosphoric Acid'],
      grades: ['Food Grade', 'Reagent Grade'],
      safetyNotes: 'CORROSIVE. Causes severe skin burns and eye damage (concentration dependent: ≥25% corrosive, 10-25% irritant). May cause irreversible eye injury. Wear gloves, eye protection, protective clothing, and work in ventilated area.',
      storageNotes: 'Store in acid-safe container. Keep away from bases.',
      solubilityLimit: null,
      phEffect: 'Very Low (Acidic)',
      notes: 'Use with extreme caution. Highest phosphate percentage. Will lower pH significantly. Dilute carefully.',
      pubchemLink: 'https://pubchem.ncbi.nlm.nih.gov/compound/Phosphoric-acid'
    }
  ],

  // AMMONIA/AMMONIUM COMPOUNDS
  ammonia: [
    {
      id: 'nh4cl',
      name: 'Ammonium Chloride',
      formula: 'NH₄Cl',
      molecularWeight: 53.5,
      elementPercentage: 31.8,
      commonNames: ['Sal Ammoniac'],
      grades: ['Reagent Grade', 'Technical Grade'],
      safetyNotes: 'Irritant. Avoid inhaling dust. Wear gloves and work in ventilated area.',
      storageNotes: 'Store in sealed container in dry place.',
      solubilityLimit: 383,
      phEffect: 'Acidic (~5.5)',
      notes: 'Recipe: 13.5g per liter. Depletes alkalinity: every 50 ppm NO₃ equivalent decreases alk by 2.3 dKH.',
      pubchemLink: 'https://pubchem.ncbi.nlm.nih.gov/compound/Ammonium-chloride'
    },
    {
      id: 'nh4hco3',
      name: 'Ammonium Bicarbonate',
      formula: 'NH₄HCO₃',
      molecularWeight: 79.1,
      elementPercentage: 21.5,
      commonNames: ["Baker's Ammonia"],
      grades: ['Food Grade'],
      safetyNotes: 'Strong ammonia smell. Use in well-ventilated area. Wear gloves.',
      storageNotes: 'Store in sealed container. Loses ammonia to air over time.',
      solubilityLimit: 220,
      phEffect: 'Moderate (~8)',
      notes: "Randy's current recommendation for nitrogen dosing. Recipe: 20g per liter. Does not deplete alkalinity.",
      pubchemLink: 'https://pubchem.ncbi.nlm.nih.gov/compound/Ammonium-bicarbonate'
    }
  ]
}

// Target parameter ranges
export const PARAMETER_RANGES = {
  calcium: {
    natural: { min: 400, max: 450 },
    recommended: { min: 400, max: 500 },
    optimal: { min: 400, max: 430 },
    unit: 'ppm'
  },
  alkalinity: {
    natural: { min: 5, max: 12 },
    recommended: { min: 7, max: 12 },
    optimal: { min: 8, max: 9 },
    unit: 'dKH'
  },
  magnesium: {
    natural: { min: 1250, max: 1350 },
    recommended: { min: 1200, max: 1400 },
    optimal: { min: 1250, max: 1350 },
    unit: 'ppm'
  },
  nitrate: {
    natural: { min: 0.01, max: 5 },
    recommended: { min: 2, max: 75 },
    optimal: { min: 3, max: 20 },
    unit: 'ppm'
  },
  phosphate: {
    natural: { min: 0.01, max: 0.01 },
    recommended: { min: 0.01, max: 0.3 },
    optimal: { min: 0.04, max: 0.2 },
    unit: 'ppm'
  },
  ammonia: {
    natural: { min: 0, max: 0 },
    recommended: { min: 0, max: 2 },
    optimal: { min: 0, max: 0 },
    unit: 'ppm',
    note: 'For cycling only'
  }
}

export const getChemicalsForParameter = (parameter) => {
  return CHEMICALS[parameter] || []
}

export const getParameterInfo = (parameter) => {
  return PARAMETER_RANGES[parameter]
}

// Base compound information for grouping
export const BASE_COMPOUNDS = {
  calcium: {
    'calcium-chloride': { name: 'Calcium Chloride', element: 'Calcium' },
    'calcium-nitrate': { name: 'Calcium Nitrate', element: 'Calcium' }
  },
  alkalinity: {
    'sodium-bicarbonate': { name: 'Sodium Bicarbonate', element: 'Carbonate' },
    'sodium-carbonate': { name: 'Sodium Carbonate', element: 'Carbonate' }
  },
  magnesium: {
    'magnesium-chloride': { name: 'Magnesium Chloride', element: 'Magnesium' },
    'magnesium-sulfate': { name: 'Magnesium Sulfate (Epsom Salt)', element: 'Magnesium' },
    'balanced-magnesium': { name: "Balanced Magnesium (Randy's Recipe)", element: 'Magnesium' }
  },
  nitrate: {
    'potassium-nitrate': { name: 'Potassium Nitrate', element: 'Nitrate' },
    'sodium-nitrate': { name: 'Sodium Nitrate', element: 'Nitrate' },
    'calcium-nitrate': { name: 'Calcium Nitrate', element: 'Nitrate' }
  },
  phosphate: {
    'trisodium-phosphate': { name: 'Trisodium Phosphate', element: 'Phosphate' },
    'disodium-phosphate': { name: 'Disodium Phosphate', element: 'Phosphate' },
    'monosodium-phosphate': { name: 'Monosodium Phosphate', element: 'Phosphate' },
    'dipotassium-phosphate': { name: 'Dipotassium Phosphate', element: 'Phosphate' },
    'phosphoric-acid': { name: 'Phosphoric Acid', element: 'Phosphate' }
  },
  ammonia: {
    'ammonium-chloride': { name: 'Ammonium Chloride', element: 'Ammonia' },
    'ammonium-bicarbonate': { name: 'Ammonium Bicarbonate', element: 'Ammonia' }
  }
}

// Form display names
export const FORM_NAMES = {
  anhydrous: 'Anhydrous',
  dihydrate: 'Dihydrate (·2H₂O)',
  hexahydrate: 'Hexahydrate (·6H₂O)',
  heptahydrate: 'Heptahydrate (·7H₂O)',
  dodecahydrate: 'Dodecahydrate (·12H₂O)',
  decahydrate: 'Decahydrate (·10H₂O)',
  monohydrate: 'Monohydrate (·H₂O)',
  trihydrate: 'Trihydrate (·3H₂O)',
  recipe: 'Balanced Recipe'
}

// Mapping of chemical IDs to their base compound and form
export const CHEMICAL_GROUPINGS = {
  // Calcium
  'cacl2-anhydrous': { baseCompound: 'calcium-chloride', form: 'anhydrous' },
  'cacl2-dihydrate': { baseCompound: 'calcium-chloride', form: 'dihydrate' },
  'cacl2-hexahydrate': { baseCompound: 'calcium-chloride', form: 'hexahydrate' },
  'ca-no3-2': { baseCompound: 'calcium-nitrate', form: 'anhydrous' },

  // Alkalinity
  'nahco3': { baseCompound: 'sodium-bicarbonate', form: 'anhydrous' },
  'na2co3': { baseCompound: 'sodium-carbonate', form: 'anhydrous' },
  'na2co3-decahydrate': { baseCompound: 'sodium-carbonate', form: 'decahydrate' },

  // Magnesium
  'mgcl2-6h2o': { baseCompound: 'magnesium-chloride', form: 'hexahydrate' },
  'mgso4-7h2o': { baseCompound: 'magnesium-sulfate', form: 'heptahydrate' },
  'mg-balanced': { baseCompound: 'balanced-magnesium', form: 'recipe' },

  // Nitrate
  'kno3': { baseCompound: 'potassium-nitrate', form: 'anhydrous' },
  'nano3': { baseCompound: 'sodium-nitrate', form: 'anhydrous' },
  'ca-no3-2-nitrate': { baseCompound: 'calcium-nitrate', form: 'anhydrous' },

  // Phosphate
  'na3po4': { baseCompound: 'trisodium-phosphate', form: 'anhydrous' },
  'na3po4-dodecahydrate': { baseCompound: 'trisodium-phosphate', form: 'dodecahydrate' },
  'na2hpo4': { baseCompound: 'disodium-phosphate', form: 'anhydrous' },
  'na2hpo4-dihydrate': { baseCompound: 'disodium-phosphate', form: 'dihydrate' },
  'na2hpo4-heptahydrate': { baseCompound: 'disodium-phosphate', form: 'heptahydrate' },
  'na2hpo4-dodecahydrate': { baseCompound: 'disodium-phosphate', form: 'dodecahydrate' },
  'nah2po4': { baseCompound: 'monosodium-phosphate', form: 'anhydrous' },
  'nah2po4-monohydrate': { baseCompound: 'monosodium-phosphate', form: 'monohydrate' },
  'nah2po4-dihydrate': { baseCompound: 'monosodium-phosphate', form: 'dihydrate' },
  'k2hpo4': { baseCompound: 'dipotassium-phosphate', form: 'anhydrous' },
  'k2hpo4-trihydrate': { baseCompound: 'dipotassium-phosphate', form: 'trihydrate' },
  'h3po4': { baseCompound: 'phosphoric-acid', form: 'anhydrous' },

  // Ammonia
  'nh4cl': { baseCompound: 'ammonium-chloride', form: 'anhydrous' },
  'nh4hco3': { baseCompound: 'ammonium-bicarbonate', form: 'anhydrous' }
}

/**
 * Get list of base compounds for a parameter
 */
export const getBaseCompounds = (parameter) => {
  const compounds = BASE_COMPOUNDS[parameter]
  if (!compounds) return []

  return Object.entries(compounds).map(([id, info]) => ({
    id,
    name: info.name,
    element: info.element
  }))
}

/**
 * Get available forms for a base compound
 */
export const getFormsForCompound = (parameter, baseCompound) => {
  const chemicals = CHEMICALS[parameter] || []

  return chemicals
    .filter(chem => {
      const grouping = CHEMICAL_GROUPINGS[chem.id]
      return grouping && grouping.baseCompound === baseCompound
    })
    .map(chem => {
      const grouping = CHEMICAL_GROUPINGS[chem.id]
      return {
        id: chem.id,
        formType: grouping.form,
        name: FORM_NAMES[grouping.form] || grouping.form,
        formula: chem.formula,
        fullName: chem.name
      }
    })
}

/**
 * Get chemical by form ID
 */
export const getChemicalByForm = (parameter, formId) => {
  const chemicals = CHEMICALS[parameter] || []
  return chemicals.find(chem => chem.id === formId)
}
