import React, { FC, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { Amplify, Auth } from "aws-amplify";
import { useAuth } from "@/context/auth-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "@/app/_layout";

type SignInNavigationProp = StackNavigationProp<AuthStackParamList, "SignIn">;

type SigninScreenProps = {
  setIsAuthenticated: (value: boolean) => void;
};
const SignInScreen: FC<SigninScreenProps> = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<SignInNavigationProp>();
  const { setUser } = useAuth(); // Assuming you're using the context we previously discussed

  const [isSigningIn, setIsSigningIn] = useState(false); // New state to manage sign-in button disabled state

  const handleSignIn = async () => {
    if (isSigningIn) return; // Prevent multiple sign-in attempts
    setIsSigningIn(true); // Disable the sign-in button
    try {
      const user = await Auth.signIn(username, password);
      setUser(user);
      setIsAuthenticated(true);
      // Navigate to the next screen or show success message
    } catch (error) {
      console.error("Sign in error", error);
      // Handle sign-in error, display an error message, etc.
    } finally {
      setIsSigningIn(false); // Re-enable the sign-in button
    }
  };

  return (
    <View style={styles.container}>
      <Text>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        onChangeText={(text) => setUsername(text)}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <Button title="Sign In" onPress={handleSignIn} disabled={isSigningIn} />

      <Button
        title="Don't have an account? Sign Up"
        onPress={() => navigation.navigate("SignUp")}
      />
      <Button
        title="Forgot Password?"
        onPress={() => navigation.navigate("ForgotPassword")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    marginBottom: 10,
    padding: 10,
    borderColor: "gray",
    borderWidth: 1,
  },
});

export default SignInScreen;
