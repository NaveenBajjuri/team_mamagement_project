import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState(null);

  /* ⭐ KEEPING PDF STATE (but CEO won't use it now) */
  const [pdfViewer, setPdfViewer] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await api.get("/ceo/project-progress");
    setProjects(res.data);
  };

  const openDetails = async (id) => {
    const res = await api.get(`/ceo/project-details/${id}`);
    setDetails(res.data);
    setSelected(id);
  };

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Header */}
      <div className="group/header">
        <h2 className="text-xl font-semibold flex items-center gap-3">
          <span className="w-1.5 h-6 bg-[#6c5ce7] rounded-full group-hover/header:h-8 transition-all duration-300"></span>
          All Projects
        </h2>
        <p className="text-gray-400 text-sm group-hover/header:translate-x-4 transition-transform duration-300">
          Track and manage all ongoing projects
        </p>
      </div>

      {/* Projects Table */}
      <div className="bg-[#1f1b36] p-6 rounded-2xl hover:shadow-2xl hover:shadow-[#6c5ce7]/10 transition-all duration-500 border border-transparent hover:border-[#6c5ce7]/20 group/table relative overflow-hidden">

        <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] group-hover/table:w-full transition-all duration-700"></div>

        <div className="grid grid-cols-6 text-gray-400 text-sm mb-4 pb-2 border-b border-white/5 relative z-10">
          <p>Project</p>
          <p>Intern</p>
          <p>Team Lead</p>
          <p>Status</p>
          <p>Deadline</p>
          <p></p>
        </div>

        <div className="space-y-1 relative z-10">
          {projects.map((p, index) => (
            <div
              key={p.id}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="grid grid-cols-6 items-center py-3 border-b border-white/5 group/row hover:bg-white/5 hover:scale-[1.01] transition-all duration-300 hover:shadow-lg rounded-lg px-2 animate-slideIn"
            >
              <p className="font-semibold">{p.title}</p>
              <p>{p.intern}</p>
              <p>{p.teamlead}</p>

              <span className={`text-xs px-2 py-1 rounded-lg w-fit ${
                p.status === "Completed"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}>
                {p.status}
              </span>

              <p>{new Date(p.deadline).toLocaleDateString()}</p>

              <button
                onClick={() => openDetails(p.id)}
                className="text-sm text-[#8b7cf6] hover:underline"
              >
                View →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* DETAILS MODAL */}
      {selected && details && (
        <div
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 animate-fadeIn"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-[#1f1b36] w-[900px] p-6 rounded-2xl border border-white/5 animate-scaleIn relative overflow-hidden"
            onClick={e => e.stopPropagation()}
          >

            <div className="flex items-start justify-between mb-4 relative z-10">
              <div>
                <h3 className="text-xl font-semibold">
                  {details.project?.title}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  {details.project?.description}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="hover:bg-white/10 p-2 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* ✅ CEO SUMMARY VIEW (LOGIC CHANGED ONLY) */}
            <div className="space-y-3 pr-2">

              {(() => {
                const submissions = details.submissions || [];

                const total = submissions.length;
                const approved = submissions.filter(
                  s => s.status === "Approved"
                ).length;

                const rejected = submissions.filter(
                  s => s.status === "Rejected"
                ).length;

                const pending = submissions.filter(
                  s => s.status === "Pending"
                ).length;

                const progress =
                  total === 0
                    ? 0
                    : Math.round((approved / total) * 100);

                return (
                  <div className="bg-[#2c274b] p-4 rounded-xl border border-white/5 space-y-3">

                    <p><strong>Intern:</strong> {details.project?.intern}</p>
                    <p><strong>Team Lead:</strong> {details.project?.teamlead}</p>
                    <p><strong>Status:</strong> {details.project?.status}</p>
                    <p><strong>Deadline:</strong> {new Date(details.project?.deadline).toLocaleDateString()}</p>

                    <div className="border-t border-white/10 pt-3 space-y-1">
                      <p><strong>Total Submissions:</strong> {total}</p>
                      <p><strong>Approved:</strong> {approved}</p>
                      <p><strong>Rejected:</strong> {rejected}</p>
                      <p><strong>Pending:</strong> {pending}</p>
                      <p><strong>Completion:</strong> {progress}%</p>
                    </div>

                  </div>
                );
              })()}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}