import { colorsList } from "./colorList";

export function getRandomColor(){
    const randomIndex = Math.floor(Math.random() * colorsList.length);
    return colorsList[randomIndex];


}