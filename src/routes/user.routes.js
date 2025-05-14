import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
//destructure {} krke import tab le skte ha jab export default na ho

// & for file uploadd handling:
import { upload } from '../middlewares/multer.middleware.js'

const router = Router();
router.route("/register").post(
    // uploads.field is a midddleware coming from multer package
    upload.fields([
        // in frontEnd also these fields should be named as avatar and coverImage
        {
            name: "avatar", maxCount: 1
        },
        {
            name: "coverImage", maxCount: 1
        }
    ]),
    registerUser);
// '/register' lagane par registerUser method will get called
export default router;