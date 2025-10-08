
import type { SessionStore ,createLRUStore} from "@smithery/sdk"

const noConnectionMessage = "No active connection. Please call connect() first.";

export default class Context {
  private _ws: WebSocket | undefined = undefined;

  get ws(): WebSocket {
    if (!this._ws) {
      throw new Error(noConnectionMessage);
    }
    return this._ws;
  }

  set ws(ws: WebSocket) {
    this._ws = ws;
  }

  hasWs() {
    return !!this._ws;
  }

  // async sendSse<T extends MessageVjType<SocketMessageMap>>>() {

  // };
  close = async () => {

  }
}