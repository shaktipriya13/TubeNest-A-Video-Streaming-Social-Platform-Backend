// import { Router } from "express";
// import { loginUser, logoutUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";
// //destructure {} krke import tab le skte ha jab export default na ho

// // & for file uploadd handling:
// import { upload } from '../middlewares/multer.middleware.js'
// import { verifyJWT } from "../middlewares/auth.middleware.js";

// const router = Router();
// router.route("/register").post(
//     // uploads is a midddleware coming from multer package...fields is one of its property
//     upload.fields([

//         // in frontEnd also these fields should be named as avatar and coverImage
//         {
//             name: "avatar", maxCount: 1
//         },
//         {
//             name: "coverImage", maxCount: 1
//         }
//     ]),
//     registerUser);
// // '/register' lagane par registerUser method will get called

// router.route("/login").post(loginUser)

// // secured routes
// router.route("/logout").post(verifyJWT, logoutUser);

// // & making an endpoint for refreshToken
// router.route("/refresh-token").post(refreshAccessToken)

// export default router;


import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
} from "../controllers/user.controller.js";
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public Routes (No Authentication Required)
router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
);

router.route("/login").post(loginUser);

router.route("/refresh-token").post(refreshAccessToken);

// Secured Routes (Require Authentication via verifyJWT)
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router.route("/update-avatar").post(
    verifyJWT,
    upload.single("avatar"),
    updateUserAvatar
);

router.route("/update-cover-image").post(
    verifyJWT,
    upload.single("coverImage"),
    updateUserCoverImage
);

export default router;