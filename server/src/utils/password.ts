export const hashPassword = (pw: string): Promise<string> => Bun.password.hash(pw);
export const verifyPassword = (pw: string, hash: string): Promise<boolean> => Bun.password.verify(pw, hash);
