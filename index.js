const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database/db');
const query = require('./database/query');

// inisialiasi aplikasi express
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// inisialisasi port
const PORT = 3000;

// Connect ke MongoDB
db.connectDB();

// Rute utk GET semua user
app.get('/users', async (req, res) => {
    try {
        const users = await query.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error mendapatkan data users', error: err });
    }
});

// Rute untuk GET single user berdasarkan ID
app.get('/users/:id', async (req, res) => {
    try {
        const user = await query.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error mendapatkan data user', error: err });
    }
});

// Rute untuk GET SEARCH user berdasarkan nama
app.get('/search', async (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ message: "Name query parameter is required" });
    }
    try {
        const users = await query.searchUserByName(name);
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error mencari user', error: err });
    }
});

// Rute untuk POST CREATE user baru
app.post('/users', async (req, res) => {
    const user = req.body;
    if (!user.name || !user.age) {
        return res.status(400).json({ message: "Data user tidak lengkap. Nama dan umur harus diisi." });
    }
    try {
        const newUser = await query.createUser(user);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: 'Error membuat user baru', error: err });
    }
});

// Rute untuk PUT UPDATE data user berdasarkan ID
app.put('/users/:id', async (req, res) => {
    const userUpdate = req.body;
    if (!userUpdate.name && !userUpdate.age) {
        return res.status(400).json({ message: "Data update user tidak valid. Nama atau umur harus diisi." });
    }
    try {
        const updatedUser = await query.updateUser(req.params.id, userUpdate);
        if (!updatedUser) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Error mengupdate user', error: err });
    }
});

// Rute untuk DELETE data user berdasarkan ID
app.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await query.deleteUser(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }
        res.status(200).json({ message: "User berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ message: 'Error menghapus user', error: err });
    }
});

// Run server dan listen di port yang telah diinisialisasi
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
