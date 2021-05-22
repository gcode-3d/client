export default function GETURL() {
  if (process.env.NODE_ENV === "production") {
    return "";
  } else {
    return window.location.protocol + "//" + window.location.hostname + ":8000";
  }
}
