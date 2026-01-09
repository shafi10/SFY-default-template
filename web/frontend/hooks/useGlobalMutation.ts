import { useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { useMutation, useQueryClient, UseMutationResult } from "react-query";
import { useUI } from "../contexts/ui.context";

type CreatePayload = FormData | Record<string, any>;

interface UpdatePayload {
  url?: string;
  data?: FormData | Record<string, any>;
  [key: string]: any;
}

const useCreate = (
  apiEndpoint: string,
  apiKey: string
): UseMutationResult<any, unknown, CreatePayload> => {
  const fetch = useAuthenticatedFetch();
  const queryClient = useQueryClient();
  const { showToast } = useUI();

  async function createStatus(status: CreatePayload): Promise<any> {
    // Support dynamic URL override and optional data wrapper (mirrors useUpdate pattern)
    const targetUrl = (status as any)?.url || apiEndpoint;
    const bodyData = (status as any)?.data ?? status;
    const skipBody = Boolean((status as any)?.skipBody);

    // Allow body-less POST when skipBody is true or data is undefined
    const shouldSendBody = !skipBody && bodyData !== undefined && bodyData !== null;
    const isFormData = bodyData instanceof FormData;

    return await fetch(targetUrl, {
      method: "POST",
      ...(shouldSendBody
        ? {
            body: isFormData ? bodyData : JSON.stringify(bodyData),
            headers: isFormData
              ? undefined
              : {
                  "Content-Type": "application/json",
                },
          }
        : {}),
    });
  }

  return useMutation<any, unknown, CreatePayload>(
    (status) => createStatus(status),
    {
      onSuccess: async (data) => {
        if (data?.status === 400) {
          const error = await data?.json();
          return showToast(
            error?.error?.message || error?.errors || `Something went wrong`,
            { error: true }
          );
        }

        queryClient.invalidateQueries(apiKey);

        showToast(`Submit Successfully`);
      },
      onError: async (errors: any) => {
        const parsed = typeof errors?.json === "function" ? await errors.json().catch(() => ({})) : errors;
        return showToast(
          parsed?.error?.message || parsed?.message || `Something went wrong`,
          { error: true }
        );
      },
    }
  );
};

export const useDelete = (
  apiEndpoint: string,
  apiKey: string
): UseMutationResult<any, unknown, void> => {
  const fetch = useAuthenticatedFetch();
  const queryClient = useQueryClient();
  const { showToast } = useUI();

  async function deleteItem(): Promise<any> {
    return await fetch(apiEndpoint, {
      method: "DELETE",
    });
  }

  return useMutation<any, unknown, void>(() => deleteItem(), {
    onSuccess: async (data) => {
      if (data?.status === 400) {
        const error = await data.json();
        return showToast(
          error?.error?.message || error?.errors || `Something went wrong`,
          { error: true }
        );
      }

      queryClient.invalidateQueries(apiKey);

      showToast(`Deleted Successfully`);
    },
    onError: async (errors: any) => {
      const parsed = typeof errors?.json === "function" ? await errors.json().catch(() => ({})) : errors;
      return showToast(
        parsed?.error?.message || parsed?.message || `Something went wrong`,
        { error: true }
      );
    },
  });
};

export const useUpdate = (
  apiEndpoint: string,
  apiKey: string
): UseMutationResult<any, unknown, UpdatePayload> => {
  const fetch = useAuthenticatedFetch();
  const queryClient = useQueryClient();
  const { showToast } = useUI();

  async function updateStatus(payload: UpdatePayload): Promise<any> {
    const url = payload?.url || apiEndpoint;
    const body = payload?.data || payload;

    const isFormData = body instanceof FormData;

    return await fetch(url, {
      method: "PUT",
      body: isFormData ? body : JSON.stringify(body),
      headers: isFormData
        ? undefined
        : {
            "Content-Type": "application/json",
          },
    });
  }

  return useMutation<any, unknown, UpdatePayload>(
    (payload) => updateStatus(payload),
    {
      onSuccess: async (data) => {
        if (data?.status === 400) {
          const error = await data?.json();
          return showToast(
            error?.error?.message || error?.errors || `Something went wrong`,
            { error: true }
          );
        }

        queryClient.invalidateQueries(apiKey);

        showToast(`Updated Successfully`);
      },
      onError: async (errors: any) => {
        const parsed = typeof errors?.json === "function" ? await errors.json().catch(() => ({})) : errors;
        return showToast(
          parsed?.error?.message || parsed?.message || `Something went wrong`,
          { error: true }
        );
      },
    }
  );
};

export default useCreate;