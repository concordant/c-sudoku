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
 * Add a classname to a list of elements.
 * @param listId List of elements id.
 * @param classname ClassName to be added.
 */
export function addClassName(listId: any, classname: string) {
    for (let id of listId) {
        const myElem = document.getElementById(String(id))
        if (myElem) {
            myElem.classList.add(classname)
        }
    }
}

/**
 * Remove a classname to a list of elements.
 * @param listId List of elements id.
 * @param classname ClassName to be removed.
 */
export function removeClassName(listId: any, classname: string) {
    for (let id of listId) {
        const myElem = document.getElementById(String(id))
        if (myElem) {
            myElem.classList.remove(classname)
        }
    }
}

/**
 * Add errorcell class to a list of elements.
 * @param listId List of elements id.
 */
export function setErrorCell(listId: any) {
    addClassName(listId, "errorcell")
}

/**
 * Remove errorcell class to a list of elements.
 * @param listId List of elements id.
 */
export function removeErrorCell(listId: any) {
    removeClassName(listId, "errorcell")
}
