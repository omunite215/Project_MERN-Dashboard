import { env } from "../config/env.js";
import { connectDB, disconnectDB } from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import Transaction from "../models/Transaction.js";
import OverallStat from "../models/OverallStat.js";
import AffiliateStat from "../models/AffiliateStat.js";
import {
  dataUser, dataProduct, dataProductStat, dataTransaction, dataOverallStat, dataAffiliateStat,
} from "./index.js";

async function seed() {
  await connectDB(env.MONGODB_URL);
  await Promise.all([
    User.insertMany(dataUser as never),
    Product.insertMany(dataProduct as never),
    ProductStat.insertMany(dataProductStat as never),
    Transaction.insertMany(dataTransaction as never),
    OverallStat.insertMany(dataOverallStat as never),
    AffiliateStat.insertMany(dataAffiliateStat as never),
  ]);
  console.log("Seed complete.");
  await disconnectDB();
}

seed().catch((err) => { console.error(err); process.exit(1); });
