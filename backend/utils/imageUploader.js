import {v2 as cloudinary} from 'cloudinary';

export const uploadImageCloudinary = async (base64, folder, height, quality) =>{

    const options = { folder };
    if (height) {
        options.height = height;
    }
    if (quality) {
        options.quality = quality;
    }
    options.resource_type = "auto";

    return await cloudinary.uploader.upload(base64, options);
};

