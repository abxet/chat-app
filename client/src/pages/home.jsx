import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Github, Mail, Globe } from "lucide-react";
import logo from "../assets/logo.svg"; 
import screenshot from "../assets/screenshot.png"
import ThemeToggle from "../components/ThemeToggle";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white transition-colors duration-500 flex flex-col">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-5 bg-white/70 dark:bg-gray-900/50 backdrop-blur-md shadow-sm dark:shadow-none">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Teal Chat Logo" className="w-10 h-10" />
          <h1 className="text-2xl font-bold tracking-tight text-teal-500">
            Teal
          </h1>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 text-sm font-semibold rounded-xl border border-teal-400 text-teal-700 hover:bg-teal-400 hover:text-white dark:text-white dark:border-teal-400 dark:hover:bg-teal-500 dark:hover:text-black transition-all duration-300"
          >
            Log In
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="px-5 py-2 text-sm font-semibold rounded-xl bg-teal-500 text-white hover:bg-teal-600 dark:bg-teal-400 dark:text-black dark:hover:bg-teal-300 transition-all duration-300"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center flex-1 text-center px-8 py-24 sm:py-32"
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 text-gray-900 dark:text-white dark:drop-shadow-[0_0_12px_#00bfa5]">
          Chat Reimagined with <span className="text-teal-400">Teal</span>
        </h1>
        <p className="max-w-2xl text-lg sm:text-xl mb-12 text-gray-600 dark:text-gray-300">
          Experience real-time conversations secured with next-gen encryption.
          Simple, sleek, and made for real connections.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/signup")}
            className="px-7 py-3 text-base font-semibold rounded-xl bg-teal-500 text-white hover:bg-teal-600 dark:bg-teal-400 dark:text-black dark:hover:bg-teal-300 transition-all duration-300 dark:shadow-[0_0_20px_#00bfa5]"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-7 py-3 text-base font-semibold rounded-xl border border-teal-400 text-teal-700 hover:bg-teal-400 hover:text-white dark:text-white dark:border-teal-400 dark:hover:bg-teal-500 dark:hover:text-black transition-all duration-300 dark:shadow-[0_0_10px_#00bfa5]"
          >
            Log In
          </button>
        </div>
      </motion.section>

      {/* FEATURES */}
      <section className="py-24 px-8 sm:px-16 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-center mb-16"
        >
          Why Choose <span className="text-teal-400">Teal Chat?</span>
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {[
            {
              title: "End-to-End Encryption",
              desc: "Your messages are yours alone. Every chat is protected with next-gen cryptography.",
            },
            {
              title: "Instant Messaging",
              desc: "Smooth, lag-free conversations with real-time delivery.",
            },
            {
              title: "Modern UI/UX",
              desc: "Minimal, elegant, and fast — Teal Chat is built with beauty and speed in mind.",
            },
            {
              title: "Custom Themes",
              desc: "Light or Dark, Teal Chat adapts to your style with seamless transitions.",
            },
            {
              title: "Secure Storage",
              desc: "Local key management ensures your data stays encrypted — even on your device.",
            },
            {
              title: "Friends & Connections",
              desc: "Add, chat, and share seamlessly with friends in one sleek interface.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl p-8 bg-white shadow-md dark:bg-gray-950 dark:shadow-[0_0_15px_#00bfa5]/30 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-3 text-teal-500 dark:text-teal-400">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SCREENSHOT SECTION */}
      <section className="py-24 text-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <h2 className="text-3xl font-bold mb-10">
          See <span className="text-teal-400">Teal Chat</span> in Action
        </h2>
        <div className="w-4/5 max-w-4xl mx-auto h-80 sm:h-[28rem] rounded-2xl flex items-center justify-center border-2 border-gray-300 dark:border-teal-400/50 dark:shadow-[0_0_15px_#00bfa5]/40 transition-all duration-300 overflow-x-hidden">
          <p className="text-gray-500 dark:text-gray-400">
            <img src={screenshot} alt="screenshot" className="relative h-120"/>
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-8 sm:px-16 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Teal Chat Logo" className="w-8 h-8" />
            <h3 className="text-lg font-semibold text-teal-500">Teal Chat</h3>
          </div>

          <div className="flex gap-6">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
            >
              <Github size={22} />
            </a>
            <a
              href="mailto:support@tealchat.app"
              className="hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
            >
              <Mail size={22} />
            </a>
            <a
              href="#"
              className="hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
            >
              <Globe size={22} />
            </a>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Made with 💚 by <span className="text-teal-500">Teal Team</span>
          </p>
        </div>
      </footer>
      <ThemeToggle />
    </div>
  );
};

export default Home;
