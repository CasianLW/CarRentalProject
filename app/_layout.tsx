import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
// import { Stack } from "expo-router";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import * as SplashScreen from "expo-splash-screen";
import { FC, useEffect, useState } from "react";

import { useColorScheme } from "@/components/use-color-scheme";
import SignInScreen from "@/components/sign-in.screen";
import SignUpScreen from "@/components/sign-up.screen";
import ForgotPasswordScreen from "@/components/forgot-password.screen";
import HomeScreen from "@/components/tabs/home-screen.tab";
import ProfileScreen from "@/components/tabs/profile-screen.tab";
import { AuthProvider } from "@/context/auth-context";

// import Amplify from 'aws-amplify';
import config from "../amplifyconfiguration"; // Adjust the path to where your amplifyconfiguration.js is located
import { Amplify } from "aws-amplify";

// Amplify.configure(config);
Amplify.configure(config);

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Dummy authentication check function
  useEffect(() => {
    // Actual check for current authenticated user
    const checkAuth = async () => {
      try {
        await Amplify.Auth.currentAuthenticatedUser();
        setIsAuthenticated(true);
      } catch (error) {
        // Not authenticated
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // return <RootLayoutNav />;
  return (
    <AuthProvider>
      <NavigationContainer independent={true}>
        {isAuthenticated ? (
          <MainAppNavigator setIsAuthenticated={setIsAuthenticated} />
        ) : (
          <AuthNavigator setIsAuthenticated={setIsAuthenticated} />
        )}
        {/* <RootLayoutNav /> */}
      </NavigationContainer>
    </AuthProvider>
  );
}

// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

// function RootLayoutNav() {
//   const colorScheme = useColorScheme();

//   return (
//     <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//       <Stack.Navigator
//         initialRouteName="(tabs)"
//         screenOptions={{ headerShown: false }}
//       >
//         <Stack.Screen name="(tabs)" component={MainAppNavigator} />
//         <Stack.Screen
//           name="SignIn"
//           component={SignInScreen}
//           options={{ title: "Sign In" }}
//         />
//         <Stack.Screen
//           name="SignUp"
//           component={SignUpScreen}
//           options={{ title: "Sign Up" }}
//         />
//         <Stack.Screen
//           name="ForgotPassword"
//           component={ForgotPasswordScreen}
//           options={{ title: "Forgot Password" }}
//         />
//       </Stack.Navigator>
//     </ThemeProvider>
//   );
// }
const AuthNavigator: FC<{
  setIsAuthenticated: (value: boolean) => void;
}> = ({ setIsAuthenticated }) => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      {/* <AuthStack.Screen name="SignIn" component={SignInScreen} /> */}
      <AuthStack.Screen name="SignIn">
        {() => <SignInScreen setIsAuthenticated={setIsAuthenticated} />}
      </AuthStack.Screen>
      <AuthStack.Screen name="SignUp">
        {() => <SignUpScreen setIsAuthenticated={setIsAuthenticated} />}
      </AuthStack.Screen>
      {/* <AuthStack.Screen name="SignUp" component={SignUpScreen} /> */}
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
      {/* Add more auth screens as needed */}
    </AuthStack.Navigator>
  );
};
const MainAppNavigator: FC<{
  setIsAuthenticated: (value: boolean) => void;
}> = ({ setIsAuthenticated }) => {
  return (
    <MainTab.Navigator>
      {/* <MainTab.Screen name="Home" component={HomeScreen} /> */}
      <MainTab.Screen name="Home">
        {() => <HomeScreen setIsAuthenticated={setIsAuthenticated} />}
      </MainTab.Screen>
      <MainTab.Screen name="Profile" component={ProfileScreen} />
      {/* Add more MainTabs as needed */}
    </MainTab.Navigator>
  );
};
