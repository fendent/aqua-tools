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

It's super simple to add a new calculator:

1. **Create your calculator component** in `src/calculators/YourCalculator.vue`
2. **Import it** in `src/App.vue`
3. **Register it** in the `calculators` object with a URL slug
4. **Add a card** for it in `src/components/Home.vue`

### Example: Adding a Salinity Calculator

**Step 1:** Create `src/calculators/SalinityCalculator.vue`:

```vue
<template>
  <div class="w-full max-w-4xl mx-auto p-6">
    <h1 class="text-4xl font-bold text-gray-800 mb-4">Salinity Calculator</h1>
    <!-- Your calculator UI here -->
  </div>
</template>

<script setup>
import { ref } from 'vue'

const specificGravity = ref(1.025)
// Your calculator logic here
</script>
```

**Step 2:** In `src/App.vue`, add your import and register it:

```javascript
import SalinityCalculator from './calculators/SalinityCalculator.vue'

const calculators = {
  'water-change': WaterChangeModel,
  'salinity': SalinityCalculator  // Add this line
}
```

**Step 3:** In `src/components/Home.vue`, add a card:

```vue
<a href="#/salinity" class="block p-6 bg-white rounded-xl shadow-lg...">
  <div class="text-4xl mb-4">🧂</div>
  <h2 class="text-2xl font-semibold text-gray-800 mb-2">Salinity Calculator</h2>
  <p class="text-gray-600">Calculate salinity from specific gravity...</p>
</a>
```

That's it! Your new calculator is now accessible at `#/salinity`.

## Using Charts

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
- Dosing calculator (two-part, trace elements)
- Salinity/specific gravity converter
- Tank volume calculator
- Stocking calculator
- Evaporation rate estimator
- Lighting PAR calculator

## License

MIT
