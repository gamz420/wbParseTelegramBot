import { connectToCluster } from "./connectToCluster.js";

export const savingPayment = async (msg) => {
  try {
    const mongoClient = await connectToCluster(process.env.DB_URI);
    const db = mongoClient.db("wb_parse");
    const col = db.collection("paid_clients");

    const endOfSubscriptionDate = new Date();
    endOfSubscriptionDate.setMonth(endOfSubscriptionDate.getMonth() + 1);

    let client = {
      id: msg.from.id,
      first_name: msg.from.first_name,
      username: msg.from.username,
      paid: true,
      end_of_subscription: endOfSubscriptionDate,
    };

    const res = await col.insertOne(client);

    return res;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
