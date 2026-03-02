import { useEffect, useState } from "react";
import api from "../../api/axios";
import InternCard from "../../components/InternCard";
import CeoTeamLeads from "./CeoTeamLeads";
import InternDetailsModal from "../../components/InternDetailsModal";
import HRCard from "../../components/HRCard";

export default function ViewEmployees() {
  const [tab, setTab] = useState("INTERNS");
  const [interns, setInterns] = useState([]);
  const [hrs, setHrs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  /* ================= FETCH ALL ================= */
  const fetchAll = async () => {
    try {
      setLoading(true);

      const [internRes, hrRes] = await Promise.all([
        api.get("/ceo/interns"),
        api.get("/ceo/hrs")
      ]);

      const formattedInterns = internRes.data.map((i) => ({
        ...i,
        joined_date: i.joined_date || i.created_at || null,
        team_lead_name:
          i.team_lead_name ||
          i.teamlead_name ||
          i.team_lead ||
          i.team_lead_email ||
          "Not Assigned"
      }));

      setInterns(formattedInterns);
      setHrs(hrRes.data);
    } catch (err) {
      console.error("Error fetching CEO employees:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SAFE DATE ================= */
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-400">
        Loading Employees...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* ================= TABS ================= */}
      <div className="flex gap-4 flex-wrap">
        <button
          onClick={() => setTab("INTERNS")}
          className={`px-4 py-2 rounded-xl transition ${
            tab === "INTERNS"
              ? "bg-[#6c5ce7]"
              : "bg-[#1f1b36] hover:bg-[#2c274b]"
          }`}
        >
          Interns
        </button>

        <button
          onClick={() => setTab("TEAMLEADS")}
          className={`px-4 py-2 rounded-xl transition ${
            tab === "TEAMLEADS"
              ? "bg-[#6c5ce7]"
              : "bg-[#1f1b36] hover:bg-[#2c274b]"
          }`}
        >
          Team Leads
        </button>

        <button
          onClick={() => setTab("HRS")}
          className={`px-4 py-2 rounded-xl transition ${
            tab === "HRS"
              ? "bg-[#6c5ce7]"
              : "bg-[#1f1b36] hover:bg-[#2c274b]"
          }`}
        >
          HR
        </button>
      </div>

      {/* ================= INTERNS ================= */}
      {tab === "INTERNS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interns.map((i) => (
            <InternCard
              key={i.id}
              intern={i}
              onView={() =>
                setSelected({
                  ...i,
                  role: "INTERN",
                  joined_date: formatDate(i.joined_date),
                  team_lead_name: i.team_lead_name || "Not Assigned"
                })
              }
            />
          ))}
        </div>
      )}

      {/* ================= TEAM LEADS ================= */}
      {tab === "TEAMLEADS" && <CeoTeamLeads />}

      {/* ================= HRS ================= */}
      {tab === "HRS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hrs.map((h) => (
            <HRCard
              key={h.id}
              hr={h}
              onView={() =>
                setSelected({
                  ...h,
                  role: "HR",
                  joined_date: formatDate(h.joined_date || h.created_at)
                })
              }
            />
          ))}
        </div>
      )}

      {/* ================= MODAL ================= */}
      <InternDetailsModal
        intern={selected}
        onClose={() => setSelected(null)}
        onDeleted={fetchAll}
      />
    </div>
  );
}