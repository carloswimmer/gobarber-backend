import { inject, injectable } from 'tsyringe';
import { isAfter, getHours } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  year: number;
  month: number;
  day: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointemntsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        year,
        month,
        day,
      },
    );

    const firstAppointmentHour = 8;

    const hoursOfThisDay = Array.from(
      { length: 10 },
      (_, index) => index + firstAppointmentHour,
    );

    const currentDate = new Date(Date.now());

    const availability = hoursOfThisDay.map(hour => {
      const hasAppointmentInHour = appointments.some(
        appointment => getHours(appointment.date) === hour,
      );

      const compareDate = new Date(year, month - 1, day, hour);
      const isInTheFuture = isAfter(compareDate, currentDate);

      return {
        hour,
        available: !hasAppointmentInHour && isInTheFuture,
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
