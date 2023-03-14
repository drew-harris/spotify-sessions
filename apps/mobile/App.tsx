import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useEffect, useState } from "react";
import superjson from "superjson";
import LogIn from "./src/screens/LogIn";
import SessionsPage from "./src/screens/Sessions";
import SplashScreen from "./src/screens/Splash";
import { useAuthStore } from "./src/stores/authStore";
import { trpc } from "./src/utils/trpc";

export type RootStackParamList = {
  "Log In": undefined;
  Sessions: undefined;
  Splash: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const initializeAuth = useAuthStore((s) => s.initialize);
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    trpc.createClient({
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
    })
  );

  useEffect(() => {
    initializeAuth();
  }, []);

  const isAuthed = useAuthStore((s) => {
    if (!s.jwt) return false;
    if (!s.expires) return false;
    if (s.expires < new Date()) return false;
    return true;
  });

  const loaded = useAuthStore((s) => s.loaded);
  if (!loaded) return null;

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
            initialRouteName="Sessions"
          >
            {!loaded && <Stack.Screen name="Splash" component={SplashScreen} />}
            {isAuthed && loaded ? (
              <Stack.Screen name="Sessions" component={SessionsPage} />
            ) : (
              <Stack.Screen name="Log In" component={LogIn} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
