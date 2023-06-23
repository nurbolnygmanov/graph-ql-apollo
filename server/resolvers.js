import { GraphQLError } from "graphql";
import {
  countJobs,
  createJob,
  deleteJob,
  getJob,
  getJobs,
  getJobsByCompany,
  updateJob,
} from "./db/jobs.js";
import { getCompany } from "./db/companies.js";

export const resolvers = {
  Query: {
    jobs: async (_root, { limit, offset }) => {
      const items = await getJobs(limit, offset);
      const totalCount = await countJobs();

      return { items, totalCount };
    },
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if (!job) throw notFoundError("No job found with id " + id);

      return job;
    },
    company: async (_root, { id }) => {
      const company = await getCompany(id);
      if (!company) throw notFoundError("No company found with id " + id);

      return company;
    },
  },

  Mutation: {
    createJob: (_root, { input: { title, description } }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }

      return createJob({ companyId: user.companyId, title, description });
    },
    deleteJob: async (_root, { id }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }
      const job = await deleteJob(id, user.companyId);
      if (!job) throw notFoundError("No job found with id " + id);

      return job;
    },
    updateJob: (_root, { input: { id, title, description } }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing authentication");
      }

      const job = updateJob({ id, title, description }, user.companyId);
      if (!job) throw notFoundError("No job found with id " + id);

      return job;
    },
  },

  Job: {
    company: (job, _args, { companyLoader }) =>
      companyLoader.load(job.companyId),
    date: (job) => toIsoDate(job.createdAt),
  },

  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },
};

function notFoundError(message) {
  return new GraphQLError(message, {
    extensions: { code: "NOT_FOUND" },
  });
}

function unauthorizedError(message) {
  return new GraphQLError(message, {
    extensions: { code: "UNAUTHORIZED" },
  });
}

function toIsoDate(value) {
  return value.slice(0, "yyyy-mm-dd".length);
}

// const fullDate = "2023-01-30T11:00:00.000Z";
// const date = fullDate.slice(0, "yyyy-mm-dd".length);
// date = "2023-01-30"
