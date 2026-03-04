import { useState, useEffect } from "react";
import InternCard from "../../components/InternCard";
import InternDetailsModal from "../../components/InternDetailsModal";
import HrTeamLeads from "./HrTeamLeads"; // make sure this file is inside /hr folder
import api from "../../api/axios";

export default function ViewEmployees() {
  const [tab, setTab] = useState("INTERNS");
  const [interns, setInterns] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
  fetchInterns();
}, []);

const fetchInterns = async () => {
  try {
    const res = await api.get("/hr/interns");
    console.log("HR interns response:", res.data);  // 👈 ADD THIS
    setInterns(res.data);
  } catch (err) {
    console.error("Failed to fetch interns", err);
  }
};
  return (
    <div className="space-y-6 animate-fadeIn p-6">

      {/* Tabs */}
      <div className="flex gap-4">
        <button
          onClick={() => setTab("INTERNS")}
          className={`px-4 py-2 rounded-xl ${
            tab === "INTERNS"
              ? "bg-[#6c5ce7]"
              : "bg-[#1f1b36] hover:bg-[#2c274b]"
          }`}
        >
          Interns
        </button>

        <button
          onClick={() => setTab("TEAMLEADS")}
          className={`px-4 py-2 rounded-xl ${
            tab === "TEAMLEADS"
              ? "bg-[#6c5ce7]"
              : "bg-[#1f1b36] hover:bg-[#2c274b]"
          }`}
        >
          Team Leads
        </button>
      </div>

      {/* Interns */}
      {tab === "INTERNS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interns.map((i) => (
            <InternCard
              key={i.id}
              intern={i}
              onView={() => setSelected(i)}
            />
          ))}
        </div>
      )}

      {/* Team Leads */}
      {tab === "TEAMLEADS" && <HrTeamLeads />}

      {/* Modal */}
      <InternDetailsModal
        intern={selected}
        onClose={() => setSelected(null)}
        onDeleted={fetchInterns}
      />
    </div>
  );
}