import Button from "@/components/ui/button/Button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full text-center bg-gray-50 pt-36 pb-6">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-black">
          Automate Repetitive Tasks, <br />&
          <span className="text-blue-600"> Create RFPs in Minutes.</span>
        </h1>
        <p className="mt-4 text-gray-600">
          Automate manual tasks and free up your team to focus on strategic work
        </p>
        <Button className="mt-6" onClick={() => navigate("/register")}>
          Get Started
        </Button>
      </div>
    </header>
  );
};

export default Header;
