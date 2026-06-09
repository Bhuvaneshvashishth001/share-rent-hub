import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI, setAuthToken } from "@/lib/api";
import GoogleAuthButton from "@/components/GoogleAuthButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  /**
   * Handle form submission - Call backend API
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ DEBUGGING: Log form data
    console.log("📝 [FORM SUBMIT] Login attempt:", {
      email,
      password: password ? "***" : "empty",
    });

    // Validation
    if (!email || !password) {
      toast.error("Please fill in all fields");
      console.warn("⚠️ [VALIDATION] Missing required fields");
      return;
    }

    setIsLoading(true);

    try {
      // ✅ DEBUGGING: Log API call
      console.log("🚀 [API CALL] Calling /api/auth/login...");

      // ✅ FIX: Actually call the backend API
      const response = await authAPI.login({
        email,
        password,
      });

      // ✅ DEBUGGING: Log API response
      console.log("✅ [API SUCCESS] Login response:", response);

      if (response.success && response.data) {
        const { token, user } = response.data;

        // ✅ FIX: Save token and user data
        setAuthToken(token);
        login(user, token);

        // ✅ DEBUGGING: Log successful auth
        console.log("✅ [AUTH] User logged in:", user);

        toast.success("Logged in successfully!");
        
        // Navigate to dashboard after successful login
        navigate("/dashboard");
      }
    } catch (error: any) {
      // ✅ DEBUGGING: Log error
      console.error("❌ [API ERROR] Login failed:", error.message);
      
      const errorMessage =
        error.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-card p-8 rounded-xl border border-border shadow-sm">
          <div className="text-center mb-8">
            <span className="text-4xl mb-3 block">🏠</span>
            <h1 className="text-2xl font-heading font-bold text-foreground">Welcome Back</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your RentHub account</p>
          </div>

          {/* Google Sign In */}
          <div className="mb-4"><GoogleAuthButton /></div>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">or sign in with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="email" 
                placeholder="Email address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                disabled={isLoading}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="flex justify-end">
              <button 
                type="button" 
                className="text-xs text-primary hover:underline"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground text-center mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
