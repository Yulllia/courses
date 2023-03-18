import { List, Spin } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ICourse } from "../../interfaces/interfaces";
import styles from "./detailCourse.module.scss";
import { Col, Row, Typography, Rate } from "antd";
import Video from "../video/Video";
import { ArrowLeftOutlined } from "@ant-design/icons";

function DetailCourse() {
  const [loading, setLoading] = useState(false);
  const [detailCharacter, setDetailCharacter] = useState<ICourse | null>(null);
  const { courseId } = useParams();
  const [currentNumber, setCurrentNumber] = useState<number>(0);
  const token = localStorage.getItem("token") || "{}";

  useEffect(() => {
    setLoading(true);
    const loadDetailCard = async () => {
      await axios
        .get<ICourse>(`${process.env.REACT_APP_API_URL}/${courseId}`, {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setDetailCharacter(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });

    };
    loadDetailCard();
  }, [courseId, token]);

  const onVideoSelect = (video: number) => {
    setCurrentNumber(video);
  };
console.log(detailCharacter)
  return (
    <>
      {loading ? (
        <Spin data-testid="loading" />
      ) : (
        <>
          <div className={styles.arrowBack}>
            <Link className={styles.link} to={`/`}>
              {" "}
              <span>
                <ArrowLeftOutlined />
              </span>
              Back to Homepage
            </Link>
          </div>
          <Row className={styles.container}>
            {detailCharacter?.lessons ? (
              <>
                <Col lg={15} md={12} className={styles.detailContainer}>
                  {detailCharacter.lessons[currentNumber].status ===
                  "locked" ? (
                    <div className={styles.videoContainer}>
                      <div className={styles.text}>
                        <p data-testid="video-blocked">Video blocked!</p>
                      </div>
                    </div>
                  ) : (
                    <Video
                      key={currentNumber ?? 0}
                      videoLink={detailCharacter.lessons[currentNumber]}
                    />
                  )}
                  <Typography.Title level={3} className={styles.lessonTitle} data-testid="lesson-title">
                    {detailCharacter.lessons[currentNumber].title}
                  </Typography.Title>
                  <Rate
                    className={styles.rating}
                    value={detailCharacter.rating}
                  />
                </Col>
                <Col lg={6} md={12} className={styles.col}>
                  {" "}
                  <div className={styles.lessonList}>
                    <h4>{detailCharacter.title}</h4>
                    <List
                      itemLayout="horizontal"
                      className={styles.list}
                      dataSource={detailCharacter.lessons}
                      renderItem={(lesson, index) => (
                        <>
                          <List.Item
                            className={styles.lesson}
                            key={lesson.title}
                            onClick={() => onVideoSelect(index)}
                            extra={
                              <>
                                <img
                                  className={styles.lessonImage}
                                  alt={lesson.title}
                                  src={`${lesson.previewImageLink}/lesson-${lesson.order}.webp`}
                                />
                                <p
                                  className={styles.title}
                                  data-testid="lessonTitle"
                                >
                                  {lesson.title}
                                </p>
                              </>
                            }
                          />
                        </>
                      )}
                    />
                  </div>
                </Col>
              </>
            ) : (
              <div data-testid="notFound">No lessons for Course not found!</div>
            )}
          </Row>
        </>
      )}
    </>
  );
}

export default DetailCourse;
