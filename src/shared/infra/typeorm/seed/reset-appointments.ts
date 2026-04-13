/* eslint-disable no-console */
import 'reflect-metadata';
import 'dotenv/config';

import { Connection, createConnection, getRepository, In } from 'typeorm';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import User from '@modules/users/infra/typeorm/entities/User';

const SEED_PROVIDER_EMAIL = 'john-barber@gmail.com';
const SEED_CLIENT_EMAIL = 'sam-client@gmail.com';

async function resetSeedAppointments(): Promise<void> {
  const usersRepository = getRepository(User);
  const appointmentsRepository = getRepository(Appointment);

  const users = await usersRepository.find({
    where: [{ email: SEED_PROVIDER_EMAIL }, { email: SEED_CLIENT_EMAIL }],
  });

  if (users.length === 0) {
    console.log('No seed users found. Nothing to reset.');
    return;
  }

  const userIds = users.map(user => user.id);

  const deleteAppointmentsResult = await appointmentsRepository
    .createQueryBuilder()
    .delete()
    .from(Appointment)
    .where('provider_id IN (:...userIds)', { userIds })
    .orWhere('user_id IN (:...userIds)', { userIds })
    .execute();

  const deletedAppointments = deleteAppointmentsResult.affected || 0;

  const deleteUsersResult = await usersRepository.delete({
    id: In(userIds),
  });

  const deletedUsers = deleteUsersResult.affected || 0;

  console.log(
    `Reset complete: deleted ${deletedAppointments} appointments and ${deletedUsers} users.`,
  );
}

async function run(): Promise<void> {
  let connection: Connection | undefined;
  try {
    connection = await createConnection('default');
    await resetSeedAppointments();
  } finally {
    if (connection && connection.isConnected) {
      await connection.close();
    }
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
