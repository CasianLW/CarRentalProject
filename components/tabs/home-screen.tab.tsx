import React, { FC } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Auth } from "aws-amplify";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "@/app/_layout";
import { useAuth } from "@/context/auth-context";

type SignInNavigationProp = StackNavigationProp<AuthStackParamList, "SignIn">;
type HomeScreenProps = {
  setIsAuthenticated: (value: boolean) => void;
};
const HomeScreen: FC<HomeScreenProps> = ({ setIsAuthenticated }) => {
  const { user, signOut } = useAuth(); // Use the useAuth hook to access user and signOut function

  const signOutAppp = async () => {
    try {
      await signOut();
      // Reset the navigation state to the Auth stack
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error signing out: ", error); // Handle sign-out errors heres
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Home Screen</Text>
      <Text style={styles.text}>
        You are now signed in!{" "}
        {user?.signInUserSession?.idToken?.payload?.email ?? ""}
        {/* {user?.signInUserSession?.idToken?.payload?.email ?? ""} */}
      </Text>
      <Button title="Sign Out" onPress={signOutAppp} />
      {/* Add your home screen content here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default HomeScreen;
