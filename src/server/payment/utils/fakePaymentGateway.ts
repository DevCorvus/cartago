const TEN_SECONDS = 10000;

export function fakePaymentGateway(): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const paymentSuccess = Math.random() < 0.9; // 90% chance
      resolve(paymentSuccess);
    }, TEN_SECONDS);
  });
}
