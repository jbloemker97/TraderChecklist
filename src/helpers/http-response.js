function httpResponse ({ statusCode, data, headers = null }) {
    const success = statusCode >= 200 && statusCode < 300 ? true : false;

    return Object.freeze({
        success,
        statusCode,
        data,
        headers    
    });
}

module.exports = httpResponse;