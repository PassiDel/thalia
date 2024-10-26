import { useRuntimeConfig } from '#imports';
import { InfluxDB } from '@influxdata/influxdb-client';

const { influxUrl, influxToken } = useRuntimeConfig();
export const influxDB = new InfluxDB({
  url: influxUrl,
  timeout: 10_000,
  token: influxToken
});
