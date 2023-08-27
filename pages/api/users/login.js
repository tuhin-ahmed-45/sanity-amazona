import { signToken } from "@/utils/auth";
import client from "@/utils/client";
import bcrypt from "bcryptjs";
import { createRouter } from "next-connect";

const router = createRouter();

router.post(async (req, res) => {
  try {
    const user = await client.fetch(`*[_type == "user" && email == $email][0]`, {
      email: req.body.email,
    });
    console.log({user});
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      const token = signToken({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token,
      });
    } else {
      res.status(401).send({ message: "Invalid email or password" });
    }
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
