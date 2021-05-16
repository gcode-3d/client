import getURL from "../../tools/geturl";
const apiMiddleWare = () => {
  return (store) => (next) => (action) => {
    switch (action.type) {
      case "api/startPrint":
        PUTRequest(
          getURL() + "/api/print",
          {
            Authorization:
              "auth-" +
              (localStorage.getItem("auth") || sessionStorage.getItem("auth")),
          },
          { printName: action.filename }
        )
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
        break;

      case "api/connectPrinter":
        PUTRequest(getURL() + "/api/connection", {
          Authorization:
            "auth-" +
            (localStorage.getItem("auth") || sessionStorage.getItem("auth")),
        })
          .then((response) => {
            if (!response.ok) {
              // TODO: Add status message dispatch
              console.error(
                `Couldn't connect printer. Status received: ${response.status} `
              );
            }
          })
          .catch((error) => {
            console.log("error", error);
          });
        break;
      case "api/reconnectPrinter":
        POSTRequest(getURL() + "/api/connection", {
          Authorization:
            "auth-" +
            (localStorage.getItem("auth") || sessionStorage.getItem("auth")),
        })
          .then((response) => {
            if (!response.ok) {
              // TODO: Add status message dispatch
              console.error(
                `Couldn't reconnect printer. Status received: ${response.status} `
              );
            }
          })
          .catch((error) => {
            console.log("error", error);
          });
        break;
      case "api/cancelPrint":
        DELETERequest(getURL() + "/api/print", {
          Authorization:
            "auth-" +
            (localStorage.getItem("auth") || sessionStorage.getItem("auth")),
        })
          .then((response) => {
            if (!response.ok) {
              // TODO: Add status message dispatch
              console.error(
                `Couldn't cancel print. Status received: ${response.status} `
              );
            }
          })
          .catch((error) => {
            console.log("error", error);
          });
        break;
      case "api/disconnectPrinter":
        DELETERequest(getURL() + "/api/connection", {
          Authorization:
            "auth-" +
            (localStorage.getItem("auth") || sessionStorage.getItem("auth")),
        })
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
      case "api/emergency":
        POSTRequest(getURL() + "/api/connection/emergency/", {
          Authorization:
            "auth-" +
            (localStorage.getItem("auth") || sessionStorage.getItem("auth")),
        })
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
        break;
    }
    return next(action);
  };
};

export default apiMiddleWare();

/**
 *
 * @param {string} url
 * @param {key: value} headers
 * @param {key: value} body
 * @returns {Promise<Response>}
 */

function PUTRequest(url, headers, body) {
  return genericRequest(url, "PUT", headers, body);
}

/**
 *
 * @param {string} url
 * @param {key: value} headers
 * @param {key: value} body
 * @returns {Promise<Response>}
 */

function DELETERequest(url, headers, body) {
  return genericRequest(url, "DELETE", headers, body);
}

/**
 *
 * @param {string} url
 * @param {key: value} headers
 * @param {key: value} body
 * @returns {Promise<Response>}
 */

function POSTRequest(url, headers, body) {
  return genericRequest(url, "POST", headers, body);
}

/**
 *
 * @param {string} url
 * @param {key: value} headers
 * @returns {Promise<Response>}
 */
function getRequest(url, headers) {
  return genericRequest(url, "GET", headers);
}

/**
 *
 * @param {string} url
 * @param {string} method
 * @param {key: value} headers
 * @param {key: value} body
 * @returns {Promise<Response>}
 */
function genericRequest(url, method, headerData, body) {
  let headers = new Headers();

  Object.entries(headerData).forEach((entry) => {
    headers.append(entry[0], entry[1]);
  });

  if (body != null) {
    headers.set("Content-Type", "application/json");
  }

  var requestOptions = {
    method,
    body: body ? JSON.stringify(body) : null,
    headers,
  };

  return fetch(url, requestOptions);
}
