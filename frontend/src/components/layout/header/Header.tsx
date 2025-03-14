import React from "react";

const Header = () => {
  return (
    <header className="flex flex-col items-center text-center py-20 bg-white">
      <h1 className="text-4xl font-bold text-black">
        Automate Repetitive Tasks, <br />
        <span className="text-blue-600">& Create RFPs in Minutes.</span>
      </h1>
      <p className="text-gray-600 mt-4">
        Automate manual tasks and free up your team <br />
        to focus on strategic work.
      </p>
      <button className="mt-6 px-6 py-2 border border-black text-black rounded-md hover:bg-black hover:text-white transition">
        Get Started
      </button>
    </header>
  );
};

export default Header;
