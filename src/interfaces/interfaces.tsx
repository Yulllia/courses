export interface ICourse {
  id: string;
  description: string;
  previewImageLink: string;
  title: string;
  lessonsCount: number;
  rating: number;
  meta: ISkills;
  lessons?: Array<ILesson>;
}

export interface VideoLink {
  videoLink: ILesson;
}
export interface CourseListLoading {
  courses?: ICourse[];
  loadingSpinner?: JSX.Element;
}

export interface ILesson {
  id: string;
  link: string;
  order: number;
  previewImageLink: string;
  status: string;
  title: string;
  type: string;
}

export interface IDetailCourse {
  id: string;
  description: string;
  previewImageLink: string;
  title: string;
  lessonsCount: number;
  rating: number;
  meta: ISkills;
}


export interface ISkills {
  skills: Array<string>;
  courseVideoPreview: IVideo;
}

interface IVideo {
  duration: number;
  link: string;
  previewImageLink: string;
}

export type CourseItem = {
  item: ICourse;
};
