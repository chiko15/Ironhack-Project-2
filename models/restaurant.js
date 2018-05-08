const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const restaurantSchema = new Schema({
  name: {type: String, unique: true, required: true},
  address: {type:String, required: true},
  cuisines: { type:String, enum: ['american', 'tai', 'mediterenian'] },
  average_cost_for_two: { type: String },
  price_range: { type: String },
  image: { type: String }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;