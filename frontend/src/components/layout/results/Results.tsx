import CountUp from "react-countup";

const results = [
  {
    value: 1200,
    suffix: "+",
    description: "Automated tasks per day, reducing manual work significantly.",
    color: "bg-purple-600",
    top: "mt-0",
  },
  {
    value: 95,
    suffix: "%",
    description: "Accuracy in AI-powered insights and data-driven decisions.",
    color: "bg-blue-600",
    top: "mt-8",
  },
  {
    value: 300,
    suffix: "+",
    description: "Seamless integrations with third-party applications.",
    color: "bg-green-600",
    top: "mt-4",
  },
  {
    value: 80,
    suffix: "%",
    description: "Reduction in processing time for complex operations.",
    color: "bg-orange-600",
    top: "mt-12",
  },
];

const Results = () => {
  return (
    <section className="bg-white py-20 text-center">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-900 mb-6 animate-fade-in-up">
          Measurable <span className="text-green-600">Impact</span> of Our Solution
        </h2>
        <p className="text-lg text-gray-600 mb-12 max-w-xl mx-auto animate-fade-in-up delay-100">
          Our AI-powered automation enhances efficiency, streamlines workflows, and delivers exceptional results.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {results.map(({ value, suffix, description, color, top }, index) => (
            <div
              key={index}
              className={`${top} p-6 rounded-xl shadow-lg text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in-up delay-${200 + index * 100} ${color}`}
            >
              <span className="text-5xl font-bold">
                <CountUp start={0} end={value} duration={3} />{suffix}
              </span>
              <p className="text-sm text-center mt-4">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Results;