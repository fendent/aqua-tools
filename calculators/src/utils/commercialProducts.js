// Commercial dosing products database
// Concentrations are stored per gallon of system water for consistency
// For liquids: ppm or meq/L per mL additive per gallon system
// For powders: ppm or meq/L per gram additive per gallon system

export const COMMERCIAL_PRODUCTS = {
  // ============================================================================
  // CALCIUM PRODUCTS (40+ products)
  // ============================================================================
  calcium: [
    // === Red Sea ===
    {
      id: 'red-sea-foundation-a',
      name: 'Red Sea Foundation A',
      manufacturer: 'Red Sea',
      concentration: { value: 52.83, unit: 'ppm/ml/gal' },
      form: 'liquid',
      chemical: 'Calcium Chloride solution'
    },
    {
      id: 'red-sea-foundation-a-powder',
      name: 'Red Sea Foundation A (Powder)',
      manufacturer: 'Red Sea',
      concentration: { value: 95, unit: 'ppm/g/gal' },
      form: 'powder',
      chemical: 'Calcium Chloride'
    },

    // === Brightwell Aquatics ===
    {
      id: 'brightwell-calcion',
      name: 'Brightwell Calcion',
      manufacturer: 'Brightwell Aquatics',
      concentration: { value: 40, unit: 'ppm/ml/gal' },
      form: 'liquid'
    },
    {
      id: 'brightwell-reefcode-a',
      name: 'Brightwell ReefCode Part A',
      manufacturer: 'Brightwell Aquatics',
      concentration: { value: 40, unit: 'ppm/ml/gal' },
      form: 'liquid',
      notes: 'Two-part system - Part A'
    },
    {
      id: 'brightwell-reefcode-a-powder',
      name: 'Brightwell ReefCode Part A (Powder)',
      manufacturer: 'Brightwell Aquatics',
      concentration: { value: 87, unit: 'ppm/g/gal' },
      form: 'powder'
    },
    {
      id: 'brightwell-nano-code-a',
      name: 'Brightwell Nano Code A',
      manufacturer: 'Brightwell Aquatics',
      concentration: { value: 40, unit: 'ppm/ml/gal' },
      form: 'liquid',
      notes: 'Nano aquarium formulation'
    },

    // === Bulk Reef Supply (BRS) ===
    {
      id: 'brs-pharma-calcium',
      name: 'BRS Pharma Calcium Solution',
      manufacturer: 'Bulk Reef Supply',
      concentration: { value: 9.78, unit: 'ppm/ml/gal' },
      form: 'liquid',
      chemical: 'CaCl₂·2H₂O solution (37,000 ppm Ca)',
      notes: "Randy Holmes-Farley's Recipe #1. Add 1/1000 of tank volume = 37 ppm increase"
    },

    // === ESV (Earth Science Ventures) ===
    {
      id: 'esv-bionic-part2',
      name: 'ESV B-Ionic Calcium Buffer Part 2',
      manufacturer: 'ESV',
      concentration: { value: 16, unit: 'ppm/ml/gal' },
      form: 'liquid',
      notes: 'Two-part system - Part 2 (calcium component)'
    },
    {
      id: 'esv-bionic-bicarbonate-part2',
      name: 'ESV B-Ionic Bicarbonate System Part 2',
      manufacturer: 'ESV',
      concentration: { value: 4, unit: 'ppm/ml/gal' },
      form: 'liquid'
    },

    // === Kent Marine ===
    {
      id: 'kent-turbo-calcium',
      name: 'Kent TurboCalcium',
      manufacturer: 'Kent Marine',
      concentration: { value: 30, unit: 'ppm/ml/gal' },
      form: 'liquid',
      chemical: 'Anhydrous CaCl₂'
    },
    {
      id: 'kent-liquid-calcium',
      name: 'Kent Liquid Calcium',
      manufacturer: 'Kent Marine',
      concentration: { value: 26.42, unit: 'ppm/ml/gal' },
      form: 'liquid'
    },
    {
      id: 'kent-techcb-parta',
      name: 'Kent Tech-CB Part A',
      manufacturer: 'Kent Marine',
      concentration: { value: 14.7, unit: 'ppm/ml/gal' },
      form: 'liquid',
      notes: 'Two-part system - Part A'
    },

    // === Continuum ===
    {
      id: 'continuum-reef-basis-calcium',
      name: 'Continuum Reef Basis Calcium',
      manufacturer: 'Continuum',
      concentration: { value: 30, unit: 'ppm/ml/gal' },
      form: 'liquid'
    },
    {
      id: 'continuum-reef-basis-calcium-powder',
      name: 'Continuum Reef Basis Calcium (Powder)',
      manufacturer: 'Continuum',
      concentration: { value: 90.91, unit: 'ppm/g/gal' },
      form: 'powder'
    },
    {
      id: 'continuum-reef-sculpture-a',
      name: 'Continuum Reef Sculpture Part A',
      manufacturer: 'Continuum',
      concentration: { value: 30, unit: 'ppm/ml/gal' },
      form: 'liquid',
      notes: 'Two-part system - Part A'
    },

    // === PolypLab ===
    {
      id: 'polyplab-one',
      name: 'PolypLab ONE',
      manufacturer: 'PolypLab',
      concentration: { value: 18.5, unit: 'ppm/ml/gal' },
      form: 'liquid',
      chemical: 'Calcium acetate, Mg acetate, hydroxide salts (70,000 mg/L Ca)',
      notes: 'All-in-one solution (Ca + Alk + Mg). Clouds water temporarily'
    },

    // === Two Little Fishies ===
    {
      id: 'tlf-cbalance-parta',
      name: 'Two Little Fishies C-Balance Part A',
      manufacturer: 'Two Little Fishies',
      concentration: { value: 10, unit: 'ppm/ml/gal' },
      form: 'liquid',
      notes: 'Two-part system - Part A'
    },

    // === Tropic Marin ===
    {
      id: 'tropic-marin-all-for-reef',
      name: 'Tropic Marin All-For-Reef',
      manufacturer: 'Tropic Marin',
      concentration: { value: 10.57, unit: 'ppm/ml/gal' },
      form: 'liquid',
      chemical: 'Calcium formate solution (40,000 mg/L Ca)',
      notes: 'All-in-one solution (Ca + Alk + Mg + trace elements)'
    },
    {
      id: 'tropic-marin-carbo-calcium',
      name: 'Tropic Marin Carbo-Calcium',
      manufacturer: 'Tropic Marin',
      concentration: { value: 11.36, unit: 'ppm/ml/gal' },
      form: 'liquid',
      chemical: 'Calcium carbonate solution (43,000 mg/L Ca)',
      notes: 'Also provides alkalinity. Can be used as part of a balanced dosing system'
    },

    // === SeaChem ===
    {
      id: 'seachem-reef-calcium',
      name: 'SeaChem Reef Calcium',
      manufacturer: 'SeaChem',
      concentration: { value: 20, unit: 'ppm/ml/gal' },
      form: 'liquid',
      notes: 'Polygluconate-based'
    },
    {
      id: 'seachem-reef-complete',
      name: 'SeaChem Reef Complete',
      manufacturer: 'SeaChem',
      concentration: { value: 15, unit: 'ppm/ml/gal' },
      form: 'liquid'
    },
    {
      id: 'seachem-fusion-part1',
      name: 'SeaChem Fusion Part 1',
      manufacturer: 'SeaChem',
      concentration: { value: 26.42, unit: 'ppm/ml/gal' },
      form: 'liquid',
      notes: 'Two-part system - Part 1'
    },

    // === Aquaforest ===
    {
      id: 'aquaforest-ca-plus',
      name: 'Aquaforest Ca Plus',
      manufacturer: 'Aquaforest',
      concentration: { value: 30, unit: 'ppm/ml/gal' },
      form: 'liquid'
    },
    {
      id: 'aquaforest-calcium-powder',
      name: 'Aquaforest Calcium (Powder)',
      manufacturer: 'Aquaforest',
      concentration: { value: 92.45, unit: 'ppm/g/gal' },
      form: 'powder'
    },

    // === Salifert ===
    {
      id: 'salifert-coral-calcium',
      name: 'Salifert Coral Calcium',
      manufacturer: 'Salifert',
      concentration: { value: 42.27, unit: 'ppm/ml/gal' },
      form: 'liquid'
    },

    {
      id: 'randys-recipe1-calcium',
      name: "Randy's Recipe #1 - Calcium",
      manufacturer: 'DIY Recipe',
      concentration: { value: 9.77, unit: 'ppm/ml/gal' },
      form: 'liquid',
      notes: 'Popular DIY two-part recipe for normal to low pH systems',
      recipeUrl: 'https://reefs.com/magazine/aquarium-chemistry-a-homemade-two-part-calcium-and-alkalinity-additive-system/'
    },
    {
      id: 'randys-recipe2-calcium',
      name: "Randy's Recipe #2 - Calcium",
      manufacturer: 'DIY Recipe',
      concentration: { value: 4.9, unit: 'ppm/ml/gal' },
      form: 'liquid',
      notes: 'Half-strength variant for high pH systems (above 8.3)',
      recipeUrl: 'https://reefs.com/magazine/aquarium-chemistry-a-homemade-two-part-calcium-and-alkalinity-additive-system/'
    }
  ],

  // ============================================================================
  // ALKALINITY PRODUCTS (45+ products)
  // ============================================================================
  alkalinity: [
    // === Red Sea ===
    {
      id: 'red-sea-foundation-b',
      name: 'Red Sea Foundation B',
      manufacturer: 'Red Sea',
      concentration: { value: 0.951, unit: 'meq/L/ml/gal' },
      form: 'liquid',
      chemical: 'Carbonate/Bicarbonate buffer'
    },
    {
      id: 'red-sea-foundation-b-powder',
      name: 'Red Sea Foundation B (Powder)',
      manufacturer: 'Red Sea',
      concentration: { value: 3.17, unit: 'meq/L/g/gal' },
      form: 'powder'
    },

    // === Brightwell Aquatics ===
    {
      id: 'brightwell-alkalin83',
      name: 'Brightwell Alkalin8.3',
      manufacturer: 'Brightwell Aquatics',
      concentration: { value: 1.1, unit: 'meq/L/ml/gal' },
      form: 'liquid'
    },
    {
      id: 'brightwell-alkalin83-powder',
      name: 'Brightwell Alkalin8.3-P (Powder)',
      manufacturer: 'Brightwell Aquatics',
      concentration: { value: 2.43, unit: 'meq/L/g/gal' },
      form: 'powder'
    },
    {
      id: 'brightwell-reefcode-b',
      name: 'Brightwell ReefCode Part B',
      manufacturer: 'Brightwell Aquatics',
      concentration: { value: 0.79, unit: 'meq/L/ml/gal' },
      form: 'liquid',
      notes: 'Two-part system - Part B'
    },
    {
      id: 'brightwell-reefcode-b-powder',
      name: 'Brightwell ReefCode Part B (Powder)',
      manufacturer: 'Brightwell Aquatics',
      concentration: { value: 2.96, unit: 'meq/L/g/gal' },
      form: 'powder'
    },
    {
      id: 'brightwell-nano-code-b',
      name: 'Brightwell Nano Code B',
      manufacturer: 'Brightwell Aquatics',
      concentration: { value: 0.596, unit: 'meq/L/ml/gal' },
      form: 'liquid'
    },

    // === Bulk Reef Supply (BRS) ===
    {
      id: 'brs-pharma-soda-ash',
      name: 'BRS Pharma Soda Ash Solution',
      manufacturer: 'Bulk Reef Supply',
      concentration: { value: 0.50, unit: 'meq/L/ml/gal' },
      form: 'liquid',
      chemical: 'Na₂CO₃ solution',
      notes: 'Mix 1.5 cups per gallon RO/DI water. 0.714 mL per gallon = 1 dKH'
    },

    // === ESV ===
    {
      id: 'esv-bionic-part1',
      name: 'ESV B-Ionic Calcium Buffer Part 1',
      manufacturer: 'ESV',
      concentration: { value: 0.74, unit: 'meq/L/ml/gal' },
      form: 'liquid',
      notes: 'Two-part system - Part 1 (alkalinity component)'
    },
    {
      id: 'esv-bionic-bicarbonate-part1',
      name: 'ESV B-Ionic Bicarbonate System Part 1',
      manufacturer: 'ESV',
      concentration: { value: 0.185, unit: 'meq/L/ml/gal' },
      form: 'liquid'
    },

    // === Kent Marine ===
    {
      id: 'kent-techcb-partb',
      name: 'Kent Tech-CB Part B',
      manufacturer: 'Kent Marine',
      concentration: { value: 0.735, unit: 'meq/L/ml/gal' },
      form: 'liquid',
      notes: 'Two-part system - Part B'
    },

    // === Continuum ===
    {
      id: 'continuum-reef-basis-kh',
      name: 'Continuum Reef Basis KH Buffer',
      manufacturer: 'Continuum',
      concentration: { value: 1, unit: 'meq/L/ml/gal' },
      form: 'liquid'
    },
    {
      id: 'continuum-reef-basis-kh-powder',
      name: 'Continuum Reef Basis KH Buffer (Powder)',
      manufacturer: 'Continuum',
      concentration: { value: 3.125, unit: 'meq/L/g/gal' },
      form: 'powder'
    },
    {
      id: 'continuum-reef-sculpture-b',
      name: 'Continuum Reef Sculpture Part B',
      manufacturer: 'Continuum',
      concentration: { value: 0.79, unit: 'meq/L/ml/gal' },
      form: 'liquid',
      notes: 'Two-part system - Part B'
    },

    // === PolypLab ===
    {
      id: 'polyplab-one-alk',
      name: 'PolypLab ONE',
      manufacturer: 'PolypLab',
      concentration: { value: 1.06, unit: 'meq/L/ml/gal' },
      form: 'liquid',
      chemical: 'Calcium acetate, Mg acetate, hydroxide salts (4,000 meq/L)',
      notes: 'All-in-one solution (Ca + Alk + Mg). Clouds water temporarily'
    },

    // === Two Little Fishies ===
    {
      id: 'tlf-cbalance-partb',
      name: 'Two Little Fishies C-Balance Part B',
      manufacturer: 'Two Little Fishies',
      concentration: { value: 0.5, unit: 'meq/L/ml/gal' },
      form: 'liquid',
      notes: 'Two-part system - Part B'
    },

    // === Tropic Marin ===
    {
      id: 'tropic-marin-all-for-reef-alk',
      name: 'Tropic Marin All-For-Reef',
      manufacturer: 'Tropic Marin',
      concentration: { value: 0.528, unit: 'meq/L/ml/gal' },
      form: 'liquid',
      chemical: 'Calcium formate solution (2,800 dKH per 500mL)',
      notes: 'All-in-one solution (Ca + Alk + Mg + trace elements)'
    },
    {
      id: 'tropic-marin-carbo-calcium-alk',
      name: 'Tropic Marin Carbo-Calcium',
      manufacturer: 'Tropic Marin',
      concentration: { value: 0.566, unit: 'meq/L/ml/gal' },
      form: 'liquid',
      chemical: 'Calcium carbonate solution (6,000 dKH per 1000mL)',
      notes: 'Also provides calcium. Can be used as part of a balanced dosing system'
    },

    // === SeaChem ===
    {
      id: 'seachem-reef-carbonate',
      name: 'SeaChem Reef Carbonate',
      manufacturer: 'SeaChem',
      concentration: { value: 0.8, unit: 'meq/L/ml/gal' },
      form: 'liquid'
    },
    {
      id: 'seachem-reef-buffer',
      name: 'SeaChem Reef Buffer',
      manufacturer: 'SeaChem',
      concentration: { value: 2.5, unit: 'meq/L/g/gal' },
      form: 'powder'
    },
    {
      id: 'seachem-reef-builder',
      name: 'SeaChem Reef Builder',
      manufacturer: 'SeaChem',
      concentration: { value: 3.0, unit: 'meq/L/g/gal' },
      form: 'powder'
    },
    {
      id: 'seachem-fusion-part2',
      name: 'SeaChem Fusion Part 2',
      manufacturer: 'SeaChem',
      concentration: { value: 1.17, unit: 'meq/L/ml/gal' },
      form: 'liquid',
      notes: 'Two-part system - Part 2'
    },

    // === Aquaforest ===
    {
      id: 'aquaforest-kh-plus',
      name: 'Aquaforest KH Plus',
      manufacturer: 'Aquaforest',
      concentration: { value: 0.236, unit: 'meq/L/ml/gal' },
      form: 'liquid'
    },
    {
      id: 'aquaforest-kh-buffer-powder',
      name: 'Aquaforest KH Buffer (Powder)',
      manufacturer: 'Aquaforest',
      concentration: { value: 3.115, unit: 'meq/L/g/gal' },
      form: 'powder'
    },

    {
      id: 'fritz-sodium-bicarbonate',
      name: 'Fritz Sodium Bicarbonate',
      manufacturer: 'Fritz',
      concentration: { value: 3.145, unit: 'meq/L/g/gal' },
      form: 'powder',
      chemical: 'NaHCO₃'
    },
    {
      id: 'fritz-sodium-carbonate',
      name: 'Fritz Sodium Carbonate',
      manufacturer: 'Fritz',
      concentration: { value: 4.975, unit: 'meq/L/g/gal' },
      form: 'powder',
      chemical: 'Na₂CO₃'
    },
    {
      id: 'randys-recipe1-alkalinity',
      name: "Randy's Recipe #1 - Alkalinity",
      manufacturer: 'DIY Recipe',
      concentration: { value: 0.5, unit: 'meq/L/ml/gal' },
      form: 'liquid',
      notes: 'Popular DIY two-part recipe for normal to low pH systems',
      recipeUrl: 'https://reefs.com/magazine/aquarium-chemistry-a-homemade-two-part-calcium-and-alkalinity-additive-system/'
    },
    {
      id: 'randys-recipe2-alkalinity',
      name: "Randy's Recipe #2 - Alkalinity",
      manufacturer: 'DIY Recipe',
      concentration: { value: 0.25, unit: 'meq/L/ml/gal' },
      form: 'liquid',
      notes: 'Half-strength variant for high pH systems (above 8.3)',
      recipeUrl: 'https://reefs.com/magazine/aquarium-chemistry-a-homemade-two-part-calcium-and-alkalinity-additive-system/'
    }
  ],

  // ============================================================================
  // MAGNESIUM PRODUCTS (30+ products)
  // ============================================================================
  magnesium: [
    // === Red Sea ===
    {
      id: 'red-sea-foundation-c',
      name: 'Red Sea Foundation C',
      manufacturer: 'Red Sea',
      concentration: { value: 26.42, unit: 'ppm/ml/gal' },
      form: 'liquid'
    },
    {
      id: 'red-sea-foundation-c-powder',
      name: 'Red Sea Foundation C (Powder)',
      manufacturer: 'Red Sea',
      concentration: { value: 35.40, unit: 'ppm/g/gal' },
      form: 'powder'
    },

    // === Brightwell Aquatics ===
    {
      id: 'brightwell-magnesion',
      name: 'Brightwell Magnesion',
      manufacturer: 'Brightwell Aquatics',
      concentration: { value: 26, unit: 'ppm/ml/gal' },
      form: 'liquid'
    },
    {
      id: 'brightwell-magnesion-powder',
      name: 'Brightwell Magnesion-P (Powder)',
      manufacturer: 'Brightwell Aquatics',
      concentration: { value: 64, unit: 'ppm/g/gal' },
      form: 'powder'
    },

    // === Bulk Reef Supply (BRS) ===
    {
      id: 'brs-pharma-magnesium',
      name: 'BRS Pharma Magnesium Solution',
      manufacturer: 'Bulk Reef Supply',
      concentration: { value: 12.42, unit: 'ppm/ml/gal' },
      form: 'liquid',
      chemical: 'MgCl₂ + MgSO₄ solution (47,000 ppm Mg)',
      notes: 'Balanced Mg recipe using both chloride and sulfate'
    },

    // === Continuum ===
    {
      id: 'continuum-reef-basis-magnesium',
      name: 'Continuum Reef Basis Magnesium',
      manufacturer: 'Continuum',
      concentration: { value: 18.76, unit: 'ppm/ml/gal' },
      form: 'liquid'
    },
    {
      id: 'continuum-reef-basis-mg-powder',
      name: 'Continuum Reef Basis Magnesium (Powder)',
      manufacturer: 'Continuum',
      concentration: { value: 111.11, unit: 'ppm/g/gal' },
      form: 'powder',
      notes: 'Formula: grams = tank gallons * 0.009 * desired ppm increase'
    },

    // === Kent Marine ===
    {
      id: 'kent-tech-m',
      name: 'Kent Tech M',
      manufacturer: 'Kent Marine',
      concentration: { value: 18.4, unit: 'ppm/ml/gal' },
      form: 'liquid'
    },
    {
      id: 'kent-tech-m-concentrated',
      name: 'Kent Tech M (Concentrated)',
      manufacturer: 'Kent Marine',
      concentration: { value: 39.1, unit: 'ppm/ml/gal' },
      form: 'liquid'
    },

    // === ESV ===
    {
      id: 'esv-bionic-magnesium',
      name: 'ESV B-Ionic Magnesium',
      manufacturer: 'ESV',
      concentration: { value: 6.67, unit: 'ppm/ml/gal' },
      form: 'liquid'
    },

    // === Aquaforest ===
    {
      id: 'aquaforest-mg-plus',
      name: 'Aquaforest Mg Plus',
      manufacturer: 'Aquaforest',
      concentration: { value: 19.82, unit: 'ppm/ml/gal' },
      form: 'liquid'
    },
    {
      id: 'aquaforest-magnesium-powder',
      name: 'Aquaforest Magnesium (Powder)',
      manufacturer: 'Aquaforest',
      concentration: { value: 30.86, unit: 'ppm/g/gal' },
      form: 'powder'
    },

    // === Salifert ===
    {
      id: 'salifert-liquid-magnesium',
      name: 'Salifert Liquid Magnesium',
      manufacturer: 'Salifert',
      concentration: { value: 6.60, unit: 'ppm/ml/gal' },
      form: 'liquid'
    },

    // === PolypLab ===
    {
      id: 'polyplab-one-mg',
      name: 'PolypLab ONE',
      manufacturer: 'PolypLab',
      concentration: { value: 4.23, unit: 'ppm/ml/gal' },
      form: 'liquid',
      chemical: 'Calcium acetate, Mg acetate, hydroxide salts (16,000 mg/L Mg)',
      notes: 'All-in-one solution (Ca + Alk + Mg). Clouds water temporarily'
    },

    // === SeaChem ===
    {
      id: 'seachem-reef-advantage-magnesium',
      name: 'SeaChem Reef Advantage Magnesium',
      manufacturer: 'SeaChem',
      concentration: { value: 35, unit: 'ppm/g/gal' },
      form: 'powder'
    },

    // === Tropic Marin ===
    {
      id: 'tropic-marin-all-for-reef-mg',
      name: 'Tropic Marin All-For-Reef',
      manufacturer: 'Tropic Marin',
      concentration: { value: 0.50, unit: 'ppm/ml/gal' },
      form: 'liquid',
      chemical: 'Calcium formate solution (950 mg Mg per 500mL)',
      notes: 'All-in-one solution (Ca + Alk + Mg + trace elements)'
    },

    {
      id: 'fritz-mag-sulfate',
      name: 'Fritz Mag Sulfate',
      manufacturer: 'Fritz',
      concentration: { value: 26.78, unit: 'ppm/g/gal' },
      form: 'powder',
      chemical: 'MgSO₄·7H₂O'
    },
    {
      id: 'fritz-mag-flake',
      name: 'Fritz Mag Flake',
      manufacturer: 'Fritz',
      concentration: { value: 30.86, unit: 'ppm/g/gal' },
      form: 'powder',
      chemical: 'MgCl₂·6H₂O'
    },
    {
      id: 'randys-recipe-magnesium',
      name: "Randy's Recipe - Magnesium",
      manufacturer: 'DIY Recipe',
      concentration: { value: 12.4, unit: 'ppm/ml/gal' },
      form: 'liquid',
      notes: 'Balanced Mg recipe using both sulfate and chloride (Recipe #3)',
      recipeUrl: 'https://www.reef2reef.com/threads/randys-diy-two-part-magnesium.330560/'
    }
  ],

  // ============================================================================
  // NITRATE PRODUCTS (limited commercial, full DIY)
  // ============================================================================
  nitrate: [
    // === Brightwell Aquatics ===
    {
      id: 'brightwell-neonitro',
      name: 'Brightwell NeoNitro',
      manufacturer: 'Brightwell Aquatics',
      concentration: { value: 5, unit: 'ppm/ml/gal' },
      form: 'liquid',
      chemical: 'Proprietary nitrogen salts',
      notes: '1 mL per gallon raises nitrate by 5 ppm'
    }
  ],

  // ============================================================================
  // PHOSPHATE PRODUCTS (limited commercial, full DIY)
  // ============================================================================
  phosphate: [
    // === Brightwell Aquatics ===
    {
      id: 'brightwell-neophos',
      name: 'Brightwell NeoPhos',
      manufacturer: 'Brightwell Aquatics',
      concentration: { value: 1.2, unit: 'ppm/ml/gal' },
      form: 'liquid',
      chemical: 'Proprietary phosphate salts',
      notes: '1 mL per gallon raises phosphate by 1.2 ppm'
    }
  ],

  // ============================================================================
  // AMMONIA PRODUCTS (for tank cycling)
  // ============================================================================
  ammonia: [
    // === Dr. Tim's Aquatics ===
    {
      id: 'drtims-ammonium-chloride',
      name: "Dr. Tim's Ammonium Chloride",
      manufacturer: "Dr. Tim's Aquatics",
      concentration: { value: 10, unit: 'ppm/ml/gal' },
      form: 'liquid',
      chemical: 'NH₄Cl solution (40 mg/mL TAN)',
      notes: 'For fishless tank cycling. 4 drops (0.2 mL) per gallon = 2 ppm'
    }
  ]
}

// Helper function to get products for a specific parameter
export const getProductsByParameter = (parameter) => {
  const products = COMMERCIAL_PRODUCTS[parameter] || []
  return products.sort((a, b) => a.name.localeCompare(b.name))
}

// Helper function to get product by ID
export const getProductById = (productId) => {
  for (const parameter in COMMERCIAL_PRODUCTS) {
    const product = COMMERCIAL_PRODUCTS[parameter].find(p => p.id === productId)
    if (product) return product
  }
  return null
}

// Get all manufacturers
export const getAllManufacturers = () => {
  const manufacturers = new Set()
  for (const parameter in COMMERCIAL_PRODUCTS) {
    COMMERCIAL_PRODUCTS[parameter].forEach(product => {
      manufacturers.add(product.manufacturer)
    })
  }
  return Array.from(manufacturers).sort()
}
