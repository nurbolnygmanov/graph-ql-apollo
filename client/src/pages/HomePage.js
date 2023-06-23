import { useState } from "react";
import JobList from "../components/JobList";
import { jobsQuery } from "../lib/graphql/queries";
import { useQuery } from "@apollo/client";
import PaginationBar from "../components/PaginationBar";

function useJobs(limit, offset) {
  const { data, loading, error } = useQuery(jobsQuery, {
    variables: {
      limit,
      offset,
    },
    fetchPolicy: "network-only",
  });

  return {
    jobs: data?.jobs,
    loading,
    error: Boolean(error),
  };
}

const JOBS_PER_PAGE = 15;

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { jobs, loading, error } = useJobs(
    JOBS_PER_PAGE,
    (currentPage - 1) * JOBS_PER_PAGE
  );

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error</p>;

  const totalPages = Math.ceil(jobs.totalCount / JOBS_PER_PAGE);

  return (
    <div>
      <h1 className="title">Job Board</h1>
      <div>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{`${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <JobList jobs={jobs.items} />
    </div>
  );
}

export default HomePage;
