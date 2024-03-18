import React, { FC, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Modal } from "react-native";
import { Auth } from "aws-amplify";
import { useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "@/app/_layout";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "@/context/AuthContext";

type SignUpNavigationProp = StackNavigationProp<AuthStackParamList, "SignUp">;

type SignUpScreenProps = {
  setIsAuthenticated: (value: boolean) => void;
};
const SignUpScreen: FC<SignUpScreenProps> = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<SignUpNavigationProp>();
  const { setUser } = useAuth();

  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  const handleSignUp = async () => {
    try {
      await Auth.signUp({ username, password });
      setIsConfirmModalVisible(true); // Show confirmation modal
    } catch (error) {
      console.error("Sign up error", error);
      // Handle sign-up error, display an error message, etc.
    }
  };
  const handleConfirmSignUp = async () => {
    try {
      await Auth.confirmSignUp(username, confirmationCode);
      // Optional: Sign in the user automatically
      const user = await Auth.signIn(username, password);
      setUser(user);

      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error confirming sign up:", error);
      // Handle confirmation error, display an error message, etc.
    } finally {
      setIsConfirmModalVisible(false); // Hide the modal regardless of the outcome
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isConfirmModalVisible}
        onRequestClose={() => {
          setIsConfirmModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Enter Confirmation Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirmation Code"
              placeholderTextColor="#888"
              value={confirmationCode}
              onChangeText={setConfirmationCode}
            />
            <Button title="Confirm" onPress={handleConfirmSignUp} />
            <Text>*check your email</Text>
          </View>
        </View>
      </Modal>
      <Text>Sign Up</Text>
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
      <Button title="Sign Up" onPress={handleSignUp} />
      <Button
        title="Already have an account? Sign In"
        onPress={() => navigation.navigate("SignIn")}
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default SignUpScreen;
