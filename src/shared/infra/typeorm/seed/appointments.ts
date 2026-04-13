/* eslint-disable no-console */
import 'reflect-metadata';
import 'dotenv/config';

import { hash } from 'bcryptjs';
import {
  addDays,
  addHours,
  getHours,
  isBefore,
  setHours,
  startOfHour,
} from 'date-fns';
import { Connection, createConnection, getRepository } from 'typeorm';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import User from '@modules/users/infra/typeorm/entities/User';

const SEED_PROVIDER_EMAIL = 'john-barber@gmail.com';
const SEED_CLIENT_EMAIL = 'sam-client@gmail.com';
const SEED_PASSWORD = '12345678';
const APPOINTMENT_COUNT = 8;

/** Next wall-clock hour at or after `d`, snapped to 8–17; rolls to next day 8:00 after 17:00. */
function normalizeToBusinessHour(d: Date): Date {
  const x = startOfHour(d);
  const h = getHours(x);
  if (h < 8) {
    return setHours(x, 8);
  }
  if (h > 17) {
    return setHours(addDays(x, 1), 8);
  }
  return x;
}

/** First valid booking slot from “now”: full hour, 8–17, not in the past (same rules as CreateAppointmentService). */
function firstAvailableSlot(): Date {
  let slot = addHours(startOfHour(new Date()), 1);

  for (let i = 0; i < 24 * 14; i += 1) {
    slot = normalizeToBusinessHour(slot);
    const hour = getHours(slot);
    if (hour >= 8 && hour <= 17 && !isBefore(slot, new Date())) {
      return slot;
    }
    slot = addHours(slot, 1);
  }

  throw new Error(
    'Could not find a valid appointment slot in the next two weeks.',
  );
}

/** Upcoming hourly slots during business hours, one per hour. */
function upcomingBusinessSlots(count: number): Date[] {
  const slots: Date[] = [];
  let cursor = firstAvailableSlot();

  for (let i = 0; i < count; i += 1) {
    slots.push(cursor);
    let next = addHours(cursor, 1);
    next = normalizeToBusinessHour(next);
    let guard = 0;
    while (guard < 48 && (getHours(next) < 8 || getHours(next) > 17)) {
      next = normalizeToBusinessHour(addHours(next, 1));
      guard += 1;
    }
    cursor = next;
  }

  return slots;
}

async function findOrCreateUser(
  name: string,
  email: string,
  avatarFileName: string,
  seedPassword: string,
): Promise<User> {
  const usersRepo = getRepository(User);
  const existing = await usersRepo.findOne({ where: { email } });
  if (existing) {
    return existing;
  }

  const password = await hash(seedPassword, 8);

  const user = usersRepo.create({
    name,
    email,
    password,
    avatar: avatarFileName,
  });

  return usersRepo.save(user);
}

async function seed(): Promise<void> {
  const provider = await findOrCreateUser(
    'John',
    SEED_PROVIDER_EMAIL,
    'john-barber-avatar.png',
    SEED_PASSWORD,
  );
  const client = await findOrCreateUser(
    'Sam',
    SEED_CLIENT_EMAIL,
    'sam-client-avatar.png',
    SEED_PASSWORD,
  );

  if (provider.id === client.id) {
    throw new Error('Seed provider and client must be different users.');
  }

  const appointmentsRepo = getRepository(Appointment);
  const existingSeedAppointments = await appointmentsRepo.count({
    where: { provider_id: provider.id, user_id: client.id },
  });

  if (existingSeedAppointments > 0) {
    console.log(
      'Seed appointments already exist for the seed users; skip (reset DB or delete those rows to re-run).',
    );
    return;
  }

  const slots = upcomingBusinessSlots(APPOINTMENT_COUNT);

  const newAppointments = slots.map(date =>
    appointmentsRepo.create({
      provider_id: provider.id,
      user_id: client.id,
      date,
    }),
  );

  await appointmentsRepo.save(newAppointments);

  console.log(
    `Seeded ${slots.length} appointments between ${SEED_CLIENT_EMAIL} and ${SEED_PROVIDER_EMAIL} (password: APP_SECRET).`,
  );
}

async function run(): Promise<void> {
  let connection: Connection | undefined;
  try {
    connection = await createConnection('default');
    await seed();
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
