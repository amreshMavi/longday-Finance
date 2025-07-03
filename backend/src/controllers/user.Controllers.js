import User from '../models/user.Model.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const registerUser = async (req, res, next) => {
    const { username, email, password } = req.body

    try {
        
        const existingUser = await User.findOne({ $or: [{ username }, { email}]})
        if(existingUser){
            return res.status(409).json({ message: 'Username or email already in use' });
        }

    } catch (error) {
        
        return res.status(500).json({ message: 'Internal server error' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
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