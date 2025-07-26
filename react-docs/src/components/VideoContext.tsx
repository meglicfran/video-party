import { createContext, useContext } from "react";
import type { VideoState } from "../App";

export type VideoContextType = {
	videoState: React.RefObject<VideoState>;
	updateVideoStateContext: (newState: VideoState) => void;
};

export const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function useVideoContext() {
	const context = useContext(VideoContext);
	if (context === undefined) {
		throw new Error("useVideoContext must be used within a VideoContext");
	}

	return context;
}
