import { Layout } from "../components/Layout.tsx";
import { SceneForm } from "../features/scene/SceneForm.tsx";

export const AddScene = () => {
  return (
    <>
      <Layout>
        <SceneForm
          rosterOptions={[]}
          sendValues={(values) => console.log(values)}
          handleError={() => console.log("")}
        />
      </Layout>
    </>
  );
};
