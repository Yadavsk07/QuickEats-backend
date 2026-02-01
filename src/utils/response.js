// Response Utility
// Standardized API response formatting

const responseUtils = {
  success: (res, data, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  },

  error: (res, message = 'Error', statusCode = 500, errors = null) => {
    res.status(statusCode).json({
      success: false,
      message,
      ...(errors && { errors }),
    });
  },

  paginated: (res, data, page, limit, total, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
      success: true,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  },
};

module.exports = responseUtils;
