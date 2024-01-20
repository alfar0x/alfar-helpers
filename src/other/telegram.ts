import { onlyUnique } from ".";

interface Message {
  message: {
    chat: {
      id?: number;
    };
    text?: string;
    date?: number;
  };
}

class Telegram {
  private chatIds: number[];
  private url: string;
  private allowedUpdatesSec?: number;
  private parseMode?: "Markdown" | "HTML";

  constructor(
    token: string,
    chatIds: number[] | number,
    options: {
      allowedUpdatesSec?: number;
      parseMode?: "Markdown" | "HTML";
    } = {}
  ) {
    if (!token || !chatIds) {
      throw new Error("telegram token and ids are required");
    }
    this.chatIds = typeof chatIds === "number" ? [chatIds] : chatIds;
    this.url = `https://api.telegram.org/bot${token}`;

    const { allowedUpdatesSec, parseMode } = options;

    this.allowedUpdatesSec = allowedUpdatesSec;
    this.parseMode = parseMode;
  }

  static formatMarkdownText(text: string): string {
    const escapeSymbols = ["_", "*", "`", "["];

    let formattedText = text;

    for (const escapeSymbol of escapeSymbols) {
      formattedText = formattedText.replaceAll(
        escapeSymbol,
        `\\${escapeSymbol}`
      );
    }

    return formattedText;
  }

  static formatHtmlText(text: string): string {
    const replacers = [
      { searchValue: "<", replaceValue: "&lt;" },
      { searchValue: ">", replaceValue: "&gt;" },
      { searchValue: "&", replaceValue: "&amp;" },
    ];

    let formattedText = text;

    for (const { searchValue, replaceValue } of replacers) {
      formattedText = formattedText.replaceAll(searchValue, replaceValue);
    }

    return formattedText;
  }

  async sendMessage(text: string): Promise<void> {
    for (const id of this.chatIds) {
      const query = this.parseMode
        ? new URLSearchParams({
            chat_id: String(id),
            text,
            parse_mode: this.parseMode,
          }).toString()
        : new URLSearchParams({ chat_id: String(id), text }).toString();
      await fetch(`${this.url}/sendMessage?${query}`).catch((e) =>
        console.error(e)
      );
    }
  }

  clearUpdates(lastUpdateId: number): void {
    fetch(`${this.url}/getUpdates?offset=${lastUpdateId}`);
  }

  static getMarkdownLink(text: string, url: string): string {
    return `[${text}](${url})`;
  }

  async __getUpdates(): Promise<Message[]> {
    const allowed_updates = ["message"].join(",");

    const query = new URLSearchParams({ allowed_updates }).toString();

    const res = await fetch(`${this.url}/getUpdates?${query}`);

    const data = (await res.json()) as any;

    if (!data?.result?.length) return [];

    const lastUpdateId = data.result[data.result.length - 1].update_id + 1;

    this.clearUpdates(lastUpdateId);

    return data.result;
  }

  async getUpdates(): Promise<string[]> {
    const updates = await this.__getUpdates();

    const filtered = updates
      .filter((msg) => {
        if (!this.chatIds.includes(msg?.message?.chat?.id as any)) return false;
        if (!msg?.message?.text) return false;

        if (this.allowedUpdatesSec) {
          const msgTime = msg?.message?.date;

          if (!msgTime) return false;

          const allowedMessageTime =
            Math.round(Date.now() / 1000) - this.allowedUpdatesSec;

          if (msgTime < allowedMessageTime) return false;
        }

        return true;
      })
      .map((msg) => msg?.message?.text)
      .filter(onlyUnique)
      .filter(Boolean);

    return filtered;
  }
}

export default Telegram;
