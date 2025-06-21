# 🍃 Vaayu - Your Environmental Health Companion

**Your personalized environmental health companion for chronic conditions.**

Vaayu is a web application designed to help individuals, especially those with chronic health conditions, manage their environmental exposure and make informed decisions about their well-being. It securely connects your health profile with real-time air quality data, providing personalized recommendations at your fingertips.

## ✨ The Core Idea

In a world with increasing environmental health concerns, Vaayu empowers you to take control. Instead of storing your sensitive health data on a centralized server, Vaayu uses a decentralized approach. Your identity is managed by **Civic**, and your health profile is stored on the **Aptos blockchain** in a wallet that only you control. This ensures data privacy and sovereignty while enabling powerful, personalized insights.

## 🚀 Key Features

- **🔒 Decentralized Identity:** Secure and simple login using Civic.
- **🔐 User-Owned Data:** Your health profile is stored on the Aptos blockchain, giving you full control.
- ** wallets for each user.
- **🌬️ Real-time AQI Monitoring:** Get the latest Air Quality Index (AQI) data for your current location.
- **❤️ Personalized Recommendations:** Receive health advice based on real-time environmental conditions and your unique health profile.
- **🖥️ Clean Dashboard:** A simple, intuitive interface to view your data and recommendations.
- **🏆 Rewards System:** (Future) A system to reward users for actively managing their health.

## 🛠️ How It Works

1.  **Sign In with Civic:** The user authenticates their identity using the Civic mobile app, ensuring a secure and reusable digital identity.
2.  **Aptos Wallet Creation:** Upon first login, Vaayu automatically creates a new, personal Aptos wallet for the user, securely linked to their Civic ID.
3.  **On-Chain Health Profile:** The user completes an onboarding process, and their health data (chronic conditions, sensitivities, etc.) is stored as a resource on the Aptos blockchain via a smart contract transaction.
4.  **Personalized Dashboard:** The application reads the user's health profile from the blockchain and fetches real-time AQI data to display personalized alerts and recommendations on their dashboard.

## 💻 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn-ui](https://ui.shadcn.com/)
- **Blockchain:** [Aptos](https://aptos.dev/)
- **Identity:** [Civic](https://www.civic.com/)
- **Data Fetching:** SWR, Fetch API
- **State Management:** React Hooks / Context API

## 🏁 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later)
- [pnpm](https://pnpm.io/installation) (recommended)
- A mobile device with the [Civic Wallet App](https://www.civic.com/wallet/) installed.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/vaayu.git
cd vaayu
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

You need an API token from the World Air Quality Index project to fetch AQI data.

1.  Go to the [AQICN Token Platform](https://aqicn.org/data-platform/token/) and register for a free token.
2.  Create a file named `.env.local` in the root of the project.
3.  Add your token to the file:

```.env
NEXT_PUBLIC_AQICN_TOKEN=your_api_token_here
```

### 4. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🗺️ Project Structure

The project uses the Next.js App Router structure:

-   `app/`: Contains all routes and pages.
    -   `api/`: API routes, including the Civic auth handler.
    -   `dashboard/`: The main user dashboard.
    -   `onboarding/`: The health profile setup flow.
    -   `login/`: The main login page.
-   `components/`: Shared React components.
    -   `ui/`: Components from shadcn-ui.
-   `lib/`: Core application logic.
    -   `aptos.ts`: Functions for interacting with the Aptos blockchain (wallet creation, transactions).
    -   `civic.ts`: Configuration for Civic authentication.
-   `sources/`: Contains the Move smart contract for the health profile (`onboarding.move`).

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
