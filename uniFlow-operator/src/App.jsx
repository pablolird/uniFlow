import Dashboard from "./components/Dashboard.jsx";
import Form from "./components/Form.jsx";
import { useState, useEffect } from "react";
import SubmitActivity from "./components/SubmitActivity.jsx";
import axios from "axios";

function App() {
  return (
    <>
      <main className="bg-background dashboard-section flex-col flex w-full h-dvh">
        <h1 className="text-2xl text-foreground font-semibold text-center py-3 border bg-card"><span className="text-primary">uni</span>Flow</h1>
        <Dashboard
        />
      </main>
      <section className="p-10 border border-red-800 hidden">
        <Form />
      </section>
    </>
  );
}

export default App;
