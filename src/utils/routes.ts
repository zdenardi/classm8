import { getData } from "./service.ts";

export const CLASSES_ROUTES = {
  get: "/classes",
};

export const CLASS_API_CALLS = {
  get: async () => {
    return await getData("classes");
  },
};

export const ROUTES = {
  classes: CLASSES_ROUTES,
};
