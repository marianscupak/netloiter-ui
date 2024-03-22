import { ipSchema } from "../schemas";

describe("IPv4 validation schema", () => {
  test("IPv4 validation should pass on valid IP", () => {
    expect(ipSchema.safeParse("127.0.0.1").success).toBeTruthy();
    expect(ipSchema.safeParse("255.255.255.255").success).toBeTruthy();
    expect(ipSchema.safeParse("0.0.0.0").success).toBeTruthy();
    expect(ipSchema.safeParse("192.164.0.1").success).toBeTruthy();
  });
  test("IPv4 validation should fail on invalid IP", () => {
    expect(ipSchema.safeParse("127.0.0.1.1").success).toBeFalsy();
    expect(ipSchema.safeParse("255.255.255").success).toBeFalsy();
    expect(ipSchema.safeParse("300.0.0.1").success).toBeFalsy();
    expect(ipSchema.safeParse("").success).toBeFalsy();
    expect(
      ipSchema.safeParse("2001:0db8:85a3:0000:0000:8a2e:0370:7334").success,
    ).toBeFalsy();
  });
});
