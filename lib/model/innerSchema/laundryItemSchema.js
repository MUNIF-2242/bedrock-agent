// models/LaundryItem.js
import mongoose from "mongoose";

const laundryItemSchema = new mongoose.Schema({
  item: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: String, required: true },
  approximateTime: { type: String, required: true },
});

export default laundryItemSchema;
