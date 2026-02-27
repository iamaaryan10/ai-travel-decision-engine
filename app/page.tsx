import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-4xl md:text-6xl font-bold text-center">
        AI Travel Decision Engine
      </h1>

      <p className="mt-6 text-lg md:text-xl text-gray-400 text-center max-w-2xl">
        Collaborative travel planning powered by intelligent preference
        aggregation and AI-driven consensus optimization.
      </p>

      <Link
        href="/create-trip"
        className="mt-10 px-8 py-3 bg-white text-black rounded-xl font-semibold hover:opacity-90 transition"
      >
        Create Trip
      </Link>

      <Link
      href="/create-session"
      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold"
    >
        Create Voting Session
      </Link>
    </main>
  );
}