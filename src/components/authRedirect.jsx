import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthRedirect = () => {
  const { currentUser, loadingInitial } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth check to finish first
    if (!loadingInitial && !currentUser) {
      navigate("/login"); // Or "/" depending on your app
    }
  }, [currentUser, loadingInitial, navigate]);

  return null; // This component does not render anything
};

export default AuthRedirect;
