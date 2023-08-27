import { isAuth } from "@/utils/auth";
import config from "@/utils/config";
import axios from "axios";
import { createRouter } from "next-connect";

const router = createRouter();

router
.put(async (req, res) => {
    const tokenWithWriteAccess = process.env.SANITY_AUTH_TOKEN;
    await axios.post(
      `https://${config.projectId}.api.sanity.io/v1/data/mutate/${config.dataset}`,
      {
        mutations: [
          {
            patch: {
              id: req.query.id,
              set: {
                isPaid: true,
                paidAt: new Date().toISOString(),
                'paymentResult.id': req.body.id,
                'paymentResult.status': req.body.email_address,
                'paymentResult.email_address': req.body.id,
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
  
    res.send({ message: 'order paid' });
  })
  .use(isAuth);
export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
