import Navbar from "./components/layout/navbar/navbar";
import Header from "./components/layout/header/Header";
import About from "./pages/About";
import Integrations from "./pages/Integrations";
import FeaturesAutomation from "./pages/Features";
import Results from "./pages/Results";
import UseCases from "./pages/UseCases";
import Footer from "./components/layout/footer/Footer";

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
