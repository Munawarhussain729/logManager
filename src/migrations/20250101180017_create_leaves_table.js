
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.createTable('leaves', (table) => {
        table.increments('id').primary();
        table
            .uuid('userId')
            .unsigned()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.string('subject', 255).notNullable();
        table.text('body');
        table.date('startDate').notNullable();
        table.date('endDate').notNullable();
        table.timestamp('createdOn').defaultTo(knex.fn.now());
        table.string('status',20).defaultTo('Pending')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.dropTableIfExists('leaves')
};
