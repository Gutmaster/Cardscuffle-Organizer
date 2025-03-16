import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import { BrowserRouter } from "react-router-dom";
import {UserProvider} from "./components/context/user";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    <UserProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </UserProvider>
);