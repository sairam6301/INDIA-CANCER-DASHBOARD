# India Cancer Analytics Dashboard

A responsive, cross-platform healthcare data visualization dashboard built with **React Native**, **Expo SDK 54**, **TypeScript**, and **React Native SVG**. The dashboard presents epidemiological insights, gender breakdown, top cancer category incidence, overall mortality metrics, and 2024–2050 predictive projections for cancer burden in India based on dataset from the **IARC Global Cancer Observatory**.

---

## 📌 Project Overview

Cancer incidence in India is projected to grow significantly over the next quarter-century. This project translates raw epidemiological datasets into a modern, interactive, offline-first dashboard designed for both web and mobile platforms.

It features custom interactive SVG charts (bar chart, donut chart, area line projection chart), glassmorphism-styled UI components, Indian Number System formatting (`en-IN`), responsive multi-column layouts for wide desktop screens, and seamless mobile support on Android Expo Go.

---

## ✨ Key Features

- **Indian Number System Formatting (`en-IN`)**: Displays all case counts and death totals using standard Indian digit grouping (e.g., `15,62,581` instead of `1.56M`).
- **Interactive SVG Visualizations**:
  - **Top 5 Cancer Types Bar Chart**: Hover/tap bars to view exact case counts and share percentages.
  - **Gender Split Donut Chart**: Hover/tap donut segments or legend rows to inspect male vs. female statistics.
  - **2024–2050 Projection Area Chart**: Interactive data nodes displaying year-by-year projected cases.
- **Glassmorphism Healthcare UI**: Clean light aesthetic featuring translucent cards, subtle refraction lines, soft shadows, and left-accent border indicators.
- **Responsive Multi-Column Layout**:
  - **Desktop ($\ge 1050\text{px}$)**: Expands up to `1250px` max-width with 2-column side-by-side row containers for optimal screen space usage.
  - **Tablet ($600\text{px} - 1049\text{px}$)**: 2-column KPI grid with stacked chart cards.
  - **Mobile ($< 600\text{px}$)**: Single-column responsive layout optimized for touch.
- **Offline Ready**: Reads data directly from local processed JSON (`assets/data/cancer_india.json`) without requiring internet access.
- **Cross-Platform Compatibility**: Single codebase targeting Web browsers and Android Expo Go.

---

## 📊 Dashboard Analytics

| Metric | Value | Detail / Period |
| :--- | :--- | :--- |
| **New Cancer Cases (2024)** | `15,62,581` | Base Year Incidence |
| **Cancer-Related Deaths (2024)** | `9,01,828` | Overall Mortality |
| **Projected Cases (2050)** | `28,27,251` | Target Projection Year |
| **Absolute Increase** | `12,64,670` | Additional Cases by 2050 |
| **Percentage Growth** | `80.93%` | Growth from 2024 to 2050 |
| **CAGR** | `2.31%` | Compound Annual Growth Rate |
| **Male Cases (2024)** | `7,82,181` | `50.06%` of Total |
| **Female Cases (2024)** | `7,80,400` | `49.94%` of Total |

---

## 🔍 Key Findings & Analytical Observations

1. **High Baseline Disease Burden & Mortality Ratio**: In 2024, India recorded **15,62,581** new cancer cases and **9,01,828** cancer-related deaths. The high mortality-to-incidence ratio underscores critical needs for early screening and public health intervention.
2. **Substantial 2024–2050 Projected Growth**: Cancer incidence is projected to rise from **15,62,581** cases in 2024 to **28,27,251** cases by 2050—representing an **80.93%** total increase (**12,64,670** additional cases) at a Compound Annual Growth Rate (CAGR) of **2.31%**.
3. **Balanced Gender Parity with Category Specificity**: Total new cases in 2024 are evenly split between males (**7,82,181** cases / **50.06%**) and females (**7,80,400** cases / **49.94%**). However, **Breast Cancer** remains the leading individual incidence category at **2,37,231** cases (`33.0%` of top 5 incidence).

---

## 📐 Data-Processing Pipeline & Calculations

### Data-Processing Steps
1. **Geography Selection**: Filtered raw epidemiological records specifically for geography = `India`.
2. **Missing-Value Handling**: Excluded incomplete records lacking age-standardized rates or incidence counts.
3. **Cancer-Name Standardization**: Normalized cancer category labels (e.g., standardizing `"Lip, oral cavity"`, `"Trachea, bronchus and lung"`, `"Cervix uteri"`).
4. **Ranking Top 5 Categories**: Aggregated total annual cases per cancer type, sorted in descending order, and selected the top 5 highest incidence categories.
5. **Growth Modeling**: Computed 26-year growth trajectory between base year 2024 and target year 2050.
6. **Local JSON Export**: Serialized processed data into `assets/data/cancer_india.json` for offline client consumption.

### Mathematical Formulas & Calculations
- **Absolute Increase**:
  $$\text{Absolute Increase} = \text{Projected Cases (2050)} - \text{Current Cases (2024)} = 2,827,251 - 1,562,581 = 1,264,670$$
- **Percentage Growth**:
  $$\text{Percentage Growth} = \left( \frac{\text{Projected Cases} - \text{Current Cases}}{\text{Current Cases}} \right) \times 100 = \left( \frac{1,264,670}{1,562,581} \right) \times 100 = 80.93\%$$
- **Compound Annual Growth Rate (CAGR)**:
  $$\text{CAGR} = \left( \frac{\text{Projected Cases (2050)}}{\text{Current Cases (2024)}} \right)^{\frac{1}{2050 - 2024}} - 1 = \left( \frac{2,827,251}{1,562,581} \right)^{\frac{1}{26}} - 1 = 2.31\%$$
- **Gender Share Percentages**:
  $$\text{Male \%} = \left( \frac{7,82,181}{1,562,581} \right) \times 100 = 50.06\%, \quad \text{Female \%} = \left( \frac{7,80,400}{1,562,581} \right) \times 100 = 49.94\%$$

---

## 🌐 Data Source Details

- **Primary Source**: **IARC Global Cancer Observatory (GCO)**
  - *Current Estimates*: [GCO Cancer Today](https://gco.iarc.who.int/today)
  - *Future Projections*: [GCO Cancer Tomorrow](https://gco.iarc.who.int/tomorrow)
  - *Official Portal*: [https://gco.iarc.who.int/](https://gco.iarc.who.int/)
- **Dataset Baseline Year**: `2024` (Projections through `2050`)
- **Data Access Date**: `August 2026`
- **Local File**: `assets/data/cancer_india.json`

---

## 🛠️ Technology Stack

- **Core Framework**: [React Native](https://reactnative.dev/) (`0.81.5`) & [Expo](https://expo.dev/) (`SDK 54`)
- **Navigation & Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (`6.0.24`)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (`~5.9.2`)
- **Data Visualization**: [React Native SVG](https://github.com/software-mansion/react-native-svg) (`15.12.1`)
- **Safe Area & UI**: [React Native Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context)
- **Styling**: Native `StyleSheet` with dynamic layout hooks, glassmorphism tokens, and CSS `boxShadow` for Web

---

## 📂 Project Structure

```
INDIA-CANCER-DASHBOARD/
├── assets/
│   ├── data/
│   │   └── cancer_india.json       # Local processed cancer dataset
│   └── images/                     # Project assets and icons
├── scripts/
│   └── sync-processed-data.cjs     # Pre-start data synchronization script
├── src/
│   ├── app/
│   │   ├── _layout.tsx             # Root stack navigator layout
│   │   ├── index.tsx               # Main India Cancer Analytics Dashboard
│   │   └── explore.tsx             # Project info screen
│   ├── components/                 # Reusable UI elements
│   ├── constants/                  # Theme constants and design tokens
│   └── hooks/                      # Custom hooks (useTheme, etc.)
├── app.json                        # Expo configuration manifest
├── package.json                    # Dependencies and npm scripts
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Project documentation
```

---

## 📦 Project Deliverables

1. **GitHub Source Repository**: Complete React Native & Expo source code ([https://github.com/sairam6301/INDIA-CANCER-DASHBOARD](https://github.com/sairam6301/INDIA-CANCER-DASHBOARD)).
2. **Local Processed Dataset**: Structured JSON data (`assets/data/cancer_india.json`).
3. **Data Sync Script**: Automated pre-build data handler (`scripts/sync-processed-data.cjs`).
4. **Source Data Documentation**: IARC GCO Cancer Today & Cancer Tomorrow metadata references.
5. **Cross-Platform Web & Mobile Launcher**: Expo SDK 54 Web build and Android Expo Go runner configuration.

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sairam6301/INDIA-CANCER-DASHBOARD.git
   cd INDIA-CANCER-DASHBOARD
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Sync local data**:
   ```bash
   npm run sync:data
   ```

---

## 📱 Web and Android Usage

### Running on Web
To start the Expo development server and open the dashboard in your web browser:
```bash
npm run web
```
or
```bash
npx expo start --web
```
*The web dashboard opens at `http://localhost:8081`.*

### Running on Android (Expo Go)
1. Install the **Expo Go** app on your Android device from the Google Play Store.
2. Start the Expo development server:
   ```bash
   npx expo start
   ```
3. Scan the generated QR code in your terminal using the Expo Go app (or camera).

---

## 🖼️ Screenshots

### Desktop Web Dashboard

![India Cancer Analytics Dashboard - Web](assets/screenshots/dashboard-web.png)

### Android Mobile Dashboard

![India Cancer Analytics Dashboard - Mobile](assets/screenshots/dashboard-mobile.png)

---

## ⚠️ Important Assumptions & Limitations

- **Demographic Projections**: Future incidence numbers (2025–2050) are statistical estimates derived from demographic changes and epidemiological models, not guaranteed future events.
- **Non-Clinical Purpose**: This dashboard is built strictly for data visualization, research, and public health analysis; it does NOT constitute clinical medical advice or diagnostic guidance.
- **Dataset Scope**: Analytics are bounded by the IARC GCO baseline dataset (2024) and parameters selected during data extraction.
- **Offline Static Data**: The local processed JSON snapshot provides offline functionality and does not stream real-time updates.

---

## 🤖 AI Tools Disclosure

AI-assisted development tools (including Claude and Antigravity AI coding assistant) were utilized during project development for architectural pair programming, component prototyping, SVG layout calculations, and documentation drafting. All generated code, mathematical calculations, chart components, responsive logic, and project assets were manually reviewed, audited, tested, and verified by the developer.

---

## 🔮 Future Improvements

- **State/Region Breakdown**: Add state-wise geographical filtering across India.
- **Cancer Type Specific Mortality**: Integrate granular mortality statistics per cancer type once dataset updates become available.
- **Export & Reporting**: Add PDF/CSV export functionality for data analysts and medical researchers.
- **Dark Mode Support**: Extend the theme system to support toggleable dark mode aesthetics.

---

## ✍️ Author

**Thammana Venkata Rama Durga Naga Sairam**

B.Tech Computer Science Engineering (AI & Data Science)

GitHub: https://github.com/sairam6301

India Cancer Analytics Dashboard — a cross-platform healthcare data visualization project built with React Native, Expo, and TypeScript.