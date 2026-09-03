// src/components/StatCard.jsx
// One headline number on the dashboard.
//
// A single number does not need a chart, so this is plain text: a label,
// the value, and an optional line of supporting detail underneath.

import { motion } from "motion/react";

// Animation reference:
// https://motion.dev/docs/react

function StatCard({ label, value, hint }) {
  return (
    <motion.article
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <p className="stat-card-label">{label}</p>

      <p className="stat-card-value">{value}</p>

      {/* Only render the hint line when there is something to say. */}
      {hint && <p className="stat-card-hint">{hint}</p>}
    </motion.article>
  );
}

export default StatCard;
