
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <div className="relative">
            <div className="flex justify-center">
              <div className="h-32 w-32 bg-medblue/5 rounded-full flex items-center justify-center">
                <div className="h-24 w-24 bg-medblue/10 rounded-full flex items-center justify-center">
                  <Search className="h-12 w-12 text-medblue" />
                </div>
              </div>
            </div>
            <h1 className="text-9xl font-bold text-medblue/20 absolute inset-0 flex items-center justify-center">
              404
            </h1>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" className="flex items-center" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>
          <Button className="bg-medblue hover:bg-medblue-dark flex items-center" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
