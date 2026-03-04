import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  const [teamLeads, setTeamLeads] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CEO",
    team_lead_id: ""
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeamLeads();
  }, []);

  const fetchTeamLeads = async () => {
    try {
      const res = await api.get("/superadmin/team-leads");
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

      await api.post("/users", payload);

      setMsg("Employee created successfully");

      setForm({
        name: "",
        email: "",
        password: "",
        role: "CEO",
        team_lead_id: ""
      });

    } catch (err) {
      setMsg(err.response?.data?.message || "Error creating employee");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a142f] to-[#2d2653] p-6 flex items-center justify-center">
      <div className="max-w-xl w-full animate-fadeIn">
        
        {/* Enhanced Header with Glassmorphism */}
        <div className="group/header mb-8">
          <div className="flex justify-between items-start">
            <div className="relative">
              {/* Animated background glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#6c5ce7]/20 to-[#8b7cf6]/20 rounded-lg blur-xl opacity-75 group-hover/header:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-gradient-to-b from-[#6c5ce7] to-[#8b7cf6] rounded-full group-hover/header:h-10 transition-all duration-300"></span>
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Super Admin
                  </span>
                </h1>
                <p className="text-gray-400 group-hover/header:translate-x-4 transition-transform duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#6c5ce7] rounded-full"></span>
                  Create all organization members
                </p>
              </div>
            </div>

            {/* Enhanced Logout Button */}
            <button
              onClick={logout}
              className="group/logout relative px-6 py-2.5 rounded-xl overflow-hidden transition-all duration-300"
            >
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 group-hover/logout:from-red-500/30 group-hover/logout:to-red-600/30 transition-all duration-300"></div>
              
              {/* Border with gradient */}
              <div className="absolute inset-0 border border-red-500/30 rounded-xl"></div>
              
              {/* Content */}
              <span className="relative flex items-center gap-2 text-red-400 group-hover/logout:text-red-300 transition-colors duration-300">
                <svg className="w-4 h-4 group-hover/logout:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </span>
            </button>
          </div>
        </div>

        {/* Enhanced Message Alert */}
        {msg && (
          <div className={`mb-6 p-4 rounded-xl animate-slideIn backdrop-blur-sm ${
            msg.includes("success")
              ? "bg-green-500/20 text-green-400 border border-green-500/30 shadow-lg shadow-green-500/10"
              : "bg-red-500/20 text-red-400 border border-red-500/30 shadow-lg shadow-red-500/10"
          }`}>
            <div className="flex items-center gap-3">
              {msg.includes("success") ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <p className="font-medium">{msg}</p>
            </div>
          </div>
        )}

        {/* Enhanced Form with Glassmorphism */}
        <form
          onSubmit={submit}
          className="relative bg-[#1f1b36]/90 backdrop-blur-sm p-8 rounded-2xl space-y-5 border border-white/5 hover:shadow-2xl hover:shadow-[#6c5ce7]/20 transition-all duration-500 hover:border-[#6c5ce7]/30 group/form overflow-hidden"
        >
          {/* Animated background lines */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#6c5ce7]/5 to-transparent -translate-x-full group-hover/form:translate-x-full transition-transform duration-1000"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#6c5ce7]/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#8b7cf6]/5 rounded-full blur-3xl -ml-20 -mb-20"></div>

          {/* Input Fields with enhanced styling */}
          <div className="space-y-4 relative z-10">
            {/* Name Input */}
            <div className="group/input">
              <label className="text-sm text-gray-400 mb-1 block group-focus-within/input:text-[#6c5ce7] transition-colors duration-300">
                Full Name
              </label>
              <div className="relative">
                <input
                  name="name"
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-[#2c274b] p-3 rounded-lg outline-none border border-white/5 focus:border-[#6c5ce7] focus:ring-2 focus:ring-[#6c5ce7]/20 transition-all duration-300 placeholder:text-gray-500"
                  required
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#6c5ce7]/0 to-[#8b7cf6]/0 group-focus-within/input:from-[#6c5ce7]/20 group-focus-within/input:to-[#8b7cf6]/20 -z-10 blur-xl transition-all duration-500"></div>
              </div>
            </div>

            {/* Email Input */}
            <div className="group/input">
              <label className="text-sm text-gray-400 mb-1 block group-focus-within/input:text-[#6c5ce7] transition-colors duration-300">
                Email Address
              </label>
              <div className="relative">
                <input
                  name="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-[#2c274b] p-3 rounded-lg outline-none border border-white/5 focus:border-[#6c5ce7] focus:ring-2 focus:ring-[#6c5ce7]/20 transition-all duration-300 placeholder:text-gray-500"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="group/input">
              <label className="text-sm text-gray-400 mb-1 block group-focus-within/input:text-[#6c5ce7] transition-colors duration-300">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type="password"
                  placeholder="Enter secure password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-[#2c274b] p-3 rounded-lg outline-none border border-white/5 focus:border-[#6c5ce7] focus:ring-2 focus:ring-[#6c5ce7]/20 transition-all duration-300 placeholder:text-gray-500"
                  required
                />
              </div>
            </div>

            {/* Role Dropdown */}
            <div className="group/select">
              <label className="text-sm text-gray-400 mb-1 block group-focus-within/select:text-[#6c5ce7] transition-colors duration-300">
                Select Role
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full bg-[#2c274b] p-3 rounded-lg outline-none border border-white/5 focus:border-[#6c5ce7] focus:ring-2 focus:ring-[#6c5ce7]/20 transition-all duration-300 appearance-none cursor-pointer"
                >
                  <option value="CEO" className="bg-[#2c274b]">CEO</option>
                  <option value="HR" className="bg-[#2c274b]">HR</option>
                  <option value="TEAM_LEAD" className="bg-[#2c274b]">Team Lead</option>
                  <option value="INTERN" className="bg-[#2c274b]">Intern</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Team Lead Select (Conditional) */}
            {form.role === "INTERN" && (
              <div className="group/select animate-slideDown">
                <label className="text-sm text-gray-400 mb-1 block group-focus-within/select:text-[#6c5ce7] transition-colors duration-300">
                  Assign Team Lead
                </label>
                <div className="relative">
                  <select
                    name="team_lead_id"
                    value={form.team_lead_id}
                    onChange={handleChange}
                    className="w-full bg-[#2c274b] p-3 rounded-lg outline-none border border-white/5 focus:border-[#6c5ce7] focus:ring-2 focus:ring-[#6c5ce7]/20 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#2c274b]">No team lead</option>
                    {teamLeads.map(t => (
                      <option key={t.id} value={t.id} className="bg-[#2c274b]">{t.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Submit Button */}
          <button
            disabled={loading}
            className="relative w-full group/btn mt-6"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] rounded-xl blur opacity-60 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] py-3.5 rounded-xl font-semibold text-white overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Employee...</span>
                </>
              ) : (
                <>
                  <span>Create Employee</span>
                  <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </div>
          </button>
        </form>
      </div>

      {/* Add these animations to your global CSS or tailwind config */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}