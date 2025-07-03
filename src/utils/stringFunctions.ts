/** 
 * This function generates a color based on the input string, ensuring that the same string always produces  the same color. It uses a hash function to derive a color code from the string.
    * @param {string} str - The input string to convert to a color.
    * @return {string} - A hexadecimal color code derived from the input string.
 */
export function stringToColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).slice(-2);
    }
    return color;
};