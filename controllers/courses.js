const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');


// @desc Get Courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access Public
exports.getCourses = asyncHandler(async (req, res, next) => {

    if (req.params.bootcampId) {
        const courses = await Course.find({bootcamp: req.params.bootcampId});
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } else {

        res.status(200).json(res.advancedResults);
        // query = Course.find().populate('bootcamp'); This will get all fields of bootcamp
        // query = Course.find().populate({
        //     path: 'bootcamp',
        //     select: 'name description'
        // });
    }
});


// @desc Get single Courses
// @route GET /api/v1/courses/:id
// @access Public
exports.getCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if (!course) {
        return next(
            new ErrorResponse(`No Course with the id: ${req.params.id}`, 404)
        );
    }

    res
        .status(200)
        .json({
            success: true,
            data: course
        });
});

// @desc Add Courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access Private
exports.addCourse = asyncHandler(async (req, res, next) => {

    req.body.bootcamp = req.params.bootcampId;

    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(
            new ErrorResponse(`No Bootcamp with the id: ${req.params.bootcampId}`, 404)
        );
    }

    //Check if the user is the course/bootcamp owner
    if(!isOwnerOrAdmin(bootcamp.user.toString(), req.user.id, req.user.role)) {
        return next(new ErrorResponse(`User ${req.user.name} is not authorized to create a course for the bootcamp ${bootcamp.name}`, 403));
    }

    const course = await Course.create(req.body);

    res
        .status(200)
        .json({
            success: true,
            data: course
        });
});

// @desc Update Courses
// @route PUT /api/v1/courses/:id
// @access Private
exports.updateCourse = asyncHandler(async (req, res, next) => {

    let course = await Course.findById(req.params.id);

    if (!course) {
        return next(
            new ErrorResponse(`No Course with the id: ${req.params.id}`, 404)
        );
    }

    //Check if the user is the course/bootcamp owner
    if(!isOwnerOrAdmin(course.user.toString(), req.user.id, req.user.role)) {
        return next(new ErrorResponse(`User ${req.user.name} is not authorized to update the course ${course.name}`, 403));
    }


    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    await course.save();

    res
        .status(200)
        .json({
            success: true,
            data: course
        });
});

// @desc Delete Courses
// @route Delete /api/v1/courses/:id
// @access Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id);

    if (!course) {
        return next(
            new ErrorResponse(`No Course with the id: ${req.params.id}`, 404)
        );
    }

    //Check if the user is the course/bootcamp owner
    if(!isOwnerOrAdmin(course.user.toString(), req.user.id, req.user.role)) {
        return next(new ErrorResponse(`User ${req.user.name} is not authorized to update the course ${course.name}`, 403));
    }

    await course.remove();

    res
        .status(200)
        .json({
            success: true,
            data: {}
        });
});

isOwnerOrAdmin = (coursesUserID, requestedUserId, requestedUserRole) => {
    return coursesUserID === requestedUserId || requestedUserRole === 'admin';
};