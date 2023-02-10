import React from "react";
import useAxios from "axios-hooks";

export const userIsAuth = ({ navigation }) => {
  const [{ data, loading, error }] = useAxios("user/status");

  React.useEffect(() => {
    if (!data?.status && !loading) {
      // navigate to login
      console.log("TEST");
    }
  }, [loading, data]);
};
