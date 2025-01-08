/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('leaves', (table) => {
      // Add 'approvedBy' column
      table
        .uuid('approvedBy')
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL');
  
      // Add 'approvedAt' column
      table.timestamp('approvedAt').nullable();
    });
  
    // Alter 'status' column
    await knex.schema.raw(`
      ALTER TABLE leaves 
      DROP COLUMN IF EXISTS status;
    `);
  
    await knex.schema.alterTable('leaves', (table) => {
      table
        .enu('status', ['Pending', 'Approved', 'Rejected'])
        .defaultTo('Pending')
        .notNullable();
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export const down = async (knex) => {
    await knex.schema.alterTable('leaves', (table) => {
      table.dropColumn('approvedBy');
      table.dropColumn('approvedAt');
      table.dropColumn('status');
    });
  
    await knex.schema.alterTable('leaves', (table) => {
      table.string('status').defaultTo('Pending');
    });
  };
  