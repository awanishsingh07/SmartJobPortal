import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createJob,
  fetchAllJobs,
  fetchJobsByEmail,
  fetchJobById,
  updateJob,
  deleteJob,
} from "../services/jobApi";

// Mutation to handle job creation
export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs"]);
    },
  });
};

// Query to fetch all jobs
export const useFetchAllJobs = () =>
  useQuery({
    queryKey: ["jobs"],
    queryFn: fetchAllJobs,
  });

// Query to fetch jobs by email (user-specific jobs)
export const useFetchJobsByEmail = (email) =>
  useQuery({
    queryKey: ["jobs", email],
    queryFn: () => fetchJobsByEmail(email),
    enabled: !!email,
  });

// Query to fetch a single job by ID
export const useFetchJobById = (id) =>
  useQuery({
    queryKey: ["job", id],
    queryFn: () => fetchJobById(id),
    enabled: !!id,
  });

// Mutation to update a job
export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateJob,
    onMutate: async (updatedJobData) => {
      const previousJobData = queryClient.getQueryData([
        "job",
        updatedJobData.id,
      ]);

      // Optimistically update the cache with the updated job data
      queryClient.setQueryData(["job", updatedJobData.id], {
        ...previousJobData,
        ...updatedJobData,
      });

      return { previousJobData };
    },
    onError: (err, updatedJobData, context) => {
      queryClient.setQueryData(
        ["job", updatedJobData.id],
        context.previousJobData
      );
    },
    onSettled: (updatedJobData) => {
      queryClient.invalidateQueries(["job", updatedJobData.id]);
      queryClient.invalidateQueries(["jobs"]);
    },
  });
};

// Mutation to delete a job
export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs"]);
    },
  });
};
