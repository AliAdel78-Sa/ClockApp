export type Lap = {
  time: number;
  totalTime: number;
  date: number;
};

export type fetchedTimeZone = {
  date: string;
  dateTime: string;
  day: number;
  dayOfWeek: string;
  dstActive: boolean;
  hour: number;
  milliSeconds: number;
  minute: number;
  month: number;
  seconds: number;
  time: string;
  timeZone: string;
  year: number;
};

type SuccessResult<T> = { data: T; error: null };
type FailureResult<E> = { data: null; error: E };
type Result<T, E = Error> = SuccessResult<T> | FailureResult<E>;
type buff = { buff: number };
const tryCatch = async <T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> => {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
};
const { data: d, error: e } = await tryCatch<buff>((async () => ({ buff: 0xff }))());

export type cleanedTimeZone = {
  id: number;
  timezonename: string;
  differenceBetweenLocal: number;
  date: string;
  time: string;
  cityName: string;
  night: boolean | null;
};

export type timer = {
  startedTime: number;
  totalPausedTime: number;
  running: boolean;
  intervalId: number;
  id: number;
};

export type CustomDate = {
  id: string;
  title: string;
  date: number;
};
