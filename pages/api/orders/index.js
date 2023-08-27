import { isAuth } from "@/utils/auth";
import config from "@/utils/config";
import axios from "axios";
import { createRouter } from "next-connect";

const router = createRouter();

router
  .post(async (req, res) => {
    try {
      const projectId = config.projectId;
      const dataset = config.dataset;
      const tokenWithWriteAccess = process.env.SANITY_AUTH_TOKEN;
      const { data } = await axios.post(
        `https://${projectId}.api.sanity.io/v1/data/mutate/${dataset}?returnIds=true`,
        {
          mutations: [
            {
              create: {
                _type: "order",
                createdAt: new Date().toISOString(),
                ...req.body,
                userName: req.user.name,
                user: {
                  _type: "reference",
                  _ref: req.user._id,
                },
              },
            },
          ],
        },
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${tokenWithWriteAccess}`,
          },
        }
      );

      res.status(201).send(data.results[0].id);
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
