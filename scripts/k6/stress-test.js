import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "https://test-api.example.com";

export const options = {
  stages: [
    { duration: "5m", target: 100 },
    { duration: "10m", target: 1000 },
    { duration: "10m", target: 2000 },
    { duration: "5m", target: 0 }
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"]
  }
};

export default function () {
  const res = http.get(BASE_URL + "/api/products");
  check(res, { "status is 200": (r) => r.status === 200 });
  sleep(1);
}
