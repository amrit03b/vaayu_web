# 🍃 Vaayu – Your Environmental Health Companion

**Vaayu** is a decentralized, AI-powered mobile and web application that empowers individuals—especially those with chronic health conditions—to monitor their environmental exposure and receive actionable health guidance based on real-time air quality data.

---

## 🚨 The Problem It Solves

India is facing a growing **public health crisis** due to **air pollution**. In 2024–25, cities like Delhi recorded AQI in the *“severe”* category for weeks at a time, resulting in:

- ❌ School closures and public health emergencies  
- ⚠️ Over 2.3 million pollution-related premature deaths *(The Lancet, 2025)*  
- 🚫 Lack of tools offering personalized, real-time environmental health guidance  

Most existing solutions are either:
- Static AQI display apps
- Generic wellness trackers  
They **fail to connect** real-world environmental conditions with **individualized health needs**.

---

## 💡 What You Can Use Vaayu For

### 📍 Live AQI Alerts & Safe Zone Mapping
- Real-time **AQI alerts** based on your **GPS location**
- Map view of surroundings by AQI category (green, yellow, red)
- Distance calculation to nearest unsafe zone

### 🧠 Personalized Health Recommendations (AI + Blockchain)
- Login securely using **Civic Auth**
- Input profile details: age, gender, sleep cycle, walking habits
- Data stored on **Aptos blockchain** for **ownership & privacy**
- **AI-powered suggestions** based on habits + AQI data  
  > “You usually walk to the mosque at 5 PM, but AQI is severe then. Try 6 AM instead.”

### ✅ Daily Health Challenges & Rewards
- Tasks like:
  - 💧 Drink 3 liters of water  
  - 🚶 Walk 3000 steps daily  
- Earn **Green Tokens** 🪙 for completing them

### 🛍️ Green Token Redemption 
- Redeem tokens for:
  - Eco-friendly products
  - Partner brand discounts
  - Sponsored health services

### 📊 Lifestyle Analytics & Health Score
- Tracks:
  - Task completion  
  - Daily consistency
- Generates dynamic **health score**
- Visualizes long-term patterns between **health habits & pollution exposure**

---

## 🔐 Why Vaayu is Unique

| Feature | Description |
|--------|-------------|
| 🌐 **Civic Auth** | Decentralized digital identity for secure, passwordless login |
| 🔗 **Aptos Blockchain** | User health data stored on-chain, owned by the user |
| 🤖 **AI-Generated Advice** | Personalized suggestions using Gemini-powered ML |
| 📍 **GPS + AQI Mapping** | Dynamic heatmaps and location-based alerts |
| 🪙 **Green Tokens** | Gamified system to reward healthy behaviors |
| 📱 **Cross-Platform** | Built for both **Web (Next.js)** and **Mobile (React Native)** |

---

## 🧠 Architecture Overview

- 🧾 **Frontend**  
  - `React Native` (mobile)
  - `Next.js` (web + backend handling)
  - `Tailwind CSS` + `shadcn-ui`

- 🔐 **Authentication**  
  - Civic SDK for identity verification
  - JWT tokens to maintain secure sessions

- 🔗 **Blockchain Integration**  
  - Health profile stored as smart contract resource on **Aptos**
  - Blockchain interactions handled via a **Next.js backend**

- 🌍 **Live AQI Integration**  
  - AQICN API for real-time air quality data
  - GPS used to match user location with nearby pollution zones

- 🧠 **AI Engine**  
  - Gemini for behavior-aware, contextual advice

---

## 🛠️ How to Run Locally

### 🔧 Prerequisites
- Node.js v18+
- pnpm
- Civic Wallet app (for login)
- AQICN API key

### 📥 Installation

```bash
git clone https://github.com/your-username/vaayu.git
cd vaayu
pnpm install

## 🌱 Setup `.env.local`

To fetch real-time AQI data, create a `.env.local` file in the root directory and add your AQICN API token:

```env
NEXT_PUBLIC_AQICN_TOKEN=your_api_token_here
````

---

## ▶️ Run the Dev Server

Start the development server using the following command:

```bash
pnpm dev
```

Then open your browser and visit:

```
http://localhost:3000
```

---

## 🗂️ Project Structure

```bash
/app                 → Next.js app routes (dashboard, login, onboarding)
/api                 → API handlers (e.g. Civic authentication)
/components          → Shared UI components
/ui                  → shadcn-ui based design system
/lib
  ├─ aptos.ts        → Blockchain functions (wallet, transactions)
  └─ civic.ts        → Civic auth utilities
/sources
  └─ onboarding.move → Move smart contract for storing health profiles
```

---

## 🧩 Technologies Used

* **Frontend**: React Native, Next.js
* **Styling**: Tailwind CSS, shadcn-ui
* **Authentication**: Civic
* **Blockchain**: Aptos + Move smart contracts
* **Data Fetching**: Fetch API, SWR
* **AI**: Gemini for ML-powered health recommendations
* **Location**: GPS + AQICN API (for real-time AQI data)

---

## ⚠️ Technical Challenges & Solutions

### 1. Civic Auth in React Native

**Issue**: Civic SDK lacks official support for React Native
✅ **Solution**: Reverse-engineered web SDK, implemented custom JWT parsing and secure redirects manually.

### 2. Aptos Integration on Mobile

**Issue**: No React Native-compatible libraries for Aptos blockchain
✅ **Solution**: Offloaded blockchain operations to a Next.js backend and communicated via secure REST APIs.

### 3. Real-Time AQI Mapping

**Issue**: Frequent GPS updates caused API lags and performance issues
✅ **Solution**: Optimized with throttled API polling, clustering, and heatmap-based visualization.

## 🔐 Civic Auth Hackathon Track Submission

### 🔐 Civic Auth Integration

Civic Auth is the **core identity layer** in our app, enabling secure, reusable, and seamless authentication across both web and mobile platforms.

- ✅ Civic Auth is integrated on both **React Native (mobile)** and **Next.js (web)** versions.
- 🔐 Users log in using Civic, receive a verified JWT, and begin a personalized onboarding experience.
- 🔗 The identity is linked with lifestyle data (age, sleep cycle, walking habits), securely stored on the **Aptos blockchain**.
- 🧠 This data powers an **AI-driven health recommendation system** based on real-time AQI and personal patterns.
- Despite limited React Native support, we implemented a custom flow for JWT handling and secure redirect management.

---

### 🚀 Go-to-Market Readiness

Our app directly addresses India's growing **air pollution crisis** by combining identity, location, and health data for proactive wellness support:

- 🏙️ Designed for city dwellers, daily commuters, and vulnerable groups (children, elderly, patients).
- 📍 Provides real-time AQI zone alerts and daily health guidance.
- 🎯 Green Token reward system incentivizes healthy actions and can be redeemed for partner discounts and eco-products.
- 📈 Launch plan includes metro-focused rollouts, brand partnerships, and awareness drives via healthcare networks.

---

### 💡 Use Case & Innovation

We merge:

- **Civic Auth** (secure identity)
- **Aptos Blockchain** (verifiable health data storage)
- **Gemini AI** (personalized recommendations)
- **AQICN + GPS** (live environmental awareness)

This isn’t just an AQI or health app—it’s a **smart wellness assistant** that dynamically adapts to a user's location, lifestyle, and routine using decentralized, privacy-first infrastructure.

---

### 🎥 Presentation & Demo

A working demo is hosted on **Vercel** (Web) and **Expo Go** (Mobile).  
Our demo video includes:

- Civic login flow  
- User onboarding with lifestyle data  
- AQI mapping + live alerts  
- Health tasks, token rewards, and blockchain sync

---

### ✅ Civic Hackathon Requirements: Checklist

| Requirement              | Status                                                                 |
|--------------------------|------------------------------------------------------------------------|
| Civic Auth Integrated    | ✅ Yes, integrated on both Web & Mobile with JWT + session handling     |
| Working Demo             | ✅ Deployed on Vercel (Web) and Expo (Mobile)                           |
| 1-Sentence Description   | "A Civic-authenticated health & AQI companion that protects users from pollution and rewards healthy behavior with real-time, blockchain-secured personalization." |
| GitHub Repository        | ✅ Full source code (frontend, backend, smart contracts) included       |
| Demo Video               | ✅ Walkthrough of login, AQI alerts, task tracking, token logic         |
| Original Work            | ✅ 100% original codebase, architecture, and design                     |


## 🧩 Aptos Full-Stack Hackathon Track Submission

### 🌐 Overview

This project is a **real-world, full-stack wellness dApp** built on the Aptos blockchain. It securely stores user lifestyle data (age, sleep cycle, etc.) on-chain and leverages it to provide:

- 🔴 Real-time AQI zone alerts and pollution-safe navigation  
- 🪙 Daily health challenge rewards via a Green Token system  
- 🤖 AI-powered personalized health advice based on blockchain-stored data  
- ✅ Transparent and user-owned data using Aptos smart contracts  

The app abstracts blockchain complexity while preserving decentralization and privacy—offering a Web3 experience for non-Web3 users.

---

### ✅ How This Aligns with the Track

| Objective            | Implementation                                                                 |
|----------------------|---------------------------------------------------------------------------------|
| **Full-Stack dApp**   | Built using React (web), React Native (mobile), Next.js (backend), and Move    |
| **Aptos Integration** | Secure on-chain storage of user health data via custom Move smart contracts     |
| **Smart Contracts**   | Handle user profiles, token eligibility, and metadata storage                  |
| **Backend**           | Bridges frontend and Aptos using RESTful APIs and Aptos SDK                    |
| **Frontend**          | React Native + React with AQI mapping, token tracking, and habit visualizations |
| **Real-World Utility**| Tackles India's pollution crisis with personalized, preventive tech             |
| **User Experience**   | Civic Auth + tokenless interaction = smooth, non-technical onboarding          |

---

### 🔍 Deep Dive into Aptos Integration

| Layer         | Integration Details                                                                 |
|---------------|--------------------------------------------------------------------------------------|
| Smart Contracts | Written in Move to manage health data, tokens, and user onboarding                 |
| Backend       | Next.js API handles Aptos wallet logic, signing, and on-chain interactions          |
| Frontend      | React Native + React apps fetch real-time data from AQICN + Aptos-backed APIs       |
| Storage       | All user metadata (age, habits, etc.) is immutably stored on Aptos for transparency |

---

### 💡 1-Sentence Summary

A full-stack wellness dApp that uses Aptos blockchain to store personal health data and deliver AI-powered, real-time air quality alerts and reward-based lifestyle guidance.


---

## 🤝 Contributing

We welcome contributions!

* Open an issue
* Submit a pull request
* Suggest new features or integrations

---

## 📄 License

This project is licensed under the **MIT License**.
See the `LICENSE` file for details.

---

## 🌍 Made with ❤️ for cleaner air and healthier lives by Code Crusaders.



