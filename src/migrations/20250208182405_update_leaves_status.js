
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('leaves', (table) => {
        table.enu('stauts', ['pending', 'approved', 'rejected'], {
            useNative: true,
            enumName: 'leave_status',
        }).defaultTo('pending').notNullable().alter();
    });

    await knex('leaves')
        .whereNotIn('status', ['pending', 'approved', 'rejected'])
        .update({ status: 'pending' });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable('leaves', (table) => {
        table.string('status', 20).defaultTo('pending').alter()
    })

    await knex.raw('DROP TYPE IF EXISTS leave_status');
};
