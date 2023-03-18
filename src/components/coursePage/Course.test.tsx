import React from 'react';
import { render, screen } from '@testing-library/react';
import Course from './Course';
import { ICourse } from '../../interfaces/interfaces';
import { MemoryRouter } from 'react-router-dom';

global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

describe("Course component", () => {
    const item: ICourse = {
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
        }
    };
  
    test("renders course component correctly", () => {
      render(
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <Course item={item} />
        </MemoryRouter>
      );
  
      const titleElement = screen.getByText(/The Power of Self-Discipline: How to Stay on Track/i);
      expect(titleElement).toBeInTheDocument();
    });
  });