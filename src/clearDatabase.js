import { client } from "./urqlClient";
import { gql } from "@urql/core";

const deleteAllClimbsMutation = gql`
  mutation DeleteAllClimbs {
    deleteClimbs {
      nodesDeleted
    }
  }
`;

export const clearDatabase = async () => {
  const { data } = await client.mutation(deleteAllClimbsMutation);
  console.log(`${data?.deleteClimbs?.nodesDeleted} deleted from database`);

  const db = inkdrop.main.dataStore.getLocalDB();
  const syncedTag = await db.tags.findWithName("synced");
  await db.utils.deleteTag(syncedTag._id);
  console.log("Removed synced tag");
};
