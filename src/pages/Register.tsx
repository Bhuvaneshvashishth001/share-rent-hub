import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI, setAuthToken } from "@/lib/api";
import GoogleAuthButton from "@/components/GoogleAuthButton";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
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
    console.log("📝 [FORM SUBMIT] Registration data:", {
      name,
      email,
      password: password ? "***" : "empty",
      phone,
    });

    // Validation
    if (!name || !email || !password || !phone) {
      toast.error("Please fill in all fields");
      console.warn("⚠️ [VALIDATION] Missing required fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      console.warn("⚠️ [VALIDATION] Password too short");
      return;
    }

    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      console.warn("⚠️ [VALIDATION] Invalid phone number");
      return;
    }

    setIsLoading(true);

    try {
      // ✅ DEBUGGING: Log API call
      console.log("🚀 [API CALL] Calling /api/auth/register...");

      // ✅ FIX: Actually call the backend API
      const response = await authAPI.register({
        name,
        email,
        password,
        phone,
      });

      // ✅ DEBUGGING: Log API response
      console.log("✅ [API SUCCESS] Registration response:", response);

      if (response.success && response.data) {
        const { token, user } = response.data;

        // ✅ FIX: Save token and user data
        setAuthToken(token);
        login(user, token);

        // ✅ DEBUGGING: Log successful auth
        console.log("✅ [AUTH] User logged in after registration:", user);
        console.log("✅ [AUTH] Token saved:", token ? "YES" : "NO");

        toast.success("Account created successfully!");
        
        // ✅ DEBUGGING: Add delay before navigation to ensure state updates
        setTimeout(() => {
          console.log("🚀 [NAV] Navigating to dashboard...");
          navigate("/dashboard");
        }, 100);
      }
    } catch (error: any) {
      // ✅ DEBUGGING: Log error
      console.error("❌ [API ERROR] Registration failed:", error.message);
      
      const errorMessage =
        error.message || "Registration failed. Please try again.";
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
            <h1 className="text-2xl font-heading font-bold text-foreground">Create Account</h1>
            <p className="text-sm text-muted-foreground mt-1">Join RentHub and start sharing</p>
          </div>

          {/* Google Sign Up */}
          <div className="mb-4"><GoogleAuthButton /></div>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Full name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="pl-10"
                disabled={isLoading}
              />
            </div>
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
              <Input 
                type="tel" 
                placeholder="Phone number (10 digits)" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password (min 6 characters)"
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
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
