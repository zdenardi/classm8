import { useEffect } from "react";
import axios from "axios";

export const Home = () => {
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8000/api/v1/classes", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then(function (response) {
  //       // handle success
  //       console.log(response);
  //     })
  //     .catch(function (error) {
  //       // handle error
  //       console.log(error);
  //     })
  //     .finally(function () {
  //       // always executed
  //     });
  // }, []);
  return (
    <>
      <p>Home page!</p>
    </>
  );
};
