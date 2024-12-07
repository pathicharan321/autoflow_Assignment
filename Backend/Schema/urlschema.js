import { Schema,model } from "mongoose";

const urlschema=new Schema({
    longUrl: { type: String, required: true},
    shortUrl: { type: String, required: true, unique: true },
    qrcode:{type: String, unique: true ,required:true},
    clicks: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
})

const urlmodel=new model("urlmodel",urlschema);
export default urlmodel;