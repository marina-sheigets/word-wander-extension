export function setAnimationForWrongAnswer(target: HTMLButtonElement, styles: { [key: string]: string }, ms: number = 300): Promise<void> {
    return new Promise((resolve) => {
        target.classList.add(styles.wrongAnswer);
        setTimeout(() => {
            target.classList.remove(styles.wrongAnswer);
            resolve();
        }, ms);
    });
}