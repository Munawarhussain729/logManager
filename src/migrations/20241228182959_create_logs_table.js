// migrations/20240101040000_create_logs_table.js
export async function up(knex) {
  await knex.schema.createTable('logs', (table) => {
    table.increments('id').primary(); // Auto-incrementing log ID
    table.string('message').notNullable(); // Log message
    table.string('blocker'); // Blocker details
    table.integer('user_role').references('id').inTable('user_roles').onDelete('SET NULL'); // Foreign key to user_roles
    table.integer('duration'); // Duration of the task
    table.string('tomorrow_plan'); // Plan for tomorrow
    table.integer('project_id').references('id').inTable('projects').onDelete('CASCADE'); // Foreign key to projects
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE'); // Foreign key to users (uuid)
  });

  // .then(() => {
  //   // Insert initial logs
  //   return knex('logs').insert([
  //     {
  //       message: 'integrate add vehicle api',
  //       blocker: 'backend needs to update api according to requirement',
  //       user_role: 2,
  //       duration: 3,
  //       tomorrow_plan: 'Will start working on inspect screen',
  //       project_id: 2,
  //       user_id: '3c7ecb70-73e5-47cf-bb68-568380cfa487' // Replace with actual UUID
  //     },
  //     {
  //       message: 'Update the ticketing',
  //       blocker: 'No blocker.',
  //       user_role: 3,
  //       duration: 5,
  //       tomorrow_plan: 'will be working on urgent tickets',
  //       project_id: 1,
  //       user_id: 'a07c0a36-c710-4e28-875d-430b9adbc33a' // Replace with actual UUID
  //     }
  //   ]);
  // });
};

export async function down(knex) {
  return knex.schema.dropTableIfExists('logs');
};
