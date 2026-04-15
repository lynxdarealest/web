import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Hero from "./components/Hero";
import NewsSection from "./components/NewsSection";
import DownloadSection from "./components/DownloadSection";
import TopupSection from "./components/TopupSection";
import LiveActivity from "./components/LiveActivity";
import Leaderboard from "./components/Leaderboard";

import { AuthProvider } from "./hooks/useAuth";

import TransactionHistory from "./components/TransactionHistory";

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          <div className="space-y-8">
            <Hero />
            <NewsSection />
            <DownloadSection />
            <TransactionHistory />
          </div>
          <aside className="space-y-8">
            <TopupSection />
            <Leaderboard />
          </aside>
        </main>
        <LiveActivity />
        <Footer />
      </div>
    </AuthProvider>
  );
}
