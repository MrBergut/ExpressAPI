const express = require('express');
const { Pool } = require('pg'); 

const app = express();
app.use(express.json());

app.use(express.static('public'));

// подключение к PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'expressAPI',
  password: 'root',
  port: 5432,
});

app.get('/api/users', async function(_, res){
    try {
        const { rows } = await pool.query('SELECT * FROM person');
        res.send(rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/users/:id', async function(req, res){
    const id = req.params.id;
    try {
        const { rows } = await pool.query('SELECT * FROM person WHERE id = $1', [id]);
        if(rows.length > 0){
            res.send(rows[0]);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/users', async function(req, res) {
    if(!req.body) return res.sendStatus(400);
    const userName = req.body.name;
    const userAge = req.body.age;

    try {
        const { rows } = await pool.query('INSERT INTO person(name, age) VALUES($1, $2) RETURNING *', [userName, userAge]);
        const user = rows[0];
        res.send(user);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/api/users/:id', async function(req, res){
    const id = req.params.id;
    try {
        const { rows } = await pool.query('DELETE FROM person WHERE id = $1 RETURNING *', [id]);
        if(rows.length > 0){
            const user = rows[0];
            res.send(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/api/users', async function(req, res){
    if(!req.body) return res.sendStatus(400);

    const id = req.body.id;
    const userName = req.body.name;
    const userAge = req.body.age;

    try {
        const { rows } = await pool.query('UPDATE person SET name = $1, age = $2 WHERE id = $3 RETURNING *', [userName, userAge, id]);
        if(rows.length > 0){
            const user = rows[0];
            res.send(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Internal Server Error');
    }
});

const PORT = 3000;

app.listen(PORT, function(){
    console.log(`http://localhost:${PORT}`);
});