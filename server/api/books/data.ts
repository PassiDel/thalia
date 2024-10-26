import { getBookData } from '~/server/utils/influx';

export default cachedEventHandler(
  async (event) => {
    const { influxBucket } = useRuntimeConfig(event);

    const query = `from(bucket: "${influxBucket}")
 |> range(start: -7d, stop: now())
  |> filter(fn: (r) => r["_measurement"] == "book")
  |> filter(fn: (r) => r["_field"] == "price")
  |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)`;

    return getBookData(query);
  },
  {
    maxAge: 60 * 60, // 1 hour,
    swr: true,
    getKey: (event) => event.path
  }
);
