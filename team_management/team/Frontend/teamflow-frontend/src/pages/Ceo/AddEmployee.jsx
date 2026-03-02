import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function AddEmployee() {
  const [teamLeads, setTeamLeads] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "INTERN",
    team_lead_id: ""
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeamLeads();
  }, []);

  const fetchTeamLeads = async () => {
    try {
      const res = await api.get("/ceo/team-leads");
      setTeamLeads(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMsg("");

      const payload = {
        ...form,
        team_lead_id:
          form.role === "INTERN" && form.team_lead_id
            ? form.team_lead_id
            : null
      };

      await api.post("/ceo/create-employee", payload);

      setMsg("Employee created successfully");

      setForm({
        name: "",
        email: "",
        password: "",
        role: "INTERN",
        team_lead_id: ""
      });

    } catch (err) {
      setMsg(err.response?.data?.message || "Error creating employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto animate-fadeIn">

      {/* ⭐ HEADER (UNCHANGED UI) */}
      <div className="group/header mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span className="w-1.5 h-8 bg-[#6c5ce7] rounded-full group-hover/header:h-10 transition-all duration-300"></span>
          Add Employee
        </h1>
        <p className="text-gray-400 group-hover/header:translate-x-4 transition-transform duration-300">
          Create new team members
        </p>
      </div>

      {/* ⭐ MESSAGE */}
      {msg && (
        <div className={`mb-4 p-4 rounded-xl animate-slideIn ${
          msg.includes("success")
            ? "bg-green-500/20 text-green-400 border border-green-500/30"
            : "bg-red-500/20 text-red-400 border border-red-500/30"
        }`}>
          <p>{msg}</p>
        </div>
      )}

      {/* ⭐ FORM (SAME HR DESIGN) */}
      <form
        onSubmit={submit}
        className="bg-[#1f1b36] p-6 rounded-2xl space-y-4 border border-white/5 hover:shadow-2xl hover:shadow-[#6c5ce7]/10 transition-all duration-500 hover:border-[#6c5ce7]/20 group/form relative overflow-hidden"
      >

        {/* ⭐ NAME */}
        <input
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          className="w-full bg-[#2c274b] p-3 rounded-lg outline-none"
          required
        />

        {/* ⭐ EMAIL */}
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full bg-[#2c274b] p-3 rounded-lg outline-none"
          required
        />

        {/* ⭐ PASSWORD */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full bg-[#2c274b] p-3 rounded-lg outline-none"
          required
        />

        {/* ⭐ ROLE DROPDOWN */}
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full bg-[#2c274b] p-3 rounded-lg outline-none"
        >
          <option value="INTERN">Intern</option>
          <option value="TEAM_LEAD">Team Lead</option>
          <option value="HR">HR</option>
        </select>

        {/* ⭐ TEAM LEAD OPTIONAL (ONLY FOR INTERN) */}
        {form.role === "INTERN" && (
          <select
            name="team_lead_id"
            value={form.team_lead_id}
            onChange={handleChange}
            className="w-full bg-[#2c274b] p-3 rounded-lg outline-none"
          >
            <option value="">No team lead</option>
            {teamLeads.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        )}

        {/* ⭐ BUTTON */}
        <button
          disabled={loading}
          className="relative w-full bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] py-3 rounded-xl font-semibold"
        >
          {loading ? "Creating..." : "Create Employee"}
        </button>

      </form>
    </div>
  );
}