
const secondsInOneDay = 60 * 60 * 24;

// Function will make hour, minute and seconds to 00 and returning the calculated timestamp.
export function removeTimeFromTimestamp(timestamp: number) {
    return timestamp - (timestamp % secondsInOneDay);
}