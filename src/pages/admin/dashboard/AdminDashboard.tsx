import { AxiosAdmin } from "@/config/axios";
import { Boxes, KeyRound, Users, Waypoints } from "lucide-react";
import { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminStatCard from "../components/AdminStatCard";

const AdminDashboard = () => {

    const [stats , setStats] =useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await AxiosAdmin.get("/dashboard/");
                if (data) {
                    console.log("Dashboard data", data.data);
                    setStats(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            }
        };

        fetchStats();
    }, []);


  return (
    <div className="min-w-0">
      <AdminHeader title="Dashboard" subtitle="Overview of platform statistics" />

      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <AdminStatCard
            icon={<Boxes className="h-5 w-5" />}
            title="Total Question"
            value={stats ? stats.total_questions: ""}
          />
          <AdminStatCard
            icon={<Users className="h-5 w-5" />}
            title="Active Users"
            value={stats ? stats.total_users : ""}
          />
          <AdminStatCard
            icon={<KeyRound className="h-5 w-5" />}
            title="Active Tokens"
            value={stats ? stats.total_access_tokens: ""}
          />
          <AdminStatCard
            icon={<Waypoints className="h-5 w-5" />}
            title="Content Group"
            value={stats ? stats.total_groups : ""}
          />
        </div>

        {/* <div className="mt-10 grid grid-cols-2 gap-10 lg:grid-cols-4">
          <AdminDonut label="Groups count" progress={68} />
          <AdminDonut label="Subjects count" progress={62} />
          <AdminDonut label="Categories count" progress={70} />
          <AdminDonut label="Sub-categories count" progress={58} />
        </div> */}
      </div>
    </div>
  );
};

export default AdminDashboard;
