
import Navbar from "@/components/layout/navbar/navbar";
import Header from "@/components/layout/header/Header";
import About from "@/components/layout/about/About";
import Integrations from "@/components/layout/integrations/Integrations";
import FeaturesAutomation from "@/components/layout/features/Features";
import Results from "@/components/layout/results/Results";
import UseCases from "@/components/layout/usability/UseCases";
import Footer from "@/components/layout/footer/Footer";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Header />
      <About />
      <Integrations />
      <FeaturesAutomation />
      <Results />
      <UseCases />      
      <Footer />
    </div>
  );
}

export default App;

/*
import Dashboard from "./Dashboard/Dashboard";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Dashboard />
    </div>
  );
}

export default App;
*/