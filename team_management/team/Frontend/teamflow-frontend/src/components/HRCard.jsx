import { Mail, Eye, ChevronRight, BadgeCheck } from "lucide-react";

export default function HRCard({ hr, onView }) {
  return (
    <div className="group bg-[#1f1b36] rounded-xl p-4 border border-white/5 hover:border-[#6c5ce7]/30 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(108,92,231,0.15)] relative overflow-hidden">
      
      {/* Animated gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#6c5ce7]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
      
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#6c5ce7]/10 to-transparent rounded-bl-[80px]"></div>

      {/* HR Avatar and Info */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6c5ce7] to-[#8b7cf0] flex items-center justify-center font-bold text-lg shadow-lg shadow-[#6c5ce7]/20 group-hover:shadow-[#6c5ce7]/40 transition-shadow duration-300">
          {hr.name[0]}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base mb-0.5 flex items-center gap-1.5">
            <span className="truncate">{hr.name}</span>
            <BadgeCheck size={14} className="text-[#6c5ce7] shrink-0" />
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-[#6c5ce7]/20 text-[#6c5ce7] border border-[#6c5ce7]/30 text-[10px]">
              HR
            </span>
          </h3>
          <p className="text-gray-400 text-xs flex items-center gap-1.5 bg-[#2c274b]/50 py-1 px-2.5 rounded-lg w-fit">
            <Mail size={10} className="text-[#6c5ce7] shrink-0" /> 
            <span className="truncate max-w-[200px]">{hr.email}</span>
          </p>
        </div>
      </div>

      {/* View Details Button */}
      <button
        onClick={() => onView(hr)}
        className="mt-3 w-full py-2 rounded-lg bg-[#2c274b] hover:bg-[#342f5a] transition-all duration-300 flex items-center justify-center gap-1.5 group/btn relative overflow-hidden border border-white/5 hover:border-[#6c5ce7]/30 text-sm"
      >
        <span className="relative z-10 flex items-center gap-1.5">
          <Eye size={14} className="group-hover/btn:scale-110 transition-transform" />
          View Details
          <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
          <span className="absolute inset-0 bg-gradient-to-r from-[#6c5ce7]/0 via-[#6c5ce7]/10 to-[#6c5ce7]/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></span>
        </span>
      </button>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-[#6c5ce7]/20"></div>
    </div>
  );
}