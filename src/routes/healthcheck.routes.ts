import { Router } from "express";
import { healthCheck } from "../controllers/healthcheck.controllers";
const router = Router();
console.log("I am inside healthcheck router");

router.get("/", healthCheck);

export default router;
