import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  User,
  Mail,
  BadgeCheck,
  Calendar,
  Edit2,
  Shield,
  Award,
  Sparkles,
  Clock
} from "lucide-react";

export default function TeamLeadProfile() {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const res = await api.get("/users/me");
    setUser(res.data);
    setEmail(res.data.email);
  };

  const updateEmail = async () => {
    try {
      await api.put("/auth/update-email", { email });
      setMsg("Email updated successfully");
      setEdit(false);
      fetchUser();
    } catch {
      setMsg("Email update failed");
    }
  };

  if (!user) return null;

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case "ceo":
        return <Shield className="w-4 h-4" />;
      case "team_lead":
        return <Award className="w-4 h-4" />;
      case "hr":
        return <Shield className="w-4 h-4" />;
      default:
        return <BadgeCheck className="w-4 h-4" />;
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "TL";
  };

  const getMemberSince = (date) => {
    const joined = new Date(date);
    const now = new Date();
    const years = now.getFullYear() - joined.getFullYear();
    return years > 0 ? `${years} year${years > 1 ? "s" : ""}` : "Less than a year";
  };

  return (
    <div className="max-w-[700px] mx-auto p-4">

      {/* HEADER */}
      <div className="relative mb-8">
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#8b7cf6]/5 rounded-full blur-3xl"></div>
        <div className="relative">
          <h2 className="text-3xl font-semibold flex items-center gap-3">
            <span className="w-1.5 h-8 bg-[#8b7cf6] rounded-full"></span>
            Profile Settings
          </h2>
          <p className="text-gray-400 mt-2 ml-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Manage your personal information and account settings
          </p>
        </div>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-[#1f1b36] rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 shadow-lg overflow-hidden">

        {/* AVATAR */}
        <div className="relative h-32 bg-gradient-to-r from-[#8b7cf6]/10 to-transparent">
          <div className="absolute -bottom-12 left-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-[#2c274b] border-4 border-[#1f1b36] flex items-center justify-center shadow-xl">
                <span className="text-3xl font-bold text-[#8b7cf6]">
                  {getInitials(user.name)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="pt-16 px-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <span className="px-2 py-0.5 bg-[#8b7cf6]/20 text-[#8b7cf6] rounded-full text-xs font-medium flex items-center gap-1">
              {getRoleIcon(user.role)}
              {user.role}
            </span>
          </div>

          <p className="text-gray-400 text-sm flex items-center gap-2">
            <Mail className="w-3.5 h-3.5" />
            {user.email}
          </p>

          <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Member for {getMemberSince(user.created_at)}
          </p>
        </div>

        {/* FIELDS */}
        <div className="p-6 space-y-4">
          <Field icon={<User />} label="Full Name" value={user.name} />

          {!edit ? (
            <Field icon={<Mail />} label="Email Address" value={user.email} />
          ) : (
            <div className="group bg-[#2c274b] p-5 rounded-xl border border-transparent hover:border-white/5">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Mail size={14} /> Email Address
              </div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1f1b36] p-2 rounded-lg outline-none"
              />
            </div>
          )}

          <Field icon={getRoleIcon(user.role)} label="Account Type" value={user.role} />
          <Field
            icon={<Calendar />}
            label="Member Since"
            value={new Date(user.created_at).toLocaleDateString("en-GB")}
          />
        </div>

        {msg && <p className="text-green-400 text-sm px-6 pb-2">{msg}</p>}

        {/* FOOTER */}
        <div className="px-6 py-4 bg-[#1f1b36]/50 border-t border-white/5 flex justify-end gap-3">
          <button
            onClick={() => setEdit(false)}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white bg-[#2c274b] hover:bg-[#322d52] rounded-xl border border-white/5"
          >
            Cancel
          </button>

          {!edit ? (
            <button
              onClick={() => setEdit(true)}
              className="px-4 py-2 text-sm bg-[#8b7cf6] text-white rounded-xl flex items-center gap-2"
            >
              <Edit2 size={14} />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={updateEmail}
              className="px-4 py-2 text-sm bg-[#8b7cf6] text-white rounded-xl"
            >
              Save Email
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, value }) {
  return (
    <div className="group bg-[#2c274b] p-5 rounded-xl border border-transparent hover:border-white/5">
      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-[#1f1b36] rounded-lg text-[#8b7cf6]">{icon}</div>
        <div className="flex-1">
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <p className="font-semibold text-lg">{value}</p>
        </div>
      </div>
    </div>
  );
}