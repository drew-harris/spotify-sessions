// utils/trpc.ts
import {
  createTRPCProxyClient,
  createTRPCReact,
  httpBatchLink,
} from "@trpc/react-query";
import type { AppRouter } from "trpc-server";
import superjson from "superjson";
import { useAuthStore } from "../stores/authStore";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export const trpc = createTRPCReact<AppRouter>();

export const vanilla = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: __DEV__
        ? "http://192.168.1.39:3000/api/trpc"
        : "https://spotify-sessions-next.vercel.app/api/trpc",
      headers() {
        return {
          auth: useAuthStore.getState().jwt || undefined,
        };
      },
    }),
  ],
  transformer: superjson,
});
