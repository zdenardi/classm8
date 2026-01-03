class ClerkTokenGetter {
  private static instance: ClerkTokenGetter;
  private getTokenFn: (() => Promise<string | null>) | null = null;

  // private constructor() { }

  public static getInstance(): ClerkTokenGetter {
    if (!ClerkTokenGetter.instance) {
      ClerkTokenGetter.instance = new ClerkTokenGetter();
    }
    return ClerkTokenGetter.instance;
  }

  public setTokenFunction(fn: () => Promise<string | null>): void {
    this.getTokenFn = fn;
  }

  public async getToken(): Promise<string | null> {
    if (!this.getTokenFn) {
      console.warn("Token function not set in ClerkTokenGetter");
      return null;
    }
    return this.getTokenFn();
  }
}

export default ClerkTokenGetter.getInstance();
