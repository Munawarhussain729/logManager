/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable('user_roles', (table) => {
        table.increments('id').primary(); // Auto-incrementing id
        table.string('title').notNullable(); // Role title
    });

    // Inserting initial roles
    await knex('user_roles').insert([
        { title: 'Project Manager' },
        { title: 'Frontend Developer' },
        { title: 'Backend Developer' },
        { title: 'Software Engineer' }
    ]);
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.dropTableIfExists('user_roles');
};
