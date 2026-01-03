export interface ClassWithCourseAndScenes {
  id: number;
  courseId: number;
  location: string;
  notes: string | null;
  streamingLink: string;
  startDate: Date | string;
  endDate: Date | string;
  course: {
    id: number;
    title: string;
    studentLimit: number | null;
    instructorId: number;
    createdAt: Date | string;
    updatedAt: Date | string;
    instructor: {
      id: number;
      clerkId: string;
      email: string;
      firstName: string;
      lastName: string;
      role: "ADMIN" | "STUDENT" | "MODERATOR" | "INSTRUCTOR";
      createdAt: Date | string;
      updatedAt: Date | string;
    };
  };
  scenes: Array<{
    classId: number;
    sceneId: number;
    approved: boolean;
    order: number;
    scene: {
      id: number;
      duration: number;
      title: string;
      type: "PLAY" | "FILM" | "MONOLOGUE" | "SONG" | "TELEVISION" | "OTHER";
      notes: string | null;
      createdAt: Date | string;
      updatedAt: Date | string;
    };
  }>;
}
