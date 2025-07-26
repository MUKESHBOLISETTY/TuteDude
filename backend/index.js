import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { connect } from './config/database.js';
import { cloudinaryConnect } from './config/cloudinary.js';
import fileUpload from 'express-fileupload';
import userRoutes from './routes/User.js';
<<<<<<< Updated upstream
import productRoutes from './routes/Product.js';
=======
import orderRoutes from './routes/Order.js';

>>>>>>> Stashed changes
const app = express();
const port = 4000;

connect();

app.use(express.json());
app.use(cookieParser());
const corsoptions = {
  origin: "*",
  methods: "GET, POST, PUT, DELETE, HEAD, PATCH",
  credentials: true,
}
app.use(cors(corsoptions));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);


cloudinaryConnect();

app.use("/api/v1/auth",userRoutes);
<<<<<<< Updated upstream
app.use("/api/v1/product", productRoutes);
=======
app.use("/api/v1/orders",orderRoutes);

>>>>>>> Stashed changes

app.get('/', (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running",
  });
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}.`);
});