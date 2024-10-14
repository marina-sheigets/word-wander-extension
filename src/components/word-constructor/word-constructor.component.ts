import { Informer } from "../../services/informer/informer.service";
import { setAnimationForWrongAnswer } from "../../utils/setAnimationForWrongAnswer";
import { shuffleArray } from "../../utils/shuffleArray";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './word-constructor.component.css';

export class WordConstructorComponent extends BaseComponent {
    private cellsWrapper = document.createElement('div');
    private lettersWrapper = document.createElement('div');

    private letters: string[] = [];
    private shuffledLetters: string[] = [];
    private containedCells: string[] = [];


    public onLettersFinished = new Informer();

    constructor() {
        super(styles);


        this.cellsWrapper.classList.add(styles.cellsWrapper);
        this.lettersWrapper.classList.add(styles.lettersWrapper);

        this.rootElement.append(this.cellsWrapper, this.lettersWrapper);
    }

    init(word: string) {
        this.clear();
        this.letters = word.split('');

        this.shuffledLetters = shuffleArray(this.letters);

        this.shuffledLetters.forEach((letter) => {
            this.createLetterCells(letter);
            this.createEmptyCells();
        });
    }


    private createEmptyCells(letter: string | null = null) {
        const cell = document.createElement('div');
        cell.classList.add(styles.cell, styles.emptyCell);

        if (letter !== null && letter !== undefined) {
            cell.textContent = letter;
            cell.classList.add(styles.rightLetter);
        }

        this.cellsWrapper.append(cell);
    }

    private createLetterCells(letter: string) {

        const cell = document.createElement('div');
        cell.classList.add(styles.cell, styles.letterCell);
        cell.textContent = letter;

        cell.addEventListener('click', (e) => {
            this.onLetterClick(e);
        });

        this.lettersWrapper.append(cell);
    }

    private async onLetterClick(event: MouseEvent) {
        const cell = event.target as HTMLElement;

        const selectedLetter = cell.textContent;

        if (selectedLetter !== this.letters[this.containedCells.length]) {
            await setAnimationForWrongAnswer(cell as HTMLButtonElement, styles, 300);
            return;
        }

        cell.remove();

        this.containedCells.push(selectedLetter as string);

        this.cellsWrapper.innerHTML = '';

        this.containedCells.forEach((letter) => {
            this.createEmptyCells(letter);
        });

        const otherEmptyCellsCount = this.letters.length - this.containedCells.length;

        if (otherEmptyCellsCount === 0) {
            this.onLettersFinished.inform();
            return;
        }

        for (let i = 0; i < otherEmptyCellsCount; i++) {
            this.createEmptyCells();
        }
    }

    public clear() {
        this.containedCells = [];
        this.shuffledLetters = [];
        this.cellsWrapper.innerHTML = '';
        this.lettersWrapper.innerHTML = '';
    }
}