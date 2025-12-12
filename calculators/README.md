# Aquaria Calculators

A collection of calculators and tools for marine and freshwater aquarium hobbyists, built with Vue 3.

## Available Calculators

### Water Change Model
Visualize continuous and interval water changes over time. Features:
- Continuous water change mode (constant flow rate)
- Interval water change mode (discrete changes at regular intervals)
- Track supply and waste reservoir levels
- Visualize old vs new water composition over time
- Automatic reservoir refill simulation

### DIY Dosing Calculator
Calculate DIY supplement recipes for reef tank dosing. Features:
- Support for all major parameters (calcium, alkalinity, magnesium, etc.)
- Multiple chemical compound options with different hydration states
- Precise calculations for creating custom dosing solutions
- Collapsible charts showing concentration vs volume
- Recipe instructions with safety warnings
- localStorage persistence for all settings
- Automatic selection when only one compound/form is available

### Dosing Target Calculator
Calculate supplement dosage to reach target parameter levels. Features:
- Support for commercial products and DIY supplements
- Individual unit selectors for all result cards
- Real-time conversion between units (dKH, meq/L, ppm, etc.)
- Safety warnings for large parameter swings
- Support for both liquid and powder supplements
- Detailed product information with manufacturer data
- localStorage persistence for all settings

## Development

```bash
npm install
npm run dev
```

## Build for GitHub Pages

```bash
npm run build
npm run deploy
```

## Adding a New Calculator

It's super simple to add a new calculator using Vue Router:

1. **Create your calculator component** in `src/calculators/your-calculator/YourCalculator.vue`
2. **Add a route** in `src/router.js`
3. **Register it** in `src/config/calculators.js`
4. **Add a card** for it in `src/components/Home.vue`

### Example: Adding a Salinity Calculator

**Step 1:** Create `src/calculators/salinity/SalinityCalculator.vue`:

```vue
<template>
  <div class="max-w-6xl mx-auto p-6 space-y-6">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Salinity Calculator</h1>
      <p class="text-gray-600">Convert between specific gravity and salinity</p>
    </div>
    <!-- Your calculator UI here -->
  </div>
</template>

<script setup>
import { ref } from 'vue'

const specificGravity = ref(1.025)
// Your calculator logic here
</script>
```

**Step 2:** In `src/router.js`, add the route:

```javascript
import SalinityCalculator from './calculators/salinity/SalinityCalculator.vue'

const routes = [
  // ... existing routes
  {
    path: '/calculators/salinity',
    name: 'Salinity',
    component: SalinityCalculator
  }
]
```

**Step 3:** In `src/config/calculators.js`, register it:

```javascript
export const calculators = [
  // ... existing calculators
  {
    id: 'salinity',
    name: 'Salinity Calculator',
    description: 'Convert between specific gravity and salinity',
    icon: '🧂',
    path: '/calculators/salinity',
    category: 'water-chemistry'
  }
]
```

**Step 4:** The card will automatically appear in `src/components/Home.vue` based on the config.

That's it! Your new calculator is now accessible at `/calculators/salinity`.

## Architecture

### Shared Components

The project includes reusable components for common UI patterns:

- **ChemicalSelect** - Compound and form selection with auto-selection capability
- **ParameterInfoCard** - Display natural seawater values and recommended ranges
- **ParameterSelect** - Standardized parameter selection buttons
- **StatCard** - Colored result cards with optional slot content
- **VolumeInput** - Volume input with unit selection
- **CardSection** - Collapsible section containers
- **ChartWrapper** - Chart.js integration for data visualization

### Shared Utilities

Common utility functions are centralized in `src/utils/`:

- **concentrationUtils.js** - Concentration calculations and unit conversions
- **dosingChemicals.js** - Chemical database and compound information
- **commercialProducts.js** - Commercial product database
- **volumeUtils.js** - Volume conversions and calculations
- **weightUtils.js** - Weight conversions and formatting
- **formatters.js** - Display formatting utilities

### Composables

Reusable logic is available in `src/composables/`:

- **useParameterSelection** - Parameter selection state and labels

### Using Charts

If you need charts, use the `ChartWrapper` component:

```vue
<script setup>
import ChartWrapper from '../components/ChartWrapper.vue'
import { ref } from 'vue'

const chartData = ref([
  { time: 0, value: 10 },
  { time: 1, value: 20 }
])
</script>

<template>
  <ChartWrapper :data="chartData" chart-type="line" />
</template>
```

Chart types: `line`, `area`, `area-percent`

## GitHub Pages Setup

1. Create a new repository on GitHub named `aquaria-calculators`
2. Push this code to the repository
3. Go to Settings > Pages
4. Set Source to "Deploy from a branch"
5. Select the `gh-pages` branch (created after first deploy)
6. Run `npm run deploy` to publish

Alternatively, you can use GitHub Actions for automatic deployment. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Contributing

Contributions welcome! Ideas for new calculators:
- Salinity/specific gravity converter
- Tank volume calculator
- Stocking calculator (bioload estimation)
- Evaporation rate estimator
- Lighting PAR calculator
- Nutrient export calculator (protein skimmer, refugium, etc.)
- Two-part dosing calculator
- Trace element dosing calculator

## License

MIT
