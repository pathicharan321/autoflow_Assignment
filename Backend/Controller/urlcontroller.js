import urlmodel from "../Schema/urlschema.js";
import { nanoid } from 'nanoid'
import QRCode from 'qrcode'
import validator from 'validator';
import analyticsmodel from "../Schema/analyticsschema.js";
export const postcreateshorturl=async(req,res)=>{
    console.log(req.body);
    try{
    const {longUrl,customalias}=req.body;
    console.log(req.body.longUrl);
           
    if(!validator.isURL(longUrl)){
       return res.status(400).json({ "message": "Invalid URL" });
    }
    const shorturl=customalias||nanoid(10);
    let qrcode=' ';
    try {
        qrcode = await QRCode.toDataURL(shorturl);
        console.log(qrcode);
    } catch (err) {
        console.error('QR Code generation failed:', err);
        return res.status(500).json({ message: 'Failed to generate QR Code' });
    }
   const newurl=await urlmodel.create({
        longUrl,
        shortUrl:shorturl,
        qrcode
    })
   res.status(200).json(newurl);
   }
   catch(err){
    res.status(500).json({"Error":err})
   }
}

export const getshorturl=async(req,res)=>{
    try{ 
    const urls = await urlmodel.find({}, { shortUrl: 1, longUrl: 1, _id: 0 });
   res.status(200).json(urls);
    }
   catch(err){
    res.status(500).json({"message":err})
    }
}


export const geturldetails=async(req,res)=>{
    try{
    const shorturl=req.params.code;
    console.log(req.headers);
    console.log(shorturl);
    const details=await urlmodel.findOne({shortUrl:shorturl});
    return res.status(200).json(details);
    }
    catch(err){
        res.status(500).json({message:"Internal server Error"})
     }
}

export const deleteurl=async(req,res)=>{
    try{
    const shorturl=req.params.code;
    await urlmodel.deleteOne({ shortUrl: shorturl });
     res.status(200).json({message:"Url deleted successfully"});
    }
    catch(err){
       res.status(500).json({message:"Internal server Error"})
    }
}

export const getredirect=async(req,res)=>{
    try{
        const shorturl=req.params.code;
        const updatedData = await urlmodel.findOneAndUpdate(
            {shortUrl:shorturl }, 
            {$inc:{clicks: 1 } },
            { new: true });
            console.log(updatedData);
        const userdata= await fetch("https://ipapi.co/json");
        const {city,country_name}=await userdata.json();
        const addeddate= await analyticsmodel.create({
            shortUrl:shorturl,
            city:city,
            country:country_name
        })
        console.log(addeddate);
        if (updatedData) {
            res.redirect(updatedData.longUrl);
          } else {
            res.status(404).json({ message: "Short URL not found" });
          }
    }
    catch{
        return res.status(500).json({message:"Internal server Error"})
    }
}

export const getstatsforcode=async (req,res)=>{
    try{
        const shorturl=req.params.code;
        const urldata=await urlmodel.findOne({shortUrl:shorturl});
        const analyticsarr=await analyticsmodel.find({shortUrl:shorturl});
        console.log(analyticsarr);
        if (urldata) {
           return  res.status(200).json({ "No.ofClicks": urldata.clicks,analytics: analyticsarr  });
          } else {
            return res.status(404).json({ message: "Short URL not found" });
          }
    }
    catch(err){
       return  res.status(500).json({message:"Internal server Error"})
     }
}


export const getqrcode=async(req,res)=>{
    try{
        const shorturl=req.params.code;
        console.log(shorturl)
        const urldata=await urlmodel.findOne({shortUrl:shorturl});
        if (urldata) {
            return  res.status(200).json({  "Qrcode": urldata.qrcode });
           } else {
             return res.status(404).json({ message: "Short URL not found" });
           }
    }
    catch(err){
        return  res.status(500).json({message:"Internal server Error"})
    }
}