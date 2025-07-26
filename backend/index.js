import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { connect } from './config/database.js';
// import { cloudinaryConnect } from './config/cloudinary.js';
import fileUpload from 'express-fileupload';

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

// cloudinaryConnect();

app.get('/', (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running",
  });
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}.`);
});