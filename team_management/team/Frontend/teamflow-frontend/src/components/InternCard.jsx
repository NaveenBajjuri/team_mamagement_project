import { Mail, User, CircleCheck, CircleAlert, Eye, BadgeCheck } from "lucide-react";

export default function InternCard({ intern, onView = () => {} }) {

  /* ⭐ FIXED ASSIGNED LOGIC (DO NOT TOUCH UI) */
  const assigned = intern.team_lead_id !== null || intern.teamlead;

  return (
    <div className="group bg-[#1f1b36] rounded-2xl p-6 border border-white/5 hover:border-[#6c5ce7]/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(108,92,231,0.15)] relative overflow-hidden">
      
      {/* Animated gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#6c5ce7]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
      
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#6c5ce7]/10 to-transparent rounded-bl-[100px]"></div>

      {/* ⭐ STATUS BADGE */}
      <div className="flex justify-end mb-2">
        <span
          className={`inline-flex text-xs px-4 py-1.5 rounded-full items-center gap-1.5 font-medium z-10 backdrop-blur-sm ${
            assigned
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}
        >
          {assigned ? <CircleCheck size={12} /> : <CircleAlert size={12} />}
          {assigned ? "Assigned" : "Unassigned"}
        </span>
      </div>

      <div className="flex items-center gap-4 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6c5ce7] to-[#8b7cf0] flex items-center justify-center font-bold text-xl shadow-lg shadow-[#6c5ce7]/20 group-hover:shadow-[#6c5ce7]/40 transition-shadow duration-300 shrink-0">
          {intern.name[0]}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1 flex items-center gap-2 flex-wrap">
            {intern.name}
            {assigned && <BadgeCheck size={16} className="text-[#6c5ce7]" />}
          </h3>
          <p className="text-gray-400 text-sm flex items-center gap-2 bg-[#2c274b]/50 py-1.5 px-3 rounded-lg w-fit">
            <Mail size={14} className="text-[#6c5ce7]" /> 
            <span>{intern.email}</span>
          </p>
        </div>
      </div>

      {/* ⭐ TEAM LEAD DISPLAY */}
      <div className="flex items-center gap-2 mt-4 p-3 bg-[#2c274b]/30 rounded-xl border border-white/5">
        <div className="p-1.5 bg-[#6c5ce7]/10 rounded-lg shrink-0">
          <User size={16} className="text-[#6c5ce7]" />
        </div>
        <p className="text-gray-300 text-sm">
          Team Lead: <span className="font-medium text-white">{intern.teamlead || "Not Assigned"}</span>
        </p>
      </div>

      <button
        onClick={() => onView(intern)}
        className="mt-4 w-full py-3 rounded-xl bg-[#2c274b] hover:bg-[#342f5a] transition-all duration-300 flex items-center justify-center gap-2 group/btn relative overflow-hidden border border-white/5 hover:border-[#6c5ce7]/30"
      >
        <span className="relative z-10 flex items-center gap-2">
          <Eye size={16} className="group-hover/btn:scale-110 transition-transform" />
          View Details
          <span className="absolute inset-0 bg-gradient-to-r from-[#6c5ce7]/0 via-[#6c5ce7]/10 to-[#6c5ce7]/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></span>
        </span>
      </button>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-[#6c5ce7]/20"></div>
    </div>
  );
}