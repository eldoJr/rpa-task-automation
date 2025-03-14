import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  title: string;
  avatarColor: string;
}

const TestimonialsSection: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote: "We saved 50% of our time in the RFP process!",
      name: "Doe J.",
      title: "Procurement Manager",
      avatarColor: "#FF9F80", // Coral-ish
    },
    {
      id: 2,
      quote: "Manual errors dropped to nearly zero. Now, we focus on strategy instead of paperwork.",
      name: "Jane R.",
      title: "Operations Lead",
      avatarColor: "#80D8FF", // Light blue
    },
    {
      id: 3,
      quote: "Our approval workflow became 3x faster, leading to quicker deal closures!",
      name: "John T.",
      title: "Sales Director",
      avatarColor: "#FFEB3B", // Yellow
    },
    {
      id: 4,
      quote: "ROI in less than 3 months. Best investment decision we've made this year.",
      name: "Sarah M.",
      title: "CFO",
      avatarColor: "#B388FF", // Purple
    },
    {
      id: 5,
      quote: "The AI suggestions have been shockingly accurate and saved us countless revisions.",
      name: "Mark P.",
      title: "Proposal Manager",
      avatarColor: "#69F0AE", // Green
    },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const testimonialsPerPage = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
  
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);

  const autoAdvance = useCallback(() => {
    if (isAutoPlaying) {
      setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
    }
  }, [isAutoPlaying, totalPages]);

  useEffect(() => {
    const timer = setInterval(autoAdvance, 5000);
    return () => clearInterval(timer);
  }, [autoAdvance]);

  const getCurrentTestimonials = () => {
    const start = currentPage * testimonialsPerPage;
    const end = start + testimonialsPerPage;
    return testimonials.slice(start, end);
  };

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const goToPage = (pageIndex: number) => {
    setIsAutoPlaying(false);
    setCurrentPage(pageIndex);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      else if (e.key === 'ArrowRight') handleNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="bg-blue-700 text-white py-16 px-4 md:px-8 lg:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left column - Content */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Testimonials & Case Studies
            </h2>
            <p className="text-lg text-blue-100">
              Here's how our automation solutions have helped companies optimize their RFP and tender processes.
            </p>
            <button 
              className="group bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-full font-medium flex items-center transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Connect now"
            >
              Connect now
              <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </div>

          {/* Right column - Testimonials */}
          <div className="lg:col-span-8 relative">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentPage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {getCurrentTestimonials().map((testimonial) => (
                    <div 
                      key={testimonial.id} 
                      className="bg-black bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-2xl p-6 flex flex-col h-full border border-gray-800 shadow-xl transition-all duration-300 hover:translate-y-[-4px] hover:shadow-2xl"
                    >
                      <div 
                        className="w-16 h-16 rounded-full mb-6 flex items-center justify-center"
                        style={{ backgroundColor: testimonial.avatarColor }}
                      >
                        <span className="text-2xl font-bold text-black">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <p className="text-lg font-medium flex-grow">"{testimonial.quote}"</p>
                      <div className="mt-6 pt-4 border-t border-gray-700">
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-gray-400">{testimonial.title}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center mt-8 space-x-4">
              <button
                onClick={handlePrevious}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300"
                aria-label="Previous testimonials"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {/* Pagination Dots */}
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToPage(index)}
                    className={`transition-all duration-300 ${
                      index === currentPage 
                        ? 'w-8 bg-white' 
                        : 'w-2 bg-white bg-opacity-40 hover:bg-opacity-60'
                    } h-2 rounded-full`}
                    aria-label={`Go to page ${index + 1}`}
                    aria-current={index === currentPage ? 'true' : 'false'}
                  />
                ))}
              </div>
              
              <button
                onClick={handleNext}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300"
                aria-label="Next testimonials"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;