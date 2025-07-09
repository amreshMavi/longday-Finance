import { User } from '../models/user.model.js';

const registerUser = async (req, res, next) => {
    console.log("req.body is", req.body);
    const { username, email, password } = req.body

    try {
        
        const existingUser = await User.findOne({ $or: [{ username }, { email}]})
        if(existingUser){
            return res.status(409).json({ message: 'Username or email already in use' });
        }
        if (!username || !email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }

    } catch (error) {
        
        return res.status(500).json({ message: 'Internal server error' });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        username,
        email,
        password,
        coverImage: req.file ? req.file.path : null
    })

    try {
        const saveUser = await newUser.save()
        return res.status(201).json({ message: 'User registered successfully'})
    } catch (error) {
        console.error('Error saving user:', error);
        return res.status(500).json({ message: 'Internal sever error' });
    }

}

const loginUser = async (req, res, next) => {
    console.log("req.body is", req.body)
    const {email, password, username} = req.body;

    const existingUser = await User.findOne({$or: [{email}, {username}]})
    try {
        
        if(!existingUser) {
            res.status(401).json({ message: "User does not exist" });
        }

        const isMatch = await existingUser.isPasswordCorrect(password)

        if(!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }
        
        const accessToken = existingUser.generateAccessToken();
        const refreshToken = existingUser.generateRefreshToken();

        existingUser.refreshToken = refreshToken;
        await existingUser.save();

        res.status(200).json({
            message: "Login successful",
            user: {
                _id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email
            },
            accessToken,
            refreshToken
        })


    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message})
    }
}

export {registerUser, loginUser}