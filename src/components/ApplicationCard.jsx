import { Link } from "react-router-dom";
import { motion } from "motion/react";

// Animation reference:
// https://motion.dev/docs/react

function ApplicationCard({ application }) {
  return (
    <motion.article
      className="application-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
    >
      <Link
        to={`/applications/${application.id}`}
        className="application-card-link"
      >
        <h2>{application.company}</h2>

        <p className="application-position">
          {application.position}
        </p>

        <span className="status-badge">
          {application.status}
        </span>
      </Link>
    </motion.article>
  );
}

export default ApplicationCard;