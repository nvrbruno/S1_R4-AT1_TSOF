import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ClienteFactory } from './factories/ClientFactory.js'
import { MontadoraFactory } from './factories/MontadoraFactory.js'
import { VeiculoFactory } from './factories/VeiculoFactory.js'
import { clearDatabase } from './utils/clearDatabase.js'


describe('Clientes', () => {
    let cliente;

    beforeEach(async () => {
        cliente = await ClienteFactory.create(
            'Florisvaldo Junior',
            '12345678000',
            '13185880',
            'Rua Teste',
            'Bairro Teste',
            'Cidade Teste',
            'SP',
            123,
            'Apenas um teste!'
        );
    });

    afterEach(async () => {
        await clearDatabase();
    })

    // CT-001: Cadastrar cliente com dados válidos
    it("deve cadastrar um cliente com dados válidos.", async () => {
        expect(cliente.Nome).toBe('Florisvaldo Junior');
    })

    // CT-002: Cadastrar cliente sem informar o campo obrigatório Nome
    it("não deve cadastrar um cliente sem o campo obrigatório 'nome'.", async () => {
        await expect(
            ClienteFactory.create(
                undefined,
                '12345678000',
                '13185880',
                'Rua Teste',
                'Bairro Teste',
                'Cidade Teste',
                'SP',
                123,
                'Apenas um teste!'
            )
        ).rejects.toThrow();
    })

    // CT-003: Cadastrar cliente sem informar o campo obrigatório CEP
    it("não deve cadastrar um cliente sem o campo obrigatório 'cep'.", async () => {
        await expect(
            ClienteFactory.create(
                'Florisvaldo Junior',
                '12345678000',
                undefined,
                'Rua Teste',
                'Bairro Teste',
                'Cidade Teste',
                'SP',
                123,
                'Apenas um teste!'
            )
        ).rejects.toThrow();
    })

    // CT-004: Cadastrar cliente com CPF fora do padrão (mais de 11 caracteres)
    it("não deve cadastrar um cliente com CPF fora do padrão.", async () => {
        await expect(
            ClienteFactory.create(
                'Florisvaldo Junior',
                '123456780012345',
                '13185880',
                'Rua Teste',
                'Bairro Teste',
                'Cidade Teste',
                'SP',
                123,
                'Apenas um teste!'
            )
        ).rejects.toThrow();
    })

    // CT-005: Cadastrar cliente e conferir o CPF retornado
    it("deve retornar o cliente cadastrado com o CPF informado.", async () => {
        expect(cliente.CPF).toBe('12345678000');
    })

    // CT-006: Cadastrar cliente e conferir o CEP retornado
    it("deve retornar o cliente cadastrado com o CEP informado.", async () => {
        expect(cliente.CEP).toBe('13185880');
    })

    // CT-007: Cadastrar um segundo cliente distinto
    it("deve cadastrar um segundo cliente com um Id diferente do primeiro.", async () => {
        const outroCliente = await ClienteFactory.create(
            'Maria Souza',
            '98765432100',
            '13184000',
            'Rua Nova',
            'Bairro Novo',
            'Cidade Nova',
            'SP',
            456,
            'Segundo cliente'
        );

        expect(outroCliente.id === cliente.id).toBe(false);
    })
})

describe('Montadoras', () => {
    let montadora;

    beforeEach(async () => {
        montadora = await MontadoraFactory.create('Toyota', 'Japão');
    });

    afterEach(async () => {
        await clearDatabase();
    })

    // CT-008: Cadastrar montadora com dados válidos
    it("deve cadastrar uma montadora com dados válidos.", async () => {
        expect(montadora.Nome).toBe('Toyota');
    })

    // CT-009: Cadastrar montadora sem informar o campo obrigatório Nome
    it("não deve cadastrar uma montadora sem o campo obrigatório 'nome'.", async () => {
        await expect(
            MontadoraFactory.create(undefined, 'Itália')
        ).rejects.toThrow();
    })

    // CT-010: Cadastrar montadora sem informar o campo obrigatório País
    it("não deve cadastrar uma montadora sem o campo obrigatório 'pais'.", async () => {
        await expect(
            MontadoraFactory.create('Ferrari', undefined)
        ).rejects.toThrow();
    })

    // CT-011: Cadastrar montadora e conferir o País retornado
    it("deve retornar a montadora cadastrada com o país informado.", async () => {
        expect(montadora.Pais).toBe('Japão');
    })

    // CT-012: Cadastrar uma segunda montadora distinta
    it("deve cadastrar uma segunda montadora com um Id diferente da primeira.", async () => {
        const outraMontadora = await MontadoraFactory.create('Honda', 'Japão');

        expect(outraMontadora.id === montadora.id).toBe(false);
    })
})

describe('Veículos', () => {
    let montadora;
    let cliente;

    beforeEach(async () => {
        montadora = await MontadoraFactory.create('Toyota', 'Japão');
        cliente = await ClienteFactory.create(
            'Florisvaldo Junior',
            '12345678000',
            '13185880',
            'Rua Teste',
            'Bairro Teste',
            'Cidade Teste',
            'SP',
            123,
            'Apenas um teste!'
        );
    });

    afterEach(async () => {
        await clearDatabase();
    })

    // CT-013: Cadastrar veículo com dados válidos
    it("deve cadastrar um veículo com dados válidos.", async () => {
        const veiculo = await VeiculoFactory.create(
            'Corolla',
            'ABC1D23',
            2024,
            'Prata',
            120000,
            montadora.id,
            cliente.id
        );

        expect(veiculo.Modelo).toBe('Corolla');
    })

    // CT-014: Cadastrar veículo sem informar o campo obrigatório Placa
    it("não deve cadastrar um veículo sem o campo obrigatório 'placa'.", async () => {
        await expect(
            VeiculoFactory.create(
                'Corolla',
                undefined,
                2024,
                'Prata',
                120000,
                montadora.id,
                cliente.id
            )
        ).rejects.toThrow();
    })

    // CT-015: Cadastrar veículo sem informar o campo obrigatório Modelo
    it("não deve cadastrar um veículo sem o campo obrigatório 'modelo'.", async () => {
        await expect(
            VeiculoFactory.create(
                undefined,
                'ABC1D23',
                2024,
                'Prata',
                120000,
                montadora.id,
                cliente.id
            )
        ).rejects.toThrow();
    })

    // CT-016: Cadastrar veículo com IdMontadora inexistente (restrição de integridade)
    it("não deve cadastrar um veículo com IdMontadora inexistente.", async () => {
        await expect(
            VeiculoFactory.create(
                'Corolla',
                'ABC1D23',
                2024,
                'Prata',
                120000,
                999999,
                cliente.id
            )
        ).rejects.toThrow();
    })

    // CT-017: Cadastrar veículo com IdCliente inexistente (restrição de integridade)
    it("não deve cadastrar um veículo com IdCliente inexistente.", async () => {
        await expect(
            VeiculoFactory.create(
                'Corolla',
                'ABC1D23',
                2024,
                'Prata',
                120000,
                montadora.id,
                999999
            )
        ).rejects.toThrow();
    })

    // CT-018: Cadastrar veículo sem informar o campo obrigatório IdMontadora
    it("não deve cadastrar um veículo sem o campo obrigatório 'idMontadora'.", async () => {
        await expect(
            VeiculoFactory.create(
                'Corolla',
                'ABC1D23',
                2024,
                'Prata',
                120000,
                undefined,
                cliente.id
            )
        ).rejects.toThrow();
    })

    // CT-019: Cadastrar veículo e conferir a Placa retornada
    it("deve retornar o veículo cadastrado com a placa informada.", async () => {
        const veiculo = await VeiculoFactory.create(
            'Corolla',
            'ABC1D23',
            2024,
            'Prata',
            120000,
            montadora.id,
            cliente.id
        );

        expect(veiculo.Placa).toBe('ABC1D23');
    })

    // CT-020: Cadastrar um segundo veículo distinto
    it("deve cadastrar um segundo veículo com um Id diferente do primeiro.", async () => {
        const veiculo1 = await VeiculoFactory.create(
            'Corolla',
            'ABC1D23',
            2024,
            'Prata',
            120000,
            montadora.id,
            cliente.id
        );

        const veiculo2 = await VeiculoFactory.create(
            'Civic',
            'XYZ9Z99',
            2023,
            'Preto',
            110000,
            montadora.id,
            cliente.id
        );

        expect(veiculo2.id === veiculo1.id).toBe(false);
    })

    // CT-021: Cadastrar veículo e conferir o vínculo com a montadora
    it("deve vincular o veículo à montadora informada.", async () => {
        const veiculo = await VeiculoFactory.create(
            'Corolla',
            'ABC1D23',
            2024,
            'Prata',
            120000,
            montadora.id,
            cliente.id
        );

        expect(veiculo.IdMontadora).toBe(montadora.id);
    })

    // CT-022: Cadastrar veículo e conferir o vínculo com o cliente
    it("deve vincular o veículo ao cliente informado.", async () => {
        const veiculo = await VeiculoFactory.create(
            'Corolla',
            'ABC1D23',
            2024,
            'Prata',
            120000,
            montadora.id,
            cliente.id
        );

        expect(veiculo.IdCliente).toBe(cliente.id);
    })

    // CT-023: Cadastrar veículo de outra montadora vinculado ao mesmo cliente
    it("deve permitir cadastrar um veículo de outra montadora para o mesmo cliente.", async () => {
        const outraMontadora = await MontadoraFactory.create('Honda', 'Japão');

        const veiculo = await VeiculoFactory.create(
            'Civic',
            'XYZ9Z99',
            2023,
            'Preto',
            110000,
            outraMontadora.id,
            cliente.id
        );

        expect(veiculo.IdMontadora).toBe(outraMontadora.id);
    })

    // CT-024: Limpar os registros cadastrados ao rodar o clearDatabase
    it("deve remover os registros cadastrados ao rodar o clearDatabase.", async () => {
        await VeiculoFactory.create(
            'Corolla',
            'ABC1D23',
            2024,
            'Prata',
            120000,
            montadora.id,
            cliente.id
        );

        await clearDatabase();

        const novaMontadora = await MontadoraFactory.create('Toyota', 'Japão');

        expect(novaMontadora.Nome).toBe('Toyota');
    })
})