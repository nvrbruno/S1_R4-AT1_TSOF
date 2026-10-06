const { connection } = require("../../../src/configs/Database.js");

export class ClienteFactory {
    static async create(
        Nome, CPF, CEP, Logradouro, Bairro, Cidade, UF, Numero, Complemento
    ) {
        const [result] = await connection.execute(
            `INSERT INTO clientes (Nome, CPF, CEP, Logradouro, Bairro, Cidade, UF, Numero, Complemento) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [Nome, CPF, CEP, Logradouro, Bairro, Cidade, UF, Numero, Complemento]
        );

        return {
            id: result.insertId,
            Nome, CPF, CEP, Logradouro, Bairro, Cidade, UF, Numero, Complemento
        };
    }
}