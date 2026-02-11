import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.PROJECT_ID,
  dataset: "production",
  apiVersion: "2026-02-10",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});
