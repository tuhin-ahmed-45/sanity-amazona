import { isAuth } from "@/utils/auth";
import { createRouter } from "next-connect";

const router = createRouter();

router
  .get(async (req, res) => {
    try {
      res.send(process.env.PAYPAL_CLIENT_ID || "sb");
    } catch (error) {
      console.log(error);
      res.send({ success: false });
    }
  })
  .use(isAuth);
export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
