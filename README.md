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

## 🔍 Key Findings (Dataset Insights)

1. **2024 Base Burden**: India recorded **15,62,581** new cancer cases and **9,01,828** cancer-related deaths in 2024.
2. **2050 Trajectory**: New cancer cases are projected to reach **28,27,251** by 2050—representing an **80.93%** absolute increase (**12,64,670** additional cases) at a CAGR of **2.31%**.
3. **Gender Distribution**: Male and female incidence rates are nearly equal in 2024 (**50.06%** male vs. **49.94%** female).
4. **Top 5 Cancer Categories**:
   1. **Breast**: `2,37,231` cases
   2. **Lip, oral cavity**: `2,05,878` cases
   3. **Trachea, bronchus and lung**: `1,12,659` cases
   4. **Colorectum**: `83,577` cases
   5. **Cervix uteri**: `79,360` cases
5. **Mortality Indicators**:
   - **ASR (World) / 100k**: `60.4`
   - **Crude Rate / 100k**: `62.2`
   - **Cumulative Risk (0–74)**: `6.8%`

---

## 🛠️ Technology Stack

- **Core Framework**: [React Native](https://reactnative.dev/) (`0.81.5`) & [Expo](https://expo.dev/) (`SDK 54`)
- **Navigation & Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (`6.0.24`)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (`~5.9.2`)
- **Data Visualization**: [React Native SVG](https://github.com/software-mansion/react-native-svg) (`15.12.1`)
- **Safe Area & UI**: [React Native Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context)
- **Styling**: Native `StyleSheet` with dynamic layout hooks, glassmorphism tokens, and CSS `boxShadow` for Web

---

## 📁 Data Source / Dataset

- **Primary Source**: **IARC Global Cancer Observatory (GCO)**
  - *Incidence Source*: Cancer Today
  - *Projection Source*: Cancer Tomorrow
- **Local File Path**: `assets/data/cancer_india.json`
- **Data Sync Script**: `npm run sync:data` (runs `scripts/sync-processed-data.cjs` before app launch)

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