import mongoose from "mongoose";

const laundryOrderSchema = new mongoose.Schema({
  items: [
    {
      item: { type: String, required: true },
      type: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: String, required: true },
      approximateTime: { type: String, default: null },
    },
  ],

  totalPrice: {
    type: String,
  },

  currency: {
    type: String,
    default: "USD",
  },

  paymentStatus: {
    type: String,
    enum: ["Unpaid", "Paid", "Partial", "Refunded"],
    default: "Unpaid",
  },

  orderStatus: {
    type: String,
    enum: ["Pending", "In Progress", "Ready", "Completed", "Cancelled"],
    default: "Pending",
  },

  pickupScheduled: { type: Date, default: null },
  deliveryScheduled: { type: Date, default: null },
  actualDelivery: { type: Date, default: null },

  reminderRequested: {
    type: Boolean,
    default: false,
  },

  reminderSent: {
    type: Boolean,
    default: false,
  },

  reminderSentAt: {
    type: Date,
    default: null,
  },

  notes: {
    type: String,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

// Auto-update updatedAt before save
laundryOrderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Prevent model recompilation (Singleton pattern)
let LaundryOrder;
if (mongoose.models.LaundryOrder) {
  LaundryOrder = mongoose.model("LaundryOrder");
} else {
  LaundryOrder = mongoose.model("LaundryOrder", laundryOrderSchema);
}

export default LaundryOrder;
