import {
  X,
  Trash2,
  Mail,
  Users,
  FolderKanban,
  UserCircle,
  ChevronDown
} from "lucide-react";
import api from "../api/axios";
import { useState } from "react";

export default function TeamLeadDetailsModal({
  tl,
  onClose,
  interns,
  onAssign,
  onDeleted,
  role = "CEO"
}) {
  const [internId, setInternId] = useState("");

  if (!tl) return null;

  /* 🔥 SAFE INTERN MATCHING (fix type mismatch issue) */
  const internsUnderTL = interns.filter(
    (i) => Number(i.team_lead_id) === Number(tl.id)
  );

  /* 🔥 ROLE BASED REMOVE */
  const removeTL = async () => {
    if (role !== "CEO") return;

    await api.delete(`/ceo/remove-teamlead/${tl.id}`);
    onDeleted();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="bg-[#1f1b36] w-[450px] p-5 rounded-xl border border-white/5 shadow-2xl relative overflow-hidden group"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 relative z-10">
          <h2 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Team Lead Details
          </h2>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#2c274b] rounded-lg transition-all duration-300"
          >
            <X size={16} />
          </button>
        </div>

        {/* TL Basic Info */}
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6c5ce7] to-[#8b7cf0] flex items-center justify-center font-bold text-xl shadow-lg shadow-[#6c5ce7]/30">
            {tl.name[0]}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <span className="truncate">{tl.name}</span>
              <UserCircle size={14} className="text-[#6c5ce7]" />
            </h3>

            <p className="text-gray-400 text-xs flex items-center gap-1.5 mt-0.5 bg-[#2c274b]/50 py-1 px-2.5 rounded-lg w-fit">
              <Mail size={10} className="text-[#6c5ce7]" />
              <span className="truncate max-w-[200px]">
                {tl.email || "No Email"}
              </span>
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-2 mb-4 relative z-10">
          <div className="p-2.5 bg-[#2c274b]/30 rounded-lg border border-white/5">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-gray-400 text-xs">Interns</span>
              <Users size={12} className="text-[#6c5ce7]" />
            </div>

            {/* 🔥 FIXED INTERN COUNT */}
            <p className="text-base font-bold">
              {internsUnderTL.length}
            </p>
          </div>

          <div className="p-2.5 bg-[#2c274b]/30 rounded-lg border border-white/5">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-gray-400 text-xs">Projects</span>
              <FolderKanban size={12} className="text-[#6c5ce7]" />
            </div>

            {/* Safe projects count */}
            <p className="text-base font-bold">
              {tl.projects ? Number(tl.projects) : 0}
            </p>
          </div>
        </div>

        {/* Interns Under TL */}
        <div className="relative z-10 mb-3">
          <label className="text-xs text-gray-400 mb-1 block">
            Interns under this Team Lead ({internsUnderTL.length})
          </label>

          <select
            className="w-full p-2 text-sm rounded-lg bg-[#2c274b] border border-white/5 outline-none"
          >
            <option value="">View assigned interns</option>

            {internsUnderTL.length > 0 ? (
              internsUnderTL.map((i) => (
                <option key={i.id} disabled>
                  {i.name}
                </option>
              ))
            ) : (
              <option disabled>No interns assigned</option>
            )}
          </select>
        </div>

        {/* Assign Intern */}
        <div className="relative z-10 mb-4">
          <label className="text-xs text-gray-400 mb-1 block">
            Select intern to assign
          </label>

          <select
            value={internId}
            onChange={(e) => setInternId(e.target.value)}
            className="w-full p-2 text-sm rounded-lg bg-[#2c274b] border border-white/5 outline-none"
          >
            <option value="">Select intern to assign</option>

            {interns.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 relative z-10">
          <button
            onClick={() => onAssign(internId)}
            disabled={!internId}
            className={`flex-1 py-2 text-sm rounded-lg bg-[#6c5ce7] hover:bg-[#7b6ced] transition-all duration-300 ${
              !internId ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Assign / Reassign
          </button>

          {/* 🔥 CEO Only Remove */}
          {role === "CEO" && (
            <button
              onClick={removeTL}
              className="flex-1 py-2 text-sm rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-300"
            >
              <Trash2 size={14} /> Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}