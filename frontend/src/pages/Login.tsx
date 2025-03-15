import { Link } from "react-router-dom";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/inputs/input";
import logo from "@/assets/icons/logo.svg";
import { FcGoogle } from "react-icons/fc";
import { FaArrowLeft, FaTwitter, FaFacebook } from "react-icons/fa";

function Login() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      {/* Container principal com flex para alinhar as seções */}
      <div className="flex w-full max-w-4xl shadow-lg rounded-2xl overflow-hidden">
        {/* Seção esquerda: Apresentação visual e branding */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-8 w-1/3">
          <div className="text-center space-y-4">
            <img
              src={logo}
              alt="Logo da AutomateRFP"
              className="w-28 h-28 mb-4"
            />
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
            <p className="text-gray-600 text-sm mt-2 max-w-xs">
              Streamline your workflow with our powerful automation tools designed to save you time and effort.
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 transition-colors font-semibold underline"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Seção direita: Formulário de login */}
        <div className="bg-white p-8 w-full md:w-2/3 flex flex-col justify-center">
          {/* Botão de voltar com destaque */}
          <Link
            to="/"
            className="flex items-center py-4 text-gray-600 hover:text-black transition-colors"
          >
            <FaArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          {/* Cabeçalho do formulário */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-500">02.</h2>
            <h1 className="text-3xl font-bold text-black mt-2">Log in</h1>
            <p className="text-gray-600 text-sm mt-2">
              Access your account to continue automating your workflow.
            </p>
          </div>

          {/* Links alternativos */}
          <div className="mt-6 flex justify-between items-center text-sm font-semibold">
            <span className="text-gray-600">Log in with</span>
            <Link
              to="/register"
              className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
            >
              Sign up now
            </Link>
          </div>

          {/* Formulário de login */}
          <form className="mt-6 space-y-5">
            <Input placeholder="Email" label="EMAIL" type="email" />
            <Input
              placeholder="Password"
              label="PASSWORD (*)"
              type="password"
            />
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
              LOG IN AND CONTINUE
            </Button>
          </form>

          {/* Divisor visual */}
          <div className="relative flex items-center justify-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500">Or log in with</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Botões de login social */}
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
              <FaFacebook className="text-blue-600 w-5 h-5" /> Facebook
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;