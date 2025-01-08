
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.createTable('work_from_home', (table) => {
        table.increments('id').primary();
        table.uuid('employeeId').notNullable();
        table
            .foreign('employeeId')
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
        table.text('reason')
        table.date('startDate').notNullable();
        table.date('endDate').notNullable();
        table.timestamp('requestedAt').defaultTo(knex.fn.now());
        table.enu('status', ['Pending', 'Approved', 'Rejected']).defaultTo('Pending');
        table.uuid('approvedBy').nullable()
        table
            .foreign('approvedBy')
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
        table.timestamp('approvedAt').nullable()
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.dropTableIfExists('work_from_home')
};
