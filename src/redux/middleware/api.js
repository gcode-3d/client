import getURL from "../../tools/geturl";
const apiMiddleWare = () => {
  return (store) => (next) => (action) => {
    switch (action.type) {
      case "api/startPrint":
        let headers = new Headers();
        headers.append(
          "Authorization",
          "auth-" +
            (localStorage.getItem("auth") || sessionStorage.getItem("auth"))
        );
        headers.append("content-type", "application/json");

        var requestOptions = {
          method: "PUT",
          body: JSON.stringify({ printName: action.filename }),
          headers: headers,
        };

        fetch(getURL() + "/api/print", requestOptions)
          .then((response) => {
            if (!response.ok) {
              // TODO: Add status message dispatch
              console.error(
                `Couldn't start print. Status received: ${response.status} `
              );
            }
          })
          .catch((error) => {
            console.log("error", error);
          });
    }
    return next(action);
  };
};

export default apiMiddleWare();
