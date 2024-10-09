export function setAnimationForWrongAnswer(target: HTMLButtonElement, styles: { [key: string]: string }): Promise<void> {
    return new Promise((resolve) => {
        target.classList.add(styles.wrongAnswer);
        setTimeout(() => {
            target.classList.remove(styles.wrongAnswer);
            resolve();
        }, 300);
    });
}