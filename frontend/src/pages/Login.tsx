import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/inputs/input";
import logo from "@/assets/icons/logo.svg";
import { FcGoogle } from "react-icons/fc";
import {  FaTwitter, FaGithub } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";

function Login() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 -right-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-40 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-10"></div>
      <div 
        className={`flex w-full max-w-4xl shadow-xl rounded-3xl overflow-hidden bg-white/90 backdrop-blur-sm z-20 relative transition-all duration-700 transform ${
          mounted ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 p-8 w-1/3 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-grid-indigo-500/20"></div>
          </div>
          
          <div className="text-center space-y-4 relative z-10">
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl shadow-sm mx-auto">
              <img
                src={logo}
                alt="Logo"
                className="w-28 h-28 mb-4 transition-all hover:scale-105 duration-300"
              />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Welcome Back!</h2>
            <p className="text-gray-600 text-sm mt-2 max-w-xs">
              Streamline your workflow with our powerful automation tools designed to save you time and effort.
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 hover:text-indigo-700 transition-colors font-semibold underline"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        <div className="bg-white p-8 w-full md:w-2/3 flex flex-col justify-center">
          <Link
            to="/"
            className="flex items-center py-4 text-gray-600 hover:text-indigo-600 transition-colors group"
          >
            <IoChevronBack className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          <div className="mb-8">
            <h2 className="text-sm font-semibold text-indigo-500">02.</h2>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">Log in</h1>
            <p className="text-gray-600 text-sm mt-2">
              Access your account to continue automating your workflow.
            </p>
          </div>

          <div className="mt-6 flex justify-between items-center text-sm font-semibold">
            <span className="text-gray-600">Log in with</span>
            <Link
              to="/register"
              className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
            >
              Sign up now
            </Link>
          </div>

          <form className="mt-6 space-y-5">
            <div className="space-y-1">
              <Input 
                placeholder="Email" 
                label="EMAIL" 
                type="email" 
                className="rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <Input
                placeholder="Password"
                label="PASSWORD (*)"
                type="password"
                className="rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              This site is protected by reCAPTCHA and the Google{" "}
              <a href="#" className="text-indigo-600 hover:underline">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="#" className="text-indigo-600 hover:underline">
                Terms of Service
              </a>{" "}
              apply.
            </p>
            <Button className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              LOG IN AND CONTINUE
            </Button>
          </form>

          <div className="relative flex items-center justify-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500">Or log in with</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 w-full justify-center py-2.5 rounded-xl transition-all hover:shadow-sm"
            >
              <FcGoogle className="w-5 h-5" /> Google
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 w-full justify-center py-2.5 rounded-xl transition-all hover:shadow-sm"
            >
              <FaTwitter className="text-blue-400 w-5 h-5" /> Twitter
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 w-full justify-center py-2.5 rounded-xl transition-all hover:shadow-sm"
            >
              <FaGithub className="text-black w-5 h-5" /> GitHub
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;