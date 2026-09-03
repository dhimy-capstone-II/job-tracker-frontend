// src/pages/DashboardPage.jsx
// The analytics dashboard.
//
// All of the counting happens in PostgreSQL and arrives as one small
// summary object, so this page only has to display what it is given.
// It never loads the full list of applications.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import StatCard from "../components/StatCard.jsx";
import StatusChart from "../components/StatusChart.jsx";
import TimelineChart from "../components/TimelineChart.jsx";
import { getAnalyticsSummary } from "../api/analytics.js";

import "./DashboardPage.css";

// The ranges offered by the "applications over time" chart.
const RANGE_OPTIONS = [
  { value: 7, label: "Last 7 days" },
  { value: 30, label: "Last 30 days" },
  { value: 90, label: "Last 90 days" },
];

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Re-run whenever the selected range changes.
  useEffect(() => {
    // Tracks whether this effect is still the current one. Without it, a
    // slow response for "90 days" could arrive after a newer "7 days"
    // response and overwrite it.
    let isCurrent = true;

    async function loadSummary() {
      try {
        setLoading(true);
        setLoadError("");

        const data = await getAnalyticsSummary(days);

        if (isCurrent) {
          setSummary(data);
        }
      } catch (error) {
        if (isCurrent) {
          setLoadError(error.message);
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    loadSummary();

    return () => {
      isCurrent = false;
    };
  }, [days]);

  if (loading) {
    return (
      <section className="page-container">
        <h1>Dashboard</h1>
        <p>Loading your statistics...</p>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="page-container">
        <h1>Dashboard</h1>

        <p className="status-message status-message-error">
          Error: {loadError}
        </p>
      </section>
    );
  }

  // Nothing to chart yet. Showing empty charts would look broken, so give
  // the new user something to do instead.
  if (summary.totalApplications === 0) {
    return (
      <section className="page-container">
        <h1>Dashboard</h1>

        <p className="page-description">
          Track how your job search is going.
        </p>

        <p className="state">
          You have not added any applications yet.{" "}
          <Link to="/applications/new">Add your first one</Link> and your
          statistics will appear here.
        </p>
      </section>
    );
  }

  return (
    <section className="page-container">
      <h1>Dashboard</h1>

      <p className="page-description">
        A summary of your job search so far.
      </p>

      {/* ---------- headline numbers ---------- */}

      <div className="stat-grid">
        <StatCard
          label="Total applications"
          value={summary.totalApplications}
          hint={`${summary.submittedApplications} actually submitted`}
        />

        <StatCard
          label="Interviews"
          value={summary.interviewCount}
          hint={`${summary.interviewRate}% of submitted applications`}
        />

        <StatCard
          label="Offers"
          value={summary.offerCount}
          hint={`${summary.offerRate}% of submitted applications`}
        />

        <StatCard
          label="Still saved"
          value={summary.statusCounts.Saved}
          hint="Bookmarked, not applied to yet"
        />
      </div>

      {/* ---------- charts ---------- */}

      <div className="chart-card">
        <h2>Applications by status</h2>

        <p className="chart-note">
          Where every application currently sits.
        </p>

        <StatusChart statusCounts={summary.statusCounts} />
      </div>

      <div className="chart-card">
        <div className="chart-card-header">
          <div>
            <h2>Applications over time</h2>

            <p className="chart-note">
              How many you added on each day.
            </p>
          </div>

          <label className="range-control">
            <span>Range</span>

            <select
              value={days}
              onChange={(event) => setDays(Number(event.target.value))}
            >
              {RANGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <TimelineChart
          applicationsOverTime={summary.applicationsOverTime}
        />
      </div>

      {/* ---------- recent activity ---------- */}

      <div className="chart-card">
        <h2>Recent activity</h2>

        <ul className="recent-list">
          {summary.recentApplications.map((application) => (
            <li key={application.id} className="recent-item">
              <Link to={`/applications/${application.id}`}>
                <span className="recent-company">
                  {application.company}
                </span>

                <span className="recent-position">
                  {application.position}
                </span>
              </Link>

              <span
                className={`badge badge-${application.status.toLowerCase()}`}
              >
                {application.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* The rates are honest about what they can and cannot know. */}
      <p className="dashboard-footnote">
        Rates are measured against submitted applications, so saved
        bookmarks are not counted. Each application stores only its current
        status, so one that reached an interview and was later rejected now
        counts as rejected.
      </p>
    </section>
  );
}

export default DashboardPage;
