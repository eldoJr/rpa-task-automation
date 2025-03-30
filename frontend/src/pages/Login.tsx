import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/icons/logo.svg";
import { FcGoogle } from "react-icons/fc";
import { FaTwitter, FaGithub } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";

const Button = ({
  children,
  className = "",
  variant = "default",
  isLoading = false,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
  isLoading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const baseStyles =
    "font-medium rounded-lg transition-all flex items-center justify-center";
  const variantStyles = {
    default:
      "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg",
    outline:
      "border border-gray-300 hover:bg-gray-50 text-gray-700 hover:shadow-sm",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${
        isLoading ? "opacity-70 cursor-not-allowed" : ""
      } ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

const Input = ({
  placeholder,
  label,
  type = "text",
  className = "",
  error,
  ...props
}: {
  placeholder: string;
  label: string;
  type?: string;
  className?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

function Login() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // static user for testing
      if (email === "admin" && password === "admin1234") {
        navigate("/dashboard");
      } else {
        setError("Invalid credentials. Try admin/admin1234 for testing.");
      }
    } catch (err) {
      console.error("Login error:", err); // Log the error for debugging.
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 -right-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-40 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Backdrop blur */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-10"></div>

      {/* Main card */}
      <div
        className={`flex w-full max-w-4xl shadow-xl rounded-3xl overflow-hidden bg-white/90 backdrop-blur-sm z-20 relative transition-all duration-700 transform ${
          mounted ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Left side - Branding */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 p-8 w-1/3 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-grid-indigo-500/20"></div>
          </div>

          <div className="text-center space-y-4 relative z-10">
            <img
              src={logo}
              alt="Logo"
              className="w-28 h-28 mb-4 transition-all hover:scale-105 duration-300"
            />
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Welcome Back!
            </h2>
            <p className="text-gray-600 text-sm mt-2 max-w-xs">
              Streamline your workflow with our powerful automation tools
              designed to save you time and effort.
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

        {/* Right side - Login form */}
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

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <Input
                placeholder="Enter your username"
                label="USERNAME"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div className="space-y-1">
              <Input
                placeholder="Enter your password"
                label="PASSWORD"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full mt-4 py-3 rounded-xl"
              isLoading={isLoading}
            >
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
              className="flex items-center gap-2 w-full justify-center py-2.5 rounded-xl"
            >
              <FcGoogle className="w-5 h-5" /> Google
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full justify-center py-2.5 rounded-xl"
            >
              <FaTwitter className="text-blue-400 w-5 h-5" /> Twitter
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full justify-center py-2.5 rounded-xl"
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
