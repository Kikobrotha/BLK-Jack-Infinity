export interface GlobalMemory {
  handsObserved: number;
  avgVolatility: number;
  skipRate: number;
  confidenceCalibration: number;
}

export const defaultGlobalMemory: GlobalMemory = {
  handsObserved: 0,
  avgVolatility: 0,
  skipRate: 0,
  confidenceCalibration: 0.5
};
