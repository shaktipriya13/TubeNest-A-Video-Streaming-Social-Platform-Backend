import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";
//destructure {} krke import tab le skte ha jab export default na ho

// & for file uploadd handling:
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/register").post(
    // uploads is a midddleware coming from multer package...fields is one of its property
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

router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);

// & making an endpoint for refreshToken
router.route("/refresh-token").post(refreshAccessToken)

export default router;