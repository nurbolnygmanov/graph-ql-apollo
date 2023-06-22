import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getCompanyById } from "../lib/graphql/queries";
import JobList from "../components/JobList";

function CompanyPage() {
  const { companyId } = useParams();
  const [{ company, loading, error }, setState] = useState({
    company: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const company = await getCompanyById(companyId);
        setState({ company, loading: false, error: false });
      } catch (error) {
        setState({ company: null, loading: false, error: true });
      }
    })();
  }, [companyId]);

  if (loading) return <p>...loading company</p>;

  if (error) {
    return <h3 className="has-text-danger">Data unavailable</h3>;
  }

  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>

      <h2 className="title">Jobs at {company.name}</h2>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
