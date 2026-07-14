import Link from "next/link";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import type { DashboardMetric } from "./dashboard-types";

export default function DashboardMetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <Link href={metric.href} className={`dashboard-metric-card dashboard-tone-${metric.tone}`}>
      <div className="dashboard-metric-top">
        <span>{metric.label}</span>
        <span className="dashboard-metric-icon">{metric.icon}</span>
      </div>
      <strong>{metric.value}</strong>
      <div className="dashboard-metric-footer">
        <span>{metric.description}</span>
        <ArrowForwardRoundedIcon fontSize="small" />
      </div>
    </Link>
  );
}
