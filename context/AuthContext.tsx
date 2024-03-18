import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { Auth } from "aws-amplify";
// import { CognitoUser } from "@aws-amplify/auth";
import { CognitoUser } from "amazon-cognito-identity-js";

interface ExtendedCognitoUser extends CognitoUser {
  signInUserSession?: {
    idToken?: {
      payload?: {
        email?: string;
      };
    };
  };
}

interface AuthContextType {
  user: ExtendedCognitoUser | null;
  setUser: React.Dispatch<React.SetStateAction<ExtendedCognitoUser | null>>;
  signOut: () => Promise<void>;
  refreshAuthState: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<CognitoUser | null>(null);

  const refreshAuthState = useCallback(async () => {
    try {
      const currentUser =
        (await Auth.currentAuthenticatedUser()) as CognitoUser;
      setUser(currentUser);
    } catch (error) {
      console.error("Error refreshing auth state:", error);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshAuthState();
  }, [refreshAuthState]);

  const signOut = async () => {
    try {
      await Auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signOut, refreshAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
