import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "https://test-api.example.com";

export const options = {
  scenarios: {
    soak: {
      executor: "constant-vus",
      vus: 100,
      duration: "8h"
    }
  },
  thresholds: {
    http_req_duration: ["p(95)<500"],
    http_req_failed: ["rate<0.01"]
  }
};

export default function () {
  const res = http.get(BASE_URL + "/api/products");
  check(res, { "status is 200": (r) => r.status === 200 });
  sleep(1);
}
