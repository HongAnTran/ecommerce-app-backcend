import  express  from "express";
import { getCurrentUsers ,createUser,getUsers ,editUser} from '../controller/user.js'



const userRouter = express.Router()

userRouter.get('/',getUsers)
userRouter.get('/current',getCurrentUsers)
userRouter.post('/',createUser)
userRouter.post('/edit',editUser)


export default userRouter