import JobList from "../components/JobList";
import { jobsQuery } from "../lib/graphql/queries";
import { useQuery } from "@apollo/client";

function useJobs() {
  const { data, loading, error } = useQuery(jobsQuery, {
    fetchPolicy: "network-only",
  });

  return {
    jobs: data?.jobs,
    loading,
    error: Boolean(error),
  };
}

function HomePage() {
  const { jobs, loading, error } = useJobs();

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error</p>;

  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
