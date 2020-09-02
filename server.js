const path = require('path');
const express = require('express');
const dotEnv = require('dotenv');
const morgan = require('morgan');
const errorHandler = require('./middleware/error')
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');

const connectDB = require('./config/db');


//Load env vars
dotEnv.config({path:'./config/config.env'});

//Connect to database
connectDB();

//Route Files

const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const app = express();

//Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//File uploading
app.use(fileUpload());

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Prevent XSS(Cross Site Scripting)
app.use(xss());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

//use the custom error handler only after basic routes...
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} on port ${process.env.PORT}`);
});

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
//    Close server $ exit process
    server.close(() => process.exit(1));
});