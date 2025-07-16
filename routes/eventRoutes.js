import { Router } from "express";
import {cancelRegistration, getEventDetails,getEventStats,joinEvent, listUpcomingEvents} from '../controllers/eventController.js'
import authRouter from "./authRoutes.js";

const eventRouter=Router();

eventRouter.get('/:id',getEventDetails);
eventRouter.post('/:id/join',authRouter,joinEvent);

eventRouter.post('/:id/cancel', authRouter, cancelRegistration);
eventRouter.get('/upcoming/all', listUpcomingEvents);
eventRouter.get('/:id/stats', authRouter, getEventStats);

export default eventRouter