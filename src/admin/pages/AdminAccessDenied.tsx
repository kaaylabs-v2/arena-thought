import { Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminAccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-8 font-sans bg-background">
      <div className="text-center max-w-md">
        <div className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-accent/10">
          <Shield className="h-8 w-8 text-accent" strokeWidth={1.5} />
        </div>
        <h1 className="font-serif text-xl font-normal mb-2 text-foreground">Access Denied</h1>
        <p className="text-sm mb-6 leading-relaxed text-muted-foreground">
          You don't have permission to access the Admin Studio. Contact your organization administrator for access.
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors hover:opacity-90 bg-primary text-primary-foreground rounded-lg"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Arena
        </button>
      </div>
    </div>
  );
}
