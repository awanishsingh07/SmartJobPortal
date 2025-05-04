// src/hooks/useAuth.js

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  signUpUser,
  signInUser,
  fetchUser,
  updateUser,
  deleteUser,
  refreshJwtToken,
} from "../services/authApi";

// Mutation to handle sign-up
export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signUpUser,
    onSuccess: (data) => {

      localStorage.setItem("userEmail", data.username);
      localStorage.setItem("accessToken", data.jwtToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      // Invalidate the user data query to fetch fresh data after sign-up
      queryClient.invalidateQueries(["user"]);
    },
    onError: (error) => {
      // Error actions
      console.error("Sign-in error:", error);
    },
  });
};

// Mutation to handle sign-in
export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signInUser,
    onSuccess: (data) => {
      localStorage.setItem("userEmail", data.username);
      localStorage.setItem("accessToken", data.jwtToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      // Optionally, cache the response data if needed
      queryClient.setQueryData(["user", data.username], data);
    },
    onError: (error) => {
      // Error actions
      console.error("Sign-in error:", error);
    },
  });
};

// Mutation to handle refreshing JWT token
export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refreshJwtToken,
    onSuccess: (data) => {
      // Optionally, you can cache new JWT token data
      queryClient.setQueryData(["data", data]);
    },
  });
};

// Query to fetch user data
export const useFetchUser = (email) =>
  useQuery({
    queryKey: ["user", email],
    queryFn: () => fetchUser(email),
    enabled: !!email,
    staleTime: Infinity,
    retry: 1,
  });

// Mutation to update user data
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onMutate: async (updatedUserData) => {
      const previousUserData = queryClient.getQueryData([
        "user",
        updatedUserData.email,
      ]);

      // Optimistically update the cache with updated user data
      queryClient.setQueryData(["user", updatedUserData.email], {
        ...previousUserData,
        ...updatedUserData,
      });

      // Return context to rollback if needed
      return { previousUserData };
    },
    onError: (err, updatedUserData, context) => {
      // Rollback in case of error
      queryClient.setQueryData(
        ["user", updatedUserData.email],
        context.previousUserData
      );
    },
    onSettled: (updatedUserData) => {
      // Invalidate the cache for the user after update
      queryClient.invalidateQueries(["user", updatedUserData.email]);
    },
  });
};

// Mutation to delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      // Invalidate queries related to user data after deletion
      queryClient.invalidateQueries(["user"]);
    },
  });
};
