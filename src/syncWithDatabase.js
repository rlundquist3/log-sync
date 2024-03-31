import { Client, fetchExchange, gql } from "@urql/core";

const client = new Client({
  url: "https://climb-log-api.vercel.app/graphql",
  exchanges: [fetchExchange],
});

const createClimbsMutation = gql`
  mutation CreateClimbs($input: [ClimbCreateInput!]!) {
    createClimbs(input: $input) {
      climbs {
        id
      }
      info {
        nodesCreated
      }
    }
  }
`;

export const syncWithDatabase = async (climbs) => {
  const input = climbs.map(({ name, grade }) => ({
    name,
    grade,
    type: !!grade.match(/V\d+/) ? "boulder" : "sport",
  }));

  const { data } = await client.mutation(createClimbsMutation, { input });
  console.log(
    `${data?.createClimbs?.info?.nodesCreated} sends added to database`
  );
};
