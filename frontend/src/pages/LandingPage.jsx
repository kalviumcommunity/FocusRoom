import { useState } from "react";
import {
  Timer,
  Users,
  BarChart3,
  CheckSquare,
  ArrowRight,
  Play,
  Clock,
  Target,
} from "lucide-react";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { googleLogin } = useUser();
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    await googleLogin();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <Timer className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold">FocusRoom</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-gray-300 hover:text-white transition-colors"
          >
            How it Works
          </a>
          <a
            href="#pricing"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Pricing
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative px-8 pt-16 pb-24">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full opacity-30 animate-float-fast" style={{background:"radial-gradient(closest-side, rgba(255,255,255,0.06), transparent)"}} />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="reveal-up text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight tracking-tight">
              Focus. Collaborate.
              <br />
              <span className="text-red-400">Achieve.</span>
            </h1>

            <p className="reveal-up [animation-delay:120ms] text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Boost your team's productivity with our Pomodoro-based tracker.
              Manage tasks, track progress, and collaborate seamlessly in
              real-time.
            </p>

            {/* Custom Google Login Button */}
            <button
              onClick={loginWithGoogle}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="btn-shine group relative inline-flex items-center gap-4 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-gray-100 hover:scale-105 hover:shadow-2xl"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285f4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34a853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#fbbc05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#ea4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
              <ArrowRight
                className={`w-5 h-5 transition-transform duration-300 ${
                  isHovered ? "translate-x-1" : ""
                }`}
              />
            </button>
          </div>

          {/* Feature Preview Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            <div className="reveal-up bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:bg-gray-800/70 transition-all duration-300 group">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-500/30 transition-colors">
                <Clock className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Smart Pomodoro Timer
              </h3>
              <p className="text-gray-400">
                Track focused work sessions with customizable timer intervals
                and break reminders.
              </p>
            </div>

            <div className="reveal-up [animation-delay:120ms] bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:bg-gray-800/70 transition-all duration-300 group">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-pink-500/30 transition-colors">
                <Users className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Team Collaboration</h3>
              <p className="text-gray-400">
                Create organization rooms and see real-time status of team
                members' productivity.
              </p>
            </div>

            <div className="reveal-up [animation-delay:240ms] bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:bg-gray-800/70 transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Analytics Dashboard
              </h3>
              <p className="text-gray-400">
                Comprehensive insights into productivity patterns and team
                performance metrics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-8 py-20 bg-gray-800/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">How It Works</h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-400">1</span>
              </div>
              <h3 className="font-semibold mb-2">Sign In</h3>
              <p className="text-gray-400 text-sm">
                Quick Google authentication to get started
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-pink-400">2</span>
              </div>
              <h3 className="font-semibold mb-2">Create/Join Team</h3>
              <p className="text-gray-400 text-sm">
                Set up your organization or join with invite code
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-400">3</span>
              </div>
              <h3 className="font-semibold mb-2">Start Focusing</h3>
              <p className="text-gray-400 text-sm">
                Begin Pomodoro sessions and track your progress
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-400">4</span>
              </div>
              <h3 className="font-semibold mb-2">Analyze & Improve</h3>
              <p className="text-gray-400 text-sm">
                Review analytics and optimize team productivity
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Powerful Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6">
              <Timer className="w-8 h-8 text-red-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Pomodoro Timer</h3>
              <p className="text-gray-400">
                Customizable work and break intervals with audio notifications
                and visual progress tracking.
              </p>
            </div>

            <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6">
              <Users className="w-8 h-8 text-pink-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Team Rooms</h3>
              <p className="text-gray-400">
                Real-time collaboration spaces where you can see team members'
                current status and productivity.
              </p>
            </div>

            <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6">
              <CheckSquare className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Task Management</h3>
              <p className="text-gray-400">
                Kanban-style task boards for organizing work and tracking
                project progress efficiently.
              </p>
            </div>

            <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6">
              <BarChart3 className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                Analytics & Reports
              </h3>
              <p className="text-gray-400">
                Detailed insights into productivity patterns, team performance,
                and goal achievement.
              </p>
            </div>

            <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6">
              <Target className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Goal Tracking</h3>
              <p className="text-gray-400">
                Set and monitor daily, weekly, and monthly productivity goals
                for individuals and teams.
              </p>
            </div>

            <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6">
              <Play className="w-8 h-8 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Session History</h3>
              <p className="text-gray-400">
                Complete history of all Pomodoro sessions with detailed time
                tracking and productivity metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 py-20 bg-gradient-to-r from-red-500/10 via-pink-500/10 to-blue-500/10 animate-gradient">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Boost Your Productivity?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of teams already using FocusRoom to achieve more
            together.
          </p>

          <button
            onClick={loginWithGoogle}
            className="btn-shine group inline-flex items-center gap-3 bg-red-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-red-600 hover:scale-105 hover:shadow-2xl"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-12 bg-gray-800/50 border-t border-gray-700">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <Timer className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold">FocusRoom</span>
            </div>

            <div className="flex space-x-8 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FocusRoom. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
