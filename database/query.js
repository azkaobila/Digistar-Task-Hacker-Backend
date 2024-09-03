const mongoose = require('mongoose');
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

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    searchUserByName
};