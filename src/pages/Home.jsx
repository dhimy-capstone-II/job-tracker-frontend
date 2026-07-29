import ApplicationCard from "../components/ApplicationCard.jsx";

function Home() {
  const applications = [
    {
      id: 1,
      company: "Example Company",
      position: "Frontend Developer",
      status: "Applied",
    },
    {
      id: 2,
      company: "Sample Company",
      position: "Software Engineer",
      status: "Interview",
    },
  ];

  return (
    <section>
      <h1>My Job Applications</h1>

      <div className="application-list">
        {applications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
          />
        ))}
      </div>
    </section>
  );
}

export default Home;