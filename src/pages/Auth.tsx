import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, UserPlus } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
      else navigate("/admin");
    } else {
      const { error } = await signUp(email, password, displayName);
      if (error) setError(error.message);
      else {
        setError("");
        navigate("/admin");
      }
    }
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 pt-20">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-card">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary font-display text-xl font-bold text-primary-foreground">
            C
          </div>
          <h1 className="font-display text-2xl font-bold text-card-foreground">
            CITCS <span className="text-primary">Admin</span>
          </h1>
        </div>

        <div className="mb-6 flex rounded-xl bg-muted p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${isLogin ? "bg-card text-card-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            <LogIn size={14} className="mr-1.5 inline" /> Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${!isLogin ? "bg-card text-card-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            <UserPlus size={14} className="mr-1.5 inline" /> Sign Up
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required={!isLogin}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-ring"
                placeholder="Your name"
              />
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-ring"
              placeholder="admin@citcs.edu"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Auth;
