const advancedResults = (model, populate) => async (req, res, next) => {
    let query;

    //Copy req.query
    const reqQuery = {...req.query};

    //Fields to execute
    const removeFields = ['select', 'sort', 'page', 'limit'];

    //Loop over removeFields and delete them from reqQuery

    removeFields.forEach(param => delete reqQuery[param]);

    //Create query String
    let queryString = JSON.stringify(reqQuery);

    //Create operators ($gt, $gte etc)
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    //Finding resource
    query = model.find(JSON.parse(queryString))
    // query = model.find(JSON.parse(queryString)).populate({
    //     path: 'courses',
    //     select: 'title description'
    // });

    //Select Fields
    if (req.query.select) {
        //The mongoose selector needs the space between fields not the comma's. The string from select in the query
        // are separated by comma's. The below code splits the string into an array using comma and join them as a
        // string again using the space.
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);

    }

    //Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();
    console.log(`Total:${total}`);
    query = query.skip(startIndex).limit(limit);

    if (populate) {
        query = query.populate(populate);
    }

    //Executing Query
    const results = await query;
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.previous = {
            page: endIndex > total ? total : page - 1,
            limit
        }
    }

    res.advancedResults = {
        success:true,
        count: results.length,
        pagination,
        data: results
    }

    next();
};

module.exports = advancedResults;