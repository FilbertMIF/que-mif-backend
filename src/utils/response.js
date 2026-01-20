exports.success = (res, data = null, message = 'SUCCESS', status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    error: null
  })
}

exports.fail = (res, message = 'ERROR', status = 400, error = null) => {
  return res.status(status).json({
    success: false,
    message,
    data: null,
    error
  })
}
