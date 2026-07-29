import { Link } from "react-router-dom";

function ApplicationCard({ application }) {
  return (
    <Link to={`/applications/${application.id}`} className="card">
      <h2 className="card-company">{application.company}</h2>
      <p className="card-position">{application.position}</p>

      <span className={`badge badge-${application.status.toLowerCase()}`}>
        {application.status}
      </span>

      <p className="card-meta">
        {application.location || "—"}
        {" · "}
        {application.dateApplied || "Not applied yet"}
      </p>
    </Link>
  );
}

export default ApplicationCard;