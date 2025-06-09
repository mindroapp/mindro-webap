
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-psycho-primary">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mt-4 mb-2">Page not found</h2>
        <p className="text-gray-500 mb-8">Sorry, we couldn't find the page you're looking for.</p>
        <Button onClick={() => navigate("/dashboard")} className="inline-flex items-center">
          <Home className="h-4 w-4 mr-2" />
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
