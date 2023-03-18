import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
// import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter, Route, Routes } from "react-router-dom";
import DetailCourse from "./DetailCourse";

jest.mock("axios");

global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

describe("DetailCourse", () => {
  const mockLesson = [
    {
      id: "278e5a0e-8df1-4646-9984-10289d52dc2d",
      title: "Why we lack motivation",
      order: 1,
      status: "unlocked",
      link: "https://wisey.app/videos/lack-of-motivation-how-to-overcome-it/lesson-1/AppleHLS1/lesson-1.m3u8",
      previewImageLink:
        "https://wisey.app/assets/images/web/lessons-covers/lack-of-motivation-how-to-overcome-it/lesson-1",
    },
    {
      id: "d2379510-3e3a-4d87-a3e9-05c1a0195548",
      title: "Decision paralysis",
      order: 2,
      status: "unlocked",
      link: "https://wisey.app/videos/lack-of-motivation-how-to-overcome-it/lesson-2/AppleHLS1/lesson-2.m3u8",
      previewImageLink:
        "https://wisey.app/assets/images/web/lessons-covers/lack-of-motivation-how-to-overcome-it/lesson-2",
    },
    {
      id: "29a8fc4d-b2a4-420b-80de-73ecda13f28e",
      title: "Negative self-talk",
      order: 3,
      status: "locked",
      link: "https://wisey.app/videos/lack-of-motivation-how-to-overcome-it/lesson-3/AppleHLS1/lesson-3.m3u8",
      previewImageLink:
        "https://wisey.app/assets/images/web/lessons-covers/lack-of-motivation-how-to-overcome-it/lesson-3",
    },
  ];
  const mockCourse = {
    title: "Lack of Motivation & How to Overcome It",
    rating: 3.5,
    lessons: mockLesson,
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should show text when course is not found", async () => {
    const response = { data: {} };
    (axios.get as jest.Mock).mockResolvedValueOnce(response);
    const match = {
      params: { courseId: "abc" },
    };
    render(
      <MemoryRouter initialEntries={[`/course/${match.params.courseId}`]}>
        <Routes>
          <Route path="/course/:courseId" element={<DetailCourse />} />
        </Routes>
      </MemoryRouter>
    );
    const loading = screen.getByTestId("loading");
    expect(loading).toBeInTheDocument();
    await waitFor(() => {
      const titleElement = screen.getByTestId("notFound");
      expect(titleElement).toBeInTheDocument();
    });
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
  });

  test("should show video when lesson is unlocked", async () => {
    const response = { data: mockCourse };
    (axios.get as jest.Mock).mockResolvedValueOnce(response);
    const match = {
      params: { courseId: "352be3c6-848b-4c19-9e7d-54fe68fef183" },
    };
    render(
      <MemoryRouter initialEntries={[`/course/${match.params.courseId}`]}>
        <Routes>
          <Route path="/course/:courseId" element={<DetailCourse />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getAllByText("Why we lack motivation")[0]
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByText("Why we lack motivation")[0]);
    expect(
      screen.getByRole("heading", { name: /Why we lack motivation/i })
    ).toBeInTheDocument();
  });

  test("should show locked message when lesson is locked", async () => {
    const response = { data: mockCourse };
    (axios.get as jest.Mock).mockResolvedValueOnce(response);
    const match = {
      params: { courseId: "352be3c6-848b-4c19-9e7d-54fe68fef183" },
    };
    render(
      <MemoryRouter initialEntries={[`/course/${match.params.courseId}`]}>
        <Routes>
          <Route path="/course/:courseId" element={<DetailCourse />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Negative self-talk")).toBeInTheDocument();
    });

    userEvent.click(screen.getByText("Negative self-talk"));
    const blockedVideo = screen.getByTestId("video-blocked");

    expect(blockedVideo).toBeInTheDocument();
  });
});
