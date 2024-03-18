import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Modal } from "react-native";
import { Auth } from "aws-amplify";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "@/app/_layout";
import { useNavigation } from "@react-navigation/native";
type SignInNavigationProp = StackNavigationProp<AuthStackParamList, "SignIn">;

const ForgotPasswordScreen: React.FC = () => {
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigation = useNavigation<SignInNavigationProp>();
  const [isResetModalVisible, setIsResetModalVisible] = useState(false);

  const handleForgotPassword = async () => {
    try {
      await Auth.forgotPassword(username);
      setIsResetModalVisible(true); // Show modal after successful forgotPassword request
    } catch (error) {
      console.error("Forgot password error", error);
      // Handle forgot password error, display an error message, etc.
    }
  };
  const handlePasswordResetConfirm = async () => {
    try {
      await Auth.forgotPasswordSubmit(username, code, newPassword);
      setIsResetModalVisible(false); // Close the modal on successful password reset
      navigation.navigate("SignIn"); // Redirect to sign-in page
    } catch (error) {
      console.error("Password reset confirmation error", error);
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isResetModalVisible}
        onRequestClose={() => {
          setIsResetModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Reset Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirmation Code"
              placeholderTextColor="#888"
              value={code}
              onChangeText={setCode}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <Button
              title="Confirm Reset"
              onPress={handlePasswordResetConfirm}
            />
          </View>
        </View>
      </Modal>
      <Text>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
        value={username}
      />
      <Button title="Submit" onPress={handleForgotPassword} />
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

export default ForgotPasswordScreen;
