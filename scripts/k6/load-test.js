import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

const BASE_URL = __ENV.BASE_URL || "https://test-api.example.com";
const errorRate = new Rate("errors");

export const options = {
  stages: [
    { duration: "2m", target: 50 },
    { duration: "5m", target: 200 },
    { duration: "2m", target: 0 }
  ],
  thresholds: {
    http_req_duration: ["p(95)<500", "p(99)<1000"],
    http_req_failed: ["rate<0.01"],
    errors: ["rate<0.01"]
  }
};

const endpoints = [
  { method: "GET", path: "/api/products" },
  { method: "GET", path: "/api/orders/123" },
  { method: "POST", path: "/api/checkout" }
];

export default function () {
  const pick = endpoints[Math.floor(Math.random() * endpoints.length)];
  const url = BASE_URL + pick.path;
  let res;
  if (pick.method === "POST") {
    res = http.post(url, JSON.stringify({ itemId: 1, qty: 1 }), {
      headers: { "Content-Type": "application/json" }
    });
  } else {
    res = http.get(url);
  }
  const ok = check(res, { "status is 200": (r) => r.status === 200 });
  errorRate.add(!ok);
  sleep(1);
}
