"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, ShieldCheck, Zap, Briefcase, ChevronRight, Calculator, PieChart } from "lucide-react";

export default function LandingPage() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white font-sans transition-colors flex flex-col">
      {/* Navigation Bar */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-md flex items-center justify-center text-sm font-bold">
              LMS
            </div>
            <span className="font-bold tracking-tight text-lg">FinCore</span>
          </div>
          <nav className="flex items-center gap-4">
            {loading ? (
              <div className="h-9 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            ) : user ? (
              <Link
                href="/dashboard"
                className="text-sm font-medium px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors px-4 py-2">
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            LMS Platform v1.0 is Live
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl leading-tight">
            Modern Loan Management. <br className="hidden md:block" />
            <span className="text-gray-500 dark:text-gray-400">Brilliantly Simplified.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-10 leading-relaxed">
            End-to-end loan lifecycles from application to collection. Built with a real-time Business Rule Engine for instant decisions and role-based operational dashboards.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            {user ? (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all text-base"
              >
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all text-base"
                >
                  Start Borrowing <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white dark:bg-[#050505] text-black dark:text-white font-semibold rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all text-base"
                >
                  Staff Login
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Feature Grid */}
        <section className="bg-gray-50 dark:bg-[#0a0a0a] border-y border-gray-200 dark:border-gray-800 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to scale lending</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Our platform provides distinct experiences tailored for borrowers and internal operations teams, ensuring complete compliance and speed.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-white dark:bg-[#111] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors group">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-black dark:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Instant BRE Checks</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Our Business Rule Engine instantly validates borrower age and income thresholds, preventing unqualified applications from entering the queue.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white dark:bg-[#111] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors group">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Calculator className="w-6 h-6 text-black dark:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Live Math Calculations</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Borrowers can configure their loan principal and tenure using intuitive sliders, seeing total repayment and interest generated in real-time.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white dark:bg-[#111] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors group">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6 text-black dark:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Role-Based Access</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Strict RBAC ensures that Sales, Sanctioning, Disbursement, and Collection teams only see the data they need to perform their duties.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white dark:bg-[#111] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors group">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6 text-black dark:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Secure Document Vault</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Salary slips and sensitive borrower data are securely uploaded and stored, accessible only to authorized Sanctioning officers.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white dark:bg-[#111] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors group md:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <PieChart className="w-6 h-6 text-black dark:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Automated Closures</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Collections team logs partial UTR payments. Once the outstanding balance hits zero, the system automatically transitions the loan to closed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Ready to experience seamless lending?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            Join thousands of borrowers and operations teams using FinCore to manage their financial lifecycles securely and efficiently.
          </p>
          {!user && (
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all text-base"
            >
              Create Free Account
            </Link>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#050505] py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-black dark:bg-white text-white dark:text-black rounded flex items-center justify-center text-[10px] font-bold">
              LMS
            </div>
            <span className="font-semibold text-sm">FinCore Systems</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            &copy; {new Date().getFullYear()} FinCore LMS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
