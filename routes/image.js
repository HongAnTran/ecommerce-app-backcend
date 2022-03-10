import  express  from "express";
import { postImage ,deleteImage,deleteImages} from '../controller/image.js'
import multer from 'multer';
const imageRouter = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images');
      },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const uploadImg = multer({storage: storage}).single('image');

imageRouter.post('/',uploadImg,postImage)

imageRouter.post('/delete',deleteImage);

imageRouter.post('/delete/multiple',deleteImages);


export default imageRouter