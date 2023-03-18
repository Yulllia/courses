import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import CourseList from "./components/courseList/CourseList";
import DetailCourse from "./components/detailCourse/DetailCourse";
// import DetailCourse from "./components/detailCourse/DetailCourse";
import Login from "./components/login/Login";

function App() {
  const [token, setToken] = useState<string | null>(null);
  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <Routes>
      <Route path="/" element={<CourseList />} />
      <Route path="/course/:courseId" element={<DetailCourse />} />
    </Routes>
  );
}

export default App;
