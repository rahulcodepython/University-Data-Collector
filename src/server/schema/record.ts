import mongoose, { Schema } from "mongoose";

const schema = new Schema(
    {
        name: { type: String, required: true },
        student_code: { type: String, required: true },
        mobile: { type: String, required: true },
        place_of_living: { type: String, required: true },
        home_address: { type: String },
        pg_address: { type: String },
        pg_landmark: { type: String },
        pg_name: { type: String },
        pg_owner_mobile: { type: String },
        pg_owner_name: { type: String },
    },
    {
        timestamps: true
    }
)

const Record = mongoose.models.Record || mongoose.model("Record", schema)

export default Record;