/*steps:
1. toggleSubscription
Goal: Toggle the subscription status of the logged-in user for a specific channel.
Steps:
Validate channelId.
Check if the channel exists.
Prevent a user from subscribing to their own channel.
Check if the user is already subscribed.
If subscribed, unsubscribe (delete the subscription); if not, subscribe (create a subscription).
2. getUserChannelSubscribers
Goal: Fetch the list of subscribers for a specific channel.
Steps:
Validate channelId.
Check if the channel exists.
Fetch all subscriptions where the channel is the specified channelId.
Return the list of subscribers.
3. getSubscribedChannels
Goal: Fetch the list of channels a specific user has subscribed to.
Steps:
Validate subscriberId.
Check if the subscriber exists.
Fetch all subscriptions where the subscriber is the specified subscriberId.
Return the list of channels. */

import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/c/:channelId")
    .get(getUserChannelSubscribers) // Fixed: Should fetch subscribers of the channel
    .post(toggleSubscription);

router.route("/u/:subscriberId").get(getSubscribedChannels); // Fixed: Should fetch channels the user subscribed to

export default router;