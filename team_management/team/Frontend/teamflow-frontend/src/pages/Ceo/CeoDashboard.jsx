import { useEffect, useState } from "react";
import api from "../../api/axios";
import ProjectChart from "../../components/Charts/BarChart";
import PerformanceChart from "../../components/Charts/LineChart";
import { Users, FolderKanban, TrendingUp, Award } from "lucide-react";

export default function CeoDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/ceo/analytics-dashboard");
      setData(res.data);
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#6c5ce7] border-t-transparent"></div>
    </div>
  );

  /* ⭐ SAFE TOTALS MAPPING */
  const interns =
    data.totals?.interns ??
    data.totals?.totalinterns ??
    0;

  const projects =
    data.totals?.projects ??
    data.totals?.totalprojects ??
    0;

  const activeProjects =
    data.totals?.activeProjects ??
    data.totals?.activeprojects ??
    data.totals?.active ??
    0;

  const completionRate =
    data.progressTracking?.completionPercentage ??
    data.progressTracking?.completionpercentage ??
    0;

  const internGrowth = data.growth?.internGrowth ?? 0;
  const projectGrowth = data.growth?.projectGrowth ?? 0;
  const completionGrowth = data.growth?.completionGrowth ?? 0;

  const performanceTrend = data.submissionTrends?.daily?.map(d => ({
    month: new Date(d.day).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short"
    }),
    value: Number(d.total ?? d.count ?? 0)
  })) ?? [];

  const projectStatus = [
    {
      status: "Active",
      count:
        data.totals?.activeProjects ??
        data.totals?.activeprojects ??
        data.totals?.active ??
        0
    },
    {
      status: "Completed",
      count:
        data.totals?.completedProjects ??
        data.totals?.completedprojects ??
        0
    }
  ];

  /* ⭐ TEAM LEAD PERFORMANCE FIX */
  const teamLeadPerformance = data.teamPerformance?.map(tl => {
    const approved =
      Number(
        tl.approvedsubmissions ??
        tl.approvedSubmissions ??
        tl.approved ??
        0
      );

    const total =
      Number(
        tl.totalsubmissions ??
        tl.totalSubmissions ??
        tl.total ??
        0
      );

    return {
      name:
        tl.teamlead ??
        tl.teamLead ??
        tl.name ??
        "Team Lead",
      interns: Number(tl.interns ?? 0),
      projects: Number(tl.projects ?? 0),
      progress: total === 0 ? 0 : Math.round((approved / total) * 100)
    };
  }) ?? [];

  return (
    <div className="space-y-8 animate-fadeIn">

      <div className="grid grid-cols-4 gap-6">
        <Card icon={<Users />} title="Total Interns" value={interns} growth={`${internGrowth}%`} />
        <Card icon={<FolderKanban />} title="Active Projects" value={activeProjects} growth={`${projectGrowth}%`} />
        <Card icon={<TrendingUp />} title="Completion Rate" value={`${completionRate}%`} growth={`${completionGrowth}%`} />
        <Card icon={<Award />} title="Team Performance" value={`${data.progressTracking?.productivityScore ?? 0}/100`} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Team Performance Trend">
          <PerformanceChart data={performanceTrend} />
        </ChartCard>

        <ChartCard title="Project Progress Overview">
          <ProjectChart data={projectStatus} />
        </ChartCard>
      </div>

      <div className="bg-[#1f1b36] p-6 rounded-2xl border border-transparent hover:border-[#6c5ce7]/20 transition-all duration-500">
        <h3 className="mb-6 font-semibold flex items-center gap-2">
          <span className="w-1 h-6 bg-[#6c5ce7] rounded-full animate-pulse"></span>
          Team Leads Performance
        </h3>

        <div className="flex justify-between text-gray-400 text-sm mb-4 px-2 border-b border-white/5 pb-3">
          <p className="w-[200px]">Team Lead</p>
          <p className="w-[60px] text-center">Interns</p>
          <p className="w-[60px] text-center">Projects</p>
          <p className="w-[250px] text-center">Performance</p>
        </div>

        <div className="space-y-3">
          {teamLeadPerformance.map((tl, i) => (
            <div key={i} className="flex items-center justify-between hover:bg-white/5 p-3 rounded-xl transition-all duration-300">

              <div className="flex items-center gap-3 w-[200px]">
                <div className="w-10 h-10 rounded-full bg-[#6c5ce7] flex items-center justify-center font-bold">
                  {tl.name?.[0] ?? "T"}
                </div>
                <p>{tl.name}</p>
              </div>

              <p className="w-[60px] text-center">{tl.interns}</p>
              <p className="w-[60px] text-center">{tl.projects}</p>

              <div className="w-[250px]">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-[#6c5ce7] rounded-full"
                    style={{ width: `${tl.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">{tl.progress}%</p>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

/* CARD */
function Card({ icon, title, value, growth }) {
  const isPositive = Number(growth) >= 0;

  return (
    <div className="bg-[#1f1b36] p-6 rounded-2xl flex items-center gap-4 border border-transparent hover:border-[#6c5ce7]/20">
      <div className="bg-[#6c5ce7] p-3 rounded-xl">{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h2 className="text-xl font-bold">{value}</h2>

        {growth !== undefined && (
          <span className={`text-xs ${isPositive ? "text-green-400" : "text-red-400"}`}>
            {isPositive ? "+" : ""}{growth} vs last month
          </span>
        )}
      </div>
    </div>
  );
}

/* CHART CARD */
function ChartCard({ title, children }) {
  return (
    <div className="bg-[#1f1b36] p-6 rounded-2xl border border-transparent hover:border-[#6c5ce7]/20">
      <h3 className="mb-4 font-semibold flex items-center gap-2">
        <span className="w-1 h-5 bg-[#6c5ce7] rounded-full"></span>
        {title}
      </h3>
      {children}
    </div>
  );
}