
// If field extractor is null, then it will compare element directly to array elements.
export function binarySearchOnSorted(arr: any[], elemToCompare: number, fieldExtractor?: (elem: any) => number): any | undefined {
    let start = 0
    let end = arr.length - 1;

    while (start <= end){
        let mid = Math.floor((start + end) / 2);

        const arrElement = fieldExtractor ? fieldExtractor(arr[mid]) : arr[mid];
        if (arrElement === elemToCompare) {
            return arrElement;
        }

        if (arr[mid] < elemToCompare) {
            start = mid + 1;
        } else {
            end = mid - 1;
        }
    }

    return undefined;
}