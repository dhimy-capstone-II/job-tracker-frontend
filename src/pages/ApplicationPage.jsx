import { Link, useParams } from "react-router-dom";

function ApplicationPage() {
  const { id } = useParams();

  return (
    <section>
      <h1>Application Details</h1>

      <p>Application ID: {id}</p>

      <Link to={`/applications/${id}/edit`}>
        Edit Application
      </Link>
    </section>
  );
}

export default ApplicationPage;