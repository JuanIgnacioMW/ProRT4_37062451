import {pool} from "./database.js";

class LibroController {
    async getAll (req, res){
        const [result] = await pool.query('select * from libros');
        res.json(result);
    }
// Creación de libro
    async add (req, res){
        const libro = req.body;

        // Validación del ISBN
        if (!/^\d{13}$/.test(libro.ISBN)) {
            return res.status(400).json({ error: "El campo ISBN solo admite 13 números." });
        }

        const [result] = await pool.query(
            `INSERT INTO libros(nombre, autor, categoria, aniopublicacion, ISBN) VALUES (?,?,?,?,?)`,
            [libro.nombre, libro.autor, libro.categoria, libro.aniopublicacion, libro.ISBN]);
        res.json({"Id insertado:": result.insertId});
    }

      // Borrar libro
      async detele(req, res) {
        const libro = req.body;
        const [result] = await pool.query(`DELETE FROM Libros WHERE id=(?)`, [libro.id]);
        res.json({ "Registros eliminados": result.affectedRows });
    }

    // Eliminar un libro por su ISBN
    async deleteByISBN(req, res) {
        const { ISBN } = req.body;

  // Validación del ISBN
        if (!/^\d{13}$/.test(ISBN)) {
           return res.status(400).json({ error: "El campo ISBN solo admite 13 números." });
        }

        try {
           const [result] = await pool.query(`DELETE FROM Libros WHERE ISBN = ?`, [ISBN]);
           if (result.affectedRows === 0) {
              return res.status(404).json({ message: "Libro no encontrado" });
           }
          res.json({ "Registros eliminados": result.affectedRows });
       } catch (error) {
      res.status(500).json({ error: "Error al eliminar el libro", details: error.message });
     }
    }


    // Update libro
    async update(req, res) {
        try {
            const libro = req.body;
            
            // Validación del ISBN
            if (!/^\d{13}$/.test(libro.ISBN)) {
                return res.status(400).json({ error: "El campo ISBN solo admite 13 números." });
            }
            
            const [result] = await pool.query(
                `UPDATE Libros SET nombre = ?, autor = ?, categoria = ?, aniopublicacion = ?, ISBN = ? WHERE id = ?`,
                [libro.nombre, libro.autor, libro.categoria, libro.aniopublicacion, libro.ISBN, libro.id]
            );
            res.json({ "Registros actualizados": result.changedRows });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Obtener un libro por su ID
    async getOne(req, res) {
        const { id } = req.params;
        try {
            const [result] = await pool.query("SELECT * FROM libros WHERE id = ?", [id]);

            if (result.length === 0) {
                res.status(404).json({ message: "Libro no encontrado" });
            } else {
                res.json(result[0]);
            }
        } catch (error) {
            res.status(500).json({ message: "Error al obtener el libro", error });
        }
    }

}

export const libro = new LibroController();