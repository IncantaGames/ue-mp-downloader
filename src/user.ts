import prompt from "prompt";
import dotenv from "dotenv";

dotenv.config();

const promptSchema: any = {
  properties: {
    email: {
      required: true,
      type: "string"
    },
    password: {
      required: true,
      type: "string",
      hidden: true,
      replace: "*"
    }
  }
};

export default class User {
  public email: string;
  public password: string;

  constructor() {
    this.email = process.env.UE4_EMAIL || "";
    this.password = process.env.UE4_PASSWORD || "";
  }

  public async initialize(): Promise<void> {
    if (this.email && this.password) {
      console.log(
        `Using environment variables UE4_EMAIL and UE4_PASSWORD. The email being used is ${this.email}`
      );
    } else {
      prompt.start();

      await new Promise((resolve, reject) => {
        prompt.get(promptSchema, (err: any, result: any) => {
          if (result == undefined || result.email == undefined) {
            reject("Invalid entry for email and/or password");
          }

          if (err) {
            reject(err);
          }

          this.email = result.email;
          this.password = result.password;
          resolve();
        });
      });
    }
  }
}