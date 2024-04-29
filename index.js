
import express from 'express'
import env from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import { errorHandler } from './middlewares/errorHandler.js'
const app = express()

//middleware
app.use(express.json())


env.config()
mongoose.connect(process.env.MONGODB_URL)



//-------------------------requireing-Routes----------------------------//

import userRoute from './routes/userRoutes.js'


//-------------------------------Cors config----------------------------//

const corsOptions = {
  origin: process.env.FRONTEND_ENDPOINT,
  methods: ["GET", "POST", "PUT", "PATCH"]
};
app.use(cors(corsOptions));

//----------------------------------Routes------------------------------//

app.use("/",userRoute); 

//----------------------------------Server------------------------------//
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`server started running in ${port}`); 
});


app.use(errorHandler)