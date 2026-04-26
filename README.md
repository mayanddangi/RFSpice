# RFSpice 2.0 - High-Fidelity RF Signal Chain Simulator

RFSpice is a web-based, interactive RF signal chain simulator designed for engineers and researchers. It allows for rapid prototyping of signal paths using a drag-and-drop interface, with a custom symbolic simulation engine that calculates power propagation, compression, and spectral harmonics in real-time.

![RFSpice Preview](https://via.placeholder.com/1200x600.png?text=RFSpice+Interface+Preview)

## 🚀 Key Features

- **Drag-and-Drop Canvas**: Built with React Flow for an intuitive, modern user experience.
- **Custom Simulation Engine**: Handles frequency and power propagation through complex chains including Mixers, Multipliers, Amplifiers, and Filters.
- **Realistic Mixer Physics**: Implements a custom spur power model: 
  $$P_{spur}(n) = (P_{in} - Loss) - (n-1)(IP3 - P_{in})$$
  supporting both Down-converter and Up-converter modes.
- **Integrated Spectrum Analyzer**: Real-time Chart.js visualization with dynamic noise floor and sideband tracking.
- **Component Database**: Pre-loaded with real-world Mini-Circuits parts and support for custom user-defined components.
- **Static & Portable**: Zero backend required—runs entirely in the browser.

## 🛠️ Tech Stack

- **Framework**: [React.js](https://reactjs.org/)
- **State Management**: React Context API
- **Graph UI**: [React Flow](https://reactflow.dev/)
- **Charts**: [Chart.js](https://www.chartjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS (Custom Cyberpunk Theme)

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/RFSpice_2.git
   cd RFSpice_2
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run locally**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 🧪 Simulation Logic

The simulator performs a topological sort of the component graph and propagates signal "tones" (objects containing frequency and power). Each component applies specific physical rules:
- **Amplifiers**: Apply gain, P1dB compression, and IMD3 generation.
- **Mixers**: Generate fundamental and higher-order sidebands based on IIP3 distance.
- **Filters**: Apply Butterworth/Chebyshev roll-off curves to incoming tones.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Developed for the AMO Physics and RF Engineering community.*
