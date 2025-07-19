import { Router } from "express";
import { createRoomRequest, getAllRoomRequests} from "../controller.js/roomRequest.controller.js"
import authMiddleware from "../middlewares/auth.js"; 

const router = Router();

router.post("/", authMiddleware, createRoomRequest);
router.get("/", getAllRoomRequests);

export default router;