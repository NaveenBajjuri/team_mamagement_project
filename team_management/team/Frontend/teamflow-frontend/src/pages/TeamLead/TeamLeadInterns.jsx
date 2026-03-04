import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function TeamLeadInterns() {
  const [interns, setInterns] = useState([]);

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      const res = await api.get("/teamlead/my-interns");
      setInterns(res.data);
    } catch (err) {
      console.error("Failed to fetch interns", err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn p-6">

      <div>
        <h1 className="text-3xl font-bold">My Interns</h1>
        <p className="text-gray-400 mt-1">
          Interns assigned under you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interns.map((i) => (
          <div
            key={i.id}
            className="group bg-[#1f1b36] rounded-2xl p-6 border border-white/5 hover:border-[#6c5ce7]/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(108,92,231,0.15)] relative overflow-hidden"
          >

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#6c5ce7]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#6c5ce7]/10 to-transparent rounded-bl-[100px]"></div>

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6c5ce7] to-[#8b7cf0] flex items-center justify-center font-bold text-xl shadow-lg shadow-[#6c5ce7]/20 group-hover:shadow-[#6c5ce7]/40 transition-shadow duration-300 shrink-0">
                {i.name[0]}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">
                  {i.name}
                </h3>

                <p className="text-gray-400 text-sm bg-[#2c274b]/50 py-1.5 px-3 rounded-lg w-fit">
                  {i.email}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3 relative z-10">
              <div className="p-3 bg-[#2c274b]/30 rounded-xl border border-white/5">
                <p className="text-sm text-gray-300">
                  Current Projects:{" "}
                  <span className="text-white font-medium">
                    {i.project_count || 0}
                  </span>
                </p>
              </div>

              <div className="p-3 bg-[#2c274b]/30 rounded-xl border border-white/5">
                <p className="text-sm text-gray-300">
                  Joined:{" "}
                  <span className="text-white font-medium">
                    {new Date(i.created_at).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>

            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-[#6c5ce7]/20"></div>
          </div>
        ))}
      </div>
    </div>
  );
}