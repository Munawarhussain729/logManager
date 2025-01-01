/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.createTable('user_projects', (table) => {
        table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.integer('project_id').references('id').inTable('projects').onDelete('CASCADE');
        table.primary(['user_id', 'project_id']); // Composite primary key
    })
        // .then(() => {
        //     // Insert initial user-project relationships
        //     return knex('user_projects').insert([
        //         { user_id: 3, project_id: 2 },
        //         { user_id: 2, project_id: 1 }
        //     ]);
        // });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.dropTableIfExists('user_projects');
};