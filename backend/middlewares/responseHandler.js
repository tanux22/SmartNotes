export const responseHandler = (req, res, next) => {
  res.sendResponse = (data, statusCode = 200) => {
    let statusText;

    switch (statusCode) {
      case 200: statusText = "OK"; break;
      case 201: statusText = "Created"; break;
      case 400: statusText = "Bad Request"; break;
      case 404: statusText = "Not Found"; break;
      case 500: statusText = "Internal Server Error"; break;
      default: statusText = "Unknown Status";
    }

    return res.status(statusCode).json({
      success: statusCode >= 200 && statusCode < 300,
      status: statusCode,
      message: statusText,
      data: data || null,
    });
  };

  next();
};
 