/**
 * MIT License
 *
 * Copyright (c) 2020, Concordant and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import assert from 'assert';

/**
 * Return a predefined Sudoku grid as an array.
 */
export function generateStaticGrid() {
    const values = ["6", "", "2", "3", "8", "7", "9", "1", "4",
                    "7", "1", "9", "4", "5", "2", "3", "6", "8",
                    "3", "4", "8", "1", "9", "6", "2", "5", "7",
                    "8", "2", "1", "9", "3", "5", "4", "7", "6",
                    "5", "9", "", "2", "7", "4", "8", "3", "1",
                    "4", "7", "3", "8", "6", "1", "5", "2", "9",
                    "1", "8", "7", "5", "2", "9", "", "", "3",
                    "2", "3", "4", "6", "1", "8", "7", "9", "5",
                    "", "6", "5", "7", "4", "3", "1", "8", "2"];
    assert.ok(values.every(x => (x==="" || (Number(x)>=1 && Number(x)<=9))));
    return values;
}

/**
 * Check if a array only contains values 0 or 1.
 * @param array The array to be checked.
 */
export function checkArray(array:any) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] !== 0 && array[i] !== 1) {
            return false
        }
    }
    return true
}
  
/**
 * Return the position of the first cell of a block.
 * @param block The block number of which we want the position.
 */
export function firstCellOfBlock(block:number) {
    assert.ok(block >= 0 && block < 9)
    let line = Math.floor(block / 3) * 3
    let column = (block % 3) * 3
    return [line,column]
}

/**
 * Return an array containing all cell index of a block.
 * @param block The block number of which we want the cells index.
 */
export function blockIndex(block: number) {
    assert.ok(block >= 0 && block < 9)
    let blocklc = firstCellOfBlock(block)
    let line = blocklc[0]
    let col = blocklc[1]
    let index = [ line      * 9 + col,   line      * 9 + col + 1,  line      * 9 + col + 2,
                 (line + 1) * 9 + col,  (line + 1) * 9 + col + 1, (line + 1) * 9 + col + 2,
                 (line + 2) * 9 + col,  (line + 2) * 9 + col + 1, (line + 2) * 9 + col + 2]
    return index
}

/**
 * Concatenates all values of a HashSet as a String.
 * @param set HashSet to be concatenated.
 */
export function hashSetToString(set: any) {
    let res = new Set();
    let it = set.iterator();
    while (it.hasNext()) {
        let val = it.next();
        if (val !== "") {
            res.add(val);
        }
    }
    return Array.from(res).sort().join(' ')
}
