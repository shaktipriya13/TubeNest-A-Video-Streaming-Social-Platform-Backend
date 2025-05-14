import multer from "multer";

const storage = multer.diskStorage({
    // instead of disk storage we could also use memory storage
    destination: function (req, file, cb) {
        cb(null, './public/temp')
        // nanoid is a tiny and super-fast library used to generate unique IDs — just like uuid, but smaller and faster.
        // fileNames can be kept through nanoids for being unique
    },
    filename: function (req, file, cb) {
        // cb is callback
        cb(null, file.originalname)
    }
})

export const upload = multer({
    storage,
})