import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function GoogleAuthButton() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const configured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  if (!configured) {
    return (
      <button
        type="button"
        className="w-full h-11 rounded-md border border-border text-sm text-muted-foreground"
        onClick={() => toast.error("Add VITE_GOOGLE_CLIENT_ID to the frontend .env file")}
      >
        Continue with Google
      </button>
    );
  }

  return (
    <div className="flex justify-center">
      <GoogleLogin
        width="350"
        onSuccess={async ({ credential }) => {
          if (!credential) return toast.error("Google did not return a credential");
          try {
            const response = await authAPI.googleLogin(credential);
            login(response.data.user, response.data.token);
            toast.success("Signed in with Google");
            navigate("/dashboard");
          } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Google sign-in failed");
          }
        }}
        onError={() => toast.error("Google sign-in was cancelled or failed")}
      />
    </div>
  );
}
