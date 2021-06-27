const errorHandler = (err, req, res, next) => {
    let code;
    let name = err.name;
    let message;

    switch(name){
        case 'ALREADY_EXIST':
            code = 409;
            message = "Email is already exists!";
            break;
        case 'LOGIN_FAILED' :
            code = 401;
            message = "Email and password combination is wrong!";
            break;
        case 'INVALID_TOKEN' :
            code = 401;
            message = "Invalid access token!"
            break;
        case 'MISSING_TOKEN' :
            code = 401;
            message = "Missing access token!"
            break;
        case 'DATABASE_ERROR' :
            code = 500;
            message = "Database error!";
            break;
        default:
            code = 500;
            message = "Internal server error"
    }
    res.status(code).json({message});
};
module.exports = errorHandler;