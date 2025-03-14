import Navbar from "./components/layout/navbar/navbar";
import About from "./pages/About";
import Integrations from "./pages/Integrations";
import FeaturesAutomation from "./pages/Features";
import Results from "./pages/Results";
import Testemunials from "./pages/Testemunials";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <About />
      <Integrations />
      <FeaturesAutomation />
      <Results />
      <Testemunials />
      
    </div>
  );
}

export default App;
