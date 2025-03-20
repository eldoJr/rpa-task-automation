import { Link } from "react-router-dom";
import logo from "@/assets/icons/logo.svg";
import { FcGoogle } from "react-icons/fc";
import { FaTwitter, FaGithub } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";

// Componente Button local
const Button = ({
  children,
  className,
  variant = "default",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const baseStyles =
    "font-medium rounded-lg transition-colors flex items-center justify-center";
  const variantStyles = {
    default: "bg-blue-600 hover:bg-blue-700 text-white",
    outline: "border border-gray-300 hover:bg-gray-50 text-gray-700",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Componente Input local
const Input = ({
  placeholder,
  label,
  type = "text",
  ...props
}: {
  placeholder: string;
  label: string;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />
    </div>
  );
};

function Register() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="flex w-full max-w-4xl shadow-lg rounded-2xl overflow-hidden">
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-8 w-1/3">
          <div className="text-center space-y-4">
            <img
              src={logo}
              alt="Logo da AutomateRFP"
              className="w-28 h-28 mb-4"
            />
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome to AutomateRFP
            </h2>
            <p className="text-gray-600 text-sm mt-2 max-w-xs">
              Streamline your workflow with our powerful automation tools
              designed to save you time and effort.
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 transition-colors font-semibold underline"
              >
                Log in here
              </Link>
            </p>
          </div>
        </div>

        {/* Seção direita: Formulário de registro */}
        <div className="bg-white p-8 w-full md:w-2/3 flex flex-col justify-center">
          {/* Botão de voltar com destaque */}
          <Link
            to="/"
            className="flex items-center py-4 text-gray-600 hover:text-black transition-colors"
          >
            <IoChevronBack className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-500">01.</h2>
            <h1 className="text-3xl font-bold text-black mt-2">Sign up</h1>
            <p className="text-gray-600 text-sm mt-2">
              Register or log in to access your account and start automating
              your workflow.
            </p>
          </div>

          <form className="mt-6 space-y-5">
            <Input placeholder="User name" label="USERNAME" />
            <Input placeholder="Email" label="EMAIL" type="email" />
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Password"
                label="PASSWORD (*)"
                type="password"
              />
              <Input
                placeholder="Confirm Password"
                label="CONFIRM PASSWORD (*)"
                type="password"
              />
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              This site is protected by reCAPTCHA and the Google{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              apply.
            </p>
            <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg">
              REGISTER AND CONTINUE
            </Button>
          </form>

          <div className="relative flex items-center justify-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500">Or register with</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 w-full justify-center py-2.5"
            >
              <FcGoogle className="w-5 h-5" /> Google
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 w-full justify-center py-2.5"
            >
              <FaTwitter className="text-blue-400 w-5 h-5" /> Twitter
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 w-full justify-center py-2.5"
            >
              <FaGithub className="text-black w-5 h-5" /> GitHub
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
