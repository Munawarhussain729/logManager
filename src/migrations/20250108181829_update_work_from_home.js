
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('work_from_home', (table) => {
        table.renameColumn("reason", "subject");
        table.text('body');
        table.dropColumn("employeeId");
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return await knex.schema.alterTable("work_from_home", (table) => {
        table.renameColumn("subject", "reason");
        table.dropColumn("body");
        table.uuid('employeeId').notNullable();
        table
            .foreign('employeeId')
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
    })
};
