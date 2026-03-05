import { TimelineDay, TimelineItem, TripTimeline } from '../types/timeline';

const parseIsoDate = (iso: string): Date | null => {
  const [yearText, monthText, dayText] = iso.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (!year || !month || !day) {
    return null;
  }

  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const toIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const getDayRange = (startISO: string, endISO: string): string[] => {
  const start = parseIsoDate(startISO);
  const end = parseIsoDate(endISO);

  if (!start || !end || end < start) {
    const fallback = start ? toIsoDate(start) : toIsoDate(new Date());
    return [fallback];
  }

  const dates: string[] = [];
  let cursor = new Date(start);

  while (cursor <= end) {
    dates.push(toIsoDate(cursor));
    cursor = addDays(cursor, 1);
  }

  return dates;
};

const titleCase = (value: string) => value.trim() || 'Your destination';

const buildDayItems = ({
  tripId,
  destination,
  dayNumber,
  totalDays,
  dateISO,
}: {
  tripId: string;
  destination: string;
  dayNumber: number;
  totalDays: number;
  dateISO: string;
}): TimelineItem[] => {
  const itemPrefix = `${tripId}_${dateISO}`;

  if (dayNumber === 1) {
    return [
      {
        id: `${itemPrefix}_flight`,
        type: 'flight',
        title: `Flight to ${destination}`,
        time: '9:10 AM',
        subtitle: `Home airport to ${destination}`,
        meta: 'Miles-suggested route',
      },
      {
        id: `${itemPrefix}_lodging`,
        type: 'lodging',
        title: 'Hotel check-in',
        time: '4:00 PM',
        subtitle: `Settle into your stay in ${destination}`,
        locationName: `${destination} Central`,
      },
      {
        id: `${itemPrefix}_tip`,
        type: 'tip',
        title: 'Miles Tip',
        detail: 'Keep day one light. A short walk helps reset your body clock faster.',
      },
      {
        id: `${itemPrefix}_note`,
        type: 'note',
        title: 'Arrival note',
        detail: 'Save receipts and key booking references in one place for quick access.',
      },
    ];
  }

  if (dayNumber === totalDays) {
    return [
      {
        id: `${itemPrefix}_checkout`,
        type: 'lodging',
        title: 'Check-out',
        time: '10:00 AM',
        subtitle: 'Confirm baggage hold with the front desk if needed.',
      },
      {
        id: `${itemPrefix}_transport`,
        type: 'transport',
        title: 'Transfer to airport',
        time: '12:30 PM',
        subtitle: `${destination} hotel to departures`,
        meta: 'Pre-booked car',
      },
      {
        id: `${itemPrefix}_tip`,
        type: 'tip',
        title: 'Miles Tip',
        detail: 'Leave a 30-minute buffer for traffic and check-in lines before security.',
      },
    ];
  }

  return [
    {
      id: `${itemPrefix}_am_activity`,
      type: 'activity',
      title: `Morning walk in ${destination}`,
      time: '9:00 AM',
      subtitle: 'Start with an easy neighborhood loop.',
      locationName: `${destination} Old Quarter`,
    },
    {
      id: `${itemPrefix}_food`,
      type: 'food',
      title: 'Lunch reservation',
      time: '12:30 PM',
      subtitle: 'Local seasonal menu spot',
    },
    {
      id: `${itemPrefix}_pm_activity`,
      type: 'activity',
      title: 'Afternoon highlight',
      time: '3:00 PM',
      subtitle: `Top-rated cultural stop in ${destination}`,
    },
    {
      id: `${itemPrefix}_note`,
      type: 'note',
      title: 'Quick note',
      detail: 'Book tomorrow morning slot tonight to avoid last-minute sell-outs.',
    },
    {
      id: `${itemPrefix}_tip`,
      type: 'tip',
      title: 'Miles Tip',
      detail: 'Group nearby stops by area today to reduce transit time and keep your pace calm.',
    },
  ];
};

export const getSampleTimeline = (
  tripId: string,
  destination: string,
  startISO: string,
  endISO: string,
): TripTimeline => {
  const dayDates = getDayRange(startISO, endISO);
  const safeDestination = titleCase(destination);

  const days: TimelineDay[] = dayDates.map((dateISO, index) => {
    const dayNumber = index + 1;
    const totalDays = dayDates.length;

    return {
      dateISO,
      label: `Day ${dayNumber}`,
      title: dayNumber === 1 ? 'Arrival' : dayNumber === totalDays ? 'Departure' : 'Explore',
      items: buildDayItems({
        tripId,
        destination: safeDestination,
        dayNumber,
        totalDays,
        dateISO,
      }),
    };
  });

  return {
    tripId,
    days,
  };
};
