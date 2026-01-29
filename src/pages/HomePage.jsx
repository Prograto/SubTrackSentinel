import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">

      {/* ================= NAVBAR ================= */}
      <header className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            SubTrack <span className="text-indigo-500">Sentinel</span>
          </h1>

          <div className="space-x-4">
            <Link
              to="/login"
              className="text-slate-300 hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-500"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12">
          
          {/* Left */}
          <div>
            <h2 className="text-5xl font-bold leading-tight">
              Never Forget a{" "}
              <span className="text-indigo-500">Subscription</span> Again
            </h2>

            <p className="mt-6 text-slate-400 text-lg">
              SubTrack Sentinel helps you track all your subscriptions,
              monitor renewal dates, and receive alerts before you get charged.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                to="/register"
                className="bg-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-500"
              >
                Start Tracking Free
              </Link>
              <Link
                to="/login"
                className="border border-slate-600 px-6 py-3 rounded-lg hover:bg-slate-800"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Right */}
          <div className="bg-slate-800 rounded-xl p-8 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              Why SubTrack Sentinel?
            </h3>
            <ul className="space-y-3 text-slate-300">
              <li>✔ Track all subscriptions in one place</li>
              <li>✔ Get SMS & Email renewal alerts</li>
              <li>✔ Monitor monthly & yearly spending</li>
              <li>✔ Avoid unwanted charges</li>
            </ul>
          </div>

        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="bg-slate-950 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12">
            Powerful Features
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Subscription Tracking"
              desc="Add and manage all your subscriptions with renewal dates and billing cycles."
            />
            <FeatureCard
              title="Smart Alerts"
              desc="Receive reminders via SMS or Email before your subscription renews."
            />
            <FeatureCard
              title="Spending Insights"
              desc="Visualize your monthly and yearly subscription expenses."
            />
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-12">How It Works</h3>

          <div className="grid md:grid-cols-3 gap-8 text-slate-300">
            <Step number="1" text="Create your free account" />
            <Step number="2" text="Add your subscriptions" />
            <Step number="3" text="Get alerts & save money" />
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold">
            Take Control of Your Subscriptions Today
          </h3>
          <p className="mt-4 text-indigo-100">
            Join SubTrack Sentinel and never miss a renewal again.
          </p>
          <Link
            to="/register"
            className="inline-block mt-6 bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} SubTrack Sentinel. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function FeatureCard({ title, desc }) {
  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow">
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-slate-400">{desc}</p>
    </div>
  );
}

function Step({ number, text }) {
  return (
    <div className="bg-slate-800 p-6 rounded-xl">
      <div className="text-indigo-500 text-3xl font-bold mb-2">
        {number}
      </div>
      <p>{text}</p>
    </div>
  );
}
