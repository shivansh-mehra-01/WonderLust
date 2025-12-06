const cloudinaryLib = require('cloudinary');
const cloudinary = cloudinaryLib.v2;
// Try to require either the official @cloudinary package or the older
// multer-storage-cloudinary package. Different packages export different
// shapes, so handle both possibilities.
const multer = require('multer');
let storage = multer.memoryStorage();
let storageModule = null;

try {
  storageModule = require('@cloudinary/multer-storage-cloudinary');
} catch (e) {
  try {
    storageModule = require('multer-storage-cloudinary');
  } catch (e2) {
    storageModule = null;
  }
}

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// By default prefer multer memory storage and perform Cloudinary uploads
// explicitly in controllers. To opt into using a multer Cloudinary storage
// adapter, set `USE_MULTER_CLOUDINARY=1` in your environment.
if (process.env.USE_MULTER_CLOUDINARY === '1' && storageModule) {
  // storageModule might export { CloudinaryStorage } or the constructor directly
  const CloudinaryStorage = storageModule.CloudinaryStorage || storageModule;
  try {
    if (typeof CloudinaryStorage === 'function') {
      // Some storage packages export { CloudinaryStorage } (modern) while
      // others export a factory function directly (older). Older wrapper
      // implementations expect the root cloudinary module (so that
      // `cloudinary.v2` exists), while modern ones accept the v2 object.
      const paramCloud = storageModule.CloudinaryStorage ? cloudinary : cloudinaryLib;
      // Try constructor invocation
      storage = new CloudinaryStorage({
        cloudinary: paramCloud,
        params: {
          folder: 'wanderlust_DEV',
          allowedFormats: ['png', 'jpg', 'jpeg'],
        },
      });
    }
  } catch (e) {
    // Try factory-style invocation as last resort
    try {
      const paramCloud = storageModule.CloudinaryStorage ? cloudinary : cloudinaryLib;
      storage = CloudinaryStorage({
        cloudinary: paramCloud,
        folder: 'wanderlust_DEV',
        allowedFormats: ['png', 'jpg', 'jpeg'],
      });
    } catch (e2) {
      storage = null;
    }
  }
}


module.exports ={
    cloudinary,
    storage,
};