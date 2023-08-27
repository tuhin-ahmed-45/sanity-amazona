import { isAuth, signToken } from "@/utils/auth";
import config from "@/utils/config";
import axios from "axios";
import { createRouter } from "next-connect";

const router = createRouter();

router
  .put(async (req, res) => {
    try {
        const tokenWithWriteAccess = process.env.SANITY_AUTH_TOKEN;
        console.log({abc:req.body});
        await axios.post(
          `https://${config.projectId}.api.sanity.io/v1/data/mutate/${config.dataset}`,
          {
            mutations: [
              {
                patch: {
                  id: req.body._id,
                  set: {
                    name: req.body.name,
                    email: req.body.email,
                  },
                },
              },
            ],
          },
          {
            headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${tokenWithWriteAccess}`,
            },
          }
        );
      
        const user = {
          _id: req.body._id,
          name: req.body.name,
          email: req.body.email,
          isAdmin: req.body.isAdmin,
        };
        const token = signToken(user);
        console.log({Test:user});
        res.send({ ...user, token })
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
