const db = require('../db')

class UserController {
    async createUser(req, res) {
        try {
            const { name, age } = req.body;
            const newPerson = await db.query('INSERT INTO person (name, age) VALUES ($1, $2) RETURNING *', [name, age]);
            console.log(newPerson.rows[0]);
            res.json(newPerson.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getUser(req, res) {
        const users = await db.query(`SELECT * from person`)
        console.log(users.rows)
        res.json(users.rows)
    }

    async getOneUser(req, res) {
        const id = req.params.id
        const user = await db.query('SELECT * FROM person where id = $1', [id])
        res.json(user.rows[0])
    }

    async updateUser(req, res) {
        const {id, name, age} = req.body
        const user = await db.query(
            'UPDATE person set name = $1, age = $2 where id = $3 RETURNING *',
            [name, age, id]
        )
        res.json(user.rows[0])
    }

    async deleteUser(req, res) {
        const id = req.params.id
        const user = await db.query('DELETE FROM person where id = $1', [id])
        res.json(user.rows[0])
    }
}

module.exports = new UserController()