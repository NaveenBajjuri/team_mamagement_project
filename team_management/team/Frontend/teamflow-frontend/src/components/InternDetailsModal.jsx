import { X, Trash2, User, Mail, Calendar, UserCog, AlertCircle } from "lucide-react";
import api from "../api/axios";
import { useState, useEffect } from "react";

export default function InternDetailsModal({ intern, onClose, onDeleted }) {
  const [teamLeads, setTeamLeads] = useState([]);
  const [selectedTL, setSelectedTL] = useState("");

  useEffect(() => {
    if (intern && intern.role !== "HR") {
      fetchTL();
    }
  }, [intern]);

  const fetchTL = async () => {
    const res = await api.get("/ceo/team-leads");
    setTeamLeads(res.data);
  };

  if (!intern) return null;

  const assign = async () => {
  try {
    const role = localStorage.getItem("role")?.toLowerCase();

    await api.put(`/${role}/assign-teamlead`, {
      internId: intern.id,
      teamLeadId: selectedTL,
    });

    onDeleted();
    onClose();
  } catch (err) {
    console.error("Failed to assign team lead", err);
  }
};

  const remove = async () => {
    if (intern.role === "HR") {
      await api.delete(`/ceo/remove-hr/${intern.id}`);
    } else {
      await api.delete(`/ceo/remove-employee/${intern.id}`);
    }
    onDeleted();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="bg-[#1f1b36] w-[450px] p-6 rounded-2xl border border-white/5 shadow-2xl hover:shadow-[0_20px_60px_rgba(108,92,231,0.2)] transition-all duration-300 relative overflow-hidden group"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#6c5ce7]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
        
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#6c5ce7]/10 to-transparent rounded-bl-[100px]"></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-4 relative z-10">
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Employee Details
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-[#2c274b] rounded-xl transition-all duration-300 hover:rotate-90"
          >
            <X size={18} className="text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Employee Avatar and Basic Info */}
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6c5ce7] to-[#8b7cf0] flex items-center justify-center font-bold text-xl shadow-lg shadow-[#6c5ce7]/30">
            {intern.name[0]}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {intern.name}
              {intern.role === "HR" && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#6c5ce7]/20 text-[#6c5ce7] border border-[#6c5ce7]/30">
                  HR
                </span>
              )}
            </h3>
            <p className="text-gray-400 text-sm flex items-center gap-2 mt-0.5">
              <Mail size={12} className="text-[#6c5ce7]" /> {intern.email}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
          <div className="p-3 bg-[#2c274b]/30 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <UserCog size={12} className="text-[#6c5ce7]" /> Role
            </div>
            <p className="font-medium text-sm">{intern.role || "Intern"}</p>
          </div>
          
          <div className="p-3 bg-[#2c274b]/30 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <Calendar size={12} className="text-[#6c5ce7]" /> Joined
            </div>
            <p className="font-medium text-sm">
              {intern.created_at
                ? new Date(intern.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Team Lead Info (if not HR) */}
        {intern.role !== "HR" && (
          <div className="mb-4 relative z-10">
            <div className="p-3 bg-[#2c274b]/30 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1.5">
                <User size={12} className="text-[#6c5ce7]" /> Current Team Lead
              </div>
              <p className="text-base font-medium flex items-center gap-2">
  {intern.teamlead ? (
    <>
      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
      {intern.teamlead}
    </>
  ) : (
    <span className="text-gray-400 text-sm flex items-center gap-1.5">
      <AlertCircle size={14} className="text-yellow-500" />
      Not Assigned
    </span>
  )}
</p>
            </div>
          </div>
        )}

        {/* Assign Section (if not HR) */}
        {intern.role !== "HR" && (
          <>
            <div className="relative z-10 mb-3">
              <label className="text-xs text-gray-400 mb-1.5 block">
                Select Team Lead to Assign
              </label>
              <select
                value={selectedTL}
                onChange={(e) => setSelectedTL(e.target.value)}
                className="w-full p-2.5 text-sm rounded-xl bg-[#2c274b] border border-white/5 focus:border-[#6c5ce7]/50 outline-none transition-all duration-300 cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%236c5ce7'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.2em 1.2em',
                  paddingRight: '2rem'
                }}
              >
                <option value="" className="bg-[#1f1b36]">Select Team Lead</option>
                {teamLeads.map((tl) => (
                  <option key={tl.id} value={tl.id} className="bg-[#1f1b36] py-1">
                    {tl.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 relative z-10">
              <button
                onClick={assign}
                disabled={!selectedTL}
                className={`flex-1 py-2.5 text-sm rounded-xl bg-[#6c5ce7] hover:bg-[#7b6ced] transition-all duration-300 flex items-center justify-center gap-2 font-medium ${
                  !selectedTL ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-[#6c5ce7]/30'
                }`}
              >
                Assign / Reassign
              </button>

              <button
                onClick={remove}
                className="flex-1 py-2.5 text-sm rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-300 flex items-center justify-center gap-2 border border-red-500/20 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10"
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </>
        )}

        {/* HR Remove Button */}
        {intern.role === "HR" && (
          <div className="relative z-10">
            <button
              onClick={remove}
              className="w-full py-2.5 text-sm rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-300 flex items-center justify-center gap-2 border border-red-500/20 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10"
            >
              <Trash2 size={14} /> Remove HR
            </button>
          </div>
        )}

        {/* Hover effect overlay */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-[#6c5ce7]/20"></div>
      </div>
    </div>
  );
}