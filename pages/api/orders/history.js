import { isAuth } from "@/utils/auth";
import client from "@/utils/client";
import { createRouter } from "next-connect";

const router = createRouter();

const getApi = async (req, res) => {
  try {
    const orders = await client.fetch(
        `*[_type == "order" && user._ref == $userId]`,
        {
          userId: req.user._id,
        }
      );
      res.send(orders);
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
