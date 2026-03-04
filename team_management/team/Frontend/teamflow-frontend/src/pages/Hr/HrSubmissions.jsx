import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Eye, Download } from "lucide-react";

export default function HrSubmissions() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [pdfViewer, setPdfViewer] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get("/hr/submissions");
      setData(res.data);
    };
    fetch();
  }, []);

  const filtered = data.filter(i => {
    if (filter === "PENDING") return i.status === "Pending";
    if (filter === "APPROVED") return i.status === "Approved";
    if (filter === "REJECTED") return i.status === "Rejected";
    return true;
  });

  const format = (d) =>
    d ? new Date(d).toLocaleDateString("en-GB") : "—";

  const preview = async (file) => {
  if (!file || file === "null" || file === "undefined") return;

  try {
    const cleaned = file.replace(/^uploads\//, "");

    const response = await fetch(
      `http://localhost:5000/uploads/${cleaned}`
    );

    if (!response.ok) {
      console.error("Preview failed:", response.status);
      return;
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    setPdfViewer(blobUrl);

  } catch (err) {
    console.error("PDF preview failed:", err);
  }
};

const download = async (file) => {
  if (!file || file === "null" || file === "undefined") return;

  try {
    const cleaned = file.replace(/^uploads\//, "");

    const response = await fetch(
      `http://localhost:5000/uploads/${cleaned}`
    );

    if (!response.ok) {
      console.error("Download failed:", response.status);
      return;
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = cleaned;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);

  } catch (err) {
    console.error("Download failed:", err);
  }
};
  return (
    <div className="space-y-8 animate-fadeIn">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Submission Reports</h1>
          <p className="text-gray-400 mt-1">
            Final reviewed reports from team leads
          </p>
        </div>

        <div className="flex gap-3">
          <Btn
            t="All"
            a={filter === "ALL"}
            f={() => setFilter("ALL")}
            count={data.length}
          />
          <Btn
            t="Approved"
            a={filter === "APPROVED"}
            f={() => setFilter("APPROVED")}
            count={data.filter(i => i.status === "Approved").length}
          />
          <Btn
            t="Rejected"
            a={filter === "REJECTED"}
            f={() => setFilter("REJECTED")}
            count={data.filter(i => i.status === "Rejected").length}
          />
        </div>
      </div>

      {/* REPORT CARDS */}
      <div className="grid gap-6">
        {filtered.map((i) => (
          <div
            key={i.id}
            className="bg-[#1f1b36] rounded-2xl p-6 border border-white/5 hover:border-[#6c5ce7]/30 transition-all duration-300 shadow-md"
          >

            {/* TOP */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  Intern
                </p>
                <p className="text-lg font-semibold mt-1">
                  {i.intern_name}
                </p>
              </div>

              <span
                className={`px-4 py-1.5 rounded-full text-xs font-medium ${
                  i.status === "Approved"
                    ? "bg-green-500/15 text-green-400"
                    : i.status === "Rejected"
                    ? "bg-red-500/15 text-red-400"
                    : "bg-yellow-500/15 text-yellow-400"
                }`}
              >
                {i.status}
              </span>
            </div>

            {/* PROJECT TITLE */}
            <div className="mb-5">
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Project
              </p>
              <p className="text-lg font-semibold mt-2">
                {i.project}
              </p>
            </div>

            {/* ✅ IMPROVED PROJECT DESCRIPTION SECTION */}
            {i.description && (
              <div className="mb-6">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                  Project Description
                </p>
                <div className="bg-[#2c274b]/40 border border-white/5 p-4 rounded-xl">
                  <p className="text-sm leading-relaxed text-gray-300">
                    {i.description}
                  </p>
                </div>
              </div>
            )}

            {/* META INFO */}
            <div className="grid grid-cols-2 gap-6 text-sm mb-6">
              <div>
                <p className="text-gray-400">Team Lead</p>
                <p className="mt-1">{i.team_lead_name || "—"}</p>
              </div>

              <div>
                <p className="text-gray-400">Submitted On</p>
                <p className="mt-1">{format(i.submitted_at)}</p>
              </div>
            </div>

            {/* FEEDBACK */}
            {(i.feedback || i.teamlead_feedback || i.review_comment) && (
              <div className="bg-[#2c274b]/50 border border-white/5 p-4 rounded-xl mb-6">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                  Team Lead Feedback
                </p>
                <p className="text-sm leading-relaxed text-gray-200">
                  {i.feedback || i.teamlead_feedback || i.review_comment}
                </p>
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex gap-6 pt-3 border-t border-white/5">
              <button
                onClick={() => preview(i.pdf_url)}
                className="flex items-center gap-2 text-[#8b7cf6] text-sm hover:text-white transition-colors"
              >
                <Eye size={16} /> Preview
              </button>

              <button
                onClick={() => download(i.pdf_url)}
                className="flex items-center gap-2 text-[#8b7cf6] text-sm hover:text-white transition-colors"
              >
                <Download size={16} /> Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PDF MODAL */}
      {pdfViewer && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-[60]"
          onClick={() => setPdfViewer(null)}
        >
          <div
            className="bg-[#1f1b36] w-[85vw] h-[85vh] rounded-2xl overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={pdfViewer}
              className="w-full h-full"
              title="PDF Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Btn({ t, a, f, count }) {
  return (
    <button
      onClick={f}
      className={`px-4 py-2 rounded-xl text-sm transition-all ${
        a
          ? "bg-[#6c5ce7] text-white"
          : "bg-[#1f1b36] hover:bg-[#2c274b]"
      }`}
    >
      {t} ({count})
    </button>
  );
}