import { signToken } from "@/utils/auth";
import client from "@/utils/client";
import config from "@/utils/config";
import axios from "axios";
import bcrypt from "bcryptjs";
import { createRouter } from "next-connect";

const router = createRouter();

router.post(async (req, res) => {
  try {
    const projectId = config.projectId;
    const dataset = config.dataset;
    const tokenWithWriteAccess = process.env.SANITY_AUTH_TOKEN;
    const createMutations = [
      {
        create: {
          _type: "user",
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password),
          isAdmin: false,
        },
      },
    ];
    const existUser = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      {
        email: req.body.email,
      }
    );
    if (existUser) {
      return res.status(401).send({ message: "Email aleardy exists" });
    }
    const { data } = await axios.post(
      `https://${projectId}.api.sanity.io/v1/data/mutate/${dataset}?returnIds=true`,
      { mutations: createMutations },
      {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${tokenWithWriteAccess}`,
        },
      }
    );
    const userId = data.results[0].id;
    const user = {
      _id: userId,
      name: req.body.name,
      email: req.body.email,
      isAdmin: false,
    };
    const token = signToken(user);
    res.send({ ...user, token });
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
