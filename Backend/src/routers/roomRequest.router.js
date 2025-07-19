import { Router } from "express";
import { createRoomRequest, getAllRoomRequests, searchRoomRequests} from "../controller.js/roomRequest.controller.js"
import authMiddleware from "../middlewares/auth.js"; 

const router = Router();

router.post("/", authMiddleware, createRoomRequest);
router.get("/", getAllRoomRequests);
router.get("/search", authMiddleware, searchRoomRequests);

export default router;