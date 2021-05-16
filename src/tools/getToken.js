export default function getToken() {
  if (window.localStorage.getItem("auth") !== null) {
    return window.localStorage.getItem("auth");
  } else if (window.sessionStorage.getItem("auth") !== null) {
    return window.sessionStorage.getItem("auth");
  }
}
