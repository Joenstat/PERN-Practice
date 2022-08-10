const pool = require("../db.js");

const getAllTasks = async function (req, res, next) {
    try {
        const allTasks = await pool.query('SELECT * FROM tareas');
        res.json(allTasks.rows);
    } catch (error) {
        next(error);
    }
};

const getTask = async function (req, res, next) {
    try {
        const { id } = req.params
        const result = await pool.query('SELECT * FROM tareas WHERE id = $1', [id])
        if(!result.rows.length) return res.status(404).json({message: 'Tarea no encontrada'});
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

const createTask = async function (req, res, next) {
  const { title, description } = req.body;

  try {
    const result = await pool.query(
        "INSERT INTO tareas (title, description) VALUES ($1, $2) RETURNING *", 
        [title,description,]
        );
      res.json(result.rows[0])
  } catch (error) {
        next(error);
  }
};

const deleteTask = async function (req, res, next) {
    const { id } = req.params
    try {
        const result = await pool.query('DELETE FROM tareas WHERE id = $1', [id])
        if(result.rowCount === 0) return res.status(404).json({ message: 'Tarea no econtrada' })
        res.sendStatus(204)
    } catch (error) {
       next(error); 
    }
};

const updateTask = async function (req, res, next) {
    try {
        const { id } = req.params
        const { title, description } = req.body
        const result = await pool.query('UPDATE tareas SET title = $1, description = $2 WHERE id = $3 RETURNING *', [title, description, id])
        if(!result.rows.length) return res.status(404).json({ message: 'Tarea no econtrada' })
        res.json(result.rows[0])      
    } catch (error) {
        next(error)
    }
};

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  deleteTask,
  updateTask,
};
