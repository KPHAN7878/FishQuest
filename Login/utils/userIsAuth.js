import React from "react";
import useAxios from "axios-hooks";
// import URL from "./connection";

// `http://${URL}/user/status`

export const userIsAuth = () => {
  const [{ data, loading, error }] = useAxios("user/status");

  React.useEffect(() => {
    if (!data?.status && !loading) {
    }
  });
};
