import Knex from 'knex' //importei somente pra obter o tipo 'Knex'

// Migrations mantém o histórico do banco/tabela
export async function up(knex : Knex) { //knex : Knex => a variável knex é do tipo 'Knex'
    return knex.schema.createTable('points', table => {
        table.increments('id').primary(),
        table.string('image').notNullable(),
        table.string('name').notNullable(),
        table.string('email').notNullable(),
        table.string('whatsapp').notNullable(),
        table.decimal('latitude').notNullable(),
        table.decimal('longitude').notNullable(),
        table.string('city').notNullable(),
        table.string('uf', 2).notNullable()
    })
}

export async function down(knex : Knex) {
    return knex.schema.dropTable('points')
}