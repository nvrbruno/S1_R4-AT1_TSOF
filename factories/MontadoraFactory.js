const { connection } = require("../../../src/configs/Database.js");

export class MontadoraFactory {
    static async create(Nome, Pais) {
        const [result] = await connection.execute(
            `INSERT INTO montadoras (Nome, Pais) 
            VALUES (?, ?);`,
            [Nome, Pais]
        );

        return {
            id: result.insertId,
            Nome, Pais
        };
    }
}