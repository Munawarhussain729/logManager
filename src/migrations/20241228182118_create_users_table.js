/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable('users', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()')); // UUID for user ID
        table.string('name').notNullable(); // User name
        table.string('email').notNullable().unique(); // User email
        table.integer('role').references('id').inTable('user_roles').onDelete('CASCADE'); // Foreign key to user_roles
        table.string('password').notNullable(); // User password
    });

    // Inserting initial users
    await knex('users').insert([
        { name: 'ahmed', email: 'ahmed@gmail.com', role: 1, password: 'ahmedPassword' },
        { name: 'daniyal', email: 'daniyal@gmail.com', role: 2, password: 'daniyalPassword' },
        { name: 'amer', email: 'amer@gmail.com', role: 3, password: 'amerPassword' },
        { name: 'rizwan', email: 'rizwan@gmail.com', role: 4, password: 'rizwanPassword' }
    ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.dropTableIfExists('users');
};