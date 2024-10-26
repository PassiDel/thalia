import { useRuntimeConfig } from '#imports';
import { InfluxDB } from '@influxdata/influxdb-client';
import { BookInfluxData } from '~/types/influx';

const { influxUrl, influxToken, influxOrg } = useRuntimeConfig();
export const influxDB = new InfluxDB({
  url: influxUrl,
  timeout: 10_000,
  token: influxToken
});
export const queryClient = influxDB.getQueryApi(influxOrg);

export async function getBookData(query: string): Promise<BookInfluxData[]> {
  return await queryClient
    .collectRows(query, (values, tableMeta) => {
      const { _time, key, title, _value } = tableMeta.toObject(values);
      return { _time, _value, key, title };
    })
    .catch(() => [])
    .then((res) =>
      res.reduce((a, r) => {
        const did = r.key;
        const data = { x: r._time, y: r._value };
        const dI = a.findIndex((d) => d.key === did);
        if (dI < 0) {
          a.push({
            key: did,
            title: r?.title || '',
            data: [data]
          });
          return a;
        }

        a[dI].data.push(data);

        return a;
      }, [] as BookInfluxData[])
    );
}
