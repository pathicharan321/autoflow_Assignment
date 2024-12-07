import {Schema,model} from 'mongoose';

const analyticsschema=new Schema({
    shortUrl:{ type: String,required:true},
    city:{type: String},
    country:{type: String}
})

const analyticsmodel=new model("analyticsmodel",analyticsschema);
export default analyticsmodel;