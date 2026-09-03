// src/components/StatusChart.jsx
// How many applications sit in each status.
//
// This is a horizontal bar chart, not a pie chart. Bars let you compare
// exact lengths and leave room for the full status name next to each one,
// which a pie cannot do without a colour key.
//
// Every bar uses the same colour on purpose. The status name is already
// written beside each bar, so colouring them differently would repeat
// information the reader already has — and six colours that everyone can
// tell apart, including colour-blind readers, is genuinely hard to do.
//
// Recharts reference: https://recharts.org/en-US/api

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// The order the stages actually happen in, so the chart reads top to bottom
// like the job search itself.
const STATUS_ORDER = [
  "Saved",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
  "Closed",
];

// Shared look for the small grey text on the axes.
const AXIS_STYLE = {
  fill: "#64748b",
  fontSize: 13,
};

function StatusChart({ statusCounts }) {
  // Recharts needs an array of objects, but the API sends one object
  // keyed by status. Convert it, keeping the pipeline order above.
  const data = STATUS_ORDER.map((status) => ({
    status,
    count: statusCounts[status] || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 32, bottom: 8, left: 8 }}
      >
        {/* Faint vertical guides only. Horizontal ones would just
            underline the labels and add noise. */}
        <CartesianGrid
          horizontal={false}
          stroke="#e2e8f0"
          strokeDasharray="3 3"
        />

        <XAxis
          type="number"
          allowDecimals={false}
          tick={AXIS_STYLE}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          type="category"
          dataKey="status"
          width={86}
          tick={AXIS_STYLE}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          cursor={{ fill: "rgba(105, 87, 229, 0.07)" }}
          contentStyle={{
            border: "1px solid var(--border)",
            borderRadius: "10px",
            fontSize: "0.9rem",
          }}
          formatter={(value) => [value, "Applications"]}
        />

        <Bar
          dataKey="count"
          fill="var(--accent)"
          barSize={18}
          radius={[0, 4, 4, 0]}
        >
          {/* Print the number at the end of each bar so the reader never
              has to measure a bar against the axis. */}
          <LabelList
            dataKey="count"
            position="right"
            fill="#475569"
            fontSize={13}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default StatusChart;
