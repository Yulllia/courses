import React, { useState } from "react";
import { CourseItem } from "../../interfaces/interfaces";
import { Card, Tooltip, Typography } from "antd";
import ReactPlayer from "react-player";
import { StarOutlined } from "@ant-design/icons";
import {  List, Space } from "antd";
import styles from "./course.module.scss";
import { Link } from "react-router-dom";

function Course({ item }: CourseItem) {
  const [hover, setHover] = useState<boolean>(false);

  const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  return (
    <Link className={styles.link} to={`/course/${item.id}`}>
      <Card
        hoverable
        className={styles.card}
        onMouseEnter={(e: React.MouseEvent) => setHover(true)}
        onMouseLeave={(e: React.MouseEvent) => setHover(false)}
        cover={
          hover ? (
            <ReactPlayer
              url={item.meta.courseVideoPreview?.link}
              playing
              muted
              className={styles.video}
              width="100%"
              height={175}
              controls
            />
          ) : (
            <img
              className={styles.image}
              height={175}
              alt={item.title}
              src={item.previewImageLink + "/cover.webp"}
            />
          )
        }
      >
        <Tooltip placement="topLeft" title={item.description} className={styles.text}>
          <Typography.Title level={4}>{item.description}</Typography.Title>
        </Tooltip>
        <Tooltip placement="topLeft" title={item.title} className={styles.text}>
          <Typography.Title level={4}>{item.title}</Typography.Title>
        </Tooltip>
        <div className={styles.infoBlock}>
          <p>{`LessonsCount: ${item.lessonsCount}`}</p>
          <List.Item
            actions={[
              <IconText
                icon={StarOutlined}
                text={item.rating?.toString()}
                key="list-vertical-star-o"
              />,
            ]}
          />
        </div>
        <p className={styles.skills}>Skills:</p>
        <List
          itemLayout="horizontal"
          dataSource={item.meta.skills}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta description={item} />
            </List.Item>
          )}
        />
      </Card>
    </Link>
  );
}

export default Course;
