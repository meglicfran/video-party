import { createContext, useContext } from "react";

export const WebSocketContext = createContext<React.RefObject<WebSocket | null> | undefined>(undefined);

export function useWebSocketContext() {
	const wsContext = useContext(WebSocketContext);

	if (wsContext === undefined) {
		throw new Error("useWebSocketContext must be used within a WebSocketContext");
	}

	return wsContext;
}
