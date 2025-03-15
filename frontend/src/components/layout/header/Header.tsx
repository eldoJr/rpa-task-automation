import Button from "@/components/ui/button/Button";

const Header = () => {
  return (
    <header className="w-full text-center py-32 bg-gray-50">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-black">
          Automate Repetitive Tasks, <br />&
          <span className="text-blue-600"> Create RFPs in Minutes.</span>
        </h1>
        <p className="mt-4 text-gray-600">
          Automate manual tasks and free up your team to focus on strategic work
        </p>
        <Button className="mt-6">Get Started</Button>
      </div>
    </header>
  );
};

export default Header;
