import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  applyForJob,
  updateApplicationStatus,
  getAcceptedApplicantsByJobId,
  getAppliedJobsByApplicantEmail,
} from "../services/appliedJobApi";

export const useApplyForJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyForJob,
    onSuccess: () => {
      // Optionally invalidate the cache to refresh applied jobs data
      queryClient.invalidateQueries(["appliedJobs"]);
    },
  });
};

// Mutation for updating application status
export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateApplicationStatus,
    onSuccess: () => {
      // Optionally invalidate the cache to refresh applied jobs data
      queryClient.invalidateQueries(["appliedJobs"]);
    },
  });
};

// Query to get accepted applicants by jobId for HR
export const useGetAcceptedApplicantsByJobId = (jobId) =>
  useQuery({
    queryKey: ["acceptedApplicants", jobId],
    queryFn: () => getAcceptedApplicantsByJobId(jobId),
    enabled: !!jobId, // Only fetch when jobId is provided
  });

// Query to get applied jobs by applicant email
export const useGetAppliedJobsByApplicantEmail = (email) =>
  useQuery({
    queryKey: ["appliedJobs", email],
    queryFn: () => getAppliedJobsByApplicantEmail(email),
    enabled: !!email, // Only fetch when email is provided
  });
