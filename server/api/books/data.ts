import { getBookData } from '~/server/utils/influx';

export default cachedEventHandler(
  async (event) => {
    const { influxBucket } = useRuntimeConfig(event);

    const query = `from(bucket: "${influxBucket}")
 |> range(start: -7d, stop: now())
  |> filter(fn: (r) => r["_measurement"] == "book")
  |> filter(fn: (r) => r["_field"] == "price")
  |> map(fn: (r) => ({ r with _level: r._value }))
  |> sort(columns: ["_source_timestamp", "_time"], desc: false) 
  |> difference(columns: ["_level"]) 
  |> filter(fn: (r) => r._level != 0) 
  |> map(fn: (r) => ({ r with _value: r._level }))
  |> yield(name: "result")`;

    const start = new Date().toISOString();
    return getBookData(query).then((r) =>
      r.map((d) => {
        d.data.unshift({ x: d.data[0].x, y: 0 });
        d.data.push({ x: start, y: d.data[d.data.length - 1].y });
        return d;
      })
    );
  },
  {
    maxAge: 60 * 60, // 1 hour,
    swr: true,
    getKey: (event) => event.path
  }
);
