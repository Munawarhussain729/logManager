
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.alterTable("logs", (table) => {
        table.timestamp('created_on').defaultTo(knex.fn.now()).notNullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.alterTable("logs", (table) => {
        table.dropColumn('created_on');
    })
};
