<template>
  <CardSection title="About This Tool" :collapsible="true" :collapsed="collapsed" @update:collapsed="$emit('update:collapsed', $event)">
    <!-- Tab Navigation -->
    <div class="mb-4">
      <nav class="flex flex-wrap gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-lg border transition-colors whitespace-nowrap',
            activeTab === tab.id
              ? 'bg-blue-500 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="text-sm text-gray-700">
      <!-- Getting Started Tab -->
      <div v-show="activeTab === 'getting-started'" class="space-y-4">
        <div>
          <h4 class="font-semibold text-gray-900 mb-2">What is CO2SYS?</h4>
          <p>
            CO2SYS is a calculator for the marine carbonate system. Given any two of seven carbonate parameters,
            it calculates the complete carbonate chemistry using fundamental thermodynamic equilibria.
            This implementation follows the methodology of Lewis & Wallace (1998) and van Heuven et al. (2011).
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Basic Concept</h4>
          <p>
            The carbonate system is completely defined by knowing any two parameters from the set of seven: pH, Total Alkalinity (TA),
            Dissolved Inorganic Carbon (DIC/TCO2), partial pressure of CO2 (pCO2 or fCO2), carbonate ion (CO₃²⁻),
            bicarbonate ion (HCO₃⁻), or dissolved CO2 (CO2(aq)).
          </p>
          <p class="mt-2">
            Once two parameters are specified, along with environmental conditions (temperature, salinity, pressure) and nutrient
            concentrations (silicate, phosphate), all other carbonate system parameters can be calculated.
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">How to Use This Calculator</h4>
          <ol class="list-decimal pl-5 space-y-2">
            <li><strong>Select two input parameters</strong> from the dropdown menus. Make sure they form a valid pair.</li>
            <li><strong>Enter their values</strong> with appropriate units (pH scale for pH, dKH/meq/L for alkalinity, etc.).</li>
            <li><strong>Set environmental conditions:</strong> temperature, salinity, and pressure (depth).</li>
            <li><strong>Optionally enter nutrient concentrations</strong> (phosphate, silicate) for more accurate calculations.</li>
            <li><strong>Choose formulations</strong> for equilibrium constants (K1/K2, KSO4, KF) and total boron. Default values are recommended for most applications.</li>
            <li><strong>Calculate</strong> to see all carbonate system parameters, pH values on multiple scales, saturation states, and species distribution.</li>
          </ol>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Why is this important for reef aquariums?</h4>
          <p>
            Understanding carbonate chemistry is crucial for coral health. Corals build their skeletons from calcium carbonate (CaCO₃),
            which requires adequate carbonate ions (CO₃²⁻) and favorable saturation states (Ω). Low pH or alkalinity reduces
            carbonate availability, slowing coral growth or even causing dissolution.
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Typical Reef Parameters</h4>
          <div class="bg-blue-50 p-3 rounded">
            <ul class="space-y-1">
              <li><strong>pH:</strong> 7.8-8.4 (ideal: 8.1-8.3)</li>
              <li><strong>Alkalinity:</strong> 7-10 dKH (ideal: 8-9 dKH)</li>
              <li><strong>Calcium:</strong> 400-450 ppm</li>
              <li><strong>pCO2:</strong> 350-500 µatm</li>
              <li><strong>Ω Aragonite:</strong> > 3.5 (ideal: > 4.0)</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Parameters Tab -->
      <div v-show="activeTab === 'parameters'" class="space-y-4">
        <div>
          <h4 class="font-semibold text-gray-900 mb-2">The Seven Carbonate Parameters</h4>
          <p>
            The carbonate system can be fully characterized using any two of these seven parameters:
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">pH</h4>
          <p>
            Measure of acidity/alkalinity on a logarithmic scale. pH = -log[H⁺]. Higher pH indicates more alkaline conditions.
            In marine systems, pH typically ranges from 7.8 to 8.4. Different pH scales exist (Total, Seawater, Free, NBS) - see the pH Scales tab.
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Total Alkalinity (TA)</h4>
          <p>
            Buffering capacity of seawater. Technically defined as the excess of proton acceptors over proton donors relative to a zero level of protons.
            Approximately: TA ≈ [HCO₃⁻] + 2[CO₃²⁻] + [B(OH)₄⁻] + [OH⁻] - [H⁺] + minor contributions from other species.
          </p>
          <p class="mt-2">
            <strong>Units:</strong> Typically expressed as dKH (degrees of carbonate hardness), meq/L (milliequivalents per liter), or µmol/kg.
            1 meq/L = 2.8 dKH ≈ 1000 µmol/kg.
          </p>
          <p class="mt-2">
            TA is conservative - it doesn't change with temperature or pressure, only with addition/removal of acids or bases.
            This makes it ideal for tracking chemical changes in reef tanks.
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Dissolved Inorganic Carbon (DIC or TCO2)</h4>
          <p>
            Total concentration of all dissolved CO2 species: DIC = [CO2(aq)] + [HCO₃⁻] + [CO₃²⁻].
            This is the total pool of inorganic carbon available in solution.
          </p>
          <p class="mt-2">
            Like TA, DIC is conservative with temperature and pressure, but changes with gas exchange (CO2 uptake/release),
            photosynthesis, respiration, and calcium carbonate precipitation/dissolution.
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">pCO2 and fCO2</h4>
          <p>
            <strong>pCO2:</strong> Partial pressure of CO2 gas in equilibrium with the solution (in µatm or ppm).
            Related to atmospheric CO2 levels.
          </p>
          <p class="mt-2">
            <strong>fCO2:</strong> Fugacity of CO2 - a thermodynamically rigorous version of partial pressure that accounts for
            non-ideal gas behavior. At typical oceanic pressures, fCO2 ≈ pCO2, but the difference becomes significant at high pressures.
          </p>
          <p class="mt-2">
            pCO2 and fCO2 are NOT conservative - they change with temperature and pressure even without chemical changes.
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Carbonate Ion (CO₃²⁻)</h4>
          <p>
            The fully deprotonated form of carbonic acid. Essential for coral calcification because it combines with calcium
            to form calcium carbonate: Ca²⁺ + CO₃²⁻ → CaCO₃.
          </p>
          <p class="mt-2">
            CO₃²⁻ concentration directly affects the saturation state (Ω). Higher carbonate concentrations promote faster
            coral skeleton growth.
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Bicarbonate Ion (HCO₃⁻)</h4>
          <p>
            The dominant carbon species in seawater, typically comprising 85-90% of total DIC at normal ocean pH (8.1-8.2).
            Bicarbonate serves as a pH buffer and is the primary carbon source for many photosynthetic organisms.
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Dissolved CO2 (CO2(aq))</h4>
          <p>
            Molecular CO2 dissolved in water (includes a small amount of carbonic acid H2CO3). Though only 0.5-1% of total DIC,
            it's crucial for gas exchange with the atmosphere and is the primary form taken up by some phytoplankton.
          </p>
        </div>
      </div>

      <!-- pH Scales Tab -->
      <div v-show="activeTab === 'ph-scales'" class="space-y-4">
        <div>
          <h4 class="font-semibold text-gray-900 mb-2">pH Scale Definitions</h4>
          <p>
            Different pH scales account for different ion interactions in seawater. All scales measure hydrogen ion activity,
            but they differ in which hydrogen-containing species they include.
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Total Scale (pH<sub>T</sub>)</h4>
          <p>
            <strong>Most commonly used in marine chemistry and reef aquariums.</strong>
          </p>
          <p class="mt-2">
            pH<sub>T</sub> = -log([H⁺] + [HSO₄⁻])
          </p>
          <p class="mt-2">
            Includes free protons plus hydrogen sulfate ions. This is the scale used by most research laboratories and
            is recommended for reporting marine carbonate system measurements.
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Seawater Scale (pH<sub>SWS</sub>)</h4>
          <p>
            pH<sub>SWS</sub> = -log([H⁺] + [HSO₄⁻] + [HF])
          </p>
          <p class="mt-2">
            Includes free protons, hydrogen sulfate, and hydrogen fluoride. This scale is theoretically preferable
            for some applications, but less commonly used than the Total scale.
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Free Scale (pH<sub>F</sub>)</h4>
          <p>
            pH<sub>F</sub> = -log([H⁺])
          </p>
          <p class="mt-2">
            Only counts free hydrogen ions. Historically important and still used in some applications,
            but less common in modern marine chemistry.
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">NBS Scale (pH<sub>NBS</sub>)</h4>
          <p>
            Based on activity rather than concentration, calibrated against National Bureau of Standards (now NIST) buffers.
            This is the scale used by most pH meters and electrodes.
          </p>
          <p class="mt-2">
            <strong>Important:</strong> Direct pH probe measurements give NBS scale values, which differ from the Total scale
            commonly used in marine science. When using a pH probe, conversion to Total scale is necessary for accurate
            carbonate system calculations.
          </p>
        </div>

        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3">
          <p><strong>Note:</strong> Differences between scales are typically 0.1-0.15 pH units. Always specify which scale
          you're using when reporting pH values!</p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Scale Relationships</h4>
          <p>
            At typical seawater conditions (S=35, T=25°C):
          </p>
          <ul class="list-disc pl-5 mt-2 space-y-1">
            <li>pH<sub>T</sub> ≈ pH<sub>SWS</sub> + 0.01</li>
            <li>pH<sub>T</sub> ≈ pH<sub>F</sub> - 0.11</li>
            <li>pH<sub>T</sub> ≈ pH<sub>NBS</sub> - 0.15</li>
          </ul>
          <p class="mt-2 text-xs text-gray-600">
            These differences vary with temperature and salinity. CO2SYS calculates all scales precisely.
          </p>
        </div>
      </div>

      <!-- Constants Tab -->
      <div v-show="activeTab === 'constants'" class="space-y-4">
        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Equilibrium Constants</h4>
          <p>
            The carbonate system calculations require accurate equilibrium constants for various chemical reactions.
            Different formulations (equations) exist for these constants, derived from different datasets and valid over
            different ranges of temperature and salinity.
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">K1 and K2: Carbonic Acid Dissociation Constants</h4>
          <p>
            These are the most important constants for carbonate chemistry:
          </p>
          <ul class="list-disc pl-5 mt-2 space-y-1">
            <li><strong>K1:</strong> CO2(aq) + H2O ⇌ HCO₃⁻ + H⁺</li>
            <li><strong>K2:</strong> HCO₃⁻ ⇌ CO₃²⁻ + H⁺</li>
          </ul>
          <p class="mt-2">
            <strong>Available formulations include:</strong>
          </p>
          <ul class="list-disc pl-5 mt-2 space-y-1 text-xs">
            <li><strong>Shackleton et al. (2023):</strong> Latest formulation, recommended for modern applications</li>
            <li><strong>Sulpis et al. (2020):</strong> Recent meta-analysis combining multiple datasets</li>
            <li><strong>Lueker et al. (2000):</strong> Standard for seawater, widely used and validated</li>
            <li><strong>Millero (2010):</strong> Comprehensive formulation covering wide ranges</li>
            <li><strong>Roy et al. (1993):</strong> Commonly used default, good for typical seawater</li>
            <li><strong>Mehrbach et al. (1973) refit by Dickson & Millero (1987):</strong> Classic formulation</li>
            <li><strong>Cai & Wang (1998):</strong> Optimized for estuarine conditions</li>
            <li>Plus specialized formulations for freshwater, estuarine, and specific conditions</li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">KSO4: Hydrogen Sulfate Dissociation</h4>
          <p>
            HSO₄⁻ ⇌ SO₄²⁻ + H⁺
          </p>
          <p class="mt-2">
            Important for converting between pH scales. Sulfate is a major ion in seawater (~28 mM).
          </p>
          <ul class="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Dickson (1990a):</strong> Standard formulation (recommended)</li>
            <li><strong>Khoo et al. (1977):</strong> Alternative formulation</li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">KF: Hydrogen Fluoride Dissociation</h4>
          <p>
            HF ⇌ F⁻ + H⁺
          </p>
          <p class="mt-2">
            Needed for Seawater pH scale. Fluoride concentration is small but significant.
          </p>
          <ul class="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Dickson & Riley (1979):</strong> Standard formulation (recommended)</li>
            <li><strong>Perez & Fraga (1987):</strong> Alternative formulation</li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">KB: Boric Acid Dissociation</h4>
          <p>
            B(OH)₃ + H₂O ⇌ B(OH)₄⁻ + H⁺
          </p>
          <p class="mt-2">
            Boron is a significant contributor to alkalinity in seawater. Different formulations are available,
            and you can also choose different values for total boron concentration.
          </p>
        </div>

        <div class="bg-blue-50 border-l-4 border-blue-400 p-3">
          <p><strong>Recommendation:</strong> For typical reef aquarium applications, use the default formulations
          (Roy et al. 1993 for K1/K2, Dickson 1990a for KSO4, Dickson & Riley 1979 for KF, Uppström 1974 for total boron).
          These are well-validated and appropriate for normal seawater conditions.</p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Choosing Formulations</h4>
          <p>
            The calculator indicates whether your conditions fall within the valid range for each formulation:
          </p>
          <ul class="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Green (Optimal):</strong> Conditions are well within the valid range</li>
            <li><strong>Yellow (Acceptable):</strong> Conditions are slightly outside the validated range but likely acceptable</li>
            <li><strong>Red (Outside):</strong> Conditions are significantly outside the validated range; results may be unreliable</li>
          </ul>
        </div>
      </div>

      <!-- Alkalinity Tab -->
      <div v-show="activeTab === 'alkalinity'" class="space-y-4">
        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Alkalinity Definitions</h4>
          <p>
            Alkalinity can be defined in several ways depending on which species are included in the calculation.
            Different definitions were used historically or for specific applications.
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Standard (Default) Alkalinity</h4>
          <p>
            The most comprehensive definition, including all significant proton acceptors:
          </p>
          <p class="mt-2 font-mono text-xs bg-gray-50 p-2 rounded">
            TA = [HCO₃⁻] + 2[CO₃²⁻] + [B(OH)₄⁻] + [OH⁻] + [HPO₄²⁻] + 2[PO₄³⁻] + [SiO(OH)₃⁻] + [NH₃] + [HS⁻]
            - [H⁺]<sub>F</sub> - [HSO₄⁻] - [HF] - [H₃PO₄]
          </p>
          <p class="mt-2">
            <strong>Use this definition</strong> for modern seawater applications and reef aquariums.
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Peng (Apparent) Alkalinity</h4>
          <p>
            A simplified definition that neglects contributions from nutrients and minor species:
          </p>
          <p class="mt-2 font-mono text-xs bg-gray-50 p-2 rounded">
            TA<sub>Peng</sub> = [HCO₃⁻] + 2[CO₃²⁻] + [B(OH)₄⁻] + [OH⁻] - [H⁺]<sub>F</sub> - [HSO₄⁻] - [HF]
          </p>
          <p class="mt-2">
            Historical definition, still used in some contexts. Differs from standard alkalinity when nutrient
            concentrations are significant.
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">GEOSECS Alkalinity</h4>
          <p>
            Used in the GEOSECS (Geochemical Ocean Sections Study) program:
          </p>
          <p class="mt-2 font-mono text-xs bg-gray-50 p-2 rounded">
            TA<sub>GEOSECS</sub> = [HCO₃⁻] + 2[CO₃²⁻] + [B(OH)₄⁻] + [OH⁻] - [H⁺]<sub>SWS</sub>
          </p>
          <p class="mt-2">
            Note the use of Seawater scale for [H⁺]. Primarily of historical interest.
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Freshwater Alkalinity</h4>
          <p>
            For freshwater or very low salinity applications. Excludes borate (negligible in freshwater):
          </p>
          <p class="mt-2 font-mono text-xs bg-gray-50 p-2 rounded">
            TA<sub>freshwater</sub> = [HCO₃⁻] + 2[CO₃²⁻] + [OH⁻] - [H⁺] + other freshwater species
          </p>
          <p class="mt-2">
            Relevant for lakes, rivers, and aquariums with salinity < 5 PSU.
          </p>
        </div>

        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3">
          <p><strong>Important:</strong> For reef aquariums and normal seawater, always use the Standard alkalinity definition.
          The differences between definitions are typically small (< 1%) at normal nutrient levels, but become significant
          in nutrient-rich waters.</p>
        </div>
      </div>

      <!-- Calculations Tab -->
      <div v-show="activeTab === 'calculations'" class="space-y-4">
        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Saturation States (Ω)</h4>
          <p>
            The saturation state represents how supersaturated seawater is with respect to calcium carbonate minerals:
          </p>
          <p class="mt-2 font-mono text-xs bg-gray-50 p-2 rounded">
            Ω = [Ca²⁺][CO₃²⁻] / K<sub>sp</sub>
          </p>
          <p class="mt-2">
            Where K<sub>sp</sub> is the solubility product for the specific CaCO₃ mineral (aragonite or calcite).
          </p>
          <ul class="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Ω > 1:</strong> Supersaturated - precipitation is thermodynamically favored</li>
            <li><strong>Ω = 1:</strong> Saturated - equilibrium between dissolution and precipitation</li>
            <li><strong>Ω < 1:</strong> Undersaturated - dissolution is favored</li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Aragonite vs Calcite</h4>
          <p>
            Two main forms of calcium carbonate with different crystal structures:
          </p>
          <ul class="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Aragonite:</strong> More soluble form. Used by most corals to build skeletons. Requires Ω > 3 for growth, ideal > 4.</li>
            <li><strong>Calcite:</strong> Less soluble form. Used by some organisms (coralline algae, some mollusks). Naturally has higher Ω values.</li>
          </ul>
          <p class="mt-2">
            For reef aquariums, focus on aragonite saturation as it's the limiting factor for coral calcification.
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Pressure Effects</h4>
          <p>
            All equilibrium constants are pressure-dependent. As pressure increases with depth:
          </p>
          <ul class="list-disc pl-5 mt-2 space-y-1">
            <li>K<sub>sp</sub> increases (CaCO₃ becomes more soluble)</li>
            <li>K1 and K2 change (affecting pH and carbonate speciation)</li>
            <li>CO₂ solubility increases</li>
          </ul>
          <p class="mt-2">
            CO2SYS accounts for pressure effects using the formulations of Millero (1995) and others.
            Enter depth in meters, and pressure will be calculated (approximately 1 dbar per meter).
          </p>
          <p class="mt-2 text-xs text-gray-600">
            <strong>Note:</strong> For aquariums at atmospheric pressure, set pressure to 0. Pressure effects are only
            relevant for oceanographic applications or when modeling deep water conditions.
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Temperature Effects</h4>
          <p>
            Temperature strongly affects all equilibrium constants and the carbonate system:
          </p>
          <ul class="list-disc pl-5 mt-2 space-y-1">
            <li>Higher temperature → lower CO₂ solubility → higher pH</li>
            <li>Higher temperature → lower K<sub>sp</sub> → lower Ω (aragonite more stable at lower temps)</li>
            <li>pCO₂ and fCO₂ increase strongly with temperature even if chemistry doesn't change</li>
          </ul>
          <p class="mt-2 text-xs text-gray-600">
            This is why samples should be analyzed at the temperature they were collected, or temperature-corrected appropriately.
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Revelle Factor (Buffer Capacity)</h4>
          <p>
            The Revelle factor quantifies the buffer capacity of seawater:
          </p>
          <p class="mt-2 font-mono text-xs bg-gray-50 p-2 rounded">
            Revelle Factor = (∂ ln pCO₂ / ∂ ln DIC)<sub>TA constant</sub>
          </p>
          <p class="mt-2">
            Higher Revelle factor means pH is more sensitive to changes in CO₂. Typical range: 8-15.
          </p>
          <p class="mt-2">
            <strong>Practical implication:</strong> Waters with high Revelle factor will show larger pH swings from
            biological activity (photosynthesis/respiration) or CO₂ exchange.
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Nutrients and Alkalinity</h4>
          <p>
            Phosphate and silicate contribute to total alkalinity, though usually < 1% of the total.
            Their effect becomes significant at high nutrient concentrations:
          </p>
          <ul class="list-disc pl-5 mt-2 space-y-1">
            <li>Each µmol/kg of phosphate contributes ~0.5 µmol/kg to alkalinity (depends on pH)</li>
            <li>Each µmol/kg of silicate contributes ~0.1 µmol/kg to alkalinity at pH 8.1</li>
          </ul>
          <p class="mt-2">
            For most reef aquariums with low nutrient levels, this contribution is negligible and can be set to zero.
          </p>
        </div>
      </div>

      <!-- References Tab -->
      <div v-show="activeTab === 'references'" class="space-y-4">
        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Primary References</h4>
          <ul class="list-disc pl-5 space-y-2 text-xs">
            <li>
              <strong>Lewis, E. and Wallace, D.W.R. (1998)</strong> - Program Developed for CO2 System Calculations.
              ORNL/CDIAC-105. Carbon Dioxide Information Analysis Center, Oak Ridge National Laboratory.
            </li>
            <li>
              <strong>van Heuven, S., Pierrot, D., Rae, J.W.B., Lewis, E., and Wallace, D.W.R. (2011)</strong> - MATLAB
              Program Developed for CO2 System Calculations. ORNL/CDIAC-105b. Carbon Dioxide Information Analysis Center,
              Oak Ridge National Laboratory.
            </li>
            <li>
              <strong>Dickson, A.G., Sabine, C.L. and Christian, J.R. (Eds.) (2007)</strong> - Guide to Best Practices for
              Ocean CO2 Measurements. PICES Special Publication 3, 191 pp.
            </li>
            <li>
              <strong>Zeebe, R.E. and Wolf-Gladrow, D. (2001)</strong> - CO2 in Seawater: Equilibrium, Kinetics, Isotopes.
              Elsevier Oceanography Series 65, 346 pp.
            </li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Key Formulation References</h4>
          <ul class="list-disc pl-5 space-y-2 text-xs">
            <li>
              <strong>Roy et al. (1993)</strong> - The dissociation constants of carbonic acid in seawater at salinities
              5 to 45 and temperatures 0 to 45°C. Marine Chemistry 44(2-4): 249-267.
            </li>
            <li>
              <strong>Lueker et al. (2000)</strong> - Ocean pCO2 calculated from dissolved inorganic carbon, alkalinity,
              and equations for K1 and K2: validation based on laboratory measurements of CO2 in gas and seawater at
              equilibrium. Marine Chemistry 70(1-3): 105-119.
            </li>
            <li>
              <strong>Millero (2010)</strong> - Carbonate constants for estuarine waters. Marine and Freshwater Research
              61(2): 139-142.
            </li>
            <li>
              <strong>Shackleton et al. (2023)</strong> - Improved calibration of carbonic acid dissociation constants
              in seawater. Science Advances 9(42).
            </li>
            <li>
              <strong>Dickson (1990a)</strong> - Standard potential of the reaction: AgCl(s) + 1/2H2(g) = Ag(s) + HCl(aq),
              and the standard acidity constant of the ion HSO4- in synthetic sea water from 273.15 to 318.15 K.
              Journal of Chemical Thermodynamics 22: 113-127.
            </li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Further Reading</h4>
          <ul class="list-disc pl-5 space-y-1 text-xs">
            <li>Millero, F.J. (2007) - The Marine Inorganic Carbon Cycle. Chemical Reviews 107: 308-341.</li>
            <li>Doney, S.C. et al. (2009) - Ocean Acidification: The Other CO2 Problem. Annual Review of Marine Science 1: 169-192.</li>
            <li>Riebesell, U. and Gattuso, J.-P. (2015) - Lessons learned from ocean acidification research. Nature Climate Change 5: 12-14.</li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Acknowledgements</h4>
          <p class="text-xs">
            This calculator is based on the work of Ernie Lewis, Douglas Wallace, and the many researchers who developed
            the original CO2SYS program. Later versions by Steven van Heuven, Denis Pierrot, and others added functionality
            and new formulations.
          </p>
          <p class="mt-2 text-xs">
            The marine chemistry community's commitment to open science and reproducible research has made tools like this possible.
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Support</h4>
          <p class="text-xs">
            For questions about carbonate chemistry calculations, consult the references above or the
            <a href="https://www.nodc.noaa.gov/ocads/oceans/Handbook_2007.html" target="_blank" class="text-blue-600 hover:underline">
              Guide to Best Practices for Ocean CO2 Measurements
            </a>.
          </p>
        </div>

        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3">
          <p class="text-xs">
            <strong>Disclaimer:</strong> This calculator is provided for educational and research purposes.
            While calculations follow established methodologies, always verify critical measurements with laboratory analysis.
            The developers assume no liability for decisions made based on these calculations.
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Program Limitations</h4>
          <ul class="list-disc pl-5 space-y-1 text-xs">
            <li>Accuracy depends on the validity of chosen formulations for your conditions</li>
            <li>Formulations are empirical fits to data - extrapolation beyond validated ranges may be unreliable</li>
            <li>Some formulations may not be appropriate for extreme conditions (very low/high salinity, temperature, pressure)</li>
            <li>Nutrients, organic matter, and other trace species not explicitly modeled may affect real-world results</li>
            <li>pH scale conversions require accurate K<sub>SO4</sub> and K<sub>F</sub> - uncertainties propagate through calculations</li>
          </ul>
        </div>
      </div>
    </div>
  </CardSection>
</template>

<script setup>
import { ref } from 'vue'
import CardSection from '../../../components/CardSection.vue'

defineProps({
  collapsed: { type: Boolean, default: true }
})

defineEmits(['update:collapsed'])

const activeTab = ref('getting-started')

const tabs = [
  { id: 'getting-started', name: 'Getting Started' },
  { id: 'parameters', name: 'Parameters' },
  { id: 'ph-scales', name: 'pH Scales' },
  { id: 'constants', name: 'Constants' },
  { id: 'alkalinity', name: 'Alkalinity' },
  { id: 'calculations', name: 'Calculations' },
  { id: 'references', name: 'References' }
]
</script>
