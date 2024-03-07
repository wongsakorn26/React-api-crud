const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const mysql = require('mysql2/promise')

app.use(bodyParser.json())
app.use(cors())

const port = 2000
let conn = null

require('dotenv').config()
const initMySQL = async () => {
    conn = await mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    })
}

const jwt = require('jsonwebtoken');



const secretKey = require('crypto').randomBytes(64).toString('hex');

// สร้าง Access Token
function generateAccessToken(user) {
    return jwt.sign(user, secretKey, { expiresIn: '1h' }); // ใช้ secretKey เพื่อเข้ารหัส token
}

// Middleware authenticateToken
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); // ไม่มี Token ใน Header

    jwt.verify(token, secretKey, (err, user) => { // ใช้ secretKey เพื่อถอดรหัส token
        if (err) return res.sendStatus(403); // Token ไม่ถูกต้องหรือหมดอายุ
        req.user = user;
        next(); // ยืนยันตัวผู้ใช้สำเร็จ
    });
}



//creat path = เรียกว่า / และมีตัวแปล req, res
app.get('/users', async (req, res) => {
    try {
        const results = await conn.query('SELECT * FROM customer')
        res.json(results[0])
    } catch (error) {
        console.error('Error fetching users:', error.message)
        res.status(500).json({ error: 'Error fetching users' })
    }
})
app.get('/authuser', authenticateToken, async (req, res) => {
    try {
        const id = req.user.id;
        const results = await conn.query('SELECT * from customer where id=?', id);

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userData = results[0];

        // ตรวจสอบว่า cus_id เป็น "admin" หรือไม่
        const isAdmin = userData[0].cus_id === "admin";

        res.json({ 
            status: 'ok',
            userData,
             isAdmin
        });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ 
            message: 'Internal server error' 
        });
    }
});




app.get('/users/:id', async (req, res) => {
    try {
        let id = req.params.id
        const results = await conn.query('SELECT * FROM customer WHERE id = ?', id)

        // handle error 2
        if (results[0].length == 0) {
            throw { statusCode: 404, message: 'หาไม่เจอ' }
        }
        res.json(results[0][0])
    } catch (error) {
        console.error('error message', error.message) ///ฝั่งเราเห็น
        let statusCode = error.statusCode || 500 // handle status code ระหว่าง 404 , 500 จาก handle error 2
        res.status(statusCode).json({
            message: 'somthing wrong',
            //errorMessage: error.message //user จะเห็นerror เลยไม่ใช้ไป consoleข้างบน
        })
    }
})


app.post('/add', async (req, res) => {
    try {
        let user = req.body
        const results = await conn.query('INSERT INTO customer SET ?', user)
        res.json({
            message: 'insert ok',
            data: results[0]
        })
    } catch (error) {
        console.error('Error fetching users:', error.message)
        res.status(500).json({ error: 'Error fetching users' })
    }
})

app.post('/login', async (req, res) => {
    try {
        const { cus_id, cus_pwd } = req.body
        const [results] = await conn.query('SELECT * from customer where cus_id=? AND cus_pwd=? ', [cus_id, cus_pwd])
        const userData = results[0]
        const accessToken = generateAccessToken(userData);
     
        res.json({
            accessToken: accessToken,
            userData: userData,
        
        })
    } catch (error) {
        console.log('error', error)
        res.status(401).json({
            message: 'error',
            error
        })
    }

});



app.delete('/delete', async (req, res) => {
    try {
        let { id } = req.body; // Assuming cus_id is the identifier for the customer to delete
        if (!id) {
            return res.status(400).json({ error: 'Missing cus_id in request body' });
        }

        const results = await conn.query('DELETE FROM customer WHERE id = ?', [id]);
        res.json({
            message: 'Delete operation successful',
            data: results // No need for [0] since DELETE operation doesn't return data
        });
    } catch (error) {
        console.error('Error deleting customer:', error.message);
        res.status(500).json({ error: 'Error deleting customer' });
    }
});

app.put('/update/:id', async (req, res) => {
    try {
        let id = req.params.id
        let updateUser = req.body
        const results = await conn.query('UPDATE customer SET ? WHERE id = ?', [updateUser, id])
        res.json({
            message: 'update ok',
            data: results[0]
        })
    } catch (error) {
        console.error('error message', error.message) ///ฝั่งเราเห็น
        res.status(500).json({
            message: 'somthing wrong',
            //errorMessage: error.message //user จะเห็นerror เลยไม่ใช้ไป consoleข้างบน
        })
    }
})



app.listen(port, async (req, res) => {
    await initMySQL() //มาเรียก เพื่อ ติดต่อ connecttion
    console.log('http server run at ' + port)
})