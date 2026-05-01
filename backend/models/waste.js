import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const wasteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    wasteType: {
        type: String,
        enum: ["dry", "wet", "recyclable", "hazardous"],
        required: true,
    },

    quantity: {
        type: Number,
        required: true,
    },

    date: {
        type: Date,
        default: Date.now,
    },
})

const Waste = new mongoose.model("Waste", wasteSchema);

export default Waste;
