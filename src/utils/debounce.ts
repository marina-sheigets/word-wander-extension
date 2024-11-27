export function debounce<T extends (...args: any[]) => void>(
    func: T,
    delay: number,
    immediate: boolean = false
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
        const callNow = immediate && !timeout;

        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            timeout = null;
            if (!immediate) func(...args);
        }, delay);

        if (callNow) func(...args);
    };
}
