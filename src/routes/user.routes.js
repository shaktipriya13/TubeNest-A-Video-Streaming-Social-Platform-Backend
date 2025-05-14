import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
//destructure {} krke import tab le skte ha jab export default na ho

const router = Router();
router.route("/register").post(registerUser);
// '/register' lagane par registerUser method will get called
export default router;