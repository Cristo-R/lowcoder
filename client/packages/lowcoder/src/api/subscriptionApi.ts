import Api from "api/api";
import axios, { AxiosInstance, AxiosRequestConfig, CancelToken } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState} from "react";
import { calculateFlowCode }  from "./apiUtils";
import { fetchOrgUsersAction } from "redux/reduxActions/orgActions";
import { getOrgUsers } from "redux/selectors/orgSelectors";
import { AppState } from "@lowcoder-ee/redux/reducers";
import type {
  LowcoderNewCustomer,
  LowcoderSearchCustomer,
  StripeCustomer,
} from "@lowcoder-ee/constants/subscriptionConstants";

export type ResponseType = {
  response: any;
};

// Axios Configuration
const lcHeaders = {
  "Lowcoder-Token": calculateFlowCode(),
  "Content-Type": "application/json"
};

let axiosIns: AxiosInstance | null = null;

const getAxiosInstance = (clientSecret?: string) => {
  if (axiosIns && !clientSecret) {
    return axiosIns;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const apiRequestConfig: AxiosRequestConfig = {
    baseURL: "https://api-service.lowcoder.cloud/api/flow",
    headers,
  };

  axiosIns = axios.create(apiRequestConfig);
  return axiosIns;
};

class SubscriptionApi extends Api {
  static async secureRequest(body: any): Promise<any> {
    let response;
    const axiosInstance = getAxiosInstance();

    // Create a cancel token and set timeout for cancellation
    const source = axios.CancelToken.source();
    const timeoutId = setTimeout(() => {
      source.cancel("Request timed out.");
    }, 5000);

    // Request configuration with cancel token
    const requestConfig: AxiosRequestConfig = {
      method: "POST",
      withCredentials: true,
      data: body,
      cancelToken: source.token, // Add cancel token
    };

    try {
      response = await axiosInstance.request(requestConfig);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.warn("Request cancelled due to timeout:", error.message);
        // Retry once after timeout cancellation
        try {
          // Reset the cancel token and retry
          const retrySource = axios.CancelToken.source();
          const retryTimeoutId = setTimeout(() => {
            retrySource.cancel("Retry request timed out.");
          }, 10000);

          response = await axiosInstance.request({
            ...requestConfig,
            cancelToken: retrySource.token,
          });

          clearTimeout(retryTimeoutId);
        } catch (retryError) {
          console.error("Retry failed:", retryError);
          throw retryError;
        }
      } else {
        console.error("Error at Secure Flow Request:", error);
        throw error;
      }
    } finally {
      clearTimeout(timeoutId); // Clear the initial timeout
    }

    return response;
  }
}

// API Functions

export const searchCustomer = async (subscriptionCustomer: LowcoderSearchCustomer) => {
  const apiBody = {
    path: "webhook/secure/search-customer",
    data: subscriptionCustomer,
    method: "post",
    headers: lcHeaders
  };
  try {
    const result = await SubscriptionApi.secureRequest(apiBody);
    return result?.data?.data?.length === 1 ? result.data.data[0] as StripeCustomer : null;
  } catch (error) {
    console.error("Error searching customer:", error);
    throw error;
  }
};

export const searchSubscriptions = async (customerId: string) => {
  const apiBody = {
    path: "webhook/secure/search-subscriptions",
    data: { customerId },
    method: "post",
    headers: lcHeaders
  };
  try {
    const result = await SubscriptionApi.secureRequest(apiBody);
    return result?.data?.data ?? [];
  } catch (error) {
    console.error("Error searching subscriptions:", error);
    throw error;
  }
};

export const searchCustomersSubscriptions = async (Customer: LowcoderSearchCustomer) => {
  const apiBody = {
    path: "webhook/secure/search-customersubscriptions",
    data: Customer,
    method: "post",
    headers: lcHeaders
  };
  try {
    const result = await SubscriptionApi.secureRequest(apiBody);

    if (result?.data?.data?.length > 0) {
      return result?.data?.data;
    }
    else if (result.data.success == "false" && result.data.reason == "customerNotFound") {
      return [];
    }
    else if (result.data.success == "false" && result.data.reason == "userSubscriptionNotFound") {
      return [];
    }
    else if (result.data.success == "false" && result.data.reason == "orgSubscriptionNotFound") {
      return [];
    }
    return [];
  } catch (error) {
    console.error("Error searching customer:", error);
    throw error;
  }
};

export const createCustomer = async (subscriptionCustomer: LowcoderNewCustomer) => {
  const apiBody = {
    path: "webhook/secure/create-customer",
    data: subscriptionCustomer,
    method: "post",
    headers: lcHeaders
  };
  try {
    const result = await SubscriptionApi.secureRequest(apiBody);
    return result?.data as StripeCustomer;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

export const getProduct = async (productId : string) => {
  const apiBody = {
    path: "webhook/secure/get-product",
    method: "post",
    data: {"productId" : productId},
    headers: lcHeaders
  };
  try {
    const result = await SubscriptionApi.secureRequest(apiBody);
    return result?.data as any;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const getProducts = async () => {
  const apiBody = {
    path: "webhook/secure/get-products",
    method: "post",
    data: {},
    headers: lcHeaders
  };
  try {
    const result = await SubscriptionApi.secureRequest(apiBody);
    return result?.data?.data as any[];
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const createCheckoutLink = async (customer: StripeCustomer, priceId: string, quantity: number, discount?: number) => {
  const domain = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
  
  const apiBody = {
    path: "webhook/secure/create-checkout-link",
    data: { 
      "customerId": customer.id, 
      "priceId": priceId, 
      "quantity": quantity, 
      "discount": discount, 
      baseUrl: domain 
    },
    method: "post",
    headers: lcHeaders
  };
  try {
    const result = await SubscriptionApi.secureRequest(apiBody);
    return result?.data ? { id: result.data.id, url: result.data.url } : null;
  } catch (error) {
    console.error("Error creating checkout link:", error);
    throw error;
  }
};

// Function to get subscription details from Stripe
export const getSubscriptionDetails = async (subscriptionId: string) => {
  const apiBody = {
    path: "webhook/secure/get-subscription-details",
    method: "post",
    data: { "subscriptionId": subscriptionId },
    headers: lcHeaders,
  };
  try {
    const result = await SubscriptionApi.secureRequest(apiBody);
    return result?.data;
  } catch (error) {
    console.error("Error fetching subscription details:", error);
    throw error;
  }
};

// Function to get invoice documents from Stripe
export const getInvoices = async (subscriptionId: string) => { 
  const apiBody = {
    path: "webhook/secure/get-subscription-invoices",
    method: "post",
    data: { "subscriptionId": subscriptionId },
    headers: lcHeaders,
  };
  try {
    const result = await SubscriptionApi.secureRequest(apiBody);
    return result?.data?.data ?? [];
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

// Function to get a customer Portal Session from Stripe
export const getCustomerPortalSession = async (customerId: string) => { 
  const apiBody = {
    path: "webhook/secure/create-customer-portal-session",
    method: "post",
    data: { "customerId": customerId },
    headers: lcHeaders,
  };
  try {
    const result = await SubscriptionApi.secureRequest(apiBody);
    return result?.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

// Hooks

export const useOrgUserCount = (orgId: string) => {
  const dispatch = useDispatch();
  const orgUsers = useSelector((state: AppState) => getOrgUsers(state)); // Use selector to get orgUsers from state
  const [userCount, setUserCount] = useState<number>(0);

  useEffect(() => {
    // Dispatch action to fetch organization users
    if (orgId) {
      dispatch(fetchOrgUsersAction(orgId));
    }
  }, [dispatch, orgId]);

  useEffect(() => {
    // Update user count when orgUsers state changes
    if (orgUsers && orgUsers.length > 0) {
      setUserCount(orgUsers.length);
    }
  }, [orgUsers]);

  return userCount;
};

export default SubscriptionApi;
