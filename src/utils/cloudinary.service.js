// // todo : This code is a utility module to upload files (like images/videos) from your local server to Cloudinary and handle any failures gracefully.




// import { v2 as cloudinary } from 'cloudinary';
// // this file's code is very reusable

// import fs from 'fs'




// // Configuration krne se hi file upload krne ki persmission milti ha
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
// })





// // Upload an image
// // & This function receives a local file path and uploads it to Cloudinary.
// // & we need to just provide local file path to this fxn and it will upload file on cloudinary and it will return url as a response
// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null;
//         // & If no file was passed, exit early.

//         // upload file on Cloudinary
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto"//auto detect krlo file type
//         })
//         // if file uploaded successfully
//         // & Returns the public Cloudinary URL |
//         // even if file uploads sucessfully on cloudinary we ought to remove this file from the server

//         fs.unlinkSync(localFilePath)//removes the locally saved file even if the file upload was successful
//         console.log(response);
//         return response;
//         // cloudinary file sends url in form of response 

//     } catch (error) {
//         // & If the upload fails, it deletes the local file using fs.unlinkSync() to avoid wasting server storage.

//         fs.unlinkSync(localFilePath)//remove the locally saved temporary file as the upload operation got failed 
//         return null;
//     }
// }


// // Delete a file from Cloudinary using its URL
// const deleteFromCloudinary = async (cloudinaryUrl) => {
//     try {
//         if (!cloudinaryUrl) return null;
//         // If no URL is provided, exit early

//         // Extract the public_id from the Cloudinary URL
//         // Example URL: https://res.cloudinary.com/<cloud-name>/image/upload/<public_id>.<format>
//         const publicId = cloudinaryUrl.split('/').pop().split('.')[0];

//         // Delete the file from Cloudinary
//         const result = await cloudinary.uploader.destroy(publicId);

//         console.log("File deleted from Cloudinary:", publicId);
//         return result;
//         // Returns the Cloudinary response (e.g., { result: "ok" })
//     } catch (error) {
//         console.error("Error deleting from Cloudinary:", error);
//         return null;
//         // Return null to indicate failure, but don't throw an error to avoid blocking the main operation
//     }
// };





// export { uploadOnCloudinary, deleteFromCloudinary }


import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath, resourceType = "auto") => {
    try {
        if (!localFilePath) return null;

        const options = {
            resource_type: resourceType,
            overwrite: true,
            invalidate: true // Invalidate CDN cache for updated files
        };

        // Apply video-specific options if the resource is a video
        if (resourceType === "video" || localFilePath.match(/\.(mp4|mov|avi|mkv)$/i)) {
            options.folder = "videos"; // Store videos in a "videos" folder
            options.eager = [
                { streaming_profile: "hd", format: "m3u8" } // Generate HLS streaming format
            ];
            options.eager_async = true; // Generate transformations asynchronously
        } else {
            options.folder = "images"; // Store images (e.g., thumbnails) in an "images" folder
        }

        const response = await cloudinary.uploader.upload(localFilePath, options);
        return response;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return null;
    }
};

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
    try {
        if (!publicId) return null;
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        return true;
    } catch (error) {
        console.error(`Cloudinary delete error (${resourceType}):`, error);
        return false;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };