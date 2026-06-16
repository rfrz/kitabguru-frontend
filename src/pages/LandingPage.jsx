import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  MessageSquare, 
  Cpu, 
  ShieldCheck, 
  ArrowRight, 
  BookOpen, 
  Users, 
  Activity, 
  Zap 
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 w-full border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              KitabGuru
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <Link 
                to="/chat" 
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg shadow-sm transition-colors"
              >
                Go to App
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg shadow-sm transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/30 mb-6 animate-pulse">
            <Zap size={14} /> Built for Learning & IoT Management
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Empower Your Learning with{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
              Smart IoT and AI
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            KitabGuru brings real-time interactive AI chat and physical IoT integration under a unified dashboard. Learn faster, monitor smarter.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {user ? (
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg shadow-md transition-all group"
              >
                Go to Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg shadow-md transition-all group"
                >
                  Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-3 font-semibold border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors"
                >
                  Watch Demo
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-28 bg-gray-50/50 dark:bg-gray-900/30 border-y border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to learn & control</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 text-base sm:text-lg">
              Explore the core components designed to bridge digital classrooms with physical hardware.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-5">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">AI-Driven Chat</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-grow">
                Ask questions, generate study guides, and test your knowledge directly through our interactive chat console.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-5">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">IoT Integration</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-grow">
                Connect and control physical sensors and educational microcontroller hardware right from your browser.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-xl flex items-center justify-center mb-5">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Admin Panel</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-grow">
                Manage learning programs, review chat transcripts, monitor connected IoT boards, and configure users effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About / Use Cases / Testimonials Section */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Designed for next-generation interactive environments</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                KitabGuru enables educational institutions, makers, and enthusiasts to develop IoT projects quickly while leveraging contextual assistance through AI. 
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <Activity size={14} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Real-time Telemetry Data</h4>
                    <p className="text-xs text-gray-500">Render live plots of temp, humidity, and custom values.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <Users size={14} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Collaborative Classrooms</h4>
                    <p className="text-xs text-gray-500">Supervise user interactions and verify firmware updates seamlessly.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 relative">
              <div className="absolute top-6 left-6 text-gray-300 dark:text-gray-700 text-6xl font-serif">“</div>
              <p className="text-gray-700 dark:text-gray-300 relative z-10 italic leading-relaxed mb-6">
                Using KitabGuru, we managed to integrate our physical weather station device to the classroom UI in under an hour. The AI chat provided precise coding advice for the ESP32 connection instantly!
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                  JD
                </div>
                <div>
                  <h4 className="text-sm font-bold">John Doe</h4>
                  <p className="text-xs text-gray-500">IoT Lab Instructor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            <span className="font-semibold text-sm">KitabGuru</span>
          </div>
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} KitabGuru. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
