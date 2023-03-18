import { Spin } from "antd";
import axios from "axios";
import { useEffect } from "react";

function Login(props: { setToken: (value: string) => void }) {
  useEffect(() => {
    const loadDetailCard = async () => {
      await axios
        .get(`/api/v1/auth/anonymous?platform=subscriptions`)
        .then((response) => {
          const token = response.data.token;
          props.setToken(token);
          localStorage.setItem("token", token);
        })
        .catch((error) => {
          console.error(error);
        });
    };
    loadDetailCard();
  }, [props]);

  return <Spin/>
}

export default Login;
