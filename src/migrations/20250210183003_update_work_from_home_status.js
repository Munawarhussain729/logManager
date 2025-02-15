/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    // Ensure ENUM type exists before altering the column
    await knex.schema.raw(`
        DO $$ BEGIN
            CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected');
        EXCEPTION WHEN duplicate_object THEN
            NULL; 
        END $$;
    `);

    // Update any invalid statuses before changing column type
    await knex('work_from_home')
        .whereNotIn('status', ['pending', 'approved', 'rejected'])
        .update({ status: 'pending' });

    // Alter the column to use ENUM type
    await knex.schema.alterTable('work_from_home', (table) => {
        table.enu('status', ['pending', 'approved', 'rejected'], {
            useNative: true,
            enumName: 'leave_status',
        }).defaultTo('pending').notNullable().alter();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    // Revert column back to string type
    await knex.schema.alterTable('work_from_home', (table) => {
        table.string('status', 20).defaultTo('pending').alter();
    });

    // Drop ENUM type safely
    await knex.schema.raw('DROP TYPE IF EXISTS leave_status');
};
