// src/components/TimelineChart.jsx
// How many applications were added on each day of the selected range.
//
// The backend already fills in the days with no activity as zero, so this
// chart shows a continuous line instead of jumping between the busy days
// and pretending the quiet ones did not happen.
//
// Recharts reference: https://recharts.org/en-US/api

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Turn "2026-08-04" into "Aug 4".
//
// The string is split by hand instead of using new Date(). Passing a plain
// "YYYY-MM-DD" string to new Date() is read as UTC midnight, which can show
// the day before once the browser converts it to local time.
function formatDayLabel(isoDate) {
  const [, month, day] = isoDate.split("-");

  return `${MONTH_NAMES[Number(month) - 1]} ${Number(day)}`;
}

const AXIS_STYLE = {
  fill: "#64748b",
  fontSize: 13,
};

function TimelineChart({ applicationsOverTime }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={applicationsOverTime}
        margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
      >
        <CartesianGrid
          vertical={false}
          stroke="#e2e8f0"
          strokeDasharray="3 3"
        />

        <XAxis
          dataKey="date"
          tickFormatter={formatDayLabel}
          // Drop labels automatically when they would overlap, instead of
          // cramming 30 dates onto a narrow screen.
          minTickGap={28}
          tick={AXIS_STYLE}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          allowDecimals={false}
          width={36}
          tick={AXIS_STYLE}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          contentStyle={{
            border: "1px solid var(--border)",
            borderRadius: "10px",
            fontSize: "0.9rem",
          }}
          labelFormatter={formatDayLabel}
          formatter={(value) => [value, "Applications"]}
        />

        <Area
          type="monotone"
          dataKey="count"
          stroke="var(--accent)"
          strokeWidth={2}
          fill="var(--accent)"
          fillOpacity={0.14}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default TimelineChart;
