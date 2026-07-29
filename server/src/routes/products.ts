import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { validate } from "../middlewares/validate.js";
import { objectIdParam } from "../validation/common.js";
import { createProductSchema, updateProductSchema } from "../validation/product.js";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/products.js";

const router = Router();
router.use(authenticate);
router.get("/", getProducts);
router.post("/", authorize("admin", "superadmin"), validate({ body: createProductSchema }), createProduct);
router.patch("/:id", authorize("admin", "superadmin"), validate({ params: objectIdParam, body: updateProductSchema }), updateProduct);
router.delete("/:id", authorize("admin", "superadmin"), validate({ params: objectIdParam }), deleteProduct);
export default router;
