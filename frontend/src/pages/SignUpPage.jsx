import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import {
  MessageCircleIcon,
  LockIcon,
  MailIcon,
  UserIcon,
  LoaderIcon,
} from "lucide-react";
import { Link } from "react-router";

function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="w-full flex items-center justify-center p-4 bg-transparent transition-colors font-mono">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row glass-card h-full overflow-hidden">
            {/* FORM CLOUMN - LEFT SIDE */}
            <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-white/10">
              <div className="w-full max-w-md">
                {/* HEADING TEXT */}
                <div className="text-center mb-8">
                  <div className="flex flex-col items-center gap-2 group">
                    <div
                      className="size-12 rounded-none bg-primary/10 flex items-center justify-center 
                    group-hover:bg-primary/20 transition-colors border border-primary/20"
                    >
                      <MessageCircleIcon className="size-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold mt-2 text-white font-mono uppercase tracking-widest">Create Account</h1>
                    <p className="text-base-content/60 font-mono text-sm">Initialize new user protocol</p>
                  </div>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* FULL NAME */}
                  <div>
                    <label className="auth-input-label">Identity</label>
                    <div className="relative">
                      <UserIcon className="auth-input-icon" />
                      <input
                        type="text"
                        className="input input-hacker pl-10"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* EMAIL INPUT */}
                  <div>
                    <label className="auth-input-label">Comms ID</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />
                      <input
                        type="email"
                        className="input input-hacker pl-10"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* PASSWORD INPUT */}
                  <div>
                    <label className="auth-input-label">Access Key</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />
                      <input
                        type="password"
                        className="input input-hacker pl-10"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button type="submit" className="auth-btn" disabled={isSigningUp}>
                    {isSigningUp ? (
                      <LoaderIcon className="size-5 animate-spin mx-auto text-black" />
                    ) : (
                      "Initialize"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/login" className="auth-link">
                    Already operational? System Login
                  </Link>
                </div>
              </div>
            </div>

            {/* FORM ILLUSTRATION - RIGHT SIDE */}
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-base-300/40 to-transparent relative overflow-hidden">
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ff0008_1px,transparent_1px),linear-gradient(to_bottom,#00ff0008_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="relative z-10 text-center">
                <div className="mb-8 relative inline-block">
                   <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                   <MessageCircleIcon className="w-32 h-32 text-primary relative z-10 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary tracking-wider uppercase mb-4">
                    Join The Network
                  </h3>

                  <div className="mt-4 flex justify-center gap-4">
                    <span className="auth-badge">Free</span>
                    <span className="auth-badge">Secure</span>
                    <span className="auth-badge">Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}
export default SignUpPage;
