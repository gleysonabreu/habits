declare namespace NodeJS {
  export interface ProcessEnv {
    GITHUB_ID: string;
    GITHUB_SECRET: string;
    NEXTAUTH_SECRET: string;
    DATABASE_URL: string;
    NEXT_PUBLIC_API_URL: string;
    TWITCH_ID: string;
    TWITCH_SECRET: string;
    GOOGLE_ID: string;
    GOOGLE_SECRET: string;
    NEXT_PUBLIC_URL: string;
  }
}
