const Listing = require("../models/listing.js");
const Review=require("../models/review.js");



module.exports.createReviewRoute=async (req , res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    newReview.author=req.user._id; 
   
    console.log(listing);
    console.log(newReview);


    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("Success"," New Review Updated!");
    res.redirect(`/listings/${listing._id}`);

};


module.exports.deleteReviewRoute=async(req,res)=>{
    let {id, reviewId}=req.params;
    console.log(id,reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("Success","Review Deleted!");
    res.redirect(`/listings/${id}`);
};