import { isAuth } from "@/utils/auth";
import client from "@/utils/client";
import { createRouter } from "next-connect";

const router = createRouter();

const getApi = async (req, res) => {
  try {
    const order = await client.fetch(`*[_type == "order" && _id == $id][0]`, {
      id: req.query.id,
    });
    res.send(order);
  } catch (error) {
    console.log(error);
    res.send({ success: false });
  }
}

// router.put().get().post()
router.use(isAuth).get(getApi);
export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
