import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { 
  UserPlus, 
  Calendar, 
  FileText, 
  AlignLeft, 
  CheckCircle,
  Users,
  ChevronRight,
  Sparkles,
  AlertCircle
} from "lucide-react";

export default function CreateProject() {
  const [interns, setInterns] = useState([]);
  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: ""
  });

  /* ⭐ NEW INLINE MESSAGE STATE */
  const [msg, setMsg] = useState("");
  const [type, setType] = useState(""); // success | error

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const res = await api.get("/teamlead/my-interns");
        setInterns(res.data);
      } catch (err) {
        toast.error("Intern fetch failed");
      }
    };
    fetchInterns();
  }, []);

  const handleSubmit = async () => {
    setMsg("");

    try {
      if (!form.title || !form.description || !form.deadline) {
        setType("error");
        setMsg("Please fill all fields");
        return toast.error("Fill all fields");
      }

      if (!selected) {
        setType("error");
        setMsg("Please select an intern");
        return toast.error("Select intern");
      }

      await api.post("/teamlead/create-project", {
        ...form,
        internId: selected
      });

      setType("success");
      setMsg("Project created successfully 🚀");

      toast.success("Project created successfully 🚀");

      setForm({ title: "", description: "", deadline: "" });
      setSelected(null);

    } catch (err) {
      setType("error");
      setMsg(err.response?.data?.message || "Project creation failed");
      toast.error(err.response?.data?.message || "Creation failed");
    }
  };

  return (
    <div className="p-2">
      {/* Header */}
      <div className="relative mb-8">
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#8b7cf6]/5 rounded-full blur-3xl"></div>
        <div className="relative">
          <h1 className="text-3xl font-semibold flex items-center gap-3">
            <span className="w-1.5 h-8 bg-[#8b7cf6] rounded-full"></span>
            Create New Project
          </h1>
          <p className="text-gray-400 mt-2 ml-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Assign and manage intern projects
          </p>
        </div>
      </div>

      {/* ⭐ INLINE MESSAGE */}
      {msg && (
        <div
          className={`mb-5 flex items-center gap-2 px-4 py-3 rounded-xl border
          ${
            type === "success"
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
        >
          {type === "success" ? (
            <CheckCircle size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          {msg}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT FORM */}
        <div className="lg:col-span-2">
          <div className="bg-[#1f1b36] rounded-2xl border border-white/5 shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 bg-[#1f1b36]/50 flex items-center gap-3">
              <div className="w-1 h-6 bg-[#8b7cf6] rounded-full"></div>
              <h2 className="text-lg font-semibold">Project Details</h2>
            </div>

            <div className="p-6 space-y-5">
              <Input
                icon={<FileText size={16} />}
                label="Project Name"
                value={form.title}
                onChange={(v) => setForm({ ...form, title: v })}
                placeholder="E.g., E-commerce Dashboard"
              />

              <Textarea
                icon={<AlignLeft size={16} />}
                label="Description"
                value={form.description}
                onChange={(v) => setForm({ ...form, description: v })}
              />

              <DateInput
                value={form.deadline}
                onChange={(v) => setForm({ ...form, deadline: v })}
              />

              <button
                onClick={handleSubmit}
                className="w-full py-4 mt-4 bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] 
                         rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-[1.02]
                         transition-all duration-300"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT INTERN LIST (UNCHANGED LOGIC) */}
        <div className="bg-[#1f1b36] rounded-2xl border border-white/5 p-4">
          {interns.map((i) => (
            <div
              key={i.id}
              onClick={() => setSelected(i.id)}
              className={`p-3 rounded-xl cursor-pointer mb-2 border ${
                selected === i.id
                  ? "border-[#6c5ce7] bg-[#6c5ce7]/10"
                  : "border-white/5"
              }`}
            >
              {i.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* INPUT */
function Input({ icon, label, value, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400 flex gap-2">{icon}{label}</label>
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#14112a] p-4 rounded-xl outline-none border border-white/5"
      />
    </div>
  );
}

/* TEXTAREA */
function Textarea({ icon, label, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400 flex gap-2">{icon}{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#14112a] p-4 rounded-xl outline-none border border-white/5 h-32"
      />
    </div>
  );
}

/* DATE */
function DateInput({ value, onChange }) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#14112a] p-4 rounded-xl outline-none border border-white/5"
    />
  );
}