import { Layout } from "../components/Layout.tsx";
import { CourseForm } from "../features/course/CourseForm.tsx";

export const AddCourse = () => {
  return (
    <>
      <Layout>
        <CourseForm
          sendValues={(values) => console.log(values)}
          handleError={() => console.log("Error")}
        />
      </Layout>
    </>
  );
};
