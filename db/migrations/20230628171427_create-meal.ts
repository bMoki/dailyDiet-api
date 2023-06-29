import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meal', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.datetime('dateTime').notNullable()
    table.boolean('onDiet').notNullable()
    table.uuid('user').notNullable()
    table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meal')
}
