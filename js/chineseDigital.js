const CONVERT = {};

/**
 * @description 对要转换的数字进行处理
 * @param {number} num 要转换的阿拉伯数字
 * @returns 返回中文数字
 */
CONVERT.digitalProcessing = (num) => {
    //将数字转换为数组并将最大位的数字放在数组最后端
    let arr = num.toString().split('').reverse();

    if (!(arr instanceof Array)) {
        throw {
            message: 'arguments type error.'
        };
    } else if (arr.length > 16) {
        throw {
            message: '最多支持转换16位'
        };
    }

    //将数组中的所有阿拉伯数字转换为中文数字
    arr = arr.map((item) => {
        return CONVERT.backCnDig(parseInt(item, 10));
    });

    //对数组中的所有中文数字添加对应的位修饰符
    arr = CONVERT.backModifier(arr);

    //将转换后的数组按正确格式输出
    return arr.reverse().join('');
};

/**
 * @description 传入一个阿拉伯数字，返回一个中文数字
 * @param {number} num 0-9
 * @returns 返回中文数字
 */
CONVERT.backCnDig = (num) => {

    if (typeof num !== 'number') {
        throw {
            message: 'backCnDig(): arguments type error.'
        };
    } else if (num > 9) {
        throw {
            message: 'backCnDig(): arguments error.'
        };
    }

    return CONVERT._collator(num);
};

/**
 * @description 将传入的阿拉伯数字分级转换
 * @param {number} num 0-9
 * @returns 返回转换后的中文数字
 */
CONVERT._collator = (num) => {
    let chineseDigital = '';

    if (num > 6) {
        chineseDigital = CONVERT._sevenToNine(num);
    } else if (num > 3) {
        chineseDigital = CONVERT._fourToSix(num);
    } else {
        chineseDigital = CONVERT._zeroToThree(num);
    }

    return chineseDigital;
};

/**
 * @description 将0-3转换为中文数字
 * @param {number} num 0-3 
 * @returns 返回中文数字
 */
CONVERT._zeroToThree = (num) => {
    let chineseDigital = '';
    if (num === 0) {
        chineseDigital = '零';
    } else if (num === 1) {
        chineseDigital = '一';
    } else if (num === 2) {
        chineseDigital = '二';
    } else {
        chineseDigital = '三';
    }

    return chineseDigital;
};

/**
 * @description 将4-6转换为中文数字
 * @param {number} num 4-6 
 * @returns 返回中文数字
 */
CONVERT._fourToSix = (num) => {
    let chineseDigital = '';
    if (num === 4) {
        chineseDigital = '四';
    } else if (num === 5) {
        chineseDigital = '五';
    } else {
        chineseDigital = '六';
    }

    return chineseDigital;
};

/**
 * @description 将7-9转换为中文数字
 * @param {number} num 7-9 
 * @returns 返回中文数字
 */
CONVERT._sevenToNine = (num) => {
    // switch (num) {
    //     case 7:
    //         return '七';
    //     case 8:
    //         return '八';
    //     case 9:
    //         return '九';
    // }

    let chineseDigital = '';
    if (num === 7) {
        chineseDigital = '七';
    } else if (num === 8) {
        chineseDigital = '八';
    } else {
        chineseDigital = '九';
    }

    return chineseDigital;
};

/**
 * @description 给中文数字添加修饰符（十、百、千）
 * @param {Array} arr 一个最长长度不超过四位的数组 
 * @returns 返回一个新数组
 */
CONVERT._tenHundredThousand = (arr) => {
    return arr.map((value, index) => {
        if (value !== '零') {
            if (index === 1) {
                value += '十';
            } else if (index === 2) {
                value += '百';
            } else if (index === 3) {
                value += '千';
            }
        }

        return value;
    });
};

/**
 * @description 判断一个数组是否都是无效的值
 * @param {Array} arr 
 * @returns 是 true，否 false
 */
CONVERT.isInvalid = (arr) => {
    return arr.every(value => {
        if (value === '零' || value === '') {
            return true;
        } else {
            return false;
        }
    });
};

/**
 * @description 根据分组添加修饰符，例如：万、亿。0组：个位到千位，1组：万位到千万位，~
 * @param {Array} arr 数组本身
 * @param {number} count 第几组
 * @returns 返回一个新数组
 */
CONVERT._groupModifier = (arr, count) => {
    if (count === 1) {
        //如果万位到千万位都为0则不需要添加‘万’       
        if (!CONVERT.isInvalid(arr)) {
            arr[0] += '万';
        } else {
            arr[0] = '零';
        }
    } else if (count === 2) {
        arr[0] += '亿';
    } else if (count === 3) {
        arr[0] += '万';
    }

    return arr;
};

/**
 * @description 根据索引对中文数字添加对应的位修饰符，例如：十、百、千、万
 * @param {Array} arr 数组
 * @returns 返回添加了修饰符的数组
 */
CONVERT.backModifier = (arr) => {
    if (!(arr instanceof Array)) {
        throw {
            message: 'backModifier(): arguments type error.'
        };
    }

    /**
     * @description 记录第几组
     */
    let count = 0;
    let chinArr = [];

    //将数组每四位分成一组处理
    while (arr.length > 0) {
        let newArr = arr.splice(0, 4);

        newArr = CONVERT._tenHundredThousand(newArr);

        newArr = CONVERT.removeZero(newArr);

        newArr = CONVERT._groupModifier(newArr, count);

        //将处理完的每一组连接起来
        chinArr = chinArr.concat(newArr);
        count++;
    }

    return chinArr;
};

/**
 * @description 去除多余的零
 * @param {Array} arr 中文数字数组 
 * @returns 返回一个新数组
 */
CONVERT.removeZero = (arr) => {
    if (arr.indexOf('零') !== -1) {
        //将数组开头连续的零去掉，例如：一万零零零零 => 一万
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] !== '零') {
                break;
            } else {
                arr[i] = '';
            }
        }

        //将数字中间的零去除只留一个，例如：一千零零一 => 一千零一
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === '零' && arr[i + 1] === '零') {
                arr[i] = '';
            }
        }
    }
    return arr;
};

(function chineseDigital() {

    const inputObj = document.getElementById('myNum');

    inputObj.addEventListener('input', (e) => {
        try {
            let nums = e.target.value,
                chineseDigital = '';

            if (nums >= 0) {
                chineseDigital = CONVERT.digitalProcessing(e.target.value);
            } else {
                chineseDigital = '负' + CONVERT.digitalProcessing(e.target.value);
            }

            document.getElementById('show').innerHTML = '转换后的中文数字：' + chineseDigital;
        } catch (ex) {
            document.getElementById('myNum').value = '';
            alert(ex.message);
        }
    });

})();