import ReactDOM from "react-dom/client";
import App from "./App";
import "@mantine/core/styles.css";
// ‼️ import notifications styles after core package styles
import "@mantine/notifications/styles.css";

// biome-ignore lint/style/noNonNullAssertion: should have root :)
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
