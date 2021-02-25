export default function GETURL() {
  if (process.env.NODE_ENV === "production") {
    return "";
  } else {
    return "http://localhost:8000";
  }
}
