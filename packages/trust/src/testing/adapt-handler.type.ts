/* @layer testing @kind types */
type MockHandler = {
  fn: (body: string) => Promise<{ statusCode: number; response: string | ArrayBufferView; contentType?: string }>;
};

export type { MockHandler };
