import { Informer } from "../../services/informer/informer.service";
import { setAnimationForWrongAnswer } from "../../utils/setAnimationForWrongAnswer";
import { shuffleArray } from "../../utils/shuffleArray";
import { BaseComponent } from "../base-component/base-component";
import * as styles from './word-constructor.component.css';

type IsWordCorrect = boolean;
export class WordConstructorComponent extends BaseComponent {
    private readonly MAX_WRONG_LETTERS = 3;

    private cellsWrapper = document.createElement('div');
    private lettersWrapper = document.createElement('div');

    private letters: string[] = [];
    private shuffledLetters: string[] = [];
    private containedCells: string[] = [];

    private amountOfWrongLetters = 0;
    public onLettersFinished = new Informer<IsWordCorrect>();

    constructor() {
        super(styles);


        this.cellsWrapper.classList.add(styles.cellsWrapper);
        this.lettersWrapper.classList.add(styles.lettersWrapper);

        this.rootElement.append(this.cellsWrapper, this.lettersWrapper);

        document.addEventListener('keydown', this.onKeyDown.bind(this));
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

    private onKeyDown(event: KeyboardEvent) {
        if (!this.rootElement.parentElement || this.rootElement.parentElement.offsetParent === null) return;

        event.stopPropagation();

        if (!this.letters.includes(event.key)) return;

        const selectedLetter = event.key;

        for (let child of this.lettersWrapper.children) {
            if (child.textContent === selectedLetter) {
                (child as HTMLElement).click();
                break;
            }
        }
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
            this.amountOfWrongLetters++;
            if (this.amountOfWrongLetters === this.MAX_WRONG_LETTERS) {
                this.autocompleteWord();

                setTimeout(() => {
                    this.onLettersFinished.inform(false);
                }, 1000);
            }
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
            this.onLettersFinished.inform(true);
            return;
        }

        for (let i = 0; i < otherEmptyCellsCount; i++) {
            this.createEmptyCells();
        }
    }

    public clear() {
        this.amountOfWrongLetters = 0;
        this.containedCells = [];
        this.shuffledLetters = [];
        this.cellsWrapper.innerHTML = '';
        this.lettersWrapper.innerHTML = '';

        this.removeEventListeners();
    }

    private removeEventListeners() {
        document.removeEventListener('keydown', this.onKeyDown.bind(this));
    }

    public autocompleteWord() {
        this.shuffledLetters = [];

        this.lettersWrapper.innerHTML = '';
        this.cellsWrapper.innerHTML = '';

        this.letters.forEach((letter) => {
            const cell = document.createElement('div');
            cell.classList.add(styles.cell, styles.emptyCell, styles.wrongAnswer);
            cell.textContent = letter;

            this.cellsWrapper.append(cell);
        });
    }
}