# SipBouquet ☕💐

> **Beautiful sips, delivered digitally.**

SipBouquet is a delightful, interactive web application that allows you to craft and share personalized digital bouquets made of coffee, matcha, and specialty drinks. Inspired by the charm of Digibouquet, it brings warmth and joy to your screen through lush visuals, smooth animations, and AI-powered heartfelt messages.

![SipBouquet Hero](/public/drinks/hero-bouquet.png)

## ✨ Features

- **🎨 Interactive Builder:** Pick 3 to 9 of your favorite sips to create a unique arrangement.
- **🌿 Lush Visuals:** Multi-layered greenery and carefully clustered drink layouts for a natural, "hand-arranged" feel.
- **✨ Visual Effects:** Realistic `SteamEffect` for hot coffee and matcha drinks.
- **🌅 Custom Themes:** Choose from distinct color moods:
  - **Warm Sunset:** Golden hues for a cozy vibe.
  - **Misty Morning:** Calm, cool tones for a fresh start.
  - **Botanical Garden:** Earthy greens for a natural look.
- **🤖 AI Note Generator:** Integrated with Gemini AI to craft heartfelt, personalized messages for your recipients.
- **📱 Fully Responsive:** A premium experience across all devices, from mobile to desktop.
- **🎁 Instant Sharing:** Generate a unique link to send your bouquet to someone special.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **AI:** [Google Gemini API](https://ai.google.dev/)
- **Icons/Emojis:** Native Unicode Emojis

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm / yarn / pnpm

### Installation

1. **Clone the repository:**
   ```bash
   https://github.com/AmulThantharate/SipBouquet.git
   cd sipbouquet
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

- `src/app`: Next.js pages and API routes.
- `src/components`: Reusable UI components (BouquetDisplay, DrinkCard, SteamEffect, etc.).
- `src/lib`: State management, drink data, and utility functions.
- `public/drinks`: Watercolor assets for drinks, wrappers, and greenery.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👤 Author

**Amul Thantharate**
- GitHub: [@your-github-username](https://github.com/your-github-username)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Made with ☕ + 🍵 by Amul Thantharate
