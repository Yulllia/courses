import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { ICourse } from "../../interfaces/interfaces";
import Course from "../coursePage/Course";
import styles from "./list.module.scss";
import { Pagination, Spin } from "antd";
import { useMemo } from "react";

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const token = localStorage.getItem("token") || "{}";
  const pageSize = 10;
  const indexOfLastPost = useMemo(()=>currentPage * pageSize, [currentPage])
  const indexOfFirstPost = useMemo(()=>indexOfLastPost - pageSize, [indexOfLastPost]) 
  const currentList = useMemo(()=>courses.slice(indexOfFirstPost, indexOfLastPost), [courses, indexOfFirstPost, indexOfLastPost])  

  useEffect(() => {
    setLoading(true);
    const loadDetailCard = async () => {
      await axios
      .get(`${process.env.REACT_APP_API_URL}`, {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCourses(response.data.courses);
      })
      .catch((error) => {
        console.error(error);
      });
      setLoading(false);
    }
    loadDetailCard()
  }, [token]);

  const handleChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  };
  return (
    loading ?  <Spin data-testid="spin"/> :
    (<div className={styles.courseList}>
      <h2 className={styles.title} data-testid="title">Course List for Study</h2>
      <ul className={styles.cardContainer} data-testid="list">
        {currentList ? (
          currentList?.map((course: ICourse) => {
            return <Course item={course} key={course.id} />;
          })
        ) : (
          <div data-testid="notFound">No courses found!</div>
        )}
      </ul>
      <Pagination
        onChange={handleChange}
        className={styles.pagination}
        pageSize={pageSize}
        defaultCurrent={1}
        total={courses.length}
      />
    </div>)
  );
}

export default CourseList;
