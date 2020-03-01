import prompt from "prompt";

const promptSchema: any = {
  properties: {
    method: {
      required: true,
      type: "string",
      message: "Which 2FA authentication method are you using? Enter 'e' for email or 'a' for authenticator",
      validator: /^(e|a)$/,
      warning: "Enter 'e' for email or 'a' for authenticator"
    },
    code: {
      required: true,
      type: "string"
    }
  }
};

export interface IMFAResponse {
  code: string;
  method: string;
};

export async function getMfa(): Promise<IMFAResponse> {
  prompt.start();

  return await new Promise((resolve, reject) => {
    prompt.get(promptSchema, (err: any, result: any) => {
      if (result == undefined || result.method == undefined || result.code == undefined) {
        reject("Invalid entry for method and/or code");
      }

      if (err) {
        reject(err);
      }

      resolve({
        method: result.method === "e" ? "email" : "authenticator",
        code: result.code,
      });
    });
  });
}