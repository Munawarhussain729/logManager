/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Inserting roles into user_roles table
  // await knex('user_roles').insert([
  //     { title: 'Project Manager' },
  //     { title: 'Frontend Developer' },
  //     { title: 'Backend Developer' },
  //     { title: 'Software Engineer' }
  // ]);

  // Inserting users into users table (Ensure the user_roles are already inserted)
  // await knex('users').insert([
  //     { name: 'ahmed', email: 'ahmed@gmail.com', role: 1, password: 'ahmedPassword' },
  //     { name: 'daniyal', email: 'daniyal@gmail.com', role: 2, password: 'daniyalPassword' },
  //     { name: 'amer', email: 'amer@gmail.com', role: 3, password: 'amerPassword' },
  //     { name: 'rizwan', email: 'rizwan@gmail.com', role: 4, password: 'rizwanPassword' }
  // ]);

  // Inserting projects into projects table
  // await knex('projects').insert([
  //     { name: 'Web rentify', client_name: 'Aleem', project_manager_id: '91a2ed64-e083-4405-a09f-a26aec56927d' }, //Add user id 
  //     { name: 'Automate', client_name: 'jack', project_manager_id: 'ef92abaf-961f-48a5-9c5e-47c8239b4db7' }
  // ]);

  // Inserting user-project relationships into user_projects table
  // await knex('user_projects').insert([
  //     { user_id: 'acae6f96-9781-48a0-afca-e7e5a8798220', project_id: 2 },
  //     { user_id: 'aeec711d-6c88-48e2-8585-08e680b67004', project_id: 1 }
  // ]);

  // Inserting logs into logs table
  await knex('logs').insert([
      {
          message: 'integrate add vehicle api',
          blocker: 'backend needs to update api according to requirement',
          user_role: 2,
          duration: 3,
          tomorrow_plan: 'Will start working on inspect screen',
          project_id: 2,
          user_id: '91a2ed64-e083-4405-a09f-a26aec56927d' // Replace with actual UUID
      },
      {
          message: 'Update the ticketing',
          blocker: 'No blocker.',
          user_role: 3,
          duration: 5,
          tomorrow_plan: 'will be working on urgent tickets',
          project_id: 1,
          user_id: 'aeec711d-6c88-48e2-8585-08e680b67004' // Replace with actual UUID
      }
  ]);
};
