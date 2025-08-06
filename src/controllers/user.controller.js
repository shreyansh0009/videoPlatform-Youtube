import { asyncHandler } from '../utils/asyncHandler.js'
 
// asyncHandler is higher order function, that accepts fun as argument, that's why a callback fun.
const registerUser = asyncHandler( async (req, res) => {
    return res.status(200).json({
        message: "Hello Saurabh!"
    })
})

export {registerUser}