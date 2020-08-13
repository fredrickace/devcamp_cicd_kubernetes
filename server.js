const express = require('express');
const dotEnv = require('dotenv');

//Load env vars
dotEnv.config({path:'./config/config.env'});

const app = express();

// app.get('/', (req, res) => {
//     // res.send("<h1>Hello Express</h1>");
//     // res.status(400).json({error: 'Error Example'});
//     // res.send({name: 'Fred'});
//     res.status(200).json({user:'Fred'});
// });

app.get('/api/v1/bootcamps/:id', (req, res) => {
   res.status(200).json({success:true, msg:`Get bootcamp ${req.params.id}`});
});

app.post('/api/v1/bootcamps', (req, res) => {
    res.status(200).json({success:true, msg:'Create new bootcamp'});
});

app.put('/api/v1/bootcamps/:id', (req, res) => {
    res.status(200).json({success:true, msg:`Update bootcamp ${req.params.id}`});
});

app.delete('/api/v1/bootcamps/:id', (req, res) => {
    res.status(200).json({success:true, msg:`Delete bootcamp ${req.params.id}`});
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} on port ${process.env.PORT}`);
});