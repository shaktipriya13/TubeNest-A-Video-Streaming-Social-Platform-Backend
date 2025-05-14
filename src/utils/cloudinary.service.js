// todo : This code is a utility module to upload files (like images/videos) from your local server to Cloudinary and handle any failures gracefully.




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
// & This function receives a local file path and uploads it to Cloudinary.
// & we need to just provide local file path to this fxn and it will upload file on cloudinary and it will return url as a response
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // & If no file was passed, exit early.

        // upload file on Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"//auto detect krlo file type
        })
        // if file uploaded successfully
        console.log("file is uploaded on cloudinary", response.url);//will print on console the public url after the file upload
        // & Returns the public Cloudinary URL |
        // even if file uploads sucessfully on cloudinary we ought to remove this file from the server
        return response;
        // cloudinary file sends url in form of response 

    } catch (error) {
        // & If the upload fails, it deletes the local file using fs.unlinkSync() to avoid wasting server storage.

        fs.unlinkSync(localFilePath)//remove the locally saved temporary file as the upload operation got failed 
        return null;
    }
}





export { uploadOnCloudinary }


