import { Link } from "react-router-dom";

function ApplicationCard({ application }) {
  return (
    // <article> is a semantic element.
    // It represents a self-contained piece of content.
    // A <div> would only be a generic container.
    <article className="application-card">
      <h2>{application.position}</h2>

      <p>{application.company}</p>

      <p>Status: {application.status}</p>

      <Link to={`/applications/${application.id}`}>
        View Application
      </Link>
    </article>
  );
}

export default ApplicationCard;