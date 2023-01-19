import axios from 'axios';

interface BaseWebhookProps {
  webhookURL: string;
  transactionTypes: string[];
  accountAddresses: string[];
}

export interface InitializedWebhook extends BaseWebhookProps {
  webhookID: string;
}

const baseURL = 'https://api.helius.xyz/v0/webhooks/';

export class Helius {
  static createWebhook = async ({
    webhookURL,
    transactionTypes = ['any'],
    accountAddresses,
  }: BaseWebhookProps): Promise<InitializedWebhook | null> => {
    try {
      const res = await axios.post<InitializedWebhook>(
        baseURL + `?api-key=${process.env.NEXT_PUBLIC_HELIUS_KEY}`
      );

      if (!res.data) return null;

      return res.data;
    } catch (error) {
      console.log('🚀 ~ file: helius.ts ~ line 29 ~ error', error);

      if (axios.isAxiosError(error)) {
        console.log(
          '🚀 ~ file: helius.ts ~ line 31 ~ error.message',
          error.message
        );
      }

      return null;
    }
  };

  static updateWebhook = async ({
    webhookID,
    webhookURL,
    transactionTypes = ['any'],
    accountAddresses,
  }: InitializedWebhook): Promise<InitializedWebhook | null> => {
    const body = {
      transactionTypes,
      accountAddresses,
      webhookURL,
    };
    try {
      await axios.put<InitializedWebhook>(
        baseURL + webhookID + `?api-key=${process.env.NEXT_PUBLIC_HELIUS_KEY}`,
        body
      );
      return null;
    } catch (error) {
      console.log('🚀 ~ file: helius.ts ~ line 29 ~ error', error);

      if (axios.isAxiosError(error)) {
        console.log(
          '🚀 ~ file: helius.ts ~ line 31 ~ error.message',
          error.message
        );
      }

      return null;
    }
  };

  static getAllWebhooks = async (): Promise<InitializedWebhook[] | null> => {
    console.log(
      '🚀 ~ file: helius.ts ~ line 78 ~ Helius ~ getAllWebhooks= ~ getAllWebhooks',
      process.env.NEXT_PUBLIC_HELIUS_KEY
    );

    try {
      const res = await axios.get<InitializedWebhook[]>(
        baseURL + `?api-key=${process.env.NEXT_PUBLIC_HELIUS_KEY}`
      );

      if (!res.data) return null;

      return res.data;
    } catch (error) {
      console.log('🚀 ~ file: helius.ts ~ line 29 ~ error', error);

      if (axios.isAxiosError(error)) {
        console.log(
          '🚀 ~ file: helius.ts ~ line 31 ~ error.message',
          error.message
        );
      }

      return null;
    }
  };

  static getWebhook = async (
    webhookID: string
  ): Promise<InitializedWebhook | null> => {
    try {
      const res = await axios.get<InitializedWebhook>(
        baseURL + webhookID + `?api-key=${process.env.NEXT_PUBLIC_HELIUS_KEY}`
      );
      console.log('🚀 ~ file: helius.ts ~ line 112 ~ Helius ~ res', res);

      if (!res.data) return null;

      return res.data;
    } catch (error) {
      console.log('🚀 ~ file: helius.ts ~ line 29 ~ error', error);

      if (axios.isAxiosError(error)) {
        console.log(
          '🚀 ~ file: helius.ts ~ line 31 ~ error.message',
          error.message
        );
      }

      return null;
    }
  };

  static deleteWebhook = async (webhookID: string) => {
    try {
      const res = await axios.delete(
        baseURL + webhookID + `?api-key=${process.env.NEXT_PUBLIC_HELIUS_KEY}`
      );
      if (!res.data.entries().length) {
        console.log(`Webhook ${webhookID} successfully deleted`);
      }
    } catch (error) {
      console.log('🚀 ~ file: helius.ts ~ line 29 ~ error', error);

      if (axios.isAxiosError(error)) {
        console.log(
          '🚀 ~ file: helius.ts ~ line 31 ~ error.message',
          error.message
        );
      }
    }
  };
}
