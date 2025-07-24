import { createContext, useContext } from "react";

export type VideoContextType = {
	currentTime: React.RefObject<number>;
	durationRef: React.RefObject<number>;
	updateCurrentTime: (time: number) => void;
	updateDuration: (duration: number) => void;
};

export const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function useVideoContext() {
	const videContext = useContext(VideoContext);

	if (videContext === undefined) {
		throw new Error("useVideoContext must be used within a VideoContext");
	}

	return videContext;
}
