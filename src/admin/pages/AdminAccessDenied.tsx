import { Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminAccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-8 font-sans" style={{ backgroundColor: "#F5F0EA" }}>
      <div className="text-center max-w-md">
        <div className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "rgba(201,150,58,0.08)" }}>
          <Shield className="h-8 w-8" strokeWidth={1.5} style={{ color: "#C9963A" }} />
        </div>
        <h1 className="font-serif text-xl font-normal mb-2" style={{ color: "rgba(0,0,0,0.85)" }}>Access Denied</h1>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: "rgba(0,0,0,0.45)" }}>
          You don't have permission to access the Admin Studio. Contact your organization administrator for access.
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: "#1A1A1A", color: "#fff", borderRadius: 8 }}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Arena
        </button>
      </div>
    </div>
  );
}
