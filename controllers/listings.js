const Listing=require("../models/listing.js");


module.exports.index= async(req,res)=>{
    const allListing=await Listing.find({});
    res.render("listings/index.ejs", {allListing});
};



module.exports.renderNewForm= (req,res)=>{
    // console.log(req.user);
    res.render("listings/new.ejs");
};



module.exports.showListings=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({path:"reviews", 
        populate:{
         path:"author",
        }})
    .populate("owner");
    if(!listing){
        req.flash("error","Listing Does not Exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};


module.exports.createListings=async(req,res)=>{
    // let{title,description,image,price,location,country}=req.body;
    // let listing=req.body.listing;
    let url=req.file.path;
    let filename=req.file.filename;
    // console.log(url,"..",filename);
    const newListing = new Listing(req.body.listing);
    console.log(newListing);
    console.log(req.user);
    newListing.owner =req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("Success"," New listing Created Succcesfully");
    res.redirect("/listings");
};

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    // console.log(id,"this is listing id");
    const listing=await Listing.findById(id);
    // console.log(listing);
    if(!listing){
        req.flash("error","Listing Does not Exist For Edit");
        res.redirect("/listings");
    }

    let originalListingImageUrl=listing.image.url;
    let originalImageUrl=originalListingImageUrl.replace("/upload","/upload/h_300,w_250");

    res.render("listings/edit.ejs",{listing, originalImageUrl});

};


module.exports.updateListings=async (req,res)=>{
    let {id}=req.params;
    let result=await Listing.findByIdAndUpdate(id, {...req.body.listing});
    // console.log(result);
    if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        result.image={url,filename}; 
        await result.save();
    }

    req.flash("Success"," Listing Updated!");
     res.redirect(`/listings/${id}`);
};


module.exports.deleteListings=async (req,res)=>{
    let{id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("Success","listing Deleted Succcesfully!");
    res.redirect("/listings");
};