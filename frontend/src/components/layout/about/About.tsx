import { Card } from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";
import { Settings, Users, TrendingUp } from "lucide-react";

const aboutData = [
  {
    icon: <Settings size={40} className="text-white" />,
    title: "Your automation headquarters",
    description:
      "The platform automates repetitive tasks, freeing up time for more meaningful work.",
    color: "bg-purple-600",
  },
  {
    icon: <Users size={40} className="text-white" />,
    title: "A powerful collaboration engine",
    description:
      "Teams can focus on innovation, creativity, and strategic decision-making.",
    color: "bg-purple-400",
  },
  {
    icon: <TrendingUp size={40} className="text-white" />,
    title: "Visible and scalable impact",
    description:
      "From enabling AI in a workflow to automating processes, our platform gives you the power to speed innovation.",
    color: "bg-pink-500",
  },
];

const About = () => {
  return (
    <section className="bg-gradient-to-b from-[#FCF3F8] to-white py-20 text-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in-up">
          Crafting a Vision for the Future
        </h2>
        <p className="text-lg text-gray-600 mb-12 animate-fade-in-up delay-100">
          Empowering teams to innovate, collaborate, and scale with ease.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up delay-200">
          {aboutData.map((item, index) => (
            <Card
              key={index}
              className="shadow-lg rounded-xl p-6 bg-[#F5F0F0] hover:shadow-xl transition-shadow duration-300"
            >
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-full ${item.color} mx-auto mb-6 transition-transform hover:scale-110`}
              >
                {item.icon}
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-4">{item.title}</h3>
              <p className="text-gray-600 text-base">{item.description}</p>
            </Card>
          ))}
        </div>

        <Button
          className="mt-12 px-8 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300 animate-fade-in-up delay-300"
        >
          Explore all features
        </Button>
      </div>
    </section>
  );
};

export default About;