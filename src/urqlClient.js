import { Client, fetchExchange } from "@urql/core";

export const client = new Client({
  url: "https://climb-log-api.vercel.app/graphql",
  exchanges: [fetchExchange],
});
