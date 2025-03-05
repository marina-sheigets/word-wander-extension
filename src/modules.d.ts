declare module "*.html" {
    const content: string;
    export default content;
}

declare module "*.css";
declare module "*.png";

declare module "*.mp3";
declare module "*.json" {
    const content: any;
    export default content;
}