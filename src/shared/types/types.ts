import { Duplex } from "stream";
import { IncomingMessage } from "http";
import { socketProxy } from "../../proxy/socketProxy";

// WebsocketPrxy type
export type WebSocketProxy = typeof socketProxy & {
  upgrade: (req: IncomingMessage, socket: Duplex, head: Buffer) => void;
};

// logger log meta Data type
export type LogMeta = Record<string, unknown>;
