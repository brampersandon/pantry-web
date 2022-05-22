import * as React from "react";
import { useLocation } from "wouter";
import { useUser } from "./firebase";

export const useRequireLogin = () => {
  const user = useUser()
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    if (user == null) {
      setLocation("/login");
    } else if (!user.emailVerified) {
      setLocation('/verify')
    }
  }, [user]);
};

export const useAuthedUserGoHome = () => {
  const user = useUser()
  const [, setLocation] = useLocation();
  React.useEffect(() => {
    if (
      user != null &&
      !user.isAnonymous
    ) {
      if (user.emailVerified) {
        setLocation("/");
      } else {
        setLocation("/verify")
      }
    }
  }, [user]);
};