import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from "../models/user_model.js";
import { createUserValidator, userValidator, updateUserValidator } from "../validators/user_validator.js";
import { mailTransport } from '../config/mail.js';

// Create an endpoint for user signup
export const signup = async (req, res) => {
    // Validate the request body
    const {value, error} = userValidator.validate(req.body);

    if(error) {
        return res.status(400).json(error.details[0].message)
    }

    const email = value.email
    // Check if user exists 
    const findIfUserExists = await UserModel.findOne({email})

    if (findIfUserExists) {
        return res.status(401).json({
            message: 'User has already signed'
        })
    } else {
        // Hash the password
        const hashedPassword = await bcrypt.hash(value.password, 10)
        value.password = hashedPassword
    }

    // Create a new user
    const user = await UserModel.create(value);

    return res.status(201).json({message: "Registration successful"});
}

export const login = async (req, res) => {
    try {
    
        const {email, username, password} = req.body;
    
        // Check if user exists
        const user = await UserModel.findOne({
            $or: [
                {email},
                {username}
            ]
        })
        if (!user) {
            return res.status(400).json({message: 'User not found'})
        }
    
        // Compare password entered to password in database
        const correctPassword = bcrypt.compareSync(password, user.password)
        if (!correctPassword) {
            return res.status(401).json('Ivalid credentials')
        }
    
        // Generate token
        const token = jwt.sign(
            {id: user.id},
            process.env.JWT_PRIVATE_KEY,
            {expiresIn: '3h'}
        )
    
        // Return response
        return res.status(201).json({
            message: 'User logged in',
            accessToken: token,
            user: {
                username: user.username,
                role: user.role
            }
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(error.message)
    }

}

// Create user profile
export const profile = async (req, res, next) => {
    try {
        // Get user id from session or request
        const id = req.session?.user?.id || req?.user?.id;
        // Find user by id
        const user = await UserModel.findById(id)
            .select({ password: false });
        // Return response
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

// Get users
export const getUsers = async (req, res) => {
    try {
        // Get all users
        const users = await UserModel
            .find()
            .select({ password: false });
        // Return response
        res.status(200).json(users);
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(error.message)
    }
}

// Endpoint for admin to create a user
export const createUser = async (req, res) => {
    try {
        const {error, value} = createUserValidator.validate(req.body);
        if(error) {
            return res.status(400).json(error.message[0].details)
        }
    
        // Encrypt user password
        const hashedPassword = bcrypt.hash(value.password)
        // Create the user
        const user = await UserModel.create({
            ...value,
            password: hashedPassword
        });
    
        // Send email to the user
        await mailTransport.sendMail({
            to: value.email,
            subject: 'User Account Created',
            text: `Dear user,\n\n A user account has been created for you with the following credentials.\n\nUsername: ${value.username}\nEmail: ${value.email}\nPassword: ${value.password}\nRole: ${value.role}\n\nThank you!`
        })
    
        // Return response
        res.status(201).json('User created')
    } catch (error) {
        console.log(error.message)
        res.status(500).json(error.message)
    }
}

// Endpoint for admin to update user profile
export const updateUser = async (req, res) => {
    try {
        // Validate request
        const { value, error } = updateUserValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        // Update user
        await UserModel.findByIdAndUpdate(
            req.params.id,
            value,
            { new: true }
        );
        // Return response
        res.status(200).json('User Updated');
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(error.message)
    }
}

export const logout = async (req, res) => {
    try {
        // Clear the token on the client-side by instructing the client to remove the token from storage
        // Return response
        return res.status(200).json('Logout successful')
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(error.message)

    }
}