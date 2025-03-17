import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const results = [
  {
    value: 1200,
    suffix: "+",
    description: "Automated tasks per day, reducing manual work significantly.",
    color: "bg-purple-600",
  },
  {
    value: 95,
    suffix: "%",
    description: "Accuracy in AI-powered insights and data-driven decisions.",
    color: "bg-blue-600",
  },
  {
    value: 300,
    suffix: "+",
    description: "Seamless integrations with third-party applications.",
    color: "bg-green-600",
  },
  {
    value: 80,
    suffix: "%",
    description: "Reduction in processing time for complex operations.",
    color: "bg-orange-600",
  },
];

const Results = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <section ref={ref} className="bg-white py-20 text-center">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Measurable <span className="text-green-600">Impact</span> of Our
          Solution
        </h2>
        <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
          Our AI-powered automation enhances efficiency, streamlines workflows,
          and delivers exceptional results.
        </p>

        <div className="lg:hidden overflow-hidden">
          <div className="overflow-x-auto pb-4 no-scrollbar">
            <div className="flex gap-4 snap-x snap-mandatory w-full">
              {results.map(({ value, suffix, description, color }, index) => (
                <div
                  key={index}
                  className="snap-center shrink-0 w-64 px-2 first:pl-4 last:pr-4" // let largura fixa
                >
                  <div
                    className={`p-5 rounded-xl shadow-lg text-white ${color} h-full`}
                  >
                    <span className="text-4xl font-bold block">
                      {inView ? (
                        <CountUp start={0} end={value} duration={3} />
                      ) : (
                        0
                      )}
                      {suffix}
                    </span>
                    <p className="text-sm mt-3">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden lg:grid grid-cols-4 gap-6">
          {results.map(({ value, suffix, description, color }, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl shadow-lg text-white ${color}`}
            >
              <span className="text-5xl font-bold">
                {inView ? <CountUp start={0} end={value} duration={3} /> : 0}
                {suffix}
              </span>
              <p className="text-sm text-center mt-4">{description}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default Results;
