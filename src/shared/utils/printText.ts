import chalk from "chalk";
import figlet from "figlet";

export const printText = () => {
    try {
        console.log(figlet.textSync("SLOTFLOW"));
        console.log(chalk.white("SERVICE : "), chalk.hex("#635bff").bold("API GATEWAY"));
    } catch (err) {
        console.log("Something went wrong...");
        console.error(err);
    }
}