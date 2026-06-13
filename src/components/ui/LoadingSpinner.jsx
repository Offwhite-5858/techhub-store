import { Package } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <Package size={40} className="text-brand-400 mx-auto mb-4 animate-pulse" />
        <p className="text-dark-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}