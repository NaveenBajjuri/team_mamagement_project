import { useEffect, useState } from "react";
import { Mail, Users, Eye, UserCircle, ChevronRight } from "lucide-react";
import api from "../../api/axios";
import TeamLeadDetailsModal from "../../components/TeamLeadDetailsModal";

export default function CeoTeamLeads() {
  const [teamLeads, setTeamLeads] = useState([]);
  const [interns, setInterns] = useState([]);
  const [selectedTL, setSelectedTL] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [tlRes, internRes] = await Promise.all([
        api.get("/ceo/team-leads"),
        api.get("/ceo/interns")
      ]);

      setTeamLeads(tlRes.data);
      setInterns(internRes.data);
    } catch (err) {
      console.error("Error fetching CEO team leads:", err);
    } finally {
      setLoading(false);
    }
  };

  const assign = async (internId) => {
    try {
      await api.put("/ceo/assign-teamlead", {
        internId,
        teamLeadId: selectedTL.id
      });
      fetchData();
    } catch (err) {
      console.error("Assign failed:", err);
    }
  };

  const getAssignedCount = (tlId) => {
    return interns.filter(
      (intern) => intern.team_lead_id === tlId
    ).length;
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-400">
        Loading Team Leads...
      </div>
    );
  }

  return (
    <>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Team Leads
          </h1>
          <p className="text-gray-400 mt-2 flex items-center gap-2">
            <Users size={16} className="text-[#6c5ce7]" />
            Manage and view all team leads
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamLeads.map((tl) => {
            const assignedCount = getAssignedCount(tl.id);

            return (
              <div
                key={tl.id}
                className="group bg-[#1f1b36] rounded-2xl p-6 border border-white/5 hover:border-[#6c5ce7]/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(108,92,231,0.15)] relative overflow-hidden"
              >
                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#6c5ce7]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

                {/* Avatar + Info */}
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6c5ce7] to-[#8b7cf0] flex items-center justify-center font-bold text-2xl">
                    {tl.name?.[0]}
                  </div>

                  <div className="flex-1">
                    <h2 className="font-semibold text-lg mb-1 flex items-center gap-2">
                      {tl.name}
                      <UserCircle size={16} className="text-[#6c5ce7]" />
                    </h2>
                    <p className="text-gray-400 text-sm flex items-center gap-2 bg-[#2c274b]/50 py-1.5 px-3 rounded-lg w-fit">
                      <Mail size={12} className="text-[#6c5ce7]" />
                      <span>{tl.email}</span>
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-4 flex items-center gap-3 relative z-10">
                  <div className="flex-1 p-3 bg-[#2c274b]/30 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">
                        Assigned Interns
                      </span>
                      <Users size={14} className="text-[#6c5ce7]" />
                    </div>
                    <p className="text-2xl font-bold mt-1">
                      {assignedCount}
                    </p>
                  </div>

                  <div className="flex-1 p-3 bg-[#2c274b]/30 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">
                        Total Interns
                      </span>
                      <Users size={14} className="text-gray-400" />
                    </div>
                    <p className="text-2xl font-bold mt-1">
                      {interns.length}
                    </p>
                  </div>
                </div>

                {/* Button */}
                <button
                  onClick={() => setSelectedTL(tl)}
                  className="mt-4 w-full py-3 rounded-xl bg-[#2c274b] hover:bg-[#342f5a] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  View Details
                  <ChevronRight size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Empty */}
        {teamLeads.length === 0 && (
          <div className="text-center py-16">
            <Users size={32} className="mx-auto text-[#6c5ce7]/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No Team Leads Found
            </h3>
            <p className="text-gray-400">
              There are no team leads to display.
            </p>
          </div>
        )}
      </div>

      <TeamLeadDetailsModal
        tl={selectedTL}
        onClose={() => setSelectedTL(null)}
        interns={interns}
        onAssign={assign}
        onDeleted={fetchData}
      />
    </>
  );
}