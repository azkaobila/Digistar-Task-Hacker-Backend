const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const schema = require('./schema');

const users = mongoose.model('users', schema.userSchema);

async function getAllUsers() {
    return await users.find();
}

async function getUserById(id) {
    return await users.findById(id);
}

async function createUser(user) {
    return await users.create(user);
}

async function updateUser(id, user) {
    return await users.findByIdAndUpdate(id, user, { new: true });
}

async function deleteUser(id) {
    return await users.findByIdAndDelete(id);
}

async function searchUserByName(name) {
    return await users.find({ name: name });
}

async function getUserByEmail(email) {
    return await users.findOne({ email: email });
}

async function registerUser({ name, age, email, password }) {
    const existingUser = await users.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists with this email');
    }
    return await createUser({ name, age, email, password });
}

async function loginUser({ email, password }) {
    const user = await users.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });
    return { token, user };
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    searchUserByName,
    getUserByEmail, 
    registerUser,
    loginUser
};