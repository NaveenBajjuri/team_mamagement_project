import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState(null);

  /* ⭐ NEW STATE FOR PDF MODAL */
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

  /* ===============================
     ✅ SECURE BLOB-BASED PREVIEW
     (ONLY CHANGE MADE HERE)
  =============================== */
  const previewPdf = async (file) => {
    if (!file) return;

    try {
      const cleaned = file.replace(/^uploads\//, "");
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/uploads/${cleaned}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      setPdfViewer(blobUrl);

    } catch (err) {
      console.error("PDF preview failed:", err);
    }
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

            <div className="space-y-3 pr-2">
              {details.submissions?.length === 0 && (
                <p className="text-gray-400">No submissions yet</p>
              )}

              {details.submissions?.map((s) => (
                <div
                  key={s.id}
                  className="bg-[#2c274b] p-4 rounded-xl border border-white/5 space-y-2"
                >
                  <div className="flex justify-between">
                    <p className="font-semibold">{s.title}</p>

                    <span className={`text-xs px-2 py-1 rounded-lg ${
                      s.status === "Approved"
                        ? "bg-green-500/20 text-green-400"
                        : s.status === "Rejected"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {s.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400">
                    Submitted: {new Date(s.submitted_at).toLocaleDateString()}
                  </p>

                  {s.feedback && (
                    <p className="text-xs text-gray-300 bg-black/20 p-2 rounded-lg">
                      Feedback: {s.feedback}
                    </p>
                  )}

                  {/* ⭐ ONLY PDF PART CHANGED */}
                  {s.pdf_url && (
                    <button
                      onClick={() => previewPdf(s.pdf_url)}
                      className="text-xs text-[#8b7cf6] hover:underline inline-flex items-center gap-1"
                    >
                      📄 View PDF →
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ⭐ PDF MODAL */}
      {pdfViewer && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-[60] animate-fadeIn"
          onClick={() => setPdfViewer(null)}
        >
          <div
            className="bg-[#1f1b36] w-[80vw] h-[85vh] rounded-2xl overflow-hidden relative border border-white/10 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPdfViewer(null)}
              className="absolute top-3 right-3 z-10 bg-white/10 px-3 py-1 rounded-lg hover:bg-white/20"
            >
              ✕
            </button>

            <iframe
              src={pdfViewer}
              title="PDF Viewer"
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}