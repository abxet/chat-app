
// pages/signUp
import React, { useState, useEffect, useContext } from "react";
import { generateKeyPair, encryptPrivateKey, decryptPrivateKey } from "../utils/crypto";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { CircleX, CircleCheck, Lock, KeyRound, User, Mail } from "lucide-react";
import { motion } from "framer-motion";
import PasswordStrengthBar from "../components/PasswordStrengthBar";
import ThemeToggle from "../components/ThemeToggle";
import { UserContext } from "../context/UserContext";
import { useKeyContext } from "../context/KeyContext";


const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [passwordStrength, setPasswordStrength] = useState("");
    const [containsCapitalLetters, setContainsCapitalLetters] = useState(false);
    const [containsLowercaseLetters, setContainsLowercaseLetters] = useState(false);
    const [containsNumbers, setContainsNumbers] = useState(false);
    const [containsSpecialCharacters, setContainsSpecialCharacters] = useState(false);
    const [moreThan8Characters, setMoreThan8Characters] = useState(false);

    const navigate = useNavigate();

    const { updateUserData } = useContext(UserContext);
    const { saveUserData } = useKeyContext();
    


    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/\W/.test(password)) strength += 1;

        if (strength <= 2) return "Weak";
        if (strength === 3) return "Moderate";
        return "Strong";
    };

    // Turning off password validation for development purposes
    // # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
    // useEffect(() => {
    //     if (password && confirmPassword && password !== confirmPassword) {
    //         setError("Passwords do not match");
    //     } else if (
    //         password &&
    //         (password.length < 8 ||
    //             !/[A-Z]/.test(password) ||
    //             !/[a-z]/.test(password) ||
    //             !/[0-9]/.test(password) ||
    //             !/\W/.test(password))
    //     ) {
    //         setError(
    //             "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character"
    //         );
    //     } else {
    //         setError("");
    //     }
    //     setContainsCapitalLetters(/[A-Z]/.test(password));
    //     setContainsLowercaseLetters(/[a-z]/.test(password));
    //     setContainsNumbers(/[0-9]/.test(password));
    //     setContainsSpecialCharacters(/[\W]/.test(password));
    //     setMoreThan8Characters(password.length >= 8);
    //     setPasswordStrength(calculatePasswordStrength(password));
    // }, [password, confirmPassword]);
    // # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
    const handleSignup = async (e) => {
        e.preventDefault();
        if (error || !username || !email || !password || password !== confirmPassword) {
            setError("Please fix the above errors before continuing.");
            return;
        }
        try {
            // encryption logic
            // 1) Generate tweetnacl keypair
            const keypair = generateKeyPair();
            saveUserData(username, keypair.publicKey, keypair.secretKey);

            // 2) Encrypt secretKey with user's password (client-side)
            const encryptedPrivateKey = await encryptPrivateKey(keypair.secretKey, password);

            const response = await api.post("/signup", { username, email, password, encryptedPrivateKey, publicKey: keypair.publicKey });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.user._id);

            updateUserData(response.data.user);
            // toast.success("Sign up successful!");
            alert("Sign up successful!");
            navigate("/chat");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "💔 Server error");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen dark:bg-gray-800">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col w-full max-w-sm p-8 dark:bg-gray-900 rounded-lg shadow-lg"
            >
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6 text-3xl font-bold text-center text-teal-500"
                >
                    Create Account
                </motion.h2>

                {/* Username Input */}
                <motion.div
                    whileFocus={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="relative mb-3"
                >
                    <input
                        type="text"
                        placeholder="Username"
                        className="border-b-2 border-teal-600 bg-transparent text-gray-500 dark:text-white w-full pr-10 p-3 outline-none focus:border-teal-400 placeholder-gray-400"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <User
                        size={18}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-500 pointer-events-none"
                    />
                </motion.div>

                {/* Email Input */}
                <motion.div
                    whileFocus={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="relative mb-3"
                >
                    <input
                        type="email"
                        placeholder="Email"
                        className="border-b-2 border-teal-600 bg-transparent text-gray-500 dark:text-white w-full pr-10 p-3 outline-none focus:border-teal-400 placeholder-gray-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Mail
                        size={18}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-500 pointer-events-none"
                    />
                </motion.div>

                {/* Password Input */}
                <motion.div
                    whileFocus={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="relative mb-2"
                >
                    <input
                        type="password"
                        placeholder="Password"
                        className="border-b-2 border-teal-600 bg-transparent  text-gray-500 dark:text-white w-full pr-10 p-3 outline-none focus:border-teal-400 placeholder-gray-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <KeyRound
                        size={18}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-500 pointer-events-none"
                    />
                </motion.div>

                <div className="text-xs text-gray-400 mb-2">
                    Password strength: {passwordStrength}
                </div>
                <PasswordStrengthBar strength={passwordStrength} />

                {/* Password validation checklist */}
                <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-3 space-y-1 text-xs text-gray-400 mb-4"
                >
                    {[
                        {
                            condition: moreThan8Characters,
                            text: "At least 8 characters long",
                        },
                        {
                            condition: containsCapitalLetters,
                            text: "Contains at least one uppercase letter",
                        },
                        {
                            condition: containsLowercaseLetters,
                            text: "Contains at least one lowercase letter",
                        },
                        {
                            condition: containsNumbers,
                            text: "Contains at least one number",
                        },
                        {
                            condition: containsSpecialCharacters,
                            text: "Contains at least one special character",
                        },
                    ].map((item, i) => (
                        <motion.li
                            key={i}
                            className={`flex items-center gap-2 ${item.condition ? "text-green-500" : "text-red-500"}`}
                            animate={{ opacity: item.condition ? 1 : 0.6 }}
                        >
                            {item.condition ? <CircleCheck size={16} /> : <CircleX size={16} />}
                            {item.text}
                        </motion.li>
                    ))}
                </motion.ul>

                {/* Confirm Password */}
                <motion.div
                    whileFocus={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="relative mb-4"
                >
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="border-b-2 border-teal-600 bg-transparent text-gray-500 dark:text-white w-full pr-10 p-3 outline-none focus:border-teal-400 placeholder-gray-400"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Lock
                        size={18}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-500 pointer-events-none"
                    />
                </motion.div>

                {/* Animated Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 mb-3 text-sm text-center"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    onClick={handleSignup}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg"
                    disabled={
                        !username ||
                        !email ||
                        !password ||
                        !confirmPassword ||
                        password !== confirmPassword
                    }
                >
                    Sign Up
                </motion.button>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-gray-400 mt-4"
                >
                    Already have an account?{" "}
                    <a href="/login" className="text-teal-400 hover:underline">
                        Login
                    </a>
                </motion.p>

            </motion.div>
            <ThemeToggle />
        </div>
    );
};

export default Signup;
