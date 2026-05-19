const Listing = require("../models/listing");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { cloudinary } = require("../cloudConfig");
const streamifier = require('streamifier');

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    return res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res) => {

    let url, filename;
    // Handle cases where multer storage provides a path/filename (Cloudinary multer storage)
    // or where multer uses memoryStorage and provides a buffer (we must upload it to Cloudinary)
    if (req.file) {
        if (req.file.path && req.file.filename) {
            url = req.file.path;
            filename = req.file.filename;
        } else if (req.file.buffer) {
            // upload buffer to Cloudinary
            const uploadFromBuffer = (buffer) => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream({ folder: 'wanderlust_DEV' }, (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    });
                    streamifier.createReadStream(buffer).pipe(uploadStream);
                });
            };
            const resultUpload = await uploadFromBuffer(req.file.buffer);
            url = resultUpload.secure_url || resultUpload.url;
            filename = resultUpload.public_id || resultUpload.asset_id || resultUpload.filename;
        }
    }

    let result = listingSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(400, result.error);
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_50");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const updated = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (!updated) {
        throw new ExpressError(404, "Listing not found");
    }

    if (req.file) {
        let url, filename;
        if (req.file.path && req.file.filename) {
            url = req.file.path;
            filename = req.file.filename;
        } else if (req.file.buffer) {
            // upload buffer
            const uploadFromBuffer = (buffer) => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream({ folder: 'wanderlust_DEV' }, (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    });
                    streamifier.createReadStream(buffer).pipe(uploadStream);
                });
            };
            const resultUpload = await uploadFromBuffer(req.file.buffer);
            url = resultUpload.secure_url || resultUpload.url;
            filename = resultUpload.public_id || resultUpload.asset_id || resultUpload.filename;
        }
        updated.image = { url, filename };
        await updated.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        throw new ExpressError(404, "Listing not found");
    }
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
}
