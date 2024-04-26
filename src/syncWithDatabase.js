import { client } from "./urqlClient";
import { gql } from "@urql/core";

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
  const input = climbs.map(({ name, grade, sendDate }) => ({
    name,
    grade,
    type: !!grade.match(/V\d+/) ? "boulder" : "sport",
    sendDate,
    source: "inkdrop",
  }));

  const { data } = await client.mutation(createClimbsMutation, { input });
  console.log(
    `${data?.createClimbs?.info?.nodesCreated} sends added to database`
  );
};
