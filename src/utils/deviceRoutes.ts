export const productCodeDetailRoutes = {
  COFFEE001: "/devices/coffee-machine",
  LIGHT001: "/devices/light",
  SPEAKER01: "/devices/speaker",
} as const;

export type DeviceDetailProductCode = keyof typeof productCodeDetailRoutes;

export function getDeviceDetailPath(productCode: string) {
  return productCodeDetailRoutes[productCode as DeviceDetailProductCode];
}
