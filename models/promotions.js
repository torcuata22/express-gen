const mongoose = require("mongoose");
const Schema = mongoose.Schema;

require("mongoose-currency").loadType(mongoose); //we are adding this package and adding a new data type from the library
const Currency = mongoose.Types.Currency; //adds Currency data type

const promotionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: { type: String, required: true },
    featured: {
      type: Boolean,
      default: false,
    },
    cost: {
      type: Currency,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Promotion = mongoose.model("Promotion", promotionSchema);

module.exports = Promotion;
