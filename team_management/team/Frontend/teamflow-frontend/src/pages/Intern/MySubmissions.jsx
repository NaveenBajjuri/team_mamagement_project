import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Download, Eye, FileText, Filter, X, MessageCircle, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function MySubmissions() {
  const [subs, setSubs] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const [pdfViewer, setPdfViewer] = useState(null);

  const [viewFeedback, setViewFeedback] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/intern/my-submissions");
        setSubs(res.data || []);
      } catch (err) {
        console.error("Fetch submissions error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered =
    filter === "ALL"
      ? subs
      : subs.filter((s) => s.status === filter);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Approved':
        return <CheckCircle className="w-3.5 h-3.5" />;
      case 'Rejected':
        return <AlertCircle className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const getCountByStatus = (status) => {
    if (status === "ALL") return subs.length;
    return subs.filter(s => s.status === status).length;
  };

  /* ===============================
     PDF PREVIEW
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
      console.error("Preview failed:", err);
    }
  };

  /* ===============================
     PDF DOWNLOAD
  =============================== */
  const downloadPdf = async (file) => {
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
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = cleaned;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  if (loading) return null;

  return (
    <div className="space-y-8 p-2">
      {/* HEADER */}
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#8b7cf6]/5 rounded-full blur-3xl"></div>
        <div className="relative">
          <h1 className="text-3xl font-semibold flex items-center gap-3">
            <span className="w-1.5 h-8 bg-[#8b7cf6] rounded-full"></span>
            My Submissions
          </h1>
          <p className="text-gray-400 mt-2 ml-4 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Track and manage your submitted work
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3">
        <FilterBtn text="All" count={getCountByStatus("ALL")} active={filter==="ALL"} onClick={()=>setFilter("ALL")} />
        <FilterBtn text="Pending" count={getCountByStatus("Pending")} active={filter==="Pending"} onClick={()=>setFilter("Pending")} />
        <FilterBtn text="Approved" count={getCountByStatus("Approved")} active={filter==="Approved"} onClick={()=>setFilter("Approved")} />
        <FilterBtn text="Rejected" count={getCountByStatus("Rejected")} active={filter==="Rejected"} onClick={()=>setFilter("Rejected")} />
      </div>

      {/* TABLE */}
      <div className="bg-[#1f1b36] rounded-2xl border border-white/5 shadow-lg overflow-hidden">
        <div className="divide-y divide-white/5">
          {filtered.map((s) => {
            
            // 🔥 SAFE FEEDBACK FIELD SUPPORT
            const feedbackTextValue =
              s.feedback || s.review_comment || s.teamlead_feedback || "";

            return (
              <div key={s.id} className="group bg-[#2c274b] p-5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">

                  <div className="flex-1">
                    <p className="font-semibold">
                      {s.title || "Untitled Submission"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusTag status={s.status} icon={getStatusIcon(s.status)} />
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-2">

                    {s.pdf_url && (
                      <>
                        <button
                          onClick={() => previewPdf(s.pdf_url)}
                          className="p-2 bg-[#1f1b36] rounded-lg hover:bg-[#8b7cf6]/10 transition-all"
                        >
                          <Eye size={18} className="text-[#8b7cf6]" />
                        </button>

                        <button
                          onClick={() => downloadPdf(s.pdf_url)}
                          className="p-2 bg-[#1f1b36] rounded-lg hover:bg-[#8b7cf6]/10 transition-all"
                        >
                          <Download size={18} className="text-[#8b7cf6]" />
                        </button>
                      </>
                    )}

                    {feedbackTextValue && (
                      <button
                        onClick={() => {
                          setFeedbackMsg(feedbackTextValue);
                          setSelectedSubmission(s);
                          setViewFeedback(true);
                        }}
                        className="px-4 py-2 bg-[#8b7cf6]/20 rounded-lg"
                      >
                        Feedback
                      </button>
                    )}

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PDF MODAL */}
      {pdfViewer && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-[60]"
          onClick={() => setPdfViewer(null)}
        >
          <div
            className="bg-[#1f1b36] w-[85vw] h-[85vh] rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPdfViewer(null)}
              className="absolute top-3 right-3 bg-white/10 px-3 py-1 rounded-lg"
            >
              ✕
            </button>

            <iframe
              src={pdfViewer}
              className="w-full h-full"
              title="PDF Preview"
            />
          </div>
        </div>
      )}

      {/* FEEDBACK MODAL */}
      {viewFeedback && selectedSubmission && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1f1b36] rounded-2xl border border-white/5 w-full max-w-md shadow-2xl">
            <div className="p-6">
              <p className="text-gray-300 whitespace-pre-wrap">
                {feedbackMsg}
              </p>
              <button
                onClick={() => setViewFeedback(false)}
                className="w-full mt-4 px-4 py-3 bg-[#2c274b] rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* FILTER BUTTON */
function FilterBtn({ text, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl text-sm ${
        active
          ? "bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] text-white"
          : "bg-[#1f1b36] text-gray-400"
      }`}
    >
      {text} {count > 0 && `(${count})`}
    </button>
  );
}

/* STATUS TAG */
function StatusTag({ status, icon }) {
  const map = {
    Pending: "bg-yellow-500/20 text-yellow-400",
    Approved: "bg-green-500/20 text-green-400",
    Rejected: "bg-red-500/20 text-red-400"
  };

  return (
    <span className={`px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 ${map[status] || ""}`}>
      {icon}
      {status || "-"}
    </span>
  );
}