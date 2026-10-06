import app from '../../src/app.js'
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ClienteFactory } from './factories/ClientFactory.js'
import { MontadoraFactory } from './factories/MontadoraFactory.js'
import { VeiculoFactory } from './factories/VeiculoFactory.js'
import { clearDatabase } from './utils/clearDatabase.js'


describe('API de clientes', () => {
    beforeEach(async () => {
        const cliente = await ClienteFactory.create(
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

    // CT-001: Selecionar (listar) todos os clientes cadastrados
    it("deve listar todos os clientes cadastrados com sucesso.", async () => {
        const response = await request(app)
            .get('/clientes');

        expect(response.status).toBe(200);
    })

    // CT-008: Cadastrar cliente com dados válidos
    it("deve cadastrar um cliente com dados válidos, preenchendo endereço via CEP.", async () => {
        const response = await request(app)
            .post('/clientes')
            .send({
                nome: 'Florisvaldo Junior',
                cpf: '12345678000',
                cep: '13185880',
                numero: 123,
                complemento: 'Apenas um teste!'
            });

        expect(response.status).toBe(201);
    })

    // CT-009: Cadastrar cliente com CPF fora do padrão (mais de 11 caracteres)
    it("não deve cadastrar um cliente com CPF fora do padrão.", async () => {
        const response = await request(app)
            .post('/clientes')
            .send({
                nome: 'Florisvaldo Junior',
                cpf: '123456780012345',
                cep: '13185880',
                numero: 123,
                complemento: 'Apenas um teste!'
            });

        expect(response.status).toBe(500);
    })

    // CT-010: Cadastrar cliente sem informar o campo obrigatório CEP
    it("não deve cadastrar um cliente sem o campo obrigatório 'cep'.", async () => {
        const response = await request(app)
            .post('/clientes')
            .send({
                nome: 'Florisvaldo Junior',
                cpf: '12345678000',
                numero: 123,
                complemento: 'Apenas um teste!'
            });

        expect(response.status).toBe(500);
    })
})

describe('API de montadoras', () => {
    let montadora;

    beforeEach(async () => {
        montadora = await MontadoraFactory.create('Toyota', 'Japão');
    });

    afterEach(async () => {
        await clearDatabase();
    })

    // CT-002: Cadastrar montadora com dados válidos
    it("deve cadastrar uma montadora com dados válidos.", async () => {
        const response = await request(app)
            .post('/montadoras')
            .send({ nome: 'Ferrari', pais: 'Itália' });

        expect(response.status).toBe(201);
    })

    // CT-003: Cadastrar montadora sem informar o campo obrigatório Nome
    it("não deve cadastrar uma montadora sem o campo obrigatório 'nome'.", async () => {
        const response = await request(app)
            .post('/montadoras')
            .send({ pais: 'Itália' });

        expect(response.status).toBe(500);
    })

    // CT-004: Listar montadoras cadastradas
    it("deve listar todas as montadoras cadastradas.", async () => {
        const response = await request(app)
            .get('/montadoras');

        expect(response.status).toBe(200);

    })

    // CT-005: Atualizar dados de uma montadora existente
    it("deve atualizar os dados de uma montadora existente.", async () => {
        const response = await request(app)
            .put(`/montadoras?id=${montadora.id}`)
            .send({ nome: 'Honda', pais: 'Japão' });

        expect(response.status).toBe(200);
    })

    // CT-006: Excluir montadora vinculada a um veículo (restrição de integridade)
    it("não deve excluir uma montadora vinculada a um veículo.", async () => {

        const cliente = await ClienteFactory.create(
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

        await VeiculoFactory.create(
            'Corolla',
            'ABC1D23',
            2024,
            'Prata',
            120000,
            montadora.id,
            cliente.id
        );

        const response = await request(app)
            .delete(`/montadoras/${montadora.id}`);

        expect(response.status).toBe(500);
    });

    // CT-007: Excluir montadora sem vínculo com veículos
    it("deve excluir uma montadora sem vínculo com veículos.", async () => {
        const response = await request(app)
            .delete(`/montadoras/${montadora.id}`);

        expect([200]).toContain(response.status);
    })
})