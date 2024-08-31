const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// inisialiasi aplikasi express
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// inisialisasi port
const PORT = 3000;

// inisialisasi array utk menyimpan data user
let users = [];

// Rute utk GET semua user
app.get('/users', (req, res) => {
    res.status(200).send(users);
});

// Rute utk GET single user berdsarkan ID
app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id, 10); // konversi ID ke integer
    if (isNaN(id) || id < 0 || id >= users.length) { // Validasi ID
        return res.status(404).send({ message: "User tidak ditemukan" });
    }
    res.status(200).send(users[id]); // Kirim data user jika ID valid
});

// Rute utk GET SEARCH user berdasarkan nama
app.get('/search', (req, res) => {
    const { name } = req.query;

    // check bahwa nama nya wajib diisi
    if (!name) {
        return res.status(400).send({ message: "Name query parameter is required" });
    }

    // Filter user berdasarkan nama
    const filteredUsers = users.filter(user => user.name && user.name.includes(name));
    res.status(200).send(filteredUsers);
});

// Rute utk POST CREATE user baru
app.post('/users', (req, res) => {
    const user = req.body;

    // Validasi data user
    if (!user.name || !user.age) {
        return res.status(400).send({ message: "Data user tidak lengkap. Nama dan umur harus diisi." });
    }
    
    users.push(user); // menambahkan user baru ke dalam array
    res.status(201).send(user);
});

// Rute utk PUT UPDATE data user berdasarkan ID
app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id, 10); // konversi id ke integer
    if (isNaN(id) || id < 0 || id >= users.length) { // Validasi ID
        return res.status(404).send({ message: "User tidak ditemukan" });
    }

    const userUpdate = req.body;

    // Validasi data user update
    if (!userUpdate.name && !userUpdate.age) {
        return res.status(400).send({ message: "Data update user tidak valid. Nama atau umur harus diisi." });
    }

    // Update user dengan data baru
    users[id] = { ...users[id], ...userUpdate };
    res.status(200).send(users[id]);
});

// Rute utk DELETE data user - dari ID
app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id, 10); // konversi id ke integer
    if (isNaN(id) || id < 0 || id >= users.length) { // Validasi ID
        return res.status(404).send({ message: "User tidak ditemukan" });
    }

    users.splice(id, 1); // Hapus user dari array
    res.status(200).send({ message: "User berhasil dihapus" });
});

// Run server dan Listen di port yg di-inisialisasi
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
