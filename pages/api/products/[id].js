import { createRouter } from "next-connect";
import client from "../../../utils/client";

const router = createRouter();

router.get(async (req, res) => {
  try {
    const product = await client.fetch(
      `*[_type == "Product" && _id == $id][0]`,
      {
        id: req.query.id,
      }
    );
    res.send(product);
  } catch (error) {
    console.log(error);
    res.send({ success: false });
  }
});
export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
