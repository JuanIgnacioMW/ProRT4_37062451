import {Router} from "express";
import {libro} from "./controller.js";

export const router = Router()

router.get('/libro', libro.getAll);
router.post('/libro', libro.add);
router.delete('/libro', libro.detele);
router.put('/libro', libro.update);
router.get('/libro/:id', libro.getOne);
router.delete('/libro/ISBN', libro.deleteByISBN);