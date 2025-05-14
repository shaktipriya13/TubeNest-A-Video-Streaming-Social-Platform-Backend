import { v2 as cloudinary } from 'cloudinary';
// this file's code is very reusable

import fs from 'fs'


// Configuration krne se hi file upload krne ki persmission milti ha
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
})

// Upload an image
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // upload file on Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"//auto detect krlo file type
        })
        // if file uploaded successfully
        console.log("file is uploaded on cloudinary", response.url);//will print on console the public url after the file upload
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath)//remove the locally saved temporary file as the upload operation got failed 
        return null;
    }
}
export {uploadOnCloudinary}


