import { Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminAccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 font-sans">
      <div className="text-center max-w-md">
        <div className="h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
          <Shield className="h-8 w-8 text-red-400" strokeWidth={1.5} />
        </div>
        <h1 className="text-xl font-semibold text-slate-900 mb-2">Access Denied</h1>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          You don't have permission to access the Admin Studio. Contact your organization administrator for access.
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Arena
        </button>
      </div>
    </div>
  );
}
