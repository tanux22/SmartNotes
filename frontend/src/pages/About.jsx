import React from "react";
import { motion } from "framer-motion";
import { MdOutlineLibraryBooks } from "react-icons/md";
import Footer from "../components/Footer";

export default function About() {

    return (
        <>
            <div className="relative min-h-screen bg-black text-white overflow-hidden">

                {/* Animated Background */}
                <div className="absolute inset-0">
                    <motion.div
                        className="w-[20%] h-[100%] bg-gradient-to-r from-black-500 via-black-500 to-blue-800 rounded-full filter blur-3xl opacity-30 absolute -top-64 -left-64"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
                    />
                    <motion.div
                        className="w-[150%] h-[150%] bg-gradient-to-r from-black-400 via-indigo-500 to-purple-500 rounded-full filter blur-2xl opacity-30 absolute -bottom-64 -right-64"
                        animate={{ rotate: -360 }}
                        transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
                    />
                </div>

                <div className="relative z-10 px-6 py-32 max-w-7xl mx-auto flex flex-col items-center">

                    {/* Header */}
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-3xl shadow-xl">
                                <MdOutlineLibraryBooks className="text-black" />
                            </div>
                        </div>
                        <h1 className="text-5xl font-bold mb-4">Smart Notes</h1>
                        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                            Your intelligent note-taking companion. Organize, create, and access your notes faster and smarter, all in one platform.
                        </p>
                    </motion.div>

                    {/* Features Section */}
                    <motion.div
                        className="grid md:grid-cols-3 gap-8 w-full"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.3 } },
                        }}
                    >
                        {[
                            {
                                title: "Organize Notes",
                                desc: "Categorize and organize your notes effortlessly, keeping your ideas accessible anytime.",
                            },
                            {
                                title: "Smart Search",
                                desc: "Find notes instantly with AI-powered search, saving time and boosting productivity.",
                            },
                            {
                                title: "Cloud Sync",
                                desc: "Access your notes across all devices with secure, real-time synchronization.",
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-gray-900/70 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-gray-800 hover:scale-105 transition-transform duration-300"
                                variants={{
                                    hidden: { opacity: 0, y: 50 },
                                    visible: { opacity: 1, y: 0 },
                                }}
                            >
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Team Section */}
                    <motion.div
                        className="mt-24 w-full text-center"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold mb-8">Meet the Team</h2>
                        <div className="flex flex-wrap justify-center gap-8">
                            {["Tanush"].map((member, i) => (
                                <motion.div
                                    key={i}
                                    className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 w-60 shadow-lg border border-gray-800 hover:scale-105 transition-transform duration-300"
                                    whileHover={{ scale: 1.08 }}
                                >
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto flex items-center justify-center text-2xl font-bold text-black mb-4">
                                        {member[0]}
                                    </div>
                                    <h3 className="text-xl font-semibold">{member}</h3>
                                    <p className="text-gray-400 text-sm mt-1">Developer & Designer</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Call to Action */}
                    <motion.div
                        className="mt-24 text-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2 }}
                    >
                        <h2 className="text-3xl font-bold mb-4">Ready to take smarter notes?</h2>
                        <button
                            onClick={() => (window.location.href = "/signup")}
                            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl font-semibold hover:scale-105 transition-transform duration-300"
                        >
                            Get Started
                        </button>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </>
    );
}
