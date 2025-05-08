import { Collection } from "./Collection";

export interface Word {
    createdAt: string;
    translation: string;
    updatedAt: string;
    user: string;
    word: string;
    _id: string;
    collections: Collection[]
}
