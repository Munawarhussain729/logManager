/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable('projects', (table) => {
        table.increments('id').primary(); // Auto-incrementing project ID
        table.string('name').notNullable(); // Project name
        table.string('client_name').notNullable(); // Client name
        table.uuid('project_manager_id').references('id').inTable('users').onDelete('CASCADE'); // Foreign key to users (project manager)
    });

        // .then(() => {
        //     // Insert initial projects
        //     return knex('projects').insert([
        //         { name: 'Web rentify', client_name: 'Aleem', project_manager_id: '123e4567-e89b-12d3-a456-426614174000' },
        //         { name: 'Automate', client_name: 'jack', project_manager_id: '123e4567-e89b-12d3-a456-426614174001' }
        //     ]);
        // });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.dropTableIfExists('projects');
};
