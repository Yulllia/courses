import axios from "axios";
import { render, screen, waitFor } from "@testing-library/react";
import CourseList from "./CourseList";
import { MemoryRouter, Route, Routes } from "react-router-dom";

jest.mock("axios");
global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

describe("CourseList", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
  });
  const courses = [
    {
      id: "352be3c6-848b-4c19-9e7d-54fe68fef183",
      title: "Lack of Motivation & How to Overcome It",
      description:
        "Reignite your inner drive by managing factors that dampen your motivation.",
      lessonsCount: 2,
      rating: 3.5,
      previewImageLink:
        "https://wisey.app/assets/images/web/course-covers/lack-of-motivation-how-to-overcome-it",
      meta: {
        skills: [
          "Aligning your goals with your motives",
          "Overcoming decision paralysis",
          "Reframing negative self-talk",
          "Gaining clarity",
          "Challenging yourself",
        ],
        courseVideoPreview: {
          link: "https://wisey.app/videos/lack-of-motivation-how-to-overcome-it/preview/AppleHLS1/preview.m3u8",
          duration: 27,
          previewImageLink:
            "https://wisey.app/assets/images/web/course-covers/lack-of-motivation-how-to-overcome-it/preview",
        },
      },
    },
    {
      id: "3b77ceb6-fb43-4cf5-a25b-8fe9222a0714",
      title: "The Power of Self-Discipline: How to Stay on Track",
      description:
        "Find the inner strength to overcome procrastination and reach your goals.",
      lessonsCount: 4,
      rating: 5,
      previewImageLink:
        "https://wisey.app/assets/images/web/course-covers/the-power-of-self-discipline-how-to-stay-on-track",
      meta: {
        skills: [
          "Increasing self-awareness",
          "Personal accountability",
          "Developing a routine",
          "Improving self-control",
          "Focusing on long-term goals",
        ],
        courseVideoPreview: {
          link: "https://wisey.app/videos/the-power-of-self-discipline-how-to-stay-on-track/preview/AppleHLS1/preview.m3u8",
          duration: 19,
          previewImageLink:
            "https://wisey.app/assets/images/web/course-covers/the-power-of-self-discipline-how-to-stay-on-track/preview",
        },
      },
    },
  ];

  test("renders a list of courses", async () => {
    const response = { data: { courses: courses } };
    (axios.get as jest.Mock).mockResolvedValueOnce(response);
    render(
        <MemoryRouter initialEntries={[`/`]}>
          <Routes>
            <Route path="/" element={<CourseList />} />
          </Routes>
        </MemoryRouter>
      );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    await screen.findByText("Lack of Motivation & How to Overcome It");
  });

  test("handles API error", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("test error"));
    render(
        <MemoryRouter initialEntries={[`/`]}>
          <Routes>
            <Route path="/" element={<CourseList />} />
          </Routes>
        </MemoryRouter>
      );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(
      screen.queryByText("Lack of Motivation & How to Overcome It")
    ).not.toBeInTheDocument();
    expect(localStorage.getItem("token")).toBeNull();
  });
});
