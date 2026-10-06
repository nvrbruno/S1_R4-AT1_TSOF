const { connection } = require("../../../src/configs/Database.js");

export class VeiculoFactory {
    static async create(
        Modelo, Placa, Ano, Cor, Valor, IdMontadora, IdCliente
    ) {
        const [result] = await connection.execute(
            `INSERT INTO veiculos ( Modelo, Placa, Ano, Cor, Valor, IdMontadora, IdCliente) 
            VALUES (?, ?, ?, ?, ?, ?, ?);`,
            [ Modelo, Placa, Ano, Cor, Valor, IdMontadora, IdCliente]
        );

        return {
            id: result.insertId,
            Modelo, Placa, Ano, Cor, Valor, IdMontadora, IdCliente
        };
    }
}