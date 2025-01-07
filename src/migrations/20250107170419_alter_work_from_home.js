
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('work_from_home', (table) => {
        table.renameColumn("requestedAt", "createdOn")
        table
            .uuid("user_id")
            .references("id")
            .inTable("users")
            .onDelete('CASCADE')
            .notNullable()
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable("work_from_home", (table) => {
        table.renameColumn("createdOn", "requestedAt")
        table.dropColumn('user_id')
    })
};
