const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxLength: [50, 'Name cannot be more than 50 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a Description'],
        maxLength: [500, 'Description cannot be more than 50 characters']
    },
    website: {
        type: String,
        match: [
            /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
            , 'Please use a valid URL with HTTP or HTTPS'
        ]
    },
    phone: {
        type: String,
        maxLength: [20, 'Phone number cannot be longer than 20 characters']
    },
    email: {
        type: String,
        match: [
            /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,20}$/, 'Please add a valid email'
        ]
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    location: {
//        GeoJson  Point
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    careers: {
        //        Array of strings
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating cannot be more than 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

//Create bootcamp slug from the name
BootcampSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {lower: true});
    next();
});

//Geocode & Create location field
BootcampSchema.pre('save', async function(next) {
    const loc = await geocoder.geocode(this.address);
    console.log(loc);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode
    }
    //Uncomment if you Do not save address in DB
    // this.address = undefined;
    next();
});

//Cascade delete courses when a bootcamp is deleted
BootcampSchema.pre('remove', async function (next) {
    console.log(`Courses being removed from bootcamp ${this._id}`);
   await this.model('Course').deleteMany({bootcamp:this._id});
   next();
});

//Reverse populate with virtuals
BootcampSchema.virtual('courses', {
    ref: 'Course',
    localField:"_id",
    foreignField: 'bootcamp',
    justOne: false
})

module.exports = mongoose.model('Bootcamp', BootcampSchema);














