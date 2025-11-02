import { Router } from "express";
import { addCategory, allCategory, deleteCategory, oneCategory, updateCategory } from "../controllers/category.controller.js";

const cagetoryRoute = Router()

cagetoryRoute.post("/add", addCategory)
cagetoryRoute.get("/all", allCategory)
cagetoryRoute.get("/one/:id", oneCategory)
cagetoryRoute.patch("/update/:id", updateCategory)
cagetoryRoute.delete("/delete/:id", deleteCategory)


export default cagetoryRoute