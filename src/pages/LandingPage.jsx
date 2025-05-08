import bgImage from "../assets/insurance.jpg"; 
import LoginForm from "../components/LoginForm";

const LandingPage = () => {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center text-white overflow-hidden bg-black mt-4">
      {/* Dynamic Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transform animate-zoomPan"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      />
        {/* Main Content */}
        <div className="relative z-10 text-center max-w-3xl mt-8 bg-white bg-opacity-5 backdrop-blur-lg rounded-3xl shadow-lg w-auto h-auto flex flex-col items-center p-6">
        <LoginForm />
        </div>
    </div>
  );
};

export default LandingPage;